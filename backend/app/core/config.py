from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):

    # ============================================================
    # Application
    # ============================================================

    PROJECT_NAME: str = "AI Career Mentor"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"

    HOST: str = "127.0.0.1"
    PORT: int = 8000

    # ============================================================
    # PostgreSQL
    # ============================================================

    DB_HOST: str
    DB_PORT: int = 5432
    DB_NAME: str
    DB_USER: str
    DB_PASSWORD: str

    # ============================================================
    # JWT
    # ============================================================

    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # ============================================================
    # LLM
    # ============================================================

    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "openai/gpt-oss-20b"

    OPENAI_API_KEY: str = ""
    GOOGLE_API_KEY: str = ""

    # ============================================================
    # Qdrant
    # ============================================================

    QDRANT_URL: str
    QDRANT_API_KEY: str

    QDRANT_COLLECTION: str = "ai_career_mentor_documents"

    # ============================================================
    # Embeddings
    # ============================================================

    EMBEDDING_MODEL: str = (
        "sentence-transformers/all-MiniLM-L6-v2"
    )

    # ============================================================
    # AI Behavior
    # ============================================================

    AI_TEMPERATURE: float = 0.3

    AI_MAX_MODEL_CALLS: int = 8

    AI_SUMMARY_TRIGGER_MESSAGES: int = 20
    AI_SUMMARY_KEEP_MESSAGES: int = 12

    AI_RAG_TOP_K: int = 5

    # ============================================================
    # Pydantic
    # ============================================================

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()