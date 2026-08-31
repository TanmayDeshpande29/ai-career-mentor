from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.security import get_current_user
from app.database.session import get_db
from app.models.users import User
from app.schemas.user import PasswordChange, PreferenceResponse, PreferenceUpdate, UserResponse, UserUpdate
from app.services.auth_service import AuthService

router = APIRouter(prefix="/settings", tags=["Settings"])


@router.put("/profile", response_model=UserResponse)
def update_profile(data: UserUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        return AuthService.update_user(db, current_user, data.full_name, data.email)
    except ValueError as error:
        raise HTTPException(status_code=409, detail=str(error))


@router.put("/password", status_code=200)
def change_password(data: PasswordChange, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        AuthService.change_password(db, current_user, data.current_password, data.new_password)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))
    return {"message": "Password updated successfully"}


@router.get("/preferences", response_model=PreferenceResponse)
def get_preferences(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return AuthService.get_preferences(db, current_user.id)


@router.put("/preferences", response_model=PreferenceResponse)
def update_preferences(data: PreferenceUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return AuthService.update_preferences(db, current_user.id, data)