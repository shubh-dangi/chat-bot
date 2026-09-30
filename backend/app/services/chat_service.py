from datetime import datetime, timezone
from typing import List, Optional
import uuid
from sqlalchemy.orm import Session
from app.core.exceptions import EntityNotFoundException, PermissionDeniedException
from app.models.chat import Conversation
from app.models.message import Message
from app.schemas.chat import ConversationResponse
from app.schemas.message import MessageResponse, SendMessageResponse
from app.services.ai_service import ai_service


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
    def get_conversations(user_id: str, db: Session) -> List[ConversationResponse]:
        convs = (
            db.query(Conversation)
            .filter(Conversation.user_id == user_id)
            .order_by(Conversation.updated_at.desc())
            .all()
        )
        return [
            ConversationResponse(
                id=c.id,
                title=c.title,
                created_at=format_iso(c.created_at),
                updated_at=format_iso(c.updated_at),
                last_message_preview=c.last_message_preview,
                is_shared=c.is_shared,
                share_token=c.share_token,
            )
            for c in convs
        ]

    @staticmethod
    def get_conversation(conversation_id: str, user_id: str, db: Session) -> ConversationResponse:
        conv = db.query(Conversation).filter(Conversation.id == conversation_id).first()
        if not conv:
            raise EntityNotFoundException("Conversation", conversation_id)
        if conv.user_id != user_id:
            raise PermissionDeniedException("You do not have access to this conversation.")

        return ConversationResponse(
            id=conv.id,
            title=conv.title,
            created_at=format_iso(conv.created_at),
            updated_at=format_iso(conv.updated_at),
            last_message_preview=conv.last_message_preview,
            is_shared=conv.is_shared,
            share_token=conv.share_token,
        )

    @staticmethod
    def create_conversation(
        user_id: str, initial_message: Optional[str], db: Session, title: Optional[str] = None
    ) -> ConversationResponse:
        now = datetime.now(timezone.utc)
        conv_title = title or (
            initial_message[:36] + ("..." if len(initial_message) > 36 else "")
            if initial_message
            else "New Conversation"
        )

        conv = Conversation(
            id=f"conv-{uuid.uuid4().hex[:10]}",
            user_id=user_id,
            title=conv_title,
            last_message_preview=initial_message[:60] if initial_message else None,
            created_at=now,
            updated_at=now,
        )
        db.add(conv)
        db.commit()
        db.refresh(conv)

        return ConversationResponse(
            id=conv.id,
            title=conv.title,
            created_at=format_iso(conv.created_at),
            updated_at=format_iso(conv.updated_at),
            last_message_preview=conv.last_message_preview,
            is_shared=conv.is_shared,
            share_token=conv.share_token,
        )

    @staticmethod
    def rename_conversation(
        conversation_id: str, user_id: str, new_title: str, db: Session
    ) -> ConversationResponse:
        conv = db.query(Conversation).filter(Conversation.id == conversation_id).first()
        if not conv:
            raise EntityNotFoundException("Conversation", conversation_id)
        if conv.user_id != user_id:
            raise PermissionDeniedException("You do not have permission to modify this conversation.")

        conv.title = new_title.strip() or conv.title
        conv.updated_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(conv)

        return ConversationResponse(
            id=conv.id,
            title=conv.title,
            created_at=format_iso(conv.created_at),
            updated_at=format_iso(conv.updated_at),
            last_message_preview=conv.last_message_preview,
            is_shared=conv.is_shared,
            share_token=conv.share_token,
        )

    @staticmethod
    def delete_conversation(conversation_id: str, user_id: str, db: Session) -> None:
        conv = db.query(Conversation).filter(Conversation.id == conversation_id).first()
        if not conv:
            raise EntityNotFoundException("Conversation", conversation_id)
        if conv.user_id != user_id:
            raise PermissionDeniedException("You do not have permission to delete this conversation.")

        db.delete(conv)
        db.commit()

    @staticmethod
    def get_messages(conversation_id: str, user_id: str, db: Session) -> List[MessageResponse]:
        conv = db.query(Conversation).filter(Conversation.id == conversation_id).first()
        if not conv:
            raise EntityNotFoundException("Conversation", conversation_id)
        if conv.user_id != user_id:
            raise PermissionDeniedException("You do not have permission to view messages in this conversation.")

        messages = (
            db.query(Message)
            .filter(Message.conversation_id == conversation_id)
            .order_by(Message.created_at.asc())
            .all()
        )
        return [
            MessageResponse(
                id=m.id,
                conversation_id=m.conversation_id,
                sender=m.sender,
                content=m.content,
                timestamp=format_time_str(m.created_at),
                status=m.status,
            )
            for m in messages
        ]

    @staticmethod
    async def send_message(
        conversation_id: str, user_id: str, content: str, db: Session
    ) -> SendMessageResponse:
        conv = db.query(Conversation).filter(Conversation.id == conversation_id).first()
        if not conv:
            raise EntityNotFoundException("Conversation", conversation_id)
        if conv.user_id != user_id:
            raise PermissionDeniedException("You do not have access to this conversation.")

        now = datetime.now(timezone.utc)

        # 1. Save user message
        user_msg = Message(
            id=f"msg-{uuid.uuid4().hex[:10]}",
            conversation_id=conversation_id,
            sender="user",
            content=content,
            status="sent",
            created_at=now,
        )
        db.add(user_msg)

        # 2. Update conversation title & preview
        conv.updated_at = now
        conv.last_message_preview = content[:60]
        if conv.title == "New Conversation":
            conv.title = content[:32] + ("..." if len(content) > 32 else "")

        db.commit()
        db.refresh(user_msg)

        # 3. Generate assistant response
        ai_reply = await ai_service.generate_response(content)

        assistant_msg = Message(
            id=f"msg-{uuid.uuid4().hex[:10]}",
            conversation_id=conversation_id,
            sender="assistant",
            content=ai_reply,
            status="sent",
            created_at=datetime.now(timezone.utc),
        )
        db.add(assistant_msg)
        db.commit()
        db.refresh(assistant_msg)

        return SendMessageResponse(
            user_message=MessageResponse(
                id=user_msg.id,
                conversation_id=user_msg.conversation_id,
                sender=user_msg.sender,
                content=user_msg.content,
                timestamp=format_time_str(user_msg.created_at),
                status=user_msg.status,
            ),
            assistant_message=MessageResponse(
                id=assistant_msg.id,
                conversation_id=assistant_msg.conversation_id,
                sender=assistant_msg.sender,
                content=assistant_msg.content,
                timestamp=format_time_str(assistant_msg.created_at),
                status=assistant_msg.status,
            ),
        )

    @staticmethod
    async def edit_message(
        conversation_id: str, message_id: str, user_id: str, new_content: str, db: Session
    ) -> List[MessageResponse]:
        conv = db.query(Conversation).filter(Conversation.id == conversation_id).first()
        if not conv:
            raise EntityNotFoundException("Conversation", conversation_id)
        if conv.user_id != user_id:
            raise PermissionDeniedException("You do not have access to this conversation.")

        target_msg = db.query(Message).filter(Message.id == message_id, Message.conversation_id == conversation_id).first()
        if not target_msg:
            raise EntityNotFoundException("Message", message_id)

        # Update target message content
        target_msg.content = new_content
        now = datetime.now(timezone.utc)
        target_msg.created_at = now

        # Delete subsequent messages
        db.query(Message).filter(
            Message.conversation_id == conversation_id,
            Message.created_at > target_msg.created_at,
        ).delete()
        db.commit()

        # Generate fresh assistant response
        ai_reply = await ai_service.generate_response(new_content)
        assistant_msg = Message(
            id=f"msg-{uuid.uuid4().hex[:10]}",
            conversation_id=conversation_id,
            sender="assistant",
            content=ai_reply,
            status="sent",
            created_at=datetime.now(timezone.utc),
        )
        db.add(assistant_msg)
        conv.updated_at = datetime.now(timezone.utc)
        db.commit()

        # Return updated messages
        messages = (
            db.query(Message)
            .filter(Message.conversation_id == conversation_id)
            .order_by(Message.created_at.asc())
            .all()
        )
        return [
            MessageResponse(
                id=m.id,
                conversation_id=m.conversation_id,
                sender=m.sender,
                content=m.content,
                timestamp=format_time_str(m.created_at),
                status=m.status,
            )
            for m in messages
        ]
