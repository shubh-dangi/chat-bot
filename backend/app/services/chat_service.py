from datetime import datetime, timedelta, timezone
import math
import secrets
from typing import List, Optional, Union
import uuid
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.core.exceptions import EntityNotFoundException, PermissionDeniedException
from app.models.chat import ChatSession, Message, SharedChat
from app.models.profile import Profile
from app.schemas.chat import (
    ChatSessionCreate,
    ChatSessionResponse,
    ChatSessionUpdate,
    ConversationResponse,
    MessageCreate,
    MessageResponse,
    SendMessageResponse,
    SharedChatCreate,
    SharedChatPublicView,
    SharedChatResponse,
)
from app.schemas.common import PaginatedResponse
from app.services.ai_service import ai_service


def to_uuid(val: Union[str, uuid.UUID]) -> uuid.UUID:
    if isinstance(val, uuid.UUID):
        return val
    try:
        return uuid.UUID(str(val))
    except Exception:
        return uuid.uuid5(uuid.NAMESPACE_DNS, str(val))


def format_iso(dt: Optional[datetime]) -> str:
    if not dt:
        return datetime.now(timezone.utc).isoformat()
    return dt.isoformat()


def format_time_str(dt: Optional[datetime]) -> str:
    if not dt:
        dt = datetime.now(timezone.utc)
    return dt.strftime("%I:%M %p")


