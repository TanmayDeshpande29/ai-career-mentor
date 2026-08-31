from uuid import UUID

from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter

from app.ai.rag.qdrant_store import get_vector_store


class ResumeIngestionService:

    def __init__(self):
        self.vector_store = get_vector_store()

        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=800,
            chunk_overlap=120,
            separators=[
                "\n\n",
                "\n",
                ". ",
                " ",
            ],
        )

    def index_resume(
        self,
        documents: list[Document],
        user_id: UUID,
        resume_id: UUID,
    ) -> int:

        if not documents:
            return 0

        chunks = self.text_splitter.split_documents(
            documents
        )

        for index, chunk in enumerate(chunks):

            chunk.metadata.update(
                {
                    "user_id": str(user_id),
                    "resume_id": str(resume_id),
                    "document_type": "resume",
                    "chunk_index": index,
                }
            )

        self.vector_store.add_documents(
            chunks
        )

        return len(chunks)