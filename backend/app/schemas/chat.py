from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class ConversationCreate(BaseModel):
    initial_message: Optional[str] = Field(default=None, alias="initialMessage")
    title: Optional[str] = None

    model_config = ConfigDict(populate_by_name=True)


class ConversationRenameRequest(BaseModel):
    title: str


class ConversationResponse(BaseModel):
    id: str
    title: str
    created_at: str = Field(..., alias="createdAt")
    updated_at: str = Field(..., alias="updatedAt")
    last_message_preview: Optional[str] = Field(default=None, alias="lastMessagePreview")
    is_shared: bool = Field(default=False, alias="isShared")
    share_token: Optional[str] = Field(default=None, alias="shareToken")

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
