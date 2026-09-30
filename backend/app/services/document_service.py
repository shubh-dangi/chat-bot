from datetime import datetime, timezone
from typing import List, Optional
import uuid
from sqlalchemy.orm import Session
from app.core.exceptions import EntityNotFoundException
from app.models.document import Document
from app.schemas.document import DocumentCreate, DocumentResponse

DEFAULT_MOCK_DOCUMENTS = [
    {
        "id": "doc-1",
        "filename": "University_Academic_Curriculum_2026.pdf",
        "doc_type": "Syllabus / Regulations",
        "size_str": "4.2 MB",
        "status": "Processed",
    },
    {
        "id": "doc-2",
        "filename": "Hostel_Rules_and_Disciplinary_Code.pdf",
        "doc_type": "Student Handbook",
        "size_str": "1.8 MB",
        "status": "Processed",
    },
    {
        "id": "doc-3",
        "filename": "Campus_Placement_Eligibilities_2026_27.pdf",
        "doc_type": "Career Placement",
        "size_str": "820 KB",
        "status": "Processed",
    },
    {
        "id": "doc-4",
        "filename": "BCA_Semester_5_Lab_Manual.pdf",
        "doc_type": "Course Material",
        "size_str": "2.1 MB",
        "status": "Processing",
    },
]


def format_doc_date(dt: Optional[datetime]) -> str:
    if not dt:
        return "Sep 28, 2026"
    return dt.strftime("%b %d, %Y")


class DocumentService:
    @staticmethod
    def ensure_seeded(db: Session) -> None:
        if db.query(Document).count() == 0:
            for d in DEFAULT_MOCK_DOCUMENTS:
                doc = Document(
                    id=d["id"],
                    filename=d["filename"],
                    doc_type=d["doc_type"],
                    size_str=d["size_str"],
                    status=d["status"],
                    uploaded_at=datetime.now(timezone.utc),
                )
                db.add(doc)
            db.commit()

    @staticmethod
    def get_documents(db: Session) -> List[DocumentResponse]:
        DocumentService.ensure_seeded(db)
        docs = db.query(Document).order_by(Document.uploaded_at.desc()).all()
        return [
            DocumentResponse(
                id=d.id,
                filename=d.filename,
                doc_type=d.doc_type,
                size_str=d.size_str,
                uploaded_at=format_doc_date(d.uploaded_at),
                status=d.status,
            )
            for d in docs
        ]

    @staticmethod
    def create_document(
        data: DocumentCreate, user_id: Optional[str], db: Session
    ) -> DocumentResponse:
        doc = Document(
            id=f"doc-{uuid.uuid4().hex[:8]}",
            filename=data.filename,
            doc_type=data.doc_type,
            size_str=data.size_str,
            file_path=data.file_path,
            status=data.status,
            uploaded_at=datetime.now(timezone.utc),
            uploaded_by=user_id,
        )
        db.add(doc)
        db.commit()
        db.refresh(doc)

        return DocumentResponse(
            id=doc.id,
            filename=doc.filename,
            doc_type=doc.doc_type,
            size_str=doc.size_str,
            uploaded_at=format_doc_date(doc.uploaded_at),
            status=doc.status,
        )

    @staticmethod
    def delete_document(document_id: str, db: Session) -> None:
        doc = db.query(Document).filter(Document.id == document_id).first()
        if not doc:
            raise EntityNotFoundException("Document", document_id)
        db.delete(doc)
        db.commit()

    @staticmethod
    def update_status(document_id: str, status: str, db: Session) -> DocumentResponse:
        doc = db.query(Document).filter(Document.id == document_id).first()
        if not doc:
            raise EntityNotFoundException("Document", document_id)
        doc.status = status
        db.commit()
        db.refresh(doc)

        return DocumentResponse(
            id=doc.id,
            filename=doc.filename,
            doc_type=doc.doc_type,
            size_str=doc.size_str,
            uploaded_at=format_doc_date(doc.uploaded_at),
            status=doc.status,
        )
