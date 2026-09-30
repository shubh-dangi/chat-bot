from typing import List, Optional
from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.orm import Session
from app.api.deps import get_current_user
from app.core.rate_limit import enforce_rate_limit
from app.database.session import get_db
from app.models.user import User
from app.schemas.chat import ConversationCreate, ConversationRenameRequest, ConversationResponse
from app.services.chat_service import ChatService

router = APIRouter(prefix="/chats", tags=["Chats"])


@router.get("", response_model=List[ConversationResponse], summary="List user's active conversations")
def list_conversations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> List[ConversationResponse]:
    """Retrieves all conversation threads belonging to the current authenticated user."""
    return ChatService.get_conversations(current_user.id, db)


@router.post("", response_model=ConversationResponse, status_code=status.HTTP_201_CREATED, summary="Create a new conversation")
def create_conversation(
    request: Request,
    payload: Optional[ConversationCreate] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ConversationResponse:
    """Initializes a new chat conversation thread with abuse protection."""
    enforce_rate_limit(request, category="messages", custom_key=str(current_user.id), max_requests=30)
    init_msg = payload.initial_message if payload else None
    title = payload.title if payload else None
    return ChatService.create_conversation(current_user.id, init_msg, db, title)


@router.get("/{conversation_id}", response_model=ConversationResponse, summary="Get conversation details")
def get_conversation(
    conversation_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ConversationResponse:
    """Fetches metadata for a single conversation."""
    return ChatService.get_conversation(conversation_id, current_user.id, db)


@router.patch("/{conversation_id}", response_model=ConversationResponse, summary="Rename a conversation")
def rename_conversation(
    conversation_id: str,
    payload: ConversationRenameRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ConversationResponse:
    """Renames an existing conversation title."""
    return ChatService.rename_conversation(conversation_id, current_user.id, payload.title, db)


@router.delete("/{conversation_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete a conversation")
def delete_conversation(
    conversation_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Deletes a conversation thread and all its associated messages."""
    ChatService.delete_conversation(conversation_id, current_user.id, db)
    return None
