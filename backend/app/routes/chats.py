from typing import List
import uuid
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.deps import get_current_user, get_db, get_pagination
from app.models.profile import Profile
from app.schemas.chat import (
    ChatSessionCreate,
    ChatSessionResponse,
    ChatSessionUpdate,
    MessageCreate,
    MessageResponse,
)
from app.schemas.common import PaginatedResponse, PaginationParams
from app.services.chat_service import ChatService

router = APIRouter(prefix="/chats", tags=["Chats"])


@router.get("", response_model=PaginatedResponse[ChatSessionResponse], summary="List My Conversations")
def list_chats(
    pagination: PaginationParams = Depends(get_pagination),
    db: Session = Depends(get_db),
    current_user: Profile = Depends(get_current_user),
):
    """List current user's chat sessions, sorted by last updated."""
    return ChatService.list_user_chats(db, current_user, pagination)


@router.post("", response_model=ChatSessionResponse, status_code=status.HTTP_201_CREATED, summary="Create New Chat")
def create_chat(
    data: ChatSessionCreate,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(get_current_user),
):
    """Start a new chat conversation session."""
    return ChatService.create_chat(db, current_user, data)


@router.get("/{chat_id}", response_model=ChatSessionResponse, summary="Get Chat Details")
def get_chat(
    chat_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(get_current_user),
):
    """Retrieve chat session metadata. Strict user isolation enforced."""
    chat = ChatService.get_chat_session(db, chat_id, current_user)
    return ChatSessionResponse(
        id=chat.id,
        user_id=chat.user_id,
        title=chat.title,
        created_at=chat.created_at,
        updated_at=chat.updated_at,
        message_count=len(chat.messages),
    )


@router.put("/{chat_id}", response_model=ChatSessionResponse, summary="Rename Chat")
def update_chat(
    chat_id: uuid.UUID,
    data: ChatSessionUpdate,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(get_current_user),
):
    """Update title of a conversation."""
    return ChatService.update_chat_title(db, chat_id, data, current_user)


@router.delete("/{chat_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete Chat")
def delete_chat(
    chat_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(get_current_user),
):
    """Delete a conversation and all its messages."""
    ChatService.delete_chat(db, chat_id, current_user)
    return None


@router.get("/{chat_id}/messages", response_model=List[MessageResponse], summary="List Chat Messages")
def list_messages(
    chat_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(get_current_user),
):
    """Retrieve message history of a conversation in chronological order."""
    return ChatService.list_messages(db, chat_id, current_user)


@router.post("/{chat_id}/messages", response_model=MessageResponse, status_code=status.HTTP_201_CREATED, summary="Add Message")
def add_message(
    chat_id: uuid.UUID,
    data: MessageCreate,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(get_current_user),
):
    """Append a user or assistant message to the conversation."""
    return ChatService.add_message(db, chat_id, data, current_user)
