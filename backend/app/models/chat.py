from datetime import datetime, timezone
import uuid
from sqlalchemy import Boolean, Column, DateTime, ForeignKey, String, Text
from sqlalchemy.orm import relationship
from app.database.session import Base, GUID


def utcnow():
    return datetime.now(timezone.utc)


class ChatSession(Base):
    """Conversations created by authenticated users."""
    __tablename__ = "chat_sessions"

    id = Column(GUID, primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(GUID, ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), default="New Conversation", nullable=False)
    last_message_preview = Column(String(500), nullable=True)
    is_shared = Column(Boolean, default=False, nullable=False)
    share_token = Column(String(100), nullable=True, index=True)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False, index=True)

    # Relationships
    user = relationship("Profile", back_populates="chat_sessions")
    messages = relationship(
        "Message",
        back_populates="chat_session",
        cascade="all, delete-orphan",
        order_by="Message.created_at",
    )
    shared_chats = relationship(
        "SharedChat",
        back_populates="chat_session",
        cascade="all, delete-orphan",
    )


# Backward-compatible alias
Conversation = ChatSession


class Message(Base):
    """Individual messages in a chat conversation."""
    __tablename__ = "messages"

    id = Column(GUID, primary_key=True, default=uuid.uuid4, index=True)
    chat_id = Column(GUID, ForeignKey("chat_sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    role = Column(String(50), default="user", nullable=False)  # user, assistant, system
    content = Column(Text, nullable=False)
    status = Column(String(50), default="sent", nullable=False)  # sent, sending, error
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False, index=True)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False)

    # Relationships
    chat_session = relationship("ChatSession", back_populates="messages")

    @property
    def sender(self) -> str:
        return self.role

    @sender.setter
    def sender(self, value: str):
        self.role = value

    @property
    def conversation_id(self) -> str:
        return str(self.chat_id)

    @conversation_id.setter
    def conversation_id(self, value):
        self.chat_id = value


class SharedChat(Base):
    """
    Public read-only share link token for conversations.
    Never exposes internal IDs directly.
    """
    __tablename__ = "shared_chats"

    id = Column(GUID, primary_key=True, default=uuid.uuid4, index=True)
    chat_id = Column(GUID, ForeignKey("chat_sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    share_token = Column(String(128), unique=True, nullable=False, index=True)
    created_by = Column(GUID, ForeignKey("profiles.id", ondelete="CASCADE"), nullable=True, index=True)
    expires_at = Column(DateTime(timezone=True), nullable=True)
    revoked_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)

    # Relationships
    chat_session = relationship("ChatSession", back_populates="shared_chats")
    creator = relationship("Profile")

    def __init__(self, **kwargs):
        if "conversation_id" in kwargs and "chat_id" not in kwargs:
            kwargs["chat_id"] = to_uuid(kwargs.pop("conversation_id"))
        if "chat_id" in kwargs and isinstance(kwargs["chat_id"], str):
            kwargs["chat_id"] = to_uuid(kwargs["chat_id"])
        if "created_by" in kwargs and isinstance(kwargs["created_by"], str):
            kwargs["created_by"] = to_uuid(kwargs["created_by"])
        super().__init__(**kwargs)

    @property
    def conversation_id(self) -> str:
        return str(self.chat_id)

    @conversation_id.setter
    def conversation_id(self, val):
        self.chat_id = to_uuid(val)

    @property
    def is_active(self) -> bool:
        if self.revoked_at is not None:
            return False
        if self.expires_at is not None and self.expires_at <= datetime.now(timezone.utc):
            return False
        return True

    @is_active.setter
    def is_active(self, val: bool):
        if not val:
            self.revoked_at = datetime.now(timezone.utc)
        else:
            self.revoked_at = None
