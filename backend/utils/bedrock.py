"""AWS Bedrock Converse API utilities for invoking specialist and orchestrator agents."""

import json
import logging
import os
import re
from typing import Union

import boto3

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

MODEL_ID = os.environ.get("BEDROCK_MODEL_ID", "anthropic.claude-sonnet-4-20250514")

bedrock_client = boto3.client(
    "bedrock-runtime",
    region_name=os.environ.get("AWS_REGION", "us-east-1"),
)


def extract_json(text: str) -> dict:
    """Extract JSON from text that may be wrapped in markdown code fences."""
    # Strip markdown code fences: ```json ... ``` or ``` ... ```
    cleaned = re.sub(r"```(?:json)?\s*\n?", "", text).strip()
    cleaned = cleaned.rstrip("`").strip()

    # Try parsing the cleaned text
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        pass

    # Try to find a JSON object in the text
    match = re.search(r"\{[\s\S]*\}", text)
    if match:
        try:
            return json.loads(match.group())
        except json.JSONDecodeError:
            pass

    raise ValueError(f"Could not extract JSON from response: {text[:200]}")


def invoke_agent(
    system_prompt: str, user_message: str, tools: list = None, max_tokens: int = 8192
) -> Union[str, dict]:
    """Invoke a Bedrock Converse call for a specialist agent.

    Returns:
        str if the response is plain text, or dict if it contains tool use blocks.
    """
    messages = [{"role": "user", "content": [{"text": user_message}]}]

    kwargs = {
        "modelId": MODEL_ID,
        "messages": messages,
        "system": [{"text": system_prompt}],
        "inferenceConfig": {"maxTokens": max_tokens, "temperature": 0.7},
    }
    if tools:
        kwargs["toolConfig"] = {"tools": tools}

    logger.info("Invoking Bedrock agent with model %s", MODEL_ID)
    response = bedrock_client.converse(**kwargs)

    # Extract text from response
    output = response.get("output", {})
    message = output.get("message", {})
    content_blocks = message.get("content", [])
    logger.info("Agent response stop_reason=%s, blocks=%d",
                response.get("stopReason"), len(content_blocks))

    # If there are tool use blocks, return the full message for orchestrator processing
    has_tool_use = any(b.get("toolUse") for b in content_blocks)
    if has_tool_use:
        return {
            "content_blocks": content_blocks,
            "stop_reason": response.get("stopReason"),
        }

    # Otherwise return concatenated text
    text_parts = [b["text"] for b in content_blocks if "text" in b]
    return "\n".join(text_parts)


def invoke_orchestrator(system_prompt: str, messages: list, tools: list) -> dict:
    """Invoke the orchestrator with full message history and tools.

    Returns:
        The raw Bedrock Converse API response dict.
    """
    kwargs = {
        "modelId": MODEL_ID,
        "messages": messages,
        "system": [{"text": system_prompt}],
        "toolConfig": {"tools": tools},
        "inferenceConfig": {"maxTokens": 4096, "temperature": 0.7},
    }
    return bedrock_client.converse(**kwargs)
