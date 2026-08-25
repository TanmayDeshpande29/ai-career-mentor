from uuid import UUID

from sqlalchemy.orm import Session

from app.models.career_profiles import CareerProfile
from app.repositories.careerprofile_repositories import (
    CareerProfileRepository,
)
from app.schemas.career_profile import (
    CareerProfileCreate,
    CareerProfileUpdate,
)


class CareerProfileService:

    @staticmethod
    def create_profile(
        db: Session,
        user_id: UUID,
        profile_data: CareerProfileCreate,
    ) -> CareerProfile:

        existing_profile = (
            CareerProfileRepository.get_by_user_id(
                db,
                user_id,
            )
        )

        if existing_profile:
            raise ValueError(
                "Career profile already exists"
            )

        profile = CareerProfile(
            user_id=user_id,
            **profile_data.model_dump(),
        )

        return CareerProfileRepository.create(
            db,
            profile,
        )

    @staticmethod
    def get_profile(
        db: Session,
        user_id: UUID,
    ) -> CareerProfile | None:

        return CareerProfileRepository.get_by_user_id(
            db,
            user_id,
        )

    @staticmethod
    def update_profile(
        db: Session,
        user_id: UUID,
        profile_data: CareerProfileUpdate,
    ) -> CareerProfile:

        profile = CareerProfileRepository.get_by_user_id(
            db,
            user_id,
        )

        if not profile:
            raise ValueError(
                "Career profile not found"
            )

        update_data = profile_data.model_dump(
            exclude_unset=True
        )

        for field, value in update_data.items():
            setattr(profile, field, value)

        return CareerProfileRepository.update(
            db,
            profile,
        )

    @staticmethod
    def delete_profile(
        db: Session,
        user_id: UUID,
    ) -> None:

        profile = CareerProfileRepository.get_by_user_id(
            db,
            user_id,
        )

        if not profile:
            raise ValueError(
                "Career profile not found"
            )

        CareerProfileRepository.delete(
            db,
            profile,
        )