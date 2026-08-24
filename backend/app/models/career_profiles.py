import uuid

from sqlalchemy import ForeignKey, String, Text, Numeric, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin


class CareerProfile(Base, TimestampMixin):
    __tablename__ = "career_profiles"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("user_master.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True,
    )

    current_role: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    experience_years: Mapped[float | None] = mapped_column(
        Numeric(4, 1),
        nullable=True,
    )

    target_role: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    target_location: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    skills: Mapped[dict | None] = mapped_column(
        JSON,
        nullable=True,
    )

    education: Mapped[dict | None] = mapped_column(
        JSON,
        nullable=True,
    )

    certifications: Mapped[dict | None] = mapped_column(
        JSON,
        nullable=True,
    )

    career_goals: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    bio: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    def __repr__(self):
        return f"<CareerProfile user_id={self.user_id}>"