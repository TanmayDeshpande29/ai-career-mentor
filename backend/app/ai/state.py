from typing import Literal

from langchain.agents import AgentState


IntentType = Literal[
    "career",
    "resume",
    "roadmap",
    "general",
]


class CareerMentorState(AgentState):
    """
    Shared state for the top-level Career Mentor graph.
    """

    intent: IntentType | None

    intent_confidence: float

    retrieved_context: str | None