from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session
from app.core.security import get_current_user
from app.database.session import get_db
from app.models.career_profiles import CareerProfile
from app.models.chat import Conversation
from app.models.resume import Resume
from app.models.roadmap import Roadmap
from app.models.users import User

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/summary")
def dashboard_summary(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile_completed = db.execute(select(CareerProfile.id).where(CareerProfile.user_id == current_user.id)).scalar_one_or_none() is not None
    has_resume = db.execute(select(Resume.id).where(Resume.user_id == current_user.id, Resume.is_deleted.is_(False))).scalar_one_or_none() is not None
    roadmap = db.execute(select(Roadmap.id).where(Roadmap.user_id == current_user.id)).scalar_one_or_none() is not None
    mentor_sessions = db.execute(select(func.count(Conversation.id)).where(Conversation.user_id == current_user.id)).scalar_one()
    return {"profile_completed": profile_completed, "resume_score": 0, "learning_streak": 0, "roadmap_progress": 0, "mentor_sessions": mentor_sessions, "has_resume": has_resume, "has_roadmap": roadmap, "recent_activity": [], "recommendations": []}