from typing import Optional
from pydantic import BaseModel, ConfigDict, EmailStr, Field
from app.schemas.user import UserResponse


class LoginCredentials(BaseModel):
    email: EmailStr
    password: str


class RegisterCredentials(BaseModel):
    name: str
    email: EmailStr
    password: str
    department: Optional[str] = "General"
    role: Optional[str] = "student"


class AuthResponse(BaseModel):
    user: UserResponse
    token: str

    model_config = ConfigDict(populate_by_name=True)


class PasswordResetRequest(BaseModel):
    email: EmailStr


class PasswordResetConfirm(BaseModel):
    password: str
    token: Optional[str] = None
