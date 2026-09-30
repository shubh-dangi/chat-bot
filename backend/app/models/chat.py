from datetime import datetime, timezone
import uuid
from sqlalchemy import Boolean, Column, DateTime, ForeignKey, String
from sqlalchemy.orm import relationship
from app.database.session import Base


def utcnow():
    return datetime.now(timezone.utc)


class Conversation(Base):
    """Conversation thread grouping message exchanges."""

    __tablename__ = "conversations"

    id = Column(String(64), primary_key=True, index=True, default=lambda: f"conv-{uuid.uuid4().hex[:12]}")
    user_id = Column(String(64), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), default="New Conversation", nullable=False)
    last_message_preview = Column(String(500), nullable=True)
    is_shared = Column(Boolean, default=False, nullable=False)
    share_token = Column(String(100), nullable=True, index=True)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False, index=True)

    # Relationships
    user = relationship("User", back_populates="conversations")
    messages = relationship(
        "Message",
        back_populates="conversation",
        cascade="all, delete-orphan",
        order_by="Message.created_at",
    )
    shared_links = relationship(
        "SharedChat",
        back_populates="conversation",
        cascade="all, delete-orphan",
    )
