from uuid import UUID

from sqlalchemy.orm import Session

from app.models.chat import ChatMessage, Conversation
from app.repositories.chat_repository import ChatRepository
from app.schemas.chat import ConversationCreate, MessageCreate
from app.services.ai_service import AIService


class ChatService:

    @staticmethod
    def _response(
        db: Session,
        conversation: Conversation,
    ):
        conversation.messages = ChatRepository.messages(
            db,
            conversation.id,
        )

        return conversation

    @staticmethod
    def list(
        db: Session,
        user_id: UUID,
    ):
        conversations = ChatRepository.conversations(
            db,
            user_id,
        )

        return [
            ChatService._response(db, item)
            for item in conversations
        ]

    @staticmethod
    def create(
        db: Session,
        user_id: UUID,
        data: ConversationCreate,
    ):
        conversation = Conversation(
            user_id=user_id,
            title=data.title,
        )

        return ChatRepository.save(
            db,
            conversation,
        )

    @staticmethod
    def get(
        db: Session,
        user_id: UUID,
        conversation_id: UUID,
    ):
        conversation = ChatRepository.get_conversation(
            db,
            conversation_id,
            user_id,
        )

        if not conversation:
            return None

        return ChatService._response(
            db,
            conversation,
        )

    @staticmethod
    def add_message(
        db: Session,
        user_id: UUID,
        conversation_id: UUID,
        data: MessageCreate,
    ):

        conversation = ChatRepository.get_conversation(
            db,
            conversation_id,
            user_id,
        )

        if not conversation:
            raise ValueError(
                "Conversation not found"
            )

        # --------------------------------
        # 1. Save user message
        # --------------------------------

        user_message = ChatMessage(
            conversation_id=conversation.id,
            role="user",
            content=data.content,
        )

        ChatRepository.save(
            db,
            user_message,
        )

        # --------------------------------
        # 2. Get conversation history
        # --------------------------------

        history = ChatRepository.messages(
            db,
            conversation.id,
        )

        messages = [
            {
                "role": message.role,
                "content": message.content,
            }
            for message in history
        ]

        # --------------------------------
        # 3. Generate AI response
        # --------------------------------

        ai_service = AIService()

        ai_response = ai_service.generate_response(
            messages
        )

        # --------------------------------
        # 4. Save AI response
        # --------------------------------

        assistant_message = ChatMessage(
            conversation_id=conversation.id,
            role="assistant",
            content=ai_response,
        )

        ChatRepository.save(
            db,
            assistant_message,
        )

        # --------------------------------
        # 5. Return AI message
        # --------------------------------

        return assistant_message

    @staticmethod
    def delete(
        db: Session,
        user_id: UUID,
        conversation_id: UUID,
    ):
        conversation = ChatRepository.get_conversation(
            db,
            conversation_id,
            user_id,
        )

        if not conversation:
            raise ValueError(
                "Conversation not found"
            )

        ChatRepository.delete(
            db,
            conversation,
        )