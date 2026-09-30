"""
Administrative Audit Log Query Endpoints for College AI.
Restricted exclusively to System Administrators.
"""
import math
from fastapi import APIRouter, Depends, Query, Request
from sqlalchemy.orm import Session
from app.api.deps import require_role
from app.core.rate_limit import enforce_rate_limit
from app.database.session import get_db
from app.models.audit import AuditLog
from app.models.user import User
from app.schemas.audit import AuditLogResponse
from app.schemas.common import PaginatedResponse

router = APIRouter(prefix="/audit-logs", tags=["Audit Logs"])


@router.get("", response_model=PaginatedResponse[AuditLogResponse], summary="List Audit Logs")
def list_audit_logs(
    request: Request,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_role("admin")),
):
    """
    Query administrative and security audit trail events.
    Strictly restricted to Administrators.
    """
    enforce_rate_limit(request, category="search", custom_key=str(admin_user.id))

    offset = (page - 1) * page_size
    query = db.query(AuditLog)
    total = query.count()
    items = (
        query.order_by(AuditLog.created_at.desc())
        .offset(offset)
        .limit(page_size)
        .all()
    )
    total_pages = math.ceil(total / page_size) if total > 0 else 0

    return PaginatedResponse(
        items=[AuditLogResponse.model_validate(log) for log in items],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )
