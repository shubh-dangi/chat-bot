from typing import List, Optional
import uuid
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.core.deps import get_current_user, get_db, get_pagination, require_role
from app.models.profile import Profile
from app.schemas.common import PaginatedResponse, PaginationParams
from app.schemas.document import (
    DocumentChunkCreate,
    DocumentChunkResponse,
    DocumentCreate,
    DocumentResponse,
    DocumentUpdate,
)
from app.services.document_service import DocumentService

router = APIRouter(prefix="/documents", tags=["Documents"])


@router.get("", response_model=PaginatedResponse[DocumentResponse], summary="List Knowledge Documents")
def list_documents(
    status: Optional[str] = Query(default=None, description="Filter by status (processed, processing, etc.)"),
    pagination: PaginationParams = Depends(get_pagination),
    db: Session = Depends(get_db),
    _current_user: Profile = Depends(get_current_user),
):
    """List college knowledge documents with status and metadata."""
    return DocumentService.list_documents(db, pagination, status_filter=status)


@router.post("", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED, summary="Register Uploaded Document")
def create_document(
    data: DocumentCreate,
    db: Session = Depends(get_db),
    staff_user: Profile = Depends(require_role("teacher", "admin")),
):
    """
    Register document metadata after storing file in Supabase Storage 'college-documents'.
    Restricted to Faculty and Administrators.
    """
    return DocumentService.create_document(db, data, staff_user)


@router.get("/{document_id}", response_model=DocumentResponse, summary="Get Document Metadata")
def get_document(
    document_id: uuid.UUID,
    db: Session = Depends(get_db),
    _current_user: Profile = Depends(get_current_user),
):
    """Get metadata for a specific document."""
    return DocumentService.get_document_by_id(db, document_id)


@router.put("/{document_id}", response_model=DocumentResponse, summary="Update Document Status")
def update_document(
    document_id: uuid.UUID,
    data: DocumentUpdate,
    db: Session = Depends(get_db),
    staff_user: Profile = Depends(require_role("teacher", "admin")),
):
    """Update document indexing status or details. Restricted to Staff."""
    return DocumentService.update_document(db, document_id, data, staff_user)


@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete Document")
def delete_document(
    document_id: uuid.UUID,
    db: Session = Depends(get_db),
    admin_user: Profile = Depends(require_role("admin")),
):
    """Delete a document record and its chunks. Restricted to Administrators."""
    DocumentService.delete_document(db, document_id, admin_user)
    return None


@router.post(
    "/{document_id}/chunks",
    response_model=List[DocumentChunkResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Register Document Chunks (RAG Preparation)",
)
def add_document_chunks(
    document_id: uuid.UUID,
    chunks: List[DocumentChunkCreate],
    db: Session = Depends(get_db),
    staff_user: Profile = Depends(require_role("teacher", "admin")),
):
    """
    Add document chunk segments for future RAG retrieval and vector embedding generation.
    Restricted to Staff / System integration.
    """
    return DocumentService.add_chunks(db, document_id, chunks, staff_user)


@router.get("/{document_id}/chunks", response_model=List[DocumentChunkResponse], summary="List Document Chunks")
def list_document_chunks(
    document_id: uuid.UUID,
    db: Session = Depends(get_db),
    _current_user: Profile = Depends(get_current_user),
):
    """List chunks belonging to a document."""
    return DocumentService.list_chunks(db, document_id)
