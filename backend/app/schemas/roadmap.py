from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class RoadmapItemCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: str | None = None
    status: str = "not_started"
    priority: str = "medium"
    order_index: int = 0


class RoadmapItemResponse(RoadmapItemCreate):
    id: UUID
    roadmap_id: UUID
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)


class RoadmapCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: str | None = None
    status: str = "draft"
    items: list[RoadmapItemCreate] = []


class RoadmapResponse(BaseModel):
    id: UUID
    user_id: UUID
    title: str
    description: str | None
    status: str
    items: list[RoadmapItemResponse]
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)