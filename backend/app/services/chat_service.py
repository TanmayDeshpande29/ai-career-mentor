from uuid import UUID

from sqlalchemy.orm import Session

from app.models.chat import ChatMessage, Conversation
from app.repositories.chat_repository import ChatRepository
from app.repositories.resume_repository import ResumeRepository
from app.schemas.chat import ConversationCreate, MessageCreate
from app.services.ai_service import AIService
from app.services.resume_service import ResumeService

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
        # 3. Get user's active resume
        # --------------------------------

        resumes = ResumeService.get(
            db,
            user_id,
        )

        resume_id = None

        if resumes:
            # ResumeService.get() returns a list
            # containing the user's resumes.

            active_resume = next(
                (
                    resume
                    for resume in resumes
                    if not resume.is_deleted
                ),
                None,
            )

            if active_resume:
                resume_id = active_resume.id

        # --------------------------------
        # 4. Generate AI response
        # --------------------------------

        ai_service = AIService()

        ai_response = ai_service.generate_response(
            messages=messages,
            user_id=str(user_id),
            conversation_id=str(conversation.id),
            db=db,
            resume_id=str(resume_id) if resume_id else None,
        )

        # --------------------------------
        # 5. Save AI response
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
        # 6. Return AI message
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