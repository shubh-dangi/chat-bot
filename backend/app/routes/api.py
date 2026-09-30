from fastapi import APIRouter
from app.routes.health import router as health_router

api_router = APIRouter()

# Include health routes under /api (e.g., /api/health and /api/health/db)
api_router.include_router(health_router)
