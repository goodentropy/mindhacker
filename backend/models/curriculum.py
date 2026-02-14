"""Curriculum graph model for structured learning paths."""

from dataclasses import dataclass, field, asdict
from typing import List, Optional


@dataclass
class CurriculumNode:
    """A single node in the curriculum learning graph."""

    id: str
    title: str
    description: str
    difficulty: int = 1
    prerequisites: List[str] = field(default_factory=list)
    learning_objectives: List[str] = field(default_factory=list)
    content: str = ""

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass
class CurriculumGraph:
    """A directed acyclic graph of curriculum nodes."""

    nodes: List[CurriculumNode] = field(default_factory=list)
    subject: str = ""

    def to_dict(self) -> dict:
        return {"subject": self.subject, "nodes": [n.to_dict() for n in self.nodes]}

    @classmethod
    def from_dict(cls, d: dict) -> "CurriculumGraph":
        nodes = [CurriculumNode(**n) for n in d.get("nodes", [])]
        return cls(nodes=nodes, subject=d.get("subject", ""))

    def get_node(self, node_id: str) -> Optional[CurriculumNode]:
        """Find a node by its ID."""
        for n in self.nodes:
            if n.id == node_id:
                return n
        return None

    def get_available_nodes(self, completed: List[str]) -> List[CurriculumNode]:
        """Get all nodes whose prerequisites are met but are not yet completed."""
        available = []
        for node in self.nodes:
            if node.id not in completed:
                if all(p in completed for p in node.prerequisites):
                    available.append(node)
        return available
