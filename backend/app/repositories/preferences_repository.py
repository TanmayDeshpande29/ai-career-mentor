from uuid import UUID
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.preferences import UserPreference


class PreferencesRepository:
    @staticmethod
    def get(db: Session, user_id: UUID) -> UserPreference | None:
        return db.execute(select(UserPreference).where(UserPreference.user_id == user_id)).scalar_one_or_none()

    @staticmethod
    def save(db: Session, preference: UserPreference) -> UserPreference:
        db.add(preference)
        db.commit()
        db.refresh(preference)
        return preference