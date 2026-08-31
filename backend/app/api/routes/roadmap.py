from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.security import get_current_user
from app.database.session import get_db
from app.models.users import User
from app.schemas.roadmap import RoadmapCreate, RoadmapResponse
from app.services.roadmap_service import RoadmapService

router = APIRouter(prefix="/roadmap", tags=["Roadmap"])


@router.get("/me", response_model=RoadmapResponse)
def get_roadmap(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    roadmap = RoadmapService.get(db, current_user.id)
    if not roadmap:
        raise HTTPException(status_code=404, detail="Roadmap not found")
    return roadmap


@router.post("", response_model=RoadmapResponse, status_code=status.HTTP_201_CREATED)
@router.put("/me", response_model=RoadmapResponse)
def save_roadmap(data: RoadmapCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return RoadmapService.save(db, current_user.id, data)


@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
def delete_roadmap(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        RoadmapService.delete(db, current_user.id)
    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error))