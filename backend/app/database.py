from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings
import logging

logger = logging.getLogger("uvicorn.error")

Base = declarative_base()

def get_engine():
    db_url = settings.DATABASE_URL
    try:
        if db_url.startswith("postgresql"):
            # Test postgres connection or fallback to sqlite
            engine = create_engine(db_url, pool_pre_ping=True)
            # Try connecting briefly
            conn = engine.connect()
            conn.close()
            return engine
    except Exception as e:
        logger.warning(f"Failed to connect to PostgreSQL at {db_url}: {e}. Falling back to SQLite database.")
    
    # Fallback SQLite
    sqlite_url = "sqlite:///./projectproof.db"
    return create_engine(sqlite_url, connect_args={"check_same_thread": False})

engine = get_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
