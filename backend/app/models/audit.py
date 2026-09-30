from datetime import datetime, timezone
from typing import Any, Dict, Optional
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

    @property
    def entity_type(self) -> str:
        return self.resource_type

    @entity_type.setter
    def entity_type(self, val: str):
        self.resource_type = val

    @property
    def entity_id(self) -> Optional[str]:
        return self.resource_id

    @entity_id.setter
    def entity_id(self, val: Optional[str]):
        self.resource_id = val

    @property
    def event_metadata(self) -> Dict[str, Any]:
        return self.details

    @event_metadata.setter
    def event_metadata(self, val: Dict[str, Any]):
        self.details = val
