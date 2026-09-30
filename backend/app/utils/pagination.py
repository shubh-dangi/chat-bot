from typing import Any, List, TypeVar
from sqlalchemy.orm import Query
from app.schemas.common import PaginatedResponse

T = TypeVar("T")


def paginate(query: Query, page: int = 1, page_size: int = 20) -> tuple[List[Any], int, int]:
    """
    Applies offset and limit to an active SQLAlchemy Query.
    Returns (items, total_count, total_pages).
    """
    page = max(1, page)
    page_size = max(1, min(100, page_size))
    total = query.count()
    total_pages = (total + page_size - 1) // page_size if total > 0 else 1
    items = query.offset((page - 1) * page_size).limit(page_size).all()
    return items, total, total_pages
