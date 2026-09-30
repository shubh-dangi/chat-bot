from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str = "student"
    department: str = "General"
    avatar_url: Optional[str] = Field(default=None, alias="avatarUrl")

    model_config = ConfigDict(populate_by_name=True)


class UserCreate(UserBase):
    password: Optional[str] = None


class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[str] = None
    department: Optional[str] = None
    avatar_url: Optional[str] = Field(default=None, alias="avatarUrl")
    is_active: Optional[bool] = None

    model_config = ConfigDict(populate_by_name=True)


class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    department: Optional[str] = None
    avatar_url: Optional[str] = Field(default=None, alias="avatarUrl")

    model_config = ConfigDict(populate_by_name=True)


class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    department: str = "General"
    avatar_url: Optional[str] = Field(default=None, alias="avatarUrl")
    is_active: bool = True
    status: str = "Active"
    last_active: Optional[str] = Field(default="Just now", alias="lastActive")
    created_at: Optional[str] = Field(default=None, alias="createdAt")

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
