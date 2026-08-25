from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.career_profiles import CareerProfile

from app.models.users import User
class CareerProfileRepository:

    @staticmethod
    def get_by_user_id(
        db: Session,
        user_id: UUID,
    ) -> CareerProfile | None:
        """
        Get the career profile belonging to a user.
        """

        statement = select(CareerProfile).where(
            CareerProfile.user_id == user_id
        )

        return db.execute(statement).scalar_one_or_none()

    @staticmethod
    def create(
        db: Session,
        profile: CareerProfile,
    ) -> CareerProfile:
        """
        Create and save a new career profile.
        """

        db.add(profile)
        db.commit()
        db.refresh(profile)

        return profile

    @staticmethod
    def update(
        db: Session,
        profile: CareerProfile,
    ) -> CareerProfile:
        """
        Save changes made to an existing career profile.
        """

        db.commit()
        db.refresh(profile)

        return profile

    @staticmethod
    def delete(
        db: Session,
        profile: CareerProfile,
    ) -> None:
        """
        Delete an existing career profile.
        """

        db.delete(profile)
        db.commit()

