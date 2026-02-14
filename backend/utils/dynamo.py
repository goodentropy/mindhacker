"""DynamoDB utilities for session persistence."""

import json
import os
from decimal import Decimal
from typing import Optional

import boto3
from boto3.dynamodb.conditions import Key

TABLE_NAME = os.environ.get("TABLE_NAME", "MindHackerSessions")

dynamodb = boto3.resource(
    "dynamodb",
    region_name=os.environ.get("AWS_REGION", "us-east-1"),
)
table = dynamodb.Table(TABLE_NAME)


class DecimalEncoder(json.JSONEncoder):
    """JSON encoder that handles Decimal types from DynamoDB."""

    def default(self, o):
        if isinstance(o, Decimal):
            return float(o)
        return super().default(o)


def _convert_floats(obj):
    """Convert float values to Decimal for DynamoDB storage."""
    if isinstance(obj, float):
        return Decimal(str(obj))
    elif isinstance(obj, dict):
        return {k: _convert_floats(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [_convert_floats(v) for v in obj]
    return obj


def create_session(session_data: dict) -> dict:
    """Create a new session in DynamoDB."""
    item = _convert_floats(
        {
            "PK": f"SESSION#{session_data['session_id']}",
            "SK": "METADATA",
            **session_data,
        }
    )
    table.put_item(Item=item)
    return session_data


def get_session(session_id: str) -> Optional[dict]:
    """Retrieve a session from DynamoDB by session ID."""
    response = table.get_item(
        Key={"PK": f"SESSION#{session_id}", "SK": "METADATA"}
    )
    item = response.get("Item")
    if item:
        return json.loads(json.dumps(item, cls=DecimalEncoder))
    return None


def update_session(session_id: str, updates: dict) -> None:
    """Update specific fields of a session in DynamoDB."""
    expressions = []
    values = {}
    names = {}

    for i, (key, val) in enumerate(updates.items()):
        attr_name = f"#attr{i}"
        attr_val = f":val{i}"
        expressions.append(f"{attr_name} = {attr_val}")
        names[attr_name] = key
        values[attr_val] = _convert_floats(val)

    table.update_item(
        Key={"PK": f"SESSION#{session_id}", "SK": "METADATA"},
        UpdateExpression="SET " + ", ".join(expressions),
        ExpressionAttributeNames=names,
        ExpressionAttributeValues=values,
    )
