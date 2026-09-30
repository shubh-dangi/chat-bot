from fastapi import APIRouter
from app.schemas.health import DatabaseStatusResponse, HealthCheckResponse
from app.services.health_service import HealthService

router = APIRouter(tags=["Health"])


@router.get("/health", response_model=HealthCheckResponse, summary="Basic Liveness Health Check")
def get_health() -> HealthCheckResponse:
    """Basic health check endpoint returning { 'status': 'ok' }."""
    return HealthCheckResponse(status="ok")


@router.get("/health/db", response_model=DatabaseStatusResponse, summary="Database Connection Verification")
def get_database_health() -> DatabaseStatusResponse:
    """Verifies live connectivity to configured database instance."""
    health_info = HealthService.get_database_health()
    return DatabaseStatusResponse(**health_info)
