from datetime import datetime, timezone
import uuid
from sqlalchemy import Boolean, Column, DateTime, String, Text
from sqlalchemy.orm import relationship
from app.database.session import Base, GUID


def utcnow():
    return datetime.now(timezone.utc)


class Profile(Base):
    """
    Application profile storing metadata for authenticated Supabase users.
    Supabase Auth handles credentials; profiles table references auth.users(id).
    """
    __tablename__ = "profiles"

    id = Column(GUID, primary_key=True, default=uuid.uuid4, index=True)
    auth_user_id = Column(GUID, unique=True, nullable=True, index=True)
    email = Column(String(255), unique=True, nullable=True, index=True)
    full_name = Column(String(255), nullable=False)
    avatar_url = Column(Text, nullable=True)
    role = Column(String(50), default="student", nullable=False, index=True)  # student, teacher, admin
    department = Column(String(150), default="General", nullable=False, index=True)
    is_active = Column(Boolean, default=True, nullable=False)
    hashed_password = Column(String(255), nullable=True)
    last_active = Column(DateTime(timezone=True), default=utcnow)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False)

    # Relationships
    chat_sessions = relationship("ChatSession", back_populates="user", cascade="all, delete-orphan")
    documents = relationship("Document", back_populates="uploader")
    audit_logs = relationship("AuditLog", back_populates="user")

    @property
    def name(self) -> str:
        return self.full_name

    @name.setter
    def name(self, value: str):
        self.full_name = value


# Backward compatibility alias
User = Profile
