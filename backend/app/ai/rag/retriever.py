from uuid import UUID

from langchain_core.documents import Document

from app.ai.rag.qdrant_store import get_vector_store
from app.core.config import settings


class ResumeRetriever:

    def __init__(self):
        self.vector_store = get_vector_store()

    def retrieve(
        self,
        user_id: UUID,
        resume_id: UUID,
        query: str,
        top_k: int | None = None,
    ) -> str:

        top_k = top_k or settings.AI_RAG_TOP_K

        print("\n========== RAG RETRIEVAL START ==========")
        print("user_id:", user_id)
        print("resume_id:", resume_id)
        print("query:", query)
        print("top_k:", top_k)

        print("Calling Qdrant similarity_search...")

        documents: list[Document] = self.vector_store.similarity_search(
            query=query,
            k=top_k,
            filter={
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
            },
        )

        print("Qdrant returned!")
        print("Documents:", len(documents))

        # ---------------------------------------------------------
        # DEBUG: Inspect exactly what Qdrant retrieved
        # ---------------------------------------------------------

        for index, document in enumerate(documents, start=1):

            print(
                f"\n========== RETRIEVED DOCUMENT {index} =========="
            )

            print("Metadata:")
            print(document.metadata)

            print("\nContent:")
            print(document.page_content)

            print(
                "==============================================="
            )

        print("\n========== RAG RETRIEVAL END ==========\n")

        if not documents:
            return (
                "No relevant information was found "
                "in the user's resume."
            )

        return "\n\n".join(
            self._format_document(document)
            for document in documents
        )

    @staticmethod
    def _format_document(
        document: Document,
    ) -> str:

        metadata = document.metadata

        page = metadata.get("page")
        source = metadata.get("source")

        header = []

        if source:
            header.append(f"Source: {source}")

        if page:
            header.append(f"Page: {page}")

        metadata_text = " | ".join(header)

        if metadata_text:
            return (
                f"[{metadata_text}]\n"
                f"{document.page_content}"
            )

        return document.page_content