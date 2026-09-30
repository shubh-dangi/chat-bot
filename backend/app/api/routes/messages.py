from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.api.deps import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.schemas.message import EditMessageRequest, MessageResponse, SendMessageRequest, SendMessageResponse
from app.services.chat_service import ChatService

router = APIRouter(tags=["Messages"])


@router.get("/chats/{conversation_id}/messages", response_model=List[MessageResponse], summary="Get messages for a conversation")
def get_messages(
    conversation_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> List[MessageResponse]:
    """Retrieves chronological message history for a conversation thread."""
    return ChatService.get_messages(conversation_id, current_user.id, db)


@router.post("/chats/{conversation_id}/messages", response_model=SendMessageResponse, status_code=status.HTTP_201_CREATED, summary="Send message and receive assistant reply")
async def send_message(
    conversation_id: str,
    payload: SendMessageRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> SendMessageResponse:
    """Posts a new user message to the conversation and triggers institutional AI generation."""
    return await ChatService.send_message(conversation_id, current_user.id, payload.content, db)


@router.put("/chats/{conversation_id}/messages/{message_id}", response_model=List[MessageResponse], summary="Edit message and re-branch conversation")
async def edit_message(
    conversation_id: str,
    message_id: str,
    payload: EditMessageRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> List[MessageResponse]:
    """Edits a previous message and re-generates conversational branch from that point forward."""
    return await ChatService.edit_message(conversation_id, message_id, current_user.id, payload.new_content, db)
