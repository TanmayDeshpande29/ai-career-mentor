from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ConversationCreate(BaseModel):
    title: str = Field(default="New conversation", min_length=1, max_length=200)


class MessageCreate(BaseModel):
    content: str = Field(min_length=1)


class MessageResponse(BaseModel):
    id: UUID
    conversation_id: UUID
    role: str
    content: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class ConversationResponse(ConversationCreate):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime
    messages: list[MessageResponse] = []
    model_config = ConfigDict(from_attributes=True)