from datetime import datetime, timezone
import uuid
from sqlalchemy import Column, DateTime, String
from app.database.session import Base


def utcnow():
    return datetime.now(timezone.utc)


class Document(Base):
    """Institutional college document managed by administrative staff."""

    __tablename__ = "documents"

    id = Column(String(64), primary_key=True, index=True, default=lambda: f"doc-{uuid.uuid4().hex[:8]}")
    filename = Column(String(255), nullable=False)
    doc_type = Column(String(100), default="Official Circular", nullable=False)  # Syllabus, Student Handbook, etc.
    size_str = Column(String(50), default="1.0 MB", nullable=False)
    file_path = Column(String(500), nullable=True)  # Storage path in Supabase Storage or local bucket
    status = Column(String(50), default="Processed", index=True, nullable=False)  # Processed, Processing, Pending, Error
    uploaded_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)
    uploaded_by = Column(String(64), nullable=True)
