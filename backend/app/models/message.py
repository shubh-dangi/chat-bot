from datetime import datetime, timezone
import uuid
from sqlalchemy import Column, DateTime, ForeignKey, String, Text
from sqlalchemy.orm import relationship
from app.database.session import Base


def utcnow():
    return datetime.now(timezone.utc)


class Message(Base):
    """Individual message sent within a conversation."""

    __tablename__ = "messages"

    id = Column(String(64), primary_key=True, index=True, default=lambda: f"msg-{uuid.uuid4().hex[:12]}")
    conversation_id = Column(
        String(64),
        ForeignKey("conversations.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    sender = Column(String(50), default="user", nullable=False)  # user, assistant, system
    content = Column(Text, nullable=False)
    status = Column(String(50), default="sent", nullable=False)  # sent, sending, error
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False, index=True)

    # Relationships
    conversation = relationship("Conversation", back_populates="messages")
