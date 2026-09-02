from functools import lru_cache

from qdrant_client import QdrantClient
from qdrant_client.models import PayloadSchemaType
from langchain_qdrant import QdrantVectorStore

from app.core.config import settings
from app.ai.rag.embeddings import get_embeddings


@lru_cache(maxsize=1)
def get_qdrant_client() -> QdrantClient:
    """
    Create and cache the Qdrant client.
    """

    return QdrantClient(
        url=settings.QDRANT_URL,
        api_key=settings.QDRANT_API_KEY,
    )


def ensure_collection() -> None:
    """
    Make sure the Qdrant collection exists
    and required payload indexes are available.
    """

    client = get_qdrant_client()

    collections = client.get_collections().collections

    exists = any(
        collection.name == settings.QDRANT_COLLECTION
        for collection in collections
    )

    # ----------------------------------------
    # 1. Create collection if it doesn't exist
    # ----------------------------------------

    if not exists:
        client.create_collection(
            collection_name=settings.QDRANT_COLLECTION,
            vectors_config={
                "size": 384,
                "distance": "Cosine",
            },
        )

    # ----------------------------------------
    # 2. Check existing payload indexes
    # ----------------------------------------

    collection_info = client.get_collection(
        collection_name=settings.QDRANT_COLLECTION
    )

    payload_schema = collection_info.payload_schema

    # ----------------------------------------
    # 3. metadata.user_id index
    # ----------------------------------------

    if "metadata.user_id" not in payload_schema:

        client.create_payload_index(
            collection_name=settings.QDRANT_COLLECTION,
            field_name="metadata.user_id",
            field_schema=PayloadSchemaType.KEYWORD,
        )

    # ----------------------------------------
    # 4. metadata.resume_id index
    # ----------------------------------------

    if "metadata.resume_id" not in payload_schema:

        client.create_payload_index(
            collection_name=settings.QDRANT_COLLECTION,
            field_name="metadata.resume_id",
            field_schema=PayloadSchemaType.KEYWORD,
        )

@lru_cache(maxsize=1)
def get_vector_store() -> QdrantVectorStore:
    """
    Return the LangChain Qdrant vector store.
    """

    ensure_collection()

    return QdrantVectorStore(
        client=get_qdrant_client(),
        collection_name=settings.QDRANT_COLLECTION,
        embedding=get_embeddings(),
    )