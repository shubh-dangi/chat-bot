from datetime import datetime, timezone
import uuid
from sqlalchemy import BigInteger, Column, DateTime, ForeignKey, Integer, JSON, String, Text, UniqueConstraint
from sqlalchemy.orm import relationship
from app.database.session import Base, GUID


def utcnow():
    return datetime.now(timezone.utc)


class Document(Base):
    """
    Metadata for institutional college documents stored in Supabase Storage.
    Raw files are stored in Supabase Storage bucket 'college-documents'.
    """
    __tablename__ = "documents"

    id = Column(GUID, primary_key=True, default=uuid.uuid4, index=True)
    uploaded_by = Column(GUID, ForeignKey("profiles.id", ondelete="RESTRICT"), nullable=True, index=True)
    title = Column(String(255), default="Campus Document", nullable=False)
    description = Column(Text, nullable=True)
    file_name = Column(String(255), nullable=False)
    category = Column(String(100), default="Official Circular", nullable=False)
    storage_path = Column(String(500), unique=True, nullable=True)
    mime_type = Column(String(100), default="application/pdf", nullable=False)
    file_size = Column(BigInteger, default=1048576, nullable=False)
    status = Column(String(50), default="Processed", nullable=False, index=True)  # Processed, Processing, Pending, Error
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False, index=True)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False)

    # Relationships
    uploader = relationship("Profile", back_populates="documents")
    chunks = relationship(
        "DocumentChunk",
        back_populates="document",
        cascade="all, delete-orphan",
        order_by="DocumentChunk.chunk_index",
    )

    @property
    def filename(self) -> str:
        return self.file_name

    @filename.setter
    def filename(self, value: str):
        self.file_name = value

    @property
    def doc_type(self) -> str:
        return self.category

    @doc_type.setter
    def doc_type(self, value: str):
        self.category = value

    @property
    def size_str(self) -> str:
        if self.file_size >= 1048576:
            return f"{self.file_size / (1024 * 1024):.1f} MB"
        return f"{self.file_size / 1024:.0f} KB"

    @size_str.setter
    def size_str(self, val: str):
        try:
            if "mb" in val.lower():
                num = float(val.lower().replace("mb", "").strip())
                self.file_size = int(num * 1024 * 1024)
            elif "kb" in val.lower():
                num = float(val.lower().replace("kb", "").strip())
                self.file_size = int(num * 1024)
            else:
                self.file_size = int(val)
        except Exception:
            self.file_size = 1048576

    @property
    def uploaded_at(self) -> datetime:
        return self.created_at

    @uploaded_at.setter
    def uploaded_at(self, val: datetime):
        self.created_at = val


class DocumentChunk(Base):
    """
    RAG preparation: document chunk segments.
    Extensible for future vector column (e.g. pgvector vector(1536)).
    """
    __tablename__ = "document_chunks"

    id = Column(GUID, primary_key=True, default=uuid.uuid4, index=True)
    document_id = Column(GUID, ForeignKey("documents.id", ondelete="CASCADE"), nullable=False, index=True)
    chunk_index = Column(Integer, nullable=False)
    content = Column(Text, nullable=False)
    chunk_metadata = Column("metadata", JSON, default=dict, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False)

    __table_args__ = (
        UniqueConstraint("document_id", "chunk_index", name="uq_document_chunk_index"),
    )

    # Relationships
    document = relationship("Document", back_populates="chunks")
