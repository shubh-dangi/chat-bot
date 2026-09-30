from typing import Generator, Tuple
import logging
from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from app.core.config import settings

logger = logging.getLogger(__name__)

# SQLAlchemy declarative base
Base = declarative_base()

# Configure engine arguments based on driver
engine_kwargs = {
    "pool_pre_ping": settings.DB_POOL_PRE_PING,
}

if settings.DATABASE_URL.startswith("sqlite"):
    engine_kwargs["connect_args"] = {"check_same_thread": False}
else:
    # PostgreSQL with psycopg or similar
    engine_kwargs["connect_args"] = {"connect_timeout": settings.DB_CONNECT_TIMEOUT}
    engine_kwargs["pool_size"] = 10
    engine_kwargs["max_overflow"] = 20

engine = create_engine(settings.DATABASE_URL, **engine_kwargs)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    """Dependency for providing database sessions to request handlers."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def check_db_connection() -> Tuple[bool, str]:
    """
    Tests database connectivity with quick timeout.
    Returns (is_connected: bool, details_message: str).
    """
    try:
        with engine.connect() as conn:
            val = conn.execute(text("SELECT 1")).scalar()
            if val == 1:
                db_type = "SQLite" if settings.DATABASE_URL.startswith("sqlite") else "PostgreSQL"
                return True, f"{db_type} connection verified"
            return False, "Unexpected query result"
    except Exception as exc:
        logger.warning(f"Database health check failed: {exc}")
        return False, str(exc)
