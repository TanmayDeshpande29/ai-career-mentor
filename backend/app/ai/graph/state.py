from typing import Literal

from langgraph.graph import MessagesState


IntentType = Literal[
    "career",
    "resume",
    "roadmap",
    "interview",
    "general",
]


class CareerMentorState(MessagesState):
    """
    Shared state for the top-level Career Mentor graph.

    messages:
        Conversation messages passed through the graph.

    intent:
        Intent selected by the classifier.

    intent_confidence:
        Classifier confidence between 0 and 1.

    retrieved_context:
        Optional RAG context retrieved for the current request.
    """

    intent: IntentType | None
    intent_confidence: float
    retrieved_context: str | None