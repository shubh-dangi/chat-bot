from datetime import datetime, timedelta, timezone
import secrets
from typing import Optional, Union
import uuid
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.exceptions import EntityNotFoundException, PermissionDeniedException
from app.models.chat import Conversation, Message, SharedChat
from app.schemas.chat import ConversationResponse
from app.schemas.message import MessageResponse
from app.schemas.share import ShareLinkResponse, SharedConversationResponse
from app.services.audit_service import AuditService
from app.services.chat_service import format_iso, format_time_str, to_uuid


class ShareService:
    @staticmethod
    def create_share_link(
        conversation_id: Union[str, uuid.UUID], user_id: Union[str, uuid.UUID], db: Session
    ) -> ShareLinkResponse:
        cid = to_uuid(conversation_id)
        uid = to_uuid(user_id)
        conv = db.query(Conversation).filter(Conversation.id == cid).first()
        if not conv:
            raise EntityNotFoundException("Conversation", conversation_id)
        if conv.user_id != uid:
            raise PermissionDeniedException("You do not have permission to share this conversation.")

        # Generate cryptographically secure random token (256-bit entropy)
        token = f"s-{secrets.token_urlsafe(32)}"
        now = datetime.now(timezone.utc)
        expires_at = now + timedelta(days=30)  # Standard 30-day expiration

        conv.is_shared = True
        conv.share_token = token

        # Persist shared chat record
        shared_chat = SharedChat(
            chat_id=conv.id,
            share_token=token,
            created_by=conv.user_id,
            expires_at=expires_at,
            created_at=now,
        )
        db.add(shared_chat)
        db.commit()

        # Audit log share creation
        AuditService.log_event(
            db=db,
            action="share_created",
            resource_type="conversation",
            resource_id=str(conv.id),
            user_id=conv.user_id,
            details={"expires_at": expires_at.isoformat()},
        )

        share_url = f"{settings.FRONTEND_URL}/shared/{token}"

        return ShareLinkResponse(
            share_token=token,
            share_url=share_url,
            conversation_id=str(conv.id),
        )

    @staticmethod
    def revoke_share_link(
        conversation_id: Union[str, uuid.UUID], user_id: Union[str, uuid.UUID], db: Session
    ) -> None:
        cid = to_uuid(conversation_id)
        uid = to_uuid(user_id)
        conv = db.query(Conversation).filter(Conversation.id == cid).first()
        if not conv:
            raise EntityNotFoundException("Conversation", conversation_id)
        if conv.user_id != uid:
            raise PermissionDeniedException("You do not have permission to modify this conversation.")

        conv.is_shared = False
        conv.share_token = None

        # Deactivate all active shared records
        active_shares = db.query(SharedChat).filter(
            SharedChat.chat_id == cid,
            SharedChat.revoked_at == None,
        ).all()
        for s in active_shares:
            s.revoked_at = datetime.now(timezone.utc)

        db.commit()

        # Audit log share revocation
        AuditService.log_event(
            db=db,
            action="share_revoked",
            resource_type="conversation",
            resource_id=str(conv.id),
            user_id=conv.user_id,
        )

    @staticmethod
    def get_shared_conversation(share_token: str, db: Session) -> SharedConversationResponse:
        now = datetime.now(timezone.utc)
        shared_record = db.query(SharedChat).filter(
            SharedChat.share_token == share_token,
            SharedChat.revoked_at == None,
        ).first()

        if not shared_record:
            raise EntityNotFoundException("Shared Chat", share_token)

        # Check expiration date
        if shared_record.expires_at and shared_record.expires_at < now:
            raise EntityNotFoundException("Shared Chat", f"{share_token} (expired)")

        conv = db.query(Conversation).filter(Conversation.id == shared_record.chat_id).first()
        if not conv or not conv.is_shared:
            raise EntityNotFoundException("Shared Conversation", share_token)

        messages = (
            db.query(Message)
            .filter(Message.chat_id == conv.id)
            .order_by(Message.created_at.asc())
            .all()
        )

        return SharedConversationResponse(
            conversation=ConversationResponse(
                id=str(conv.id),
                title=conv.title,
                created_at=format_iso(conv.created_at),
                updated_at=format_iso(conv.updated_at),
                last_message_preview=conv.last_message_preview,
                is_shared=True,
                share_token=share_token,
            ),
            messages=[
                MessageResponse(
                    id=str(m.id),
                    conversation_id=str(m.chat_id),
                    sender=m.role,
                    role=m.role,
                    content=m.content,
                    timestamp=format_time_str(m.created_at),
                    status=m.status,
                )
                for m in messages
            ],
        )
