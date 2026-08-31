from functools import lru_cache

from qdrant_client import QdrantClient
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
    Make sure the configured Qdrant collection exists.
    """

    client = get_qdrant_client()

    collections = client.get_collections().collections

    exists = any(
        collection.name == settings.QDRANT_COLLECTION
        for collection in collections
    )

    if exists:
        return

    client.create_collection(
        collection_name=settings.QDRANT_COLLECTION,
        vectors_config={
            "size": 384,
            "distance": "Cosine",
        },
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