from typing import List, Optional
from fastapi import APIRouter, Depends, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.api.deps import get_current_user, require_role
from app.database.session import get_db
from app.models.user import User
from app.schemas.document import DocumentCreate, DocumentResponse
from app.services.document_service import DocumentService

router = APIRouter(prefix="/documents", tags=["Documents"])


class StatusUpdatePayload(BaseModel):
    status: str


@router.get("", response_model=List[DocumentResponse], summary="List institutional documents")
def list_documents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> List[DocumentResponse]:
    """Retrieves institutional syllabus, handbook, and circular documents."""
    return DocumentService.get_documents(db)


@router.post("", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED, summary="Register uploaded document")
def create_document(
    payload: DocumentCreate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_role("admin", "faculty", "teacher")),
) -> DocumentResponse:
    """Registers a newly uploaded institutional handbook or syllabus PDF."""
    return DocumentService.create_document(payload, admin_user.id, db)


@router.patch("/{document_id}/status", response_model=DocumentResponse, summary="Update document ingestion status")
def update_document_status(
    document_id: str,
    payload: StatusUpdatePayload,
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_role("admin")),
) -> DocumentResponse:
    """Updates ingestion status (Processed, Processing, Error)."""
    return DocumentService.update_status(document_id, payload.status, db)


@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete an institutional document")
def delete_document(
    document_id: str,
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_role("admin")),
):
    """Removes a document from the system."""
    DocumentService.delete_document(document_id, db)
    return None
