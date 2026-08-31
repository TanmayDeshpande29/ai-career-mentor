from uuid import UUID
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.roadmap import Roadmap, RoadmapItem


class RoadmapRepository:
    @staticmethod
    def get_by_user_id(db: Session, user_id: UUID) -> Roadmap | None:
        return db.execute(select(Roadmap).where(Roadmap.user_id == user_id)).scalar_one_or_none()

    @staticmethod
    def get_items(db: Session, roadmap_id: UUID) -> list[RoadmapItem]:
        return list(db.execute(select(RoadmapItem).where(RoadmapItem.roadmap_id == roadmap_id).order_by(RoadmapItem.order_index)).scalars())

    @staticmethod
    def save(db: Session, roadmap: Roadmap) -> Roadmap:
        db.add(roadmap)
        db.commit()
        db.refresh(roadmap)
        return roadmap

    @staticmethod
    def delete(db: Session, roadmap: Roadmap) -> None:
        db.delete(roadmap)
        db.commit()