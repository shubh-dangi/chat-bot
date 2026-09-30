"""
Security Middleware Suite for College AI:
1. SecurityHeadersMiddleware: Sets enterprise security headers (CSP, HSTS, X-Content-Type-Options, etc.)
2. RequestSizeLimiterMiddleware: Rejects oversized request payloads (DoS & memory exhaustion protection)
"""
from typing import Callable
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from app.core.config import settings
from app.core.exceptions import format_error_response
from app.core.logging import get_logger

logger = get_logger(__name__)

# Max request payload sizes
MAX_STANDARD_BODY_BYTES = 2 * 1024 * 1024       # 2 MB for standard JSON endpoints
MAX_UPLOAD_BODY_BYTES = 25 * 1024 * 1024        # 25 MB for document uploads


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Enforces enterprise HTTP security headers across all API responses.
    Prevents MIME sniffing, clickjacking, insecure referrer leakage, and restricts CSP.
    """

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        response: Response = await call_next(request)

        # 1. Prevent MIME-type sniffing
        response.headers["X-Content-Type-Options"] = "nosniff"

        # 2. Clickjacking protection: Disallow embedding in iframes
        response.headers["X-Frame-Options"] = "DENY"

        # 3. Referrer leakage protection
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"

        # 4. Restrict browser hardware capabilities
        response.headers["Permissions-Policy"] = "geolocation=(), camera=(), microphone=(), payment=()"

        # 5. Disable legacy reflective XSS filter in modern browsers (standardized best practice)
        response.headers["X-XSS-Protection"] = "0"

        # 6. Restrictive Content Security Policy
        csp_directives = [
            "default-src 'self'",
            "script-src 'self'",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: https:",
            "font-src 'self' data:",
            "connect-src 'self' http://localhost:* http://127.0.0.1:* https:",
            "frame-ancestors 'none'",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
        ]
        response.headers["Content-Security-Policy"] = "; ".join(csp_directives)

        # 7. Strict-Transport-Security (HSTS) in production or over HTTPS
        is_https = request.url.scheme == "https" or request.headers.get("x-forwarded-proto") == "https"
        if is_https or settings.ENVIRONMENT == "production":
            response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"

        return response


class RequestSizeLimiterMiddleware(BaseHTTPMiddleware):
    """
    Rejects requests exceeding safe payload size limits with HTTP 413.
    Shields backend and database from volumetric memory attacks and buffer exhaustion.
    """

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        # Determine maximum payload size depending on endpoint
        path = request.url.path
        if "/documents" in path:
            max_bytes = MAX_UPLOAD_BODY_BYTES
        else:
            max_bytes = MAX_STANDARD_BODY_BYTES

        content_length = request.headers.get("content-length")
        if content_length:
            try:
                length = int(content_length)
                if length > max_bytes:
                    logger.warning(
                        f"Request payload {length} bytes exceeds limit of {max_bytes} bytes for path {path}"
                    )
                    return format_error_response(
                        message=f"Request payload ({length} bytes) exceeds maximum allowable size of {max_bytes} bytes.",
                        code="PAYLOAD_TOO_LARGE",
                        status_code=413,
                    )
            except ValueError:
                pass

        return await call_next(request)
