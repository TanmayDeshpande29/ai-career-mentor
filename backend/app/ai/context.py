from dataclasses import dataclass
from typing import Optional

from sqlalchemy.orm import Session


@dataclass
class AgentContext:
    """
    Runtime dependencies supplied to every AI execution.

    This data is NOT model-generated.
    It is controlled by our backend.
    """

    user_id: str
    conversation_id: str

    db: Session

    resume_id: Optional[str] = None