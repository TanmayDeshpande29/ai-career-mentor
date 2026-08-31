import uuid

from sqlalchemy import Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin


class UserPreference(Base, TimestampMixin):
    __tablename__ = "user_preferences"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("user_master.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    email_notifications: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    career_updates: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    ai_notifications: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)