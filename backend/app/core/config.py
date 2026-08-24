from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # ============================================
    # Project
    # ============================================
    PROJECT_NAME: str
    VERSION: str
    ENVIRONMENT: str

    # ============================================
    # FastAPI
    # ============================================
    HOST: str
    PORT: int

    # ============================================
    # PostgreSQL
    # ============================================
    DB_HOST: str
    DB_PORT: int
    DB_NAME: str
    DB_USER: str
    DB_PASSWORD: str

    # ============================================
    # JWT
    # ============================================
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int

    # ============================================
    # AI APIs
    # ============================================
    GROQ_API_KEY: str = ""
    OPENAI_API_KEY: str = ""
    GOOGLE_API_KEY: str = ""

    # ============================================
    # Vector Database
    # ============================================
    QDRANT_HOST: str = "localhost"
    QDRANT_PORT: int = 6333

    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True
    )


settings = Settings()