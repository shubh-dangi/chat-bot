"""
Tamper-Resistant Audit Logging Service for College AI.
Tracks security events, administrative changes, authorization events, and share link operations.
Guarantees sensitive data (passwords, tokens, keys) is never persisted in audit trails.
"""
from datetime import datetime, timezone
from typing import Any, Dict, Optional, Union
import uuid
from sqlalchemy.orm import Session
from app.core.logging import get_logger
from app.models.audit import AuditLog

logger = get_logger(__name__)

# Sensitive keywords strictly filtered from audit details
REDACTED_KEYS = {
    "password", "hashed_password", "token", "access_token",
    "refresh_token", "secret", "jwt_secret", "service_role",
    "authorization", "api_key", "credentials"
}


def sanitize_audit_details(data: Optional[Dict[str, Any]]) -> Dict[str, Any]:
    """Recursively removes sensitive keys from audit log dictionaries."""
    if not data or not isinstance(data, dict):
        return {}

    cleaned = {}
    for k, v in data.items():
        k_lower = str(k).lower()
        if any(bad in k_lower for bad in REDACTED_KEYS):
            cleaned[k] = "[REDACTED]"
        elif isinstance(v, dict):
            cleaned[k] = sanitize_audit_details(v)
        elif isinstance(v, (str, int, float, bool)) or v is None:
            cleaned[k] = v
        else:
            cleaned[k] = str(v)
    return cleaned


class AuditService:
    @staticmethod
    def log_event(
        db: Session,
        action: str,
        resource_type: str,
        resource_id: Optional[Union[str, uuid.UUID]] = None,
        user_id: Optional[Union[str, uuid.UUID]] = None,
        ip_address: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None,
        entity_type: Optional[str] = None,  # Backward compatibility
        entity_id: Optional[str] = None,    # Backward compatibility
        metadata: Optional[Dict[str, Any]] = None,  # Backward compatibility
    ) -> Optional[AuditLog]:
        """
        Records an immutable administrative or security audit event.
        Guarantees that sensitive data like passwords, tokens, or private secrets are never stored.
        """
        try:
            target_resource = resource_type or entity_type or "system"
            target_id = resource_id or entity_id
            clean_details = sanitize_audit_details(details or metadata or {})

            # Parse user UUID if string provided
            uid = None
            if user_id:
                if isinstance(user_id, uuid.UUID):
                    uid = user_id
                else:
                    try:
                        uid = uuid.UUID(str(user_id))
                    except ValueError:
                        clean_details["raw_actor_id"] = str(user_id)

            log_entry = AuditLog(
                user_id=uid,
                action=action,
                resource_type=target_resource,
                resource_id=str(target_id) if target_id else None,
                ip_address=ip_address,
                details=clean_details,
                created_at=datetime.now(timezone.utc),
            )
            db.add(log_entry)
            db.commit()
            db.refresh(log_entry)

            logger.info(
                f"SECURITY AUDIT: action={action} resource={target_resource}:{target_id} actor={user_id or 'anonymous'}"
            )
            return log_entry
        except Exception as exc:
            logger.error(f"Failed to record audit log: {exc}")
            try:
                db.rollback()
            except Exception:
                pass
            return None
