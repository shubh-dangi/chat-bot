import logging
import re
import sys
from typing import Any
from app.core.config import settings

# Sensitive keys to mask in logs
SENSITIVE_PATTERNS = [
    re.compile(r"(password[\"']?\s*[:=]\s*[\"'])([^\"']+)([\"'])", re.IGNORECASE),
    re.compile(r"(bearer\s+)([a-zA-Z0-9_\-\.]+)", re.IGNORECASE),
    re.compile(r"(token[\"']?\s*[:=]\s*[\"'])([^\"']+)([\"'])", re.IGNORECASE),
    re.compile(r"(secret[\"']?\s*[:=]\s*[\"'])([^\"']+)([\"'])", re.IGNORECASE),
]


class SensitiveDataFilter(logging.Filter):
    """Filter that masks sensitive credentials and secrets in log messages."""

    def filter(self, record: logging.LogRecord) -> bool:
        if isinstance(record.msg, str):
            msg = record.msg
            for pattern in SENSITIVE_PATTERNS:
                msg = pattern.sub(r"\1***MASKED***\3" if pattern.groups == 3 else r"\1***MASKED***", msg)
            record.msg = msg
        return True


def setup_logging() -> None:
    """Configures centralized application logging."""
    log_level = logging.DEBUG if settings.ENVIRONMENT == "development" else logging.INFO

    # Root logger configuration
    formatter = logging.Formatter(
        fmt="%(asctime)s [%(levelname)s] [%(name)s]: %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(formatter)
    handler.addFilter(SensitiveDataFilter())

    root_logger = logging.getLogger()
    root_logger.setLevel(log_level)
    # Replace existing handlers
    root_logger.handlers = [handler]

    # Silence overly verbose external libraries
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)
    logging.getLogger("httpcore").setLevel(logging.WARNING)
    logging.getLogger("httpx").setLevel(logging.WARNING)


def get_logger(name: str) -> logging.Logger:
    """Utility to get a configured logger instance."""
    return logging.getLogger(name)
