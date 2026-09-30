from datetime import datetime, timezone
import uuid
from sqlalchemy import Column, DateTime, ForeignKey, JSON, String, Text
from sqlalchemy.orm import relationship
from app.database.session import Base, GUID


def utcnow():
    return datetime.now(timezone.utc)


class AuditLog(Base):
    """
    Audit log tracking administrative actions and security events.
    """
    __tablename__ = "audit_logs"

    id = Column(GUID, primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(GUID, ForeignKey("profiles.id", ondelete="SET NULL"), nullable=True, index=True)
    action = Column(String(100), nullable=False, index=True)
    resource_type = Column(String(100), nullable=False, index=True)
    resource_id = Column(String(255), nullable=True)
    ip_address = Column(String(50), nullable=True)
    details = Column(JSON, default=dict, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False, index=True)

    # Relationships
    user = relationship("Profile", back_populates="audit_logs")
