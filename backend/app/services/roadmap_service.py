from uuid import UUID
from sqlalchemy.orm import Session
from app.models.roadmap import Roadmap, RoadmapItem
from app.repositories.roadmap_repository import RoadmapRepository
from app.schemas.roadmap import RoadmapCreate


class RoadmapService:
    @staticmethod
    def _response(db, roadmap):
        roadmap.items = RoadmapRepository.get_items(db, roadmap.id)
        return roadmap

    @staticmethod
    def get(db: Session, user_id: UUID):
        roadmap = RoadmapRepository.get_by_user_id(db, user_id)
        return RoadmapService._response(db, roadmap) if roadmap else None

    @staticmethod
    def save(db: Session, user_id: UUID, data: RoadmapCreate):
        roadmap = RoadmapRepository.get_by_user_id(db, user_id)
        if roadmap:
            roadmap.title, roadmap.description, roadmap.status = data.title, data.description, data.status
            for item in RoadmapRepository.get_items(db, roadmap.id):
                db.delete(item)
        else:
            roadmap = Roadmap(user_id=user_id, title=data.title, description=data.description, status=data.status)
            db.add(roadmap)
            db.flush()
        for item in data.items:
            db.add(RoadmapItem(roadmap_id=roadmap.id, **item.model_dump()))
        db.commit()
        db.refresh(roadmap)
        return RoadmapService._response(db, roadmap)

    @staticmethod
    def delete(db: Session, user_id: UUID):
        roadmap = RoadmapRepository.get_by_user_id(db, user_id)
        if not roadmap:
            raise ValueError("Roadmap not found")
        RoadmapRepository.delete(db, roadmap)