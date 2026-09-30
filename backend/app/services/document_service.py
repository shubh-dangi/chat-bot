from datetime import datetime, timezone
from typing import List, Optional, Union
import uuid
from sqlalchemy.orm import Session
from app.core.exceptions import EntityNotFoundException
from app.models.document import Document
from app.schemas.document import DocumentCreate, DocumentResponse

DEFAULT_MOCK_DOCUMENTS = [
    {
        "id": "f0000001-0000-0000-0000-000000000001",
        "filename": "University_Academic_Curriculum_2026.pdf",
        "doc_type": "Syllabus / Regulations",
        "size_str": "4.2 MB",
        "status": "Processed",
    },
    {
        "id": "f0000001-0000-0000-0000-000000000002",
        "filename": "Hostel_Rules_and_Disciplinary_Code.pdf",
        "doc_type": "Student Handbook",
        "size_str": "1.8 MB",
        "status": "Processed",
    },
    {
        "id": "f0000001-0000-0000-0000-000000000003",
        "filename": "Campus_Placement_Eligibilities_2026_27.pdf",
        "doc_type": "Career Placement",
        "size_str": "820 KB",
        "status": "Processed",
    },
    {
        "id": "f0000001-0000-0000-0000-000000000004",
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


def parse_doc_uuid(val: Union[str, uuid.UUID]) -> uuid.UUID:
    if isinstance(val, uuid.UUID):
        return val
    try:
        return uuid.UUID(str(val))
    except Exception:
        return uuid.uuid5(uuid.NAMESPACE_DNS, str(val))


class DocumentService:
    @staticmethod
    def ensure_seeded(db: Session) -> None:
        if db.query(Document).count() == 0:
            for d in DEFAULT_MOCK_DOCUMENTS:
                doc = Document(
                    id=uuid.UUID(d["id"]),
                    file_name=d["filename"],
                    title=d["filename"],
                    category=d["doc_type"],
                    status=d["status"],
                    created_at=datetime.now(timezone.utc),
                )
                doc.size_str = d["size_str"]
                db.add(doc)
            db.commit()

    @staticmethod
    def get_documents(db: Session) -> List[DocumentResponse]:
        DocumentService.ensure_seeded(db)
        docs = db.query(Document).order_by(Document.created_at.desc()).all()
        return [
            DocumentResponse(
                id=str(d.id),
                filename=d.file_name,
                doc_type=d.category,
                size_str=d.size_str,
                uploaded_at=format_doc_date(d.created_at),
                status=d.status,
            )
            for d in docs
        ]

    @staticmethod
    def create_document(
        data: DocumentCreate, user_id: Optional[str], db: Session
    ) -> DocumentResponse:
        name = data.filename or data.file_name or "Untitled Document"
        category = data.doc_type or "Official Circular"
        doc = Document(
            file_name=name,
            title=name,
            category=category,
            status=data.status or "Processed",
            storage_path=data.storage_path,
            created_at=datetime.now(timezone.utc),
        )
        if data.size_str:
            doc.size_str = data.size_str
        db.add(doc)
        db.commit()
        db.refresh(doc)

        return DocumentResponse(
            id=str(doc.id),
            filename=doc.file_name,
            doc_type=doc.category,
            size_str=doc.size_str,
            uploaded_at=format_doc_date(doc.created_at),
            status=doc.status,
        )

    @staticmethod
    def delete_document(document_id: str, db: Session) -> None:
        uid = parse_doc_uuid(document_id)
        doc = db.query(Document).filter(Document.id == uid).first()
        if not doc:
            raise EntityNotFoundException("Document", document_id)
        db.delete(doc)
        db.commit()

    @staticmethod
    def update_status(document_id: str, status: str, db: Session) -> DocumentResponse:
        uid = parse_doc_uuid(document_id)
        doc = db.query(Document).filter(Document.id == uid).first()
        if not doc:
            raise EntityNotFoundException("Document", document_id)
        doc.status = status
        db.commit()
        db.refresh(doc)

        return DocumentResponse(
            id=str(doc.id),
            filename=doc.file_name,
            doc_type=doc.category,
            size_str=doc.size_str,
            uploaded_at=format_doc_date(doc.created_at),
            status=doc.status,
        )
