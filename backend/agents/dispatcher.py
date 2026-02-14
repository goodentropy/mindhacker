"""Dispatcher routes orchestrator tool calls to specialist agents."""

import json
import logging

from agents.prompts import (
    EMOTIONAL_ASSESSOR_PROMPT,
    CURRICULUM_ARCHITECT_PROMPT,
    CONTENT_ADAPTER_PROMPT,
    ASSESSMENT_GENERATOR_PROMPT,
)
from utils.bedrock import invoke_agent, extract_json

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

TOOL_AGENT_MAP = {
    "assess_emotional_state": EMOTIONAL_ASSESSOR_PROMPT,
    "parse_curriculum": CURRICULUM_ARCHITECT_PROMPT,
    "adapt_content": CONTENT_ADAPTER_PROMPT,
    "generate_assessment": ASSESSMENT_GENERATOR_PROMPT,
}


def dispatch_tool_call(tool_name: str, tool_input: dict) -> dict:
    """Route a tool call to the appropriate specialist agent."""
    if tool_name == "get_next_curriculum_node":
        return handle_curriculum_navigation(tool_input)

    system_prompt = TOOL_AGENT_MAP.get(tool_name)
    if not system_prompt:
        return {"error": f"Unknown tool: {tool_name}"}

    user_message = json.dumps(tool_input)
    response = invoke_agent(system_prompt, user_message)
    logger.info("Dispatcher: tool=%s response_type=%s", tool_name, type(response).__name__)

    # Try to parse as JSON (handle markdown-wrapped JSON), otherwise return as text
    if isinstance(response, dict):
        return response
    try:
        return extract_json(response)
    except (ValueError, TypeError):
        return {"content": response}


def handle_curriculum_navigation(tool_input: dict) -> dict:
    """Navigate curriculum graph stored in DynamoDB."""
    from utils.dynamo import get_session

    session_id = tool_input.get("session_id", "")
    session = get_session(session_id)
    if not session:
        return {"error": "Session not found"}

    curriculum = session.get("curriculum", {})
    nodes = curriculum.get("nodes", [])
    current_id = tool_input.get("current_node_id")
    completed = session.get("completed_nodes", [])

    # Find next uncompleted node whose prerequisites are all met
    for node in nodes:
        if node["id"] not in completed:
            prereqs = node.get("prerequisites", [])
            if all(p in completed for p in prereqs):
                return node

    return {"message": "All curriculum nodes completed!", "completed": True}
