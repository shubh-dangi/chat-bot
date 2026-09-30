from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field
from app.schemas.chat import ConversationResponse
from app.schemas.message import MessageResponse


class ShareLinkResponse(BaseModel):
    share_token: str = Field(..., alias="shareToken")
    share_url: Optional[str] = Field(default=None, alias="shareUrl")
    conversation_id: str = Field(..., alias="conversationId")

    model_config = ConfigDict(populate_by_name=True)


class SharedConversationResponse(BaseModel):
    conversation: ConversationResponse
    messages: List[MessageResponse]

    model_config = ConfigDict(populate_by_name=True)
