from dataclasses import dataclass
from typing import Optional

from sqlalchemy.orm import Session


@dataclass
class AgentContext:
    """
    Runtime dependencies supplied by the backend.

    This context is trusted application state.
    It is NEVER generated or modified by the LLM.
    """

    user_id: str
    conversation_id: str

    db: Session

    resume_id: Optional[str] = None