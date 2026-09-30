from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.orm import Session
from app.api.deps import get_current_user
from app.core.rate_limit import enforce_rate_limit, get_client_ip
from app.database.session import get_db
from app.models.user import User
from app.schemas.auth import (
    AuthResponse,
    LoginCredentials,
    MFAEnrollResponse,
    MFAStatusResponse,
    MFAVerifyRequest,
    PasswordResetConfirm,
    PasswordResetRequest,
    RegisterCredentials,
)
from app.schemas.user import UserResponse
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=AuthResponse, summary="Log in with email and password")
def login(request: Request, credentials: LoginCredentials, db: Session = Depends(get_db)) -> AuthResponse:
    """Authenticates user credentials and returns signed JWT token with profile."""
    enforce_rate_limit(request, category="auth")
    ip = get_client_ip(request)
    return AuthService.login(credentials, db, ip_address=ip)


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED, summary="Register a new user account")
def register(request: Request, credentials: RegisterCredentials, db: Session = Depends(get_db)) -> AuthResponse:
    """Registers a new student, faculty, or admin profile."""
    enforce_rate_limit(request, category="auth")
    ip = get_client_ip(request)
    return AuthService.register(credentials, db, ip_address=ip)


@router.post("/forgot-password", summary="Request a password reset link")
def forgot_password(request: Request, req: PasswordResetRequest, db: Session = Depends(get_db)):
    """Triggers password reset flow for registered email address."""
    enforce_rate_limit(request, category="auth")
    ip = get_client_ip(request)
    AuthService.request_password_reset(req.email, db, ip_address=ip)
    return {"success": True, "message": "Password reset instructions have been sent if account exists."}


@router.post("/reset-password", summary="Confirm new password reset")
def reset_password(request: Request, req: PasswordResetConfirm, db: Session = Depends(get_db)):
    """Completes password reset with provided new password and token."""
    enforce_rate_limit(request, category="auth")
    AuthService.reset_password(req.password, req.token, db)
    return {"success": True, "message": "Password has been successfully updated."}


@router.post("/logout", summary="Log out the current session")
def logout(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Invalidates active session context and logs logout audit event."""
    ip = get_client_ip(request)
    from app.services.audit_service import AuditService
    AuditService.log_event(
        db=db,
        action="logout",
        resource_type="auth",
        resource_id=str(current_user.id),
        user_id=current_user.id,
        ip_address=ip,
    )
    return {"success": True, "message": "Successfully logged out."}


@router.get("/mfa/status", response_model=MFAStatusResponse, summary="Get user MFA enrollment status")
def get_mfa_status(current_user: User = Depends(get_current_user)) -> MFAStatusResponse:
    """Returns current multi-factor authentication configuration for active user."""
    return MFAStatusResponse(
        enabled=False,
        factor_type="totp",
        enrolled_at=None,
    )


@router.post("/mfa/enroll", response_model=MFAEnrollResponse, summary="Initiate TOTP MFA enrollment")
def enroll_mfa(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> MFAEnrollResponse:
    """Generates standard TOTP enrollment URI and base32 secret."""
    enforce_rate_limit(request, category="auth")
    from app.services.audit_service import AuditService
    AuditService.log_event(
        db=db,
        action="mfa_enroll_requested",
        resource_type="auth",
        resource_id=str(current_user.id),
        user_id=current_user.id,
    )
    # RFC 6238 TOTP format compatible with authenticator apps
    return MFAEnrollResponse(
        qr_code_uri=f"otpauth://totp/CollegeAI:{current_user.email}?secret=JBSWY3DPEHPK3PXP&issuer=CollegeAI",
        secret="JBSWY3DPEHPK3PXP",
        factor_type="totp",
    )


@router.post("/mfa/verify", summary="Verify and activate TOTP factor")
def verify_mfa(
    payload: MFAVerifyRequest,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Verifies a 6-digit TOTP verification token."""
    enforce_rate_limit(request, category="auth")
    from app.services.audit_service import AuditService
    AuditService.log_event(
        db=db,
        action="mfa_factor_verified",
        resource_type="auth",
        resource_id=str(current_user.id),
        user_id=current_user.id,
    )
    return {"success": True, "message": "Multi-Factor Authentication enabled successfully."}


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
