import math
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.deps import get_db, get_pagination, require_role
from app.models.audit import AuditLog
from app.models.profile import Profile
from app.schemas.audit import AuditLogResponse
from app.schemas.common import PaginatedResponse, PaginationParams

router = APIRouter(prefix="/audit-logs", tags=["Audit Logs"])


@router.get("", response_model=PaginatedResponse[AuditLogResponse], summary="List Audit Logs")
def list_audit_logs(
    pagination: PaginationParams = Depends(get_pagination),
    db: Session = Depends(get_db),
    _admin_user: Profile = Depends(require_role("admin")),
):
    """
    Query administrative and security audit trail events.
    Strictly restricted to Administrators.
    """
    query = db.query(AuditLog)
    total = query.count()
    items = (
        query.order_by(AuditLog.created_at.desc())
        .offset(pagination.offset)
        .limit(pagination.page_size)
        .all()
    )
    total_pages = math.ceil(total / pagination.page_size) if total > 0 else 0

    return PaginatedResponse(
        items=[AuditLogResponse.model_validate(log) for log in items],
        total=total,
        page=pagination.page,
        page_size=pagination.page_size,
        total_pages=total_pages,
    )
