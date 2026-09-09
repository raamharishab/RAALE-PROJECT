import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "ProjectProof API"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "projectproof-super-secret-key-change-in-production-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # PostgreSQL primary, fallback to SQLite if DB connect fails or SQLite url provided
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/projectproof")

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
