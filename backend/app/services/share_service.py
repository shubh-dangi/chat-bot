from datetime import datetime, timezone
import secrets
from typing import Optional
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.exceptions import EntityNotFoundException, PermissionDeniedException
from app.models.chat import Conversation
from app.models.message import Message
from app.models.shared_chat import SharedChat
from app.schemas.chat import ConversationResponse
from app.schemas.message import MessageResponse
from app.schemas.share import ShareLinkResponse, SharedConversationResponse
from app.services.chat_service import format_iso, format_time_str


class ShareService:
    @staticmethod
    def create_share_link(conversation_id: str, user_id: str, db: Session) -> ShareLinkResponse:
        conv = db.query(Conversation).filter(Conversation.id == conversation_id).first()
        if not conv:
            raise EntityNotFoundException("Conversation", conversation_id)
        if conv.user_id != user_id:
            raise PermissionDeniedException("You do not have permission to share this conversation.")

        # Generate secure random token
        token = f"s-{secrets.token_urlsafe(8)}"

        conv.is_shared = True
        conv.share_token = token

        # Persist shared chat record
        shared_chat = SharedChat(
            conversation_id=conv.id,
            share_token=token,
            is_active=True,
            created_at=datetime.now(timezone.utc),
        )
        db.add(shared_chat)
        db.commit()

        share_url = f"{settings.FRONTEND_URL}/shared/{token}"

        return ShareLinkResponse(
            share_token=token,
            share_url=share_url,
            conversation_id=conv.id,
        )

    @staticmethod
    def revoke_share_link(conversation_id: str, user_id: str, db: Session) -> None:
        conv = db.query(Conversation).filter(Conversation.id == conversation_id).first()
        if not conv:
            raise EntityNotFoundException("Conversation", conversation_id)
        if conv.user_id != user_id:
            raise PermissionDeniedException("You do not have permission to modify this conversation.")

        conv.is_shared = False
        conv.share_token = None

        # Deactivate all active shared records
        active_shares = db.query(SharedChat).filter(
            SharedChat.conversation_id == conversation_id,
            SharedChat.is_active == True,
        ).all()
        for s in active_shares:
            s.is_active = False
            s.revoked_at = datetime.now(timezone.utc)

        db.commit()

    @staticmethod
    def get_shared_conversation(share_token: str, db: Session) -> SharedConversationResponse:
        shared_record = db.query(SharedChat).filter(
            SharedChat.share_token == share_token,
            SharedChat.is_active == True,
        ).first()

        if not shared_record:
            raise EntityNotFoundException("Shared Chat", share_token)

        conv = db.query(Conversation).filter(Conversation.id == shared_record.conversation_id).first()
        if not conv or not conv.is_shared:
            raise EntityNotFoundException("Shared Conversation", share_token)

        messages = (
            db.query(Message)
            .filter(Message.conversation_id == conv.id)
            .order_by(Message.created_at.asc())
            .all()
        )

        return SharedConversationResponse(
            conversation=ConversationResponse(
                id=conv.id,
                title=conv.title,
                created_at=format_iso(conv.created_at),
                updated_at=format_iso(conv.updated_at),
                last_message_preview=conv.last_message_preview,
                is_shared=True,
                share_token=share_token,
            ),
            messages=[
                MessageResponse(
                    id=m.id,
                    conversation_id=m.conversation_id,
                    sender=m.sender,
                    content=m.content,
                    timestamp=format_time_str(m.created_at),
                    status=m.status,
                )
                for m in messages
            ],
        )
