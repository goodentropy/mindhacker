"""Core orchestrator loop Lambda handler for the chat endpoint."""

import json
import logging

from agents.prompts import ORCHESTRATOR_PROMPT
from agents.tools import ORCHESTRATOR_TOOLS
from agents.dispatcher import dispatch_tool_call
from models.emotional_state import EmotionalState
from utils.bedrock import invoke_orchestrator
from utils.dynamo import get_session, update_session

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)


def _to_converse_format(simple_messages: list) -> list:
    """Convert simple persisted messages to Bedrock Converse API format."""
    converse = []
    for msg in simple_messages:
        content = msg.get("content", "")
        if isinstance(content, str):
            converse.append({"role": msg["role"], "content": [{"text": content}]})
        elif isinstance(content, list):
            # Already in Converse format
            converse.append(msg)
    return converse


def lambda_handler(event, context):
    """POST /api/chat - Main chat endpoint with orchestrator loop."""
    # Handle CORS preflight (needed for Lambda Function URL)
    method = (event.get("requestContext", {}).get("http", {}).get("method", "")
              or event.get("httpMethod", ""))
    if method == "OPTIONS":
        return _response(200, {})

    try:
        raw_body = event.get("body", "{}")
        logger.info("Chat: raw body length=%d", len(raw_body) if raw_body else 0)
        body = json.loads(raw_body)
        session_id = body.get("session_id")
        user_message = body.get("message", "")

        if not session_id or not user_message:
            return _response(400, {"error": "session_id and message required"})

        logger.info("Chat: fetching session=%s", session_id)
        session = get_session(session_id)
        if not session:
            return _response(404, {"error": "Session not found"})

        # Extract current curriculum content for orchestrator context
        current_node_id = session.get("current_node_id", "")
        nodes = session.get("curriculum", {}).get("nodes", [])
        current_content = ""
        current_title = ""
        for node in nodes:
            if node.get("id") == current_node_id:
                current_content = node.get("content", "")[:10000]
                current_title = node.get("title", "")
                break

        system_prompt = ORCHESTRATOR_PROMPT
        if current_content:
            system_prompt += (
                f"\n\n---\n## Current Module: {current_title}\n\n"
                f"<curriculum_content>\n{current_content}\n</curriculum_content>"
            )

        # Build message history in Bedrock Converse format
        stored_messages = session.get("messages", [])
        logger.info("Chat: stored_messages count=%d", len(stored_messages))
        messages = _to_converse_format(stored_messages)
        messages.append({"role": "user", "content": [{"text": user_message}]})
        logger.info("Chat: session=%s, history_len=%d", session_id, len(messages))

        agent_log = []  # Track agent activity for the UI
        emotional_state = None

        # Orchestrator tool-use loop (max 6 iterations)
        max_iterations = 6
        content_blocks = []

        for iteration in range(max_iterations):
            raw_response = invoke_orchestrator(
                system_prompt, messages, ORCHESTRATOR_TOOLS
            )

            stop_reason = raw_response.get("stopReason", "")
            output_message = raw_response["output"]["message"]
            content_blocks = output_message["content"]

            messages.append({"role": "assistant", "content": content_blocks})

            if stop_reason == "end_turn":
                break

            if stop_reason == "tool_use":
                tool_results = []
                for block in content_blocks:
                    if "toolUse" in block:
                        tool_use = block["toolUse"]
                        tool_name = tool_use["name"]
                        tool_input = tool_use["input"]
                        tool_id = tool_use["toolUseId"]

                        agent_log.append(
                            {
                                "tool": tool_name,
                                "input_summary": _summarize_input(
                                    tool_name, tool_input
                                ),
                            }
                        )

                        result = dispatch_tool_call(tool_name, tool_input)

                        # Capture emotional state for session tracking
                        if (
                            tool_name == "assess_emotional_state"
                            and isinstance(result, dict)
                            and "error" not in result
                        ):
                            emotional_state = result

                        tool_results.append(
                            {
                                "toolResult": {
                                    "toolUseId": tool_id,
                                    "content": [{"json": result}],
                                }
                            }
                        )

                messages.append({"role": "user", "content": tool_results})

        # Extract final text response
        assistant_text = ""
        for block in content_blocks:
            if "text" in block:
                assistant_text += block["text"]

        # Update session with simplified message format for persistence
        simple_messages = session.get("messages", [])
        simple_messages.append({"role": "user", "content": user_message})
        simple_messages.append({"role": "assistant", "content": assistant_text})

        updates = {"messages": simple_messages}

        emotional_history = session.get("emotional_history", [])
        if emotional_state:
            es = EmotionalState.from_dict(emotional_state)
            entry = es.to_dict()
            entry["message_index"] = len(simple_messages)
            entry["flow_score"] = es.flow_score
            entry["dropout_risk"] = es.dropout_risk
            emotional_history.append(entry)
            updates["emotional_history"] = emotional_history

        update_session(session_id, updates)

        return _response(
            200,
            {
                "response": assistant_text,
                "emotional_state": emotional_state,
                "agent_log": agent_log,
                "session_id": session_id,
            },
        )

    except Exception as e:
        return _response(500, {"error": str(e)})


def _summarize_input(tool_name: str, tool_input: dict) -> str:
    """Create human-readable summary of tool input for the agent log."""
    summaries = {
        "assess_emotional_state": (
            f"Analyzing: \"{tool_input.get('student_message', '')[:50]}...\""
        ),
        "adapt_content": (
            f"Adapting: {tool_input.get('current_topic', 'content')}"
        ),
        "generate_assessment": (
            f"Generating {tool_input.get('num_questions', 3)} questions on "
            f"{tool_input.get('topic', 'topic')}"
        ),
        "parse_curriculum": "Parsing curriculum content",
        "get_next_curriculum_node": "Finding next topic",
    }
    return summaries.get(tool_name, tool_name)


def _response(status_code: int, body: dict) -> dict:
    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "POST,OPTIONS",
        },
        "body": json.dumps(body),
    }
