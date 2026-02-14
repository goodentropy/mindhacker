"""Emotional state model with derived metrics and adaptation strategies."""

from dataclasses import dataclass, field, asdict
from typing import List, Dict


@dataclass
class EmotionalState:
    """Represents a student's emotional state across 5 dimensions."""

    engagement: float = 0.5
    confidence: float = 0.5
    frustration: float = 0.0
    curiosity: float = 0.5
    cognitive_load: float = 0.3

    def to_dict(self) -> dict:
        return asdict(self)

    @classmethod
    def from_dict(cls, d: dict) -> "EmotionalState":
        return cls(
            **{k: float(v) for k, v in d.items() if k in cls.__dataclass_fields__}
        )

    @property
    def flow_score(self) -> float:
        """How close to flow state (high engagement + confidence, low frustration)."""
        return (
            self.engagement
            + self.confidence
            + self.curiosity
            - self.frustration
            - self.cognitive_load * 0.5
        ) / 3.5

    @property
    def dropout_risk(self) -> float:
        """Risk of student disengaging."""
        return (
            self.frustration * 0.4
            + (1 - self.engagement) * 0.3
            + self.cognitive_load * 0.3
        )

    @property
    def readiness_for_challenge(self) -> float:
        """Ready for harder content?"""
        return (
            self.confidence * 0.4 + self.engagement * 0.3 + self.curiosity * 0.3
        ) * (1 - self.frustration)

    def get_adaptation_strategy(self) -> Dict[str, str]:
        """Decision matrix: emotional state -> teaching strategy."""
        strategies: Dict[str, str] = {}

        if self.frustration > 0.6:
            strategies["tone"] = "encouraging"
            strategies["complexity"] = "simplified"
            strategies["approach"] = "break_into_steps"

        if self.engagement < 0.3:
            strategies["tone"] = "enthusiastic"
            strategies["approach"] = "gamify"
            strategies["examples"] = "real_world"

        if self.curiosity > 0.7:
            strategies["depth"] = "deep_dive"
            strategies["extras"] = "tangential_facts"

        if self.cognitive_load > 0.7:
            strategies["complexity"] = "scaffolded"
            strategies["pacing"] = "slower"

        if self.confidence > 0.8 and self.frustration < 0.3:
            strategies["complexity"] = "advanced"
            strategies["challenge"] = "increased"

        return strategies


@dataclass
class EmotionalHistory:
    """Stores timestamped emotional states across a session."""

    states: List[Dict] = field(default_factory=list)

    def add(self, state: EmotionalState, message_index: int) -> None:
        entry = state.to_dict()
        entry["message_index"] = message_index
        entry["flow_score"] = state.flow_score
        entry["dropout_risk"] = state.dropout_risk
        self.states.append(entry)

    def to_list(self) -> List[Dict]:
        return self.states
