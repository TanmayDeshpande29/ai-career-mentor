from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.user import (
    UserCreate,
    UserResponse,
    UserLogin,
    TokenResponse,
)
from app.services.auth_service import AuthService


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post(
    "/register",
    response_model=UserResponse,status_code = status.HTTP_201_CREATED
)
def register_user(
    user_data:UserCreate,
    db:Session=Depends(get_db)
):
    try:
        return AuthService.register_user(db,user_data)
    except ValueError as errors:
        raise HTTPException(
            status_code= status.HTTP_409_CONFLICT,
            detail=str(errors)
        )


                                         