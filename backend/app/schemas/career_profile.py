from uuid import UUID
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class CareerProfileCreate(BaseModel):
    current_role: str | None = None
    experience_years: float | None = None
    target_role: str | None = None
    target_location: str | None = None

    skills: dict | None = None
    education: dict | None = None
    certifications: dict | None = None

    career_goals: str | None = None
    bio: str | None = None


class CareerProfileUpdate(BaseModel):
    current_role: str | None = None
    experience_years: float | None = None
    target_role: str | None = None
    target_location: str | None = None

    skills: dict | None = None
    education: dict | None = None
    certifications: dict | None = None

    career_goals: str | None = None
    bio: str | None = None


class CareerProfileResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID

    current_role: str | None
    experience_years: float | None
    target_role: str | None
    target_location: str | None

    skills: dict | None
    education: dict | None
    certifications: dict | None

    career_goals: str | None
    bio: str | None

    created_at: datetime
    updated_at: datetime