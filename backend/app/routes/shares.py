import uuid
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.deps import get_current_user, get_db
from app.models.profile import Profile
from app.schemas.chat import (
    SharedChatCreate,
    SharedChatPublicView,
    SharedChatResponse,
)
from app.services.chat_service import ChatService

router = APIRouter(tags=["Shared Chats"])


@router.post(
    "/chats/{chat_id}/share",
    response_model=SharedChatResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create Share Link for Conversation",
)
def share_chat(
    chat_id: uuid.UUID,
    data: SharedChatCreate,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(get_current_user),
):
    """
    Generate a cryptographically secure read-only public share link.
    Never exposes internal IDs or private profile info.
    """
    return ChatService.create_share_link(db, chat_id, current_user, data)


@router.delete(
    "/chats/{chat_id}/share",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Revoke Conversation Share Link",
)
def revoke_share(
    chat_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(get_current_user),
):
    """Revoke active share link. Link immediately becomes inaccessible to the public."""
    ChatService.revoke_share_link(db, chat_id, current_user)
    return None


@router.get(
    "/shared/{share_token}",
    response_model=SharedChatPublicView,
    summary="View Public Shared Conversation",
)
def get_shared_chat(
    share_token: str,
    db: Session = Depends(get_db),
):
    """
    Public read-only view of a shared conversation.
    No authentication required. Returns only safe message contents and conversation title.
    """
    return ChatService.get_public_shared_chat(db, share_token)
