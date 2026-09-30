"""
Institutional Document Management Routes for College AI.
Enforces file upload validation, role permissions, and administrative controls.
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, Request, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from app.api.deps import get_current_user, require_role
from app.core.rate_limit import enforce_rate_limit
from app.database.session import get_db
from app.models.user import User
from app.schemas.document import DocumentCreate, DocumentResponse
from app.services.document_service import DocumentService

router = APIRouter(prefix="/documents", tags=["Documents"])


class StatusUpdatePayload(BaseModel):
    status: str = Field(..., pattern="^(Processed|Processing|Pending|Error)$")


@router.get("", response_model=List[DocumentResponse], summary="List institutional documents")
def list_documents(
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> List[DocumentResponse]:
    """Retrieves institutional syllabus, handbook, and circular documents."""
    enforce_rate_limit(request, category="documents", custom_key=str(current_user.id), max_requests=60)
    return DocumentService.get_documents(db)


@router.post("", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED, summary="Register uploaded document")
def create_document(
    payload: DocumentCreate,
    request: Request,
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_role("admin", "faculty", "teacher")),
) -> DocumentResponse:
    """Registers a newly uploaded institutional document with file validation (Faculty & Admin only)."""
    enforce_rate_limit(request, category="documents", custom_key=str(admin_user.id), max_requests=10)
    return DocumentService.create_document(payload, str(admin_user.id), db)


@router.patch("/{document_id}/status", response_model=DocumentResponse, summary="Update document ingestion status")
def update_document_status(
    document_id: str,
    payload: StatusUpdatePayload,
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_role("admin")),
) -> DocumentResponse:
    """Updates ingestion status (Processed, Processing, Pending, Error). Admin only."""
    return DocumentService.update_status(document_id, payload.status, db)


@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete an institutional document")
def delete_document(
    document_id: str,
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_role("admin")),
):
    """Removes a document from the system. Admin only with audit log."""
    DocumentService.delete_document(document_id, db, actor_id=str(admin_user.id))
    return None
