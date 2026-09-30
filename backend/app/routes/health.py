from fastapi import APIRouter
from app.schemas.health import HealthCheckResponse, DatabaseStatusResponse
from app.services.health_service import HealthService

router = APIRouter(prefix="", tags=["Health"])


@router.get("/health", response_model=HealthCheckResponse, summary="Basic Health Check")
def get_health() -> HealthCheckResponse:
    """
    Basic health check endpoint.
    Returns: {"status": "ok"}
    """
    return HealthCheckResponse(status="ok")


@router.get("/health/db", response_model=DatabaseStatusResponse, summary="Database Connection Health")
def get_database_health() -> DatabaseStatusResponse:
    """
    Database connection verification endpoint.
    Tests live connection to the configured PostgreSQL instance.
    """
    health_info = HealthService.get_database_health()
    return DatabaseStatusResponse(**health_info)
