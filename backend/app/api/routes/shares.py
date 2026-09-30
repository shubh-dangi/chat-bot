from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.api.deps import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.schemas.share import ShareLinkResponse, SharedConversationResponse
from app.services.share_service import ShareService

router = APIRouter(tags=["Sharing"])


@router.post("/chats/{conversation_id}/share", response_model=ShareLinkResponse, summary="Create public share link for conversation")
def create_share_link(
    conversation_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ShareLinkResponse:
    """Generates a secure, cryptographically random public share token for the chat."""
    return ShareService.create_share_link(conversation_id, current_user.id, db)


@router.delete("/chats/{conversation_id}/share", status_code=status.HTTP_204_NO_CONTENT, summary="Revoke public share link for conversation")
def revoke_share_link(
    conversation_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Deactivates and revokes any active public share links for this conversation."""
    ShareService.revoke_share_link(conversation_id, current_user.id, db)
    return None


@router.get("/shared/{share_token}", response_model=SharedConversationResponse, summary="Get publicly shared conversation")
def get_shared_chat(share_token: str, db: Session = Depends(get_db)) -> SharedConversationResponse:
    """Public read-only endpoint: returns conversation metadata and messages for a valid share token."""
    return ShareService.get_shared_conversation(share_token, db)


@router.get("/chats/shared/{share_token}", response_model=SharedConversationResponse, summary="Alias for shared conversation")
def get_shared_chat_alias(share_token: str, db: Session = Depends(get_db)) -> SharedConversationResponse:
    """Alternative alias route for accessing shared conversations."""
    return ShareService.get_shared_conversation(share_token, db)
