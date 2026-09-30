from typing import Generator, List, Optional
import uuid
from fastapi import Depends, HTTPException, Query, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session
from app.core.logging import get_logger
from app.core.security import decode_access_token
from app.database.session import get_db
from app.models.profile import Profile
from app.schemas.common import PaginationParams

logger = get_logger(__name__)
security = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db),
) -> Profile:
    """
    Validates Supabase Auth JWT token or test dev token from Bearer Authorization header.
    Resolves the application Profile entity.
    """
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication credentials were not provided",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials
    payload = decode_access_token(token)

    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid, expired, or malformed authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Supabase JWT tokens provide the user ID in the 'sub' claim
    auth_user_id_raw = payload.get("sub")
    if not auth_user_id_raw:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token missing subject identity",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        # Convert string sub to uuid if valid
        auth_user_uuid = uuid.UUID(str(auth_user_id_raw))
    except (ValueError, TypeError):
        # Fallback deterministic UUID for test strings like 'mock-admin'
        auth_user_uuid = uuid.uuid5(uuid.NAMESPACE_DNS, str(auth_user_id_raw))

    # Lookup existing application profile
    profile = db.query(Profile).filter(Profile.auth_user_id == auth_user_uuid).first()

    if not profile:
        # Auto-provision initial profile if authenticated via Supabase
        email = payload.get("email", "")
        role = payload.get("role", "student")
        if role not in ("student", "teacher", "admin"):
            role = "student"
        full_name = (
            payload.get("user_metadata", {}).get("full_name")
            or payload.get("name")
            or (email.split("@")[0].capitalize() if email else "College Member")
        )

        profile = Profile(
            auth_user_id=auth_user_uuid,
            full_name=full_name,
            role=role,
            department="General",
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)
        logger.info(f"Auto-provisioned profile {profile.id} for auth_user {auth_user_uuid} (role={profile.role})")

    return profile


def get_optional_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db),
) -> Optional[Profile]:
    """
    Optional authentication for endpoints that support both public and authenticated views (e.g. shared chats).
    """
    if not credentials:
        return None
    try:
        return get_current_user(credentials=credentials, db=db)
    except HTTPException:
        return None


def require_role(*allowed_roles: str):
    """
    Role-based authorization dependency.
    Validates that the authenticated profile has one of the required roles.
    """
    def role_checker(current_user: Profile = Depends(get_current_user)) -> Profile:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied: Requires role in {list(allowed_roles)}. Current role: '{current_user.role}'",
            )
        return current_user

    return role_checker


def get_pagination(
    page: int = Query(default=1, ge=1, description="Page number starting at 1"),
    page_size: int = Query(default=20, ge=1, le=100, description="Items per page (max 100)"),
) -> PaginationParams:
    """Standardized pagination parameter dependency."""
    return PaginationParams(page=page, page_size=page_size)
