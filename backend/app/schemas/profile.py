from datetime import datetime
from typing import Optional
import uuid
from pydantic import BaseModel, ConfigDict, Field


class ProfileBase(BaseModel):
    full_name: str = Field(..., min_length=1, max_length=255)
    avatar_url: Optional[str] = None
    department: str = Field(default="General", max_length=150)


class ProfileCreate(ProfileBase):
    auth_user_id: uuid.UUID
    role: str = Field(default="student", pattern="^(student|teacher|admin)$")


class ProfileUpdate(BaseModel):
    full_name: Optional[str] = Field(default=None, min_length=1, max_length=255)
    avatar_url: Optional[str] = None
    department: Optional[str] = Field(default=None, max_length=150)


class ProfileResponse(ProfileBase):
    id: uuid.UUID
    auth_user_id: uuid.UUID
    role: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
