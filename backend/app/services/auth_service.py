from sqlalchemy.orm import Session

from app.models.users import User
from app.repositories.user_repositories import UserRepository
from app.schemas.user import UserCreate
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
)


class AuthService:

    @staticmethod
    def register_user(db: Session, user_data: UserCreate) -> User:

        existing_user = UserRepository.get_by_email(
            db,
            user_data.email,
        )

        if existing_user:
            raise ValueError("Email already registered")

        hashed_password = hash_password(user_data.password)

        new_user = User(
            full_name=user_data.full_name,
            email=user_data.email,
            hashed_password=hashed_password,
        )

        return UserRepository.create(db, new_user)

    @staticmethod
    def authenticate_user(
        db: Session,
        email: str,
        password: str,
    ) -> tuple[str, str]:

        user = UserRepository.get_by_email(
            db,
            email,
        )

        if not user:
            raise ValueError("Invalid email or password")

        if not verify_password(
            password,
            user.hashed_password,
        ):
            raise ValueError("Invalid email or password")

        if not user.is_active:
            raise ValueError("User account is inactive")

        access_token = create_access_token(
            str(user.id)
        )

        refresh_token = create_refresh_token(
            str(user.id)
        )

        return access_token, refresh_token