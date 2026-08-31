from uuid import UUID
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.chat import ChatMessage, Conversation


class ChatRepository:
    @staticmethod
    def conversations(db: Session, user_id: UUID) -> list[Conversation]:
        return list(db.execute(select(Conversation).where(Conversation.user_id == user_id).order_by(Conversation.updated_at.desc())).scalars())

    @staticmethod
    def get_conversation(db: Session, conversation_id: UUID, user_id: UUID) -> Conversation | None:
        return db.execute(select(Conversation).where(Conversation.id == conversation_id, Conversation.user_id == user_id)).scalar_one_or_none()

    @staticmethod
    def messages(db: Session, conversation_id: UUID) -> list[ChatMessage]:
        return list(db.execute(select(ChatMessage).where(ChatMessage.conversation_id == conversation_id).order_by(ChatMessage.created_at)).scalars())

    @staticmethod
    def save(db: Session, entity):
        db.add(entity)
        db.commit()
        db.refresh(entity)
        return entity

    @staticmethod
    def delete(db: Session, conversation: Conversation) -> None:
        db.delete(conversation)
        db.commit()