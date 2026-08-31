from uuid import UUID
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.resume import Resume


class ResumeRepository:
    @staticmethod
    def get_by_user_id(db: Session, user_id: UUID, include_deleted: bool = False) -> list[Resume]:
        statement = select(Resume).where(Resume.user_id == user_id)
        if not include_deleted:
            statement = statement.where(Resume.is_deleted.is_(False))
        return list(db.execute(statement.order_by(Resume.updated_at.desc())).scalars())

    @staticmethod
    def get_by_id(db: Session, user_id: UUID, resume_id: UUID) -> Resume | None:
        return db.execute(select(Resume).where(Resume.id == resume_id, Resume.user_id == user_id)).scalar_one_or_none()

    @staticmethod
    def save(db: Session, resume: Resume) -> Resume:
        db.add(resume)
        db.commit()
        db.refresh(resume)
        return resume

    @staticmethod
    def delete(db: Session, resume: Resume) -> None:
        db.delete(resume)
        db.commit()