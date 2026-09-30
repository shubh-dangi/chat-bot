from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.api.routes.api import api_router
from app.core.config import settings
from app.core.exceptions import (
    AppException,
    app_exception_handler,
    http_exception_handler,
    unhandled_exception_handler,
    validation_exception_handler,
)
from app.core.logging import get_logger, setup_logging
from app.core.middleware import RequestSizeLimiterMiddleware, SecurityHeadersMiddleware
from app.database.session import Base, SessionLocal, engine
from app.models import Conversation, Document, Message, SharedChat, User
from app.api.routes.users import ensure_users_seeded
from app.services.document_service import DocumentService

# Initialize structured logging
setup_logging()
logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown events."""
    logger.info(f"Starting {settings.PROJECT_NAME} in [{settings.ENVIRONMENT}] mode...")
    logger.info(f"Allowed CORS Origins: {settings.BACKEND_CORS_ORIGINS}")

    # Ensure all database tables exist
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database schemas verified and initialized.")

        # Seed initial default users and document records if empty
        with SessionLocal() as db:
            ensure_users_seeded(db)
            DocumentService.ensure_seeded(db)
        logger.info("Default seed data verified.")
    except Exception as exc:
        logger.error(f"Database initialization warning: {exc}")

    yield
    logger.info(f"Shutting down {settings.PROJECT_NAME}...")


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Production-grade SaaS backend for College AI student assistant and institutional portal.",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
    lifespan=lifespan,
)

# Exception handlers
app.add_exception_handler(AppException, app_exception_handler)
app.add_exception_handler(StarletteHTTPException, http_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, unhandled_exception_handler)

# Enterprise Security Headers Middleware
app.add_middleware(SecurityHeadersMiddleware)

# Request Payload Size Limiting Middleware
app.add_middleware(RequestSizeLimiterMiddleware)

# Configure CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "Accept", "Origin", "X-Requested-With"],
)

# Register API Router with /api prefix
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/", tags=["Root"])
def root():
    """Root endpoint welcoming visitors and pointing to API documentation."""
    return {
        "message": f"Welcome to {settings.PROJECT_NAME} API",
        "docs": f"{settings.API_V1_STR}/docs",
        "health": f"{settings.API_V1_STR}/health",
        "environment": settings.ENVIRONMENT,
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
