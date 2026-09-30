from typing import Optional
from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator
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

    @field_validator("password")
    @classmethod
    def validate_password_complexity(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long.")
        if not any(c.isupper() for c in v):
            raise ValueError("Password must contain at least one uppercase letter.")
        if not any(c.islower() for c in v):
            raise ValueError("Password must contain at least one lowercase letter.")
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain at least one numeric digit.")
        return v


class AuthResponse(BaseModel):
    user: UserResponse
    token: str

    model_config = ConfigDict(populate_by_name=True)


class PasswordResetRequest(BaseModel):
    email: EmailStr


class PasswordResetConfirm(BaseModel):
    password: str
    token: Optional[str] = None

    @field_validator("password")
    @classmethod
    def validate_password_complexity(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long.")
        if not any(c.isupper() for c in v):
            raise ValueError("Password must contain at least one uppercase letter.")
        if not any(c.islower() for c in v):
            raise ValueError("Password must contain at least one lowercase letter.")
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain at least one numeric digit.")
        return v


class MFAStatusResponse(BaseModel):
    enabled: bool
    factor_type: Optional[str] = None
    enrolled_at: Optional[str] = None


class MFAEnrollResponse(BaseModel):
    qr_code_uri: str
    secret: str
    factor_type: str = "totp"


class MFAVerifyRequest(BaseModel):
    code: str = Field(..., min_length=6, max_length=6, pattern="^[0-9]{6}$")
