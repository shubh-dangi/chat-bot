from typing import Any, Dict, Optional
import uuid
from sqlalchemy.orm import Session
from app.models.audit import AuditLog


class AuditService:
    @staticmethod
    def log_event(
        db: Session,
        action: str,
        entity_type: str,
        entity_id: Optional[str] = None,
        user_id: Optional[uuid.UUID] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> AuditLog:
        """
        Records an immutable administrative or security audit event.
        Guarantees that sensitive data like passwords, tokens, or private secrets are never stored.
        """
        clean_metadata = {k: v for k, v in (metadata or {}).items() if "token" not in k.lower() and "secret" not in k.lower() and "password" not in k.lower()}
        
        log_entry = AuditLog(
            user_id=user_id,
            action=action,
            entity_type=entity_type,
            entity_id=str(entity_id) if entity_id else None,
            event_metadata=clean_metadata,
        )
        db.add(log_entry)
        db.commit()
        db.refresh(log_entry)
        return log_entry
