from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.users import User
from app.schemas.career_profile import (
    CareerProfileCreate,
    CareerProfileResponse,
    CareerProfileUpdate,
)
from app.services.career_profile_service import CareerProfileService
from app.core.security import get_current_user


router = APIRouter(
    prefix="/career-profile",
    tags=["Career Profile"],
)


@router.post(
    "",
    response_model=CareerProfileResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_career_profile(
    profile_data: CareerProfileCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return CareerProfileService.create_profile(
            db,
            current_user.id,
            profile_data,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error),
        )


@router.get(
    "/me",
    response_model=CareerProfileResponse,
)
def get_my_career_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    profile = CareerProfileService.get_profile(
        db,
        current_user.id,
    )

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Career profile not found",
        )

    return profile


@router.put(
    "/me",
    response_model=CareerProfileResponse,
)
def update_my_career_profile(
    profile_data: CareerProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return CareerProfileService.update_profile(
            db,
            current_user.id,
            profile_data,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        )


@router.delete(
    "/me",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_my_career_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        CareerProfileService.delete_profile(
            db,
            current_user.id,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        )