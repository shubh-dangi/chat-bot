from typing import Generator, List, Optional
from fastapi import Depends, Header, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session
from app.core.exceptions import AuthenticationException, PermissionDeniedException
from app.core.security import decode_access_token
from app.database.session import get_db
from app.models.user import User

security_scheme = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_scheme),
    db: Session = Depends(get_db),
) -> User:
    """
    Extracts and verifies the JWT token from the Authorization header.
    Resolves the associated User from the database.
    """
    if not credentials or not credentials.credentials:
        raise AuthenticationException("Authentication required. Please provide a valid Bearer token.")

    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload:
        raise AuthenticationException("Could not validate credentials or token expired.")

    user_id = payload.get("sub")
    if not user_id:
        raise AuthenticationException("Token missing subject identifier.")

    user = db.query(User).filter(User.id == str(user_id)).first()

    # If user doesn't exist yet in local DB (e.g. newly signed up in Supabase Auth or mock user)
    if not user:
        email = payload.get("email") or f"{user_id}@college.edu"
        name = payload.get("name") or payload.get("user_metadata", {}).get("name") or email.split("@")[0].capitalize()
        role = payload.get("role") or ("admin" if "admin" in email else "student")
        department = payload.get("department") or "Computer Science"

        user = User(
            id=str(user_id),
            email=email,
            name=name,
            role=role,
            department=department,
            is_active=True,
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    if not user.is_active:
        raise PermissionDeniedException("User account is inactive.")

    return user


def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_scheme),
    db: Session = Depends(get_db),
) -> Optional[User]:
    """Optional authentication: returns User if authenticated, None otherwise."""
    if not credentials or not credentials.credentials:
        return None
    try:
        return get_current_user(credentials=credentials, db=db)
    except Exception:
        return None


def require_role(*roles: str):
    """Dependency factory ensuring current user possesses at least one of the required roles."""

    def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in roles:
            raise PermissionDeniedException(
                f"Role '{current_user.role}' lacks permission for this action. Required: {', '.join(roles)}"
            )
        return current_user

    return role_checker
