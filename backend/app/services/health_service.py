from typing import Dict, Any
from app.core.config import settings
from app.database.session import check_db_connection


class HealthService:
    @staticmethod
    def get_basic_health() -> Dict[str, str]:
        """Return the basic health status as expected by tests."""
        return {"status": "ok"}

    @staticmethod
    def get_database_health() -> Dict[str, Any]:
        """Perform a live check on the database connection and return details."""
        connected, message = check_db_connection()
        return {
            "status": "ok" if connected else "degraded",
            "database_connected": connected,
            "database_message": message,
            "project_name": settings.PROJECT_NAME,
            "environment": settings.ENVIRONMENT,
        }
