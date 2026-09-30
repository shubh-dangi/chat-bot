"""
Enterprise Rate Limiting Module for College AI.
Provides sliding-window in-memory rate limiting with per-IP and per-User tracking.
"""
from collections import defaultdict
from dataclasses import dataclass, field
import threading
import time
from typing import Dict, List, Optional
from fastapi import Request
from app.core.exceptions import RateLimitExceededException
from app.core.logging import get_logger

logger = get_logger(__name__)


@dataclass
class RateLimitRule:
    max_requests: int
    window_seconds: int = 60


# Default rate limit tiers per endpoint category
RATE_LIMIT_TIERS: Dict[str, RateLimitRule] = {
    "auth": RateLimitRule(max_requests=10, window_seconds=60),        # 10 req/min for login, register, reset
    "shares": RateLimitRule(max_requests=30, window_seconds=60),      # 30 req/min for public share links
    "search": RateLimitRule(max_requests=30, window_seconds=60),      # 30 req/min for search/directories
    "messages": RateLimitRule(max_requests=60, window_seconds=60),    # 60 req/min for sending chat messages
    "documents": RateLimitRule(max_requests=10, window_seconds=60),   # 10 req/min for file upload operations
    "default": RateLimitRule(max_requests=120, window_seconds=60),    # 120 req/min for general API calls
}


class SlidingWindowRateLimiter:
    """Thread-safe sliding window rate limiter."""

    def __init__(self):
        self._lock = threading.Lock()
        # Key: "category:identifier" -> list of request timestamps
        self._history: Dict[str, List[float]] = defaultdict(list)
        self.enabled: bool = True

    def _cleanup_old_entries(self, key: str, window_start: float):
        self._history[key] = [t for t in self._history[key] if t > window_start]
        if not self._history[key]:
            del self._history[key]

    def check(self, key: str, max_requests: int, window_seconds: int = 60) -> int:
        """
        Check if request is allowed.
        Returns remaining requests in the current window.
        Raises RateLimitExceededException if exceeded.
        """
        if not self.enabled:
            return max_requests

        now = time.time()
        window_start = now - window_seconds

        with self._lock:
            self._cleanup_old_entries(key, window_start)
            current_count = len(self._history.get(key, []))

            if current_count >= max_requests:
                # Calculate remaining time until the oldest request falls out of the window
                oldest_in_window = self._history[key][0]
                retry_after = max(1, int(oldest_in_window + window_seconds - now))
                logger.warning(f"Rate limit exceeded for [{key}]: {current_count}/{max_requests}. Retry in {retry_after}s")
                raise RateLimitExceededException(
                    message=f"Too many requests. Rate limit is {max_requests} requests per {window_seconds}s.",
                    retry_after=retry_after,
                )

            self._history[key].append(now)
            return max_requests - current_count - 1

    def reset(self):
        """Clears all rate limit history (used primarily for test suites)."""
        with self._lock:
            self._history.clear()


limiter = SlidingWindowRateLimiter()


def get_client_ip(request: Request) -> str:
    """Extracts client IP considering trusted forward headers."""
    forwarded_for = request.headers.get("x-forwarded-for")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()
    return request.client.host if request.client else "127.0.0.1"


def enforce_rate_limit(
    request: Request,
    category: str = "default",
    custom_key: Optional[str] = None,
    max_requests: Optional[int] = None,
    window_seconds: Optional[int] = None,
):
    """
    Enforces rate limits by client IP or authenticated identifier.
    """
    rule = RATE_LIMIT_TIERS.get(category, RATE_LIMIT_TIERS["default"])
    limit = max_requests if max_requests is not None else rule.max_requests
    window = window_seconds if window_seconds is not None else rule.window_seconds

    identifier = custom_key or get_client_ip(request)
    tracking_key = f"{category}:{identifier}"

    return limiter.check(tracking_key, max_requests=limit, window_seconds=window)
