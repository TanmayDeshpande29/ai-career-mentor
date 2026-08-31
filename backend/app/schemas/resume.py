from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ResumeCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    file_name: str | None = None
    storage_reference: str | None = None
    raw_text: str | None = None


class ResumeResponse(ResumeCreate):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime
    content_type: str | None
    is_deleted: bool
    is_enhanced: bool
    model_config = ConfigDict(from_attributes=True)


class ResumeUpdate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    raw_text: str | None = None


class EnhancedResumeUpdate(BaseModel):
    raw_text: str = Field(min_length=1)