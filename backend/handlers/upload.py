"""Lambda handler for curriculum upload and parsing."""

import base64
import io
import json
import logging
import os
import uuid

import boto3

from agents.prompts import CURRICULUM_ARCHITECT_PROMPT
from utils.bedrock import invoke_agent, extract_json
from utils.dynamo import create_session

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

CURRICULUM_BUCKET = os.environ.get("CURRICULUM_BUCKET", "mindhacker-curriculum")
s3_client = boto3.client("s3")


def _extract_pdf_text(pdf_base64: str) -> str:
    """Extract text from a base64-encoded PDF using PyPDF2."""
    from PyPDF2 import PdfReader

    pdf_bytes = base64.b64decode(pdf_base64)
    reader = PdfReader(io.BytesIO(pdf_bytes))
    pages = []
    for page in reader.pages:
        text = page.extract_text()
        if text:
            pages.append(text.strip())
    return "\n\n".join(pages)


def lambda_handler(event, context):
    """POST /api/upload - Upload curriculum and parse into learning graph."""
    try:
        body = json.loads(event.get("body", "{}"))
        raw_content = body.get("content", "")
        pdf_base64 = body.get("pdf_base64", "")
        subject = body.get("subject", "")

        # If PDF was uploaded, extract text from it
        if pdf_base64:
            try:
                raw_content = _extract_pdf_text(pdf_base64)
                logger.info("Extracted %d chars from PDF", len(raw_content))
            except Exception as e:
                logger.error("PDF extraction failed: %s", e)
                return _response(400, {"error": f"Could not read PDF: {str(e)}"})

        if not raw_content:
            return _response(400, {"error": "content is required"})

        # Parse curriculum via Curriculum Architect agent
        parse_input = json.dumps(
            {"raw_content": raw_content[:30000], "subject_hint": subject}
        )
        result = invoke_agent(CURRICULUM_ARCHITECT_PROMPT, parse_input, max_tokens=16384)
        logger.info("Curriculum agent raw response type=%s, length=%d",
                     type(result).__name__, len(str(result)))

        # Parse the structured curriculum (handle markdown-wrapped JSON)
        try:
            if isinstance(result, dict):
                curriculum = result
            else:
                curriculum = extract_json(result)
        except (ValueError, TypeError) as e:
            logger.error("Failed to parse curriculum JSON: %s\nRaw: %s", e, str(result)[:500])
            curriculum = {"nodes": [], "parse_error": "Could not structure curriculum"}

        if "subject" not in curriculum:
            curriculum["subject"] = subject

        # Create a new session with this curriculum
        session_id = str(uuid.uuid4())
        first_node_id = ""
        if curriculum.get("nodes"):
            first_node_id = curriculum["nodes"][0].get("id", "")

        session_data = {
            "session_id": session_id,
            "curriculum": curriculum,
            "messages": [],
            "emotional_history": [],
            "completed_nodes": [],
            "current_node_id": first_node_id,
        }
        create_session(session_data)

        # Store raw content in S3 for reference
        s3_client.put_object(
            Bucket=CURRICULUM_BUCKET,
            Key=f"curricula/{session_id}/raw.txt",
            Body=raw_content.encode("utf-8"),
            ContentType="text/plain",
        )

        return _response(
            200,
            {
                "session_id": session_id,
                "curriculum": curriculum,
            },
        )
    except Exception as e:
        return _response(500, {"error": str(e)})


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
