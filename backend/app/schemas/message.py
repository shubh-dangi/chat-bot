from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field


class MessageResponse(BaseModel):
    id: str
    conversation_id: str = Field(..., alias="conversationId")
    sender: str  # user, assistant, system
    content: str
    timestamp: str
    status: Optional[str] = "sent"

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class SendMessageRequest(BaseModel):
    content: str = Field(..., min_length=1, max_length=10000, description="Message text (max 10,000 characters)")


class EditMessageRequest(BaseModel):
    new_content: str = Field(..., alias="newContent", min_length=1, max_length=10000, description="Updated message text")

    model_config = ConfigDict(populate_by_name=True)


class SendMessageResponse(BaseModel):
    user_message: MessageResponse = Field(..., alias="userMessage")
    assistant_message: MessageResponse = Field(..., alias="assistantMessage")

    model_config = ConfigDict(populate_by_name=True)
