"""Lambda handler for student progress and emotional history retrieval."""

import json

from utils.dynamo import get_session


def lambda_handler(event, context):
    """GET /api/progress/{id} - Return emotional history and progress data."""
    try:
        path_params = event.get("pathParameters", {}) or {}
        session_id = path_params.get("id", "")
        if not session_id:
            return _response(400, {"error": "session id required"})

        session = get_session(session_id)
        if not session:
            return _response(404, {"error": "Session not found"})

        curriculum = session.get("curriculum", {})
        nodes = curriculum.get("nodes", [])
        completed = session.get("completed_nodes", [])

        progress_pct = (len(completed) / len(nodes) * 100) if nodes else 0

        return _response(
            200,
            {
                "session_id": session_id,
                "emotional_history": session.get("emotional_history", []),
                "completed_nodes": completed,
                "total_nodes": len(nodes),
                "progress_pct": progress_pct,
                "current_node_id": session.get("current_node_id", ""),
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
            "Access-Control-Allow-Methods": "GET,OPTIONS",
        },
        "body": json.dumps(body),
    }
