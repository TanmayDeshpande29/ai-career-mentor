from uuid import UUID

from sqlalchemy.orm import Session
from sqlalchemy import select

from app.models.users import User


class UserRepository:

    @staticmethod
    def get_by_email(db: Session, email: str) -> User | None:
        """
        Returns a user if the email exists.
        Otherwise returns None.
        """
        statement = select(User).where(User.email == email)

        return db.execute(statement).scalar_one_or_none()

    @staticmethod
    def create(db: Session, user: User) -> User:
        """
        Save a new user into the database.
        """
        db.add(user)
        db.commit()
        db.refresh(user)

        return user

    @staticmethod
    def get_by_id(
        db: Session,
        user_id: UUID,
    ) -> User | None:
        """
        Returns a user by UUID.
        """

        statement = select(User).where(
            User.id == user_id
        )

        return db.execute(statement).scalar_one_or_none()