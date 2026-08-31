from sqlalchemy.orm import Session

from app.models.users import User
from app.repositories.user_repositories import UserRepository
from app.schemas.user import UserCreate
from app.models.preferences import UserPreference
from app.repositories.preferences_repository import PreferencesRepository

from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
)


class AuthService:

    @staticmethod
    def update_user(db: Session, user: User, full_name: str, email: str) -> User:
        existing = UserRepository.get_by_email(db, email)
        if existing and existing.id != user.id:
            raise ValueError("Email already registered")
        user.full_name, user.email = full_name, email
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def change_password(db: Session, user: User, current_password: str, new_password: str) -> None:
        if not verify_password(current_password, user.hashed_password):
            raise ValueError("Current password is incorrect")
        user.hashed_password = hash_password(new_password)
        db.commit()

    @staticmethod
    def get_preferences(db: Session, user_id):
        preference = PreferencesRepository.get(db, user_id)
        if preference:
            return preference
        return PreferencesRepository.save(db, UserPreference(user_id=user_id))

    @staticmethod
    def update_preferences(db: Session, user_id, data):
        preference = AuthService.get_preferences(db, user_id)
        for field, value in data.model_dump().items():
            setattr(preference, field, value)
        db.commit()
        db.refresh(preference)
        return preference

    @staticmethod
    def register_user(
        db: Session,
        user_data: UserCreate,
    ) -> User:

        existing_user = UserRepository.get_by_email(
            db,
            user_data.email,
        )

        if existing_user:
            raise ValueError("Email already registered")

        hashed_password = hash_password(
            user_data.password
        )

        new_user = User(
            full_name=user_data.full_name,
            email=user_data.email,
            hashed_password=hashed_password,
        )

        return UserRepository.create(
            db,
            new_user,
        )

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
            raise ValueError(
                "Invalid email or password"
            )

        if not verify_password(
            password,
            user.hashed_password,
        ):
            raise ValueError(
                "Invalid email or password"
            )

        if not user.is_active:
            raise ValueError(
                "User account is inactive"
            )

        access_token = create_access_token(
            str(user.id)
        )

        refresh_token = create_refresh_token(
            str(user.id)
        )

        return access_token, refresh_token

    @staticmethod
    def login_user(
        db: Session,
        email: str,
        password: str,
    ):

        access_token, refresh_token = (
            AuthService.authenticate_user(
                db,
                email,
                password,
            )
        )

        user = UserRepository.get_by_email(
            db,
            email,
        )

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "user": user,
        }