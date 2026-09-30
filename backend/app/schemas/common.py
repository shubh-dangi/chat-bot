from typing import Any, Generic, List, Optional, TypeVar
from pydantic import BaseModel, Field

T = TypeVar("T")


class ApiResponse(BaseModel, Generic[T]):
    """Standard unified response envelope expected by frontend."""

    data: T
    message: Optional[str] = None
    status: int = 200
    success: bool = True


class PaginatedResponse(BaseModel, Generic[T]):
    """Standard pagination envelope for lists and tables."""

    items: List[T]
    total: int
    page: int
    pageSize: int
    totalPages: int


class ApiErrorDetail(BaseModel):
    message: str
    code: Optional[str] = None
    status: Optional[int] = None
    details: Optional[dict] = None


class ApiErrorResponse(BaseModel):
    error: ApiErrorDetail
