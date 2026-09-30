from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.api.deps import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.schemas.auth import (
    AuthResponse,
    LoginCredentials,
    PasswordResetConfirm,
    PasswordResetRequest,
    RegisterCredentials,
)
from app.schemas.user import UserResponse
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=AuthResponse, summary="Log in with email and password")
def login(credentials: LoginCredentials, db: Session = Depends(get_db)) -> AuthResponse:
    """Authenticates user credentials and returns signed JWT token with profile."""
    return AuthService.login(credentials, db)


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED, summary="Register a new user account")
def register(credentials: RegisterCredentials, db: Session = Depends(get_db)) -> AuthResponse:
    """Registers a new student, faculty, or admin profile."""
    return AuthService.register(credentials, db)


@router.post("/forgot-password", summary="Request a password reset link")
def forgot_password(req: PasswordResetRequest, db: Session = Depends(get_db)):
    """Triggers password reset flow for registered email address."""
    AuthService.request_password_reset(req.email, db)
    return {"success": True, "message": "Password reset instructions have been sent if account exists."}


@router.post("/reset-password", summary="Confirm new password reset")
def reset_password(req: PasswordResetConfirm, db: Session = Depends(get_db)):
    """Completes password reset with provided new password and token."""
    AuthService.reset_password(req.password, req.token, db)
    return {"success": True, "message": "Password has been successfully updated."}


@router.get("/me", response_model=UserResponse, summary="Get current authenticated user profile")
def get_me(current_user: User = Depends(get_current_user)) -> UserResponse:
    """Returns the verified profile of the active token bearer."""
    return UserResponse(
        id=current_user.id,
        name=current_user.name,
        email=current_user.email,
        role=current_user.role,
        department=current_user.department,
        avatar_url=current_user.avatar_url,
        is_active=current_user.is_active,
        status="Active" if current_user.is_active else "Inactive",
        created_at=current_user.created_at.isoformat() if current_user.created_at else None,
        last_active="Just now",
    )
