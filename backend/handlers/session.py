"""Lambda handler for session creation and retrieval."""

import json

from utils.dynamo import get_session, create_session
from models.session import Session


def lambda_handler(event, context):
    """POST /api/session - Create session, GET /api/session/{id} - Get session."""
    method = event.get("requestContext", {}).get("http", {}).get("method", "GET")

    if method == "POST":
        return _handle_create(event)
    elif method == "GET":
        return _handle_get(event)
    else:
        return _response(405, {"error": "Method not allowed"})


def _handle_create(event):
    """Create a new learning session."""
    try:
        body = json.loads(event.get("body", "{}"))
        session = Session(curriculum=body.get("curriculum", {}))
        data = session.to_dict()
        create_session(data)
        return _response(200, data)
    except Exception as e:
        return _response(500, {"error": str(e)})


def _handle_get(event):
    """Retrieve an existing session by ID."""
    try:
        path_params = event.get("pathParameters", {}) or {}
        session_id = path_params.get("id", "")
        if not session_id:
            return _response(400, {"error": "session id required"})

        session = get_session(session_id)
        if not session:
            return _response(404, {"error": "Session not found"})

        # Remove DynamoDB keys from response
        session.pop("PK", None)
        session.pop("SK", None)
        return _response(200, session)
    except Exception as e:
        return _response(500, {"error": str(e)})


def _response(status_code: int, body: dict) -> dict:
    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "POST,GET,OPTIONS",
        },
        "body": json.dumps(body),
    }
