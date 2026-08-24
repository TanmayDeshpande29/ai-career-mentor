from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Boolean,String
from sqlalchemy.dialects.postgresql import UUID
import uuid

from app.models.base import TimestampMixin, Base

class User(TimestampMixin,Base):
    __tablename__ = "user_master"

    id: Mapped[uuid.UUID] = mapped_column(
    UUID(as_uuid=True),
    primary_key=True,
    default=uuid.uuid4,
)
   
    full_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    email:Mapped[str]= mapped_column(
        String(225),
        unique=True,
        index=True,
        nullable=False
    )

    hashed_password: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    role: Mapped[str] = mapped_column(
        String(20),
        default="user",
        nullable=False,
    )

    provider: Mapped[str] = mapped_column(
        String(20),
        default="email",
        nullable=False,
    )

    profile_image: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    is_verified: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    def __repr__(self):
        return f"<User {self.email}>"
