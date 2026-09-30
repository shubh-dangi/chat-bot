from datetime import datetime
from typing import Any, List, Optional, Union
import uuid
from pydantic import BaseModel, ConfigDict, Field


class MessageBase(BaseModel):
    role: str = Field(default="user", pattern="^(user|assistant|system)$")
    content: str = Field(..., min_length=1)


class MessageCreate(MessageBase):
    pass


class MessageResponse(BaseModel):
    id: Union[uuid.UUID, str]
    conversation_id: Optional[str] = Field(default=None, alias="conversationId")
    chat_id: Optional[Union[uuid.UUID, str]] = None
    sender: Optional[str] = None
    role: Optional[str] = "user"
    content: str
    timestamp: Optional[str] = None
    status: Optional[str] = "sent"
    created_at: Optional[Union[datetime, str]] = None
    updated_at: Optional[Union[datetime, str]] = None

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class SendMessageRequest(BaseModel):
    content: str


class EditMessageRequest(BaseModel):
    new_content: str = Field(..., alias="newContent")

    model_config = ConfigDict(populate_by_name=True)


class SendMessageResponse(BaseModel):
    user_message: MessageResponse = Field(..., alias="userMessage")
    assistant_message: MessageResponse = Field(..., alias="assistantMessage")

    model_config = ConfigDict(populate_by_name=True)


class ConversationResponse(BaseModel):
    id: str
    title: str
    created_at: str = Field(..., alias="createdAt")
    updated_at: str = Field(..., alias="updatedAt")
    last_message_preview: Optional[str] = Field(default=None, alias="lastMessagePreview")
    is_shared: bool = Field(default=False, alias="isShared")
    share_token: Optional[str] = Field(default=None, alias="shareToken")

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class ConversationCreate(BaseModel):
    initial_message: Optional[str] = Field(default=None, alias="initialMessage")
    title: Optional[str] = None

    model_config = ConfigDict(populate_by_name=True)


class ConversationRenameRequest(BaseModel):
    title: str


class ChatSessionCreate(BaseModel):
    title: Optional[str] = Field(default="New Conversation", max_length=255)


class ChatSessionUpdate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)


class ChatSessionResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    title: str
    created_at: datetime
    updated_at: datetime
    message_count: int = 0

    model_config = ConfigDict(from_attributes=True)


class SharedChatCreate(BaseModel):
    expires_in_hours: Optional[int] = Field(default=None, ge=1, le=8760)


class SharedChatResponse(BaseModel):
    id: uuid.UUID
    chat_id: uuid.UUID
    share_token: str
    created_by: uuid.UUID
    expires_at: Optional[datetime] = None
    revoked_at: Optional[datetime] = None
    created_at: datetime
    is_active: bool

    model_config = ConfigDict(from_attributes=True)


class SharedChatPublicView(BaseModel):
    title: str
    messages: List[MessageResponse]
    created_at: datetime
