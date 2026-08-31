from typing import Literal

from pydantic import BaseModel, Field


class IntentClassification(BaseModel):
    intent: Literal[
        "career",
        "resume",
        "roadmap",
        "interview",
        "general",
    ] = Field(
        description="The primary intent of the user's request."
    )

    confidence: float = Field(
        ge=0.0,
        le=1.0,
        description="Confidence score between 0 and 1."
    )