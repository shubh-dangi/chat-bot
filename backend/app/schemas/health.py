from pydantic import BaseModel
from typing import Optional


class HealthCheckResponse(BaseModel):
    """Basic health check response schema."""
    status: str = "ok"


class DatabaseStatusResponse(BaseModel):
    """Detailed health check schema including database connection state."""
    status: str
    database_connected: bool
    database_message: str
    project_name: str
    environment: str