class ChatService:
    @staticmethod
    def get_conversations(user_id: Union[str, uuid.UUID], db: Session) -> List[ConversationResponse]:
        uid = to_uuid(user_id)
        sessions = (
            db.query(ChatSession)
            .filter(ChatSession.user_id == uid)
            .order_by(ChatSession.updated_at.desc())
            .all()
        )
        return [
            ConversationResponse(
                id=str(s.id),
                title=s.title,
                created_at=format_iso(s.created_at),
                updated_at=format_iso(s.updated_at),
                last_message_preview=s.last_message_preview,
                is_shared=bool(s.is_shared),
                share_token=s.share_token,
            )
            for s in sessions
        ]

    @staticmethod
    def get_conversation(
        conversation_id: Union[str, uuid.UUID], user_id: Union[str, uuid.UUID], db: Session
    ) -> ConversationResponse:
        cid = to_uuid(conversation_id)
        uid = to_uuid(user_id)
        chat = db.query(ChatSession).filter(ChatSession.id == cid).first()
        if not chat:
            raise EntityNotFoundException("Conversation", conversation_id)
        if chat.user_id != uid:
            raise PermissionDeniedException("You do not have access to this conversation.")

        return ConversationResponse(
            id=str(chat.id),
            title=chat.title,
            created_at=format_iso(chat.created_at),
            updated_at=format_iso(chat.updated_at),
            last_message_preview=chat.last_message_preview,
            is_shared=bool(chat.is_shared),
            share_token=chat.share_token,
        )

    @staticmethod
    def create_conversation(
        user_id: Union[str, uuid.UUID],
        initial_message: Optional[str],
        db: Session,
        title: Optional[str] = None,
    ) -> ConversationResponse:
        uid = to_uuid(user_id)
        conv_title = title or (
            initial_message[:36] + ("..." if len(initial_message) > 36 else "")
            if initial_message
            else "New Conversation"
        )
        now = datetime.now(timezone.utc)
        chat = ChatSession(
            user_id=uid,
            title=conv_title,
            last_message_preview=initial_message[:60] if initial_message else None,
            created_at=now,
            updated_at=now,
        )
        db.add(chat)
        db.commit()
        db.refresh(chat)

        return ConversationResponse(
            id=str(chat.id),
            title=chat.title,
            created_at=format_iso(chat.created_at),
            updated_at=format_iso(chat.updated_at),
            last_message_preview=chat.last_message_preview,
            is_shared=bool(chat.is_shared),
            share_token=chat.share_token,
        )

    @staticmethod
    def rename_conversation(
        conversation_id: Union[str, uuid.UUID],
        user_id: Union[str, uuid.UUID],
        new_title: str,
        db: Session,
    ) -> ConversationResponse:
        cid = to_uuid(conversation_id)
        uid = to_uuid(user_id)
        chat = db.query(ChatSession).filter(ChatSession.id == cid).first()
        if not chat:
            raise EntityNotFoundException("Conversation", conversation_id)
        if chat.user_id != uid:
            raise PermissionDeniedException("You do not have access to this conversation.")

        chat.title = new_title.strip() or chat.title
        chat.updated_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(chat)

        return ConversationResponse(
            id=str(chat.id),
            title=chat.title,
            created_at=format_iso(chat.created_at),
            updated_at=format_iso(chat.updated_at),
            last_message_preview=chat.last_message_preview,
            is_shared=bool(chat.is_shared),
            share_token=chat.share_token,
        )

    @staticmethod
    def delete_conversation(
        conversation_id: Union[str, uuid.UUID],
        user_id: Union[str, uuid.UUID],
        db: Session,
    ) -> None:
        cid = to_uuid(conversation_id)
        uid = to_uuid(user_id)
        chat = db.query(ChatSession).filter(ChatSession.id == cid).first()
        if not chat:
            raise EntityNotFoundException("Conversation", conversation_id)
        if chat.user_id != uid:
            raise PermissionDeniedException("You do not have access to this conversation.")

        db.delete(chat)
        db.commit()

    @staticmethod
    def get_messages(
        conversation_id: Union[str, uuid.UUID],
        user_id: Union[str, uuid.UUID],
        db: Session,
    ) -> List[MessageResponse]:
        cid = to_uuid(conversation_id)
        uid = to_uuid(user_id)
        chat = db.query(ChatSession).filter(ChatSession.id == cid).first()
        if not chat:
            raise EntityNotFoundException("Conversation", conversation_id)
        if chat.user_id != uid:
            raise PermissionDeniedException("You do not have access to this conversation.")

        messages = (
            db.query(Message)
            .filter(Message.chat_id == cid)
            .order_by(Message.created_at.asc())
            .all()
        )
        return [
            MessageResponse(
                id=str(m.id),
                conversation_id=str(m.chat_id),
                chat_id=m.chat_id,
                sender=m.role,
                role=m.role,
                content=m.content,
                timestamp=format_time_str(m.created_at),
                status=m.status,
                created_at=format_iso(m.created_at),
            )
            for m in messages
        ]

    @staticmethod
    async def send_message(
        conversation_id: Union[str, uuid.UUID],
        user_id: Union[str, uuid.UUID],
        content: str,
        db: Session,
    ) -> SendMessageResponse:
        cid = to_uuid(conversation_id)
        uid = to_uuid(user_id)
        chat = db.query(ChatSession).filter(ChatSession.id == cid).first()
        if not chat:
            raise EntityNotFoundException("Conversation", conversation_id)
        if chat.user_id != uid:
            raise PermissionDeniedException("You do not have access to this conversation.")

        now = datetime.now(timezone.utc)

        # 1. Save user message
        user_msg = Message(
            chat_id=cid,
            role="user",
            content=content,
            status="sent",
            created_at=now,
        )
        db.add(user_msg)

        # 2. Update conversation
        chat.updated_at = now
        chat.last_message_preview = content[:60]
        if chat.title == "New Conversation":
            chat.title = content[:32] + ("..." if len(content) > 32 else "")

        db.commit()
        db.refresh(user_msg)

        # 3. Generate assistant response
        ai_reply = await ai_service.generate_response(content)

        assistant_msg = Message(
            chat_id=cid,
            role="assistant",
            content=ai_reply,
            status="sent",
            created_at=now + timedelta(milliseconds=50),
        )
        db.add(assistant_msg)
        db.commit()
        db.refresh(assistant_msg)

        return SendMessageResponse(
            user_message=MessageResponse(
                id=str(user_msg.id),
                conversation_id=str(user_msg.chat_id),
                sender="user",
                role="user",
                content=user_msg.content,
                timestamp=format_time_str(user_msg.created_at),
                status=user_msg.status,
            ),
            assistant_message=MessageResponse(
                id=str(assistant_msg.id),
                conversation_id=str(assistant_msg.chat_id),
                sender="assistant",
                role="assistant",
                content=assistant_msg.content,
                timestamp=format_time_str(assistant_msg.created_at),
                status=assistant_msg.status,
            ),
        )

    @staticmethod
    async def edit_message(
        conversation_id: Union[str, uuid.UUID],
        message_id: Union[str, uuid.UUID],
        user_id: Union[str, uuid.UUID],
        new_content: str,
        db: Session,
    ) -> List[MessageResponse]:
        cid = to_uuid(conversation_id)
        mid = to_uuid(message_id)
        uid = to_uuid(user_id)

        chat = db.query(ChatSession).filter(ChatSession.id == cid).first()
        if not chat:
            raise EntityNotFoundException("Conversation", conversation_id)
        if chat.user_id != uid:
            raise PermissionDeniedException("You do not have access to this conversation.")

        target_msg = db.query(Message).filter(Message.id == mid, Message.chat_id == cid).first()
        if not target_msg:
            raise EntityNotFoundException("Message", message_id)

        target_msg.content = new_content
        target_msg.updated_at = datetime.now(timezone.utc)

        # Delete subsequent messages to re-branch from this point
        db.query(Message).filter(
            Message.chat_id == cid,
            Message.id != target_msg.id,
            Message.created_at >= target_msg.created_at,
        ).delete()
        db.commit()

        # Generate fresh assistant response
        ai_reply = await ai_service.generate_response(new_content)
        assistant_msg = Message(
            chat_id=cid,
            role="assistant",
            content=ai_reply,
            status="sent",
            created_at=target_msg.created_at + timedelta(milliseconds=50),
        )
        db.add(assistant_msg)
        chat.updated_at = datetime.now(timezone.utc)
        db.commit()

        return ChatService.get_messages(conversation_id, user_id, db)
