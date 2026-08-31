from uuid import UUID

from sqlalchemy.orm import Session

from app.models.resume import Resume
from app.repositories.resume_repository import ResumeRepository
from app.schemas.resume import (
    EnhancedResumeUpdate,
    ResumeCreate,
    ResumeUpdate,
)
from app.ai.rag.ingestion import ResumeIngestionService
from app.ai.rag.qdrant_store import get_qdrant_client
from app.core.config import settings


class ResumeService:

    # ============================================================
    # Resume Retrieval
    # ============================================================

    @staticmethod
    def get(db: Session, user_id: UUID):
        return ResumeRepository.get_by_user_id(
            db,
            user_id,
        )

    @staticmethod
    def get_one(
        db: Session,
        user_id: UUID,
        resume_id: UUID,
    ):
        return ResumeRepository.get_by_id(
            db,
            user_id,
            resume_id,
        )

    # ============================================================
    # Normal Resume Save
    # ============================================================

    @staticmethod
    def save(
        db: Session,
        user_id: UUID,
        data: ResumeCreate,
    ):
        resume = Resume(
            user_id=user_id,
            **data.model_dump(),
        )

        return ResumeRepository.save(
            db,
            resume,
        )

    # ============================================================
    # Resume Upload + RAG Indexing
    # ============================================================

    @staticmethod
    def save_uploaded(
        db: Session,
        user_id: UUID,
        data: ResumeCreate,
        content: bytes,
        content_type: str | None,
    ):

        resume = Resume(
            user_id=user_id,
            file_content=content,
            content_type=content_type,
            **data.model_dump(),
        )

        resume = ResumeRepository.save(
            db,
            resume,
        )

        # --------------------------------------------------------
        # Index resume into Qdrant
        # --------------------------------------------------------

        try:

            ResumeService._index_resume(
                resume=resume,
                user_id=user_id,
            )

        except Exception as error:

            print(
                f"RAG indexing failed for resume "
                f"{resume.id}: {error}"
            )

        return resume

    # ============================================================
    # RAG Indexing
    # ============================================================

    @staticmethod
    def _index_resume(
        resume: Resume,
        user_id: UUID,
    ):

        from langchain_core.documents import Document

        if not resume.raw_text:
            return

        document = Document(
            page_content=resume.raw_text,
            metadata={
                "source": resume.file_name or resume.title,
                "file_type": resume.content_type or "unknown",
                "user_id": str(user_id),
                "resume_id": str(resume.id),
                "document_type": "resume",
            },
        )

        ingestion_service = ResumeIngestionService()

        chunks = ingestion_service.index_resume(
            documents=[document],
            user_id=user_id,
            resume_id=resume.id,
        )

        print(
            f"Resume {resume.id} indexed successfully. "
            f"Created {chunks} chunks."
        )

    # ============================================================
    # Resume Update
    # ============================================================

    @staticmethod
    def update(
        db: Session,
        user_id: UUID,
        resume_id: UUID,
        data: ResumeUpdate,
    ):

        resume = ResumeRepository.get_by_id(
            db,
            user_id,
            resume_id,
        )

        if not resume or resume.is_deleted:
            raise ValueError("Resume not found")

        resume.title = data.title
        resume.raw_text = data.raw_text

        resume = ResumeRepository.save(
            db,
            resume,
        )

        # Re-index updated resume
        try:

            ResumeService._delete_resume_vectors(
                user_id=user_id,
                resume_id=resume_id,
            )

            ResumeService._index_resume(
                resume=resume,
                user_id=user_id,
            )

        except Exception as error:

            print(
                f"RAG re-indexing failed for resume "
                f"{resume.id}: {error}"
            )

        return resume

    # ============================================================
    # Delete Resume
    # ============================================================

    @staticmethod
    def delete(
        db: Session,
        user_id: UUID,
        resume_id: UUID,
    ):

        resume = ResumeRepository.get_by_id(
            db,
            user_id,
            resume_id,
        )

        if not resume:
            raise ValueError("Resume not found")

        resume.is_deleted = True

        resume = ResumeRepository.save(
            db,
            resume,
        )

        # Remove vectors from Qdrant
        try:

            ResumeService._delete_resume_vectors(
                user_id=user_id,
                resume_id=resume_id,
            )

        except Exception as error:

            print(
                f"Failed to delete resume vectors "
                f"for {resume.id}: {error}"
            )

        return resume

    # ============================================================
    # Delete Resume Vectors
    # ============================================================

    @staticmethod
    def _delete_resume_vectors(
        user_id: UUID,
        resume_id: UUID,
    ):

        client = get_qdrant_client()

        client.delete(
            collection_name=settings.QDRANT_COLLECTION,
            points_selector={
                "filter": {
                    "must": [
                        {
                            "key": "metadata.user_id",
                            "match": {
                                "value": str(user_id),
                            },
                        },
                        {
                            "key": "metadata.resume_id",
                            "match": {
                                "value": str(resume_id),
                            },
                        },
                    ]
                }
            },
        )

    # ============================================================
    # Enhanced Resume
    # ============================================================

    @staticmethod
    def save_enhanced(
        db: Session,
        user_id: UUID,
        resume_id: UUID,
        data: EnhancedResumeUpdate,
    ):

        resume = ResumeRepository.get_by_id(
            db,
            user_id,
            resume_id,
        )

        if not resume or resume.is_deleted:
            raise ValueError("Resume not found")

        resume.raw_text = data.raw_text
        resume.is_enhanced = True

        resume = ResumeRepository.save(
            db,
            resume,
        )

        # Re-index enhanced resume
        try:

            ResumeService._delete_resume_vectors(
                user_id=user_id,
                resume_id=resume_id,
            )

            ResumeService._index_resume(
                resume=resume,
                user_id=user_id,
            )

        except Exception as error:

            print(
                f"RAG re-indexing failed for enhanced "
                f"resume {resume.id}: {error}"
            )

        return resume