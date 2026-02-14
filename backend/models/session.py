"""Session model for tracking student learning sessions."""

import uuid
from dataclasses import dataclass, field, asdict
from datetime import datetime
from typing import List, Dict


@dataclass
class Session:
    """Represents a student's learning session with curriculum, messages, and emotional history."""

    session_id: str = ""
    curriculum: Dict = field(default_factory=dict)
    messages: List[Dict] = field(default_factory=list)
    emotional_history: List[Dict] = field(default_factory=list)
    completed_nodes: List[str] = field(default_factory=list)
    current_node_id: str = ""
    created_at: str = ""

    def __post_init__(self):
        if not self.session_id:
            self.session_id = str(uuid.uuid4())
        if not self.created_at:
            self.created_at = datetime.utcnow().isoformat()

    def to_dict(self) -> dict:
        return asdict(self)

    @classmethod
    def from_dict(cls, d: dict) -> "Session":
        return cls(**{k: v for k, v in d.items() if k in cls.__dataclass_fields__})

    def add_message(self, role: str, content: str) -> None:
        self.messages.append(
            {"role": role, "content": content, "timestamp": datetime.utcnow().isoformat()}
        )
