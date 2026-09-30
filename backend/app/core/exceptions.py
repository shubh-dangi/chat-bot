from typing import Any, Dict, Optional
from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from app.core.logging import get_logger

logger = get_logger(__name__)


class AppException(Exception):
    """Base application exception for all domain-specific errors."""

    def __init__(
        self,
        message: str,
        status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR,
        code: str = "INTERNAL_SERVER_ERROR",
        details: Optional[Dict[str, Any]] = None,
    ):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.code = code
        self.details = details or {}


class EntityNotFoundException(AppException):
    def __init__(self, entity_name: str, identifier: Any):
        super().__init__(
            message=f"{entity_name} with identifier '{identifier}' was not found.",
            status_code=status.HTTP_404_NOT_FOUND,
            code="RESOURCE_NOT_FOUND",
            details={"entity": entity_name, "identifier": str(identifier)},
        )


class AuthenticationException(AppException):
    def __init__(self, message: str = "Invalid or expired authentication credentials."):
        super().__init__(
            message=message,
            status_code=status.HTTP_401_UNAUTHORIZED,
            code="UNAUTHORIZED",
        )


class PermissionDeniedException(AppException):
    def __init__(self, message: str = "You do not have permission to access this resource."):
        super().__init__(
            message=message,
            status_code=status.HTTP_403_FORBIDDEN,
            code="FORBIDDEN",
        )


class ValidationException(AppException):
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=message,
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            code="VALIDATION_ERROR",
            details=details,
        )


class DuplicateResourceException(AppException):
    def __init__(self, entity_name: str, field: str, value: Any):
        super().__init__(
            message=f"{entity_name} with {field} '{value}' already exists.",
            status_code=status.HTTP_409_CONFLICT,
            code="DUPLICATE_RESOURCE",
            details={"entity": entity_name, "field": field, "value": str(value)},
        )


class RateLimitExceededException(AppException):
    def __init__(self, message: str = "Rate limit exceeded. Please try again later.", retry_after: int = 60):
        super().__init__(
            message=message,
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            code="RATE_LIMIT_EXCEEDED",
            details={"retry_after_seconds": retry_after},
        )
        self.retry_after = retry_after


class PayloadTooLargeException(AppException):
    def __init__(self, message: str = "Request payload exceeds the maximum allowed size."):
        super().__init__(
            message=message,
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            code="PAYLOAD_TOO_LARGE",
        )


def format_error_response(
    message: str,
    code: str,
    status_code: int,
    details: Optional[Dict[str, Any]] = None,
    headers: Optional[Dict[str, str]] = None,
):
    """Formats uniform SaaS error response matching frontend expectations."""
    return JSONResponse(
        status_code=status_code,
        headers=headers,
        content={
            "error": {
                "message": message,
                "code": code,
                "status": status_code,
                "details": details or {},
            }
        },
    )


async def app_exception_handler(request: Request, exc: AppException):
    logger.warning(f"Domain exception on {request.method} {request.url.path}: [{exc.code}] {exc.message}")
    resp_headers = {}
    if isinstance(exc, RateLimitExceededException):
        resp_headers["Retry-After"] = str(exc.retry_after)
    return format_error_response(exc.message, exc.code, exc.status_code, exc.details, headers=resp_headers or None)


async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    logger.warning(f"HTTP exception on {request.method} {request.url.path}: {exc.detail}")
    return format_error_response(
        message=str(exc.detail),
        code="HTTP_ERROR",
        status_code=exc.status_code,
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.warning(f"Request validation error on {request.method} {request.url.path}: {exc.errors()}")
    errors_summary = []
    for err in exc.errors():
        field = " -> ".join([str(loc) for loc in err.get("loc", [])])
        errors_summary.append({"field": field, "message": err.get("msg", "Invalid value")})
    return format_error_response(
        message="Invalid request payload or query parameters.",
        code="VALIDATION_ERROR",
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        details={"fields": errors_summary},
    )


async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled server error on {request.method} {request.url.path}: {exc}", exc_info=True)
    return format_error_response(
        message="An unexpected internal server error occurred. Please try again later.",
        code="INTERNAL_SERVER_ERROR",
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )
