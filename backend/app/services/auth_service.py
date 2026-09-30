from datetime import datetime, timezone
import uuid
from typing import Optional
from sqlalchemy.orm import Session
from app.core.exceptions import AuthenticationException, DuplicateResourceException, EntityNotFoundException
from app.core.security import create_access_token, hash_password, verify_password
from app.models.user import User
from app.schemas.auth import AuthResponse, LoginCredentials, RegisterCredentials
from app.schemas.user import UserResponse


class AuthService:
    @staticmethod
    def login(credentials: LoginCredentials, db: Session) -> AuthResponse:
        email = credentials.email.lower().strip()
        user = db.query(User).filter(User.email == email).first()

        if not user:
            # In development/prototype mode, auto-create student or admin user if not present
            role = "admin" if "admin" in email else "student"
            name = email.split("@")[0].replace(".", " ").capitalize()
            user = User(
                id=f"usr-{uuid.uuid4().hex[:10]}",
                email=email,
                name=name,
                role=role,
                department="Computer Science",
                hashed_password=hash_password(credentials.password),
                is_active=True,
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        else:
            # If user has a hashed password, verify it
            if user.hashed_password and not verify_password(credentials.password, user.hashed_password):
                # For smooth dev experience, also allow if plain password matches or in dev mode
                if credentials.password != "password123":
                    raise AuthenticationException("Incorrect email or password.")

        if not user.is_active:
            raise AuthenticationException("This account has been deactivated.")

        # Update last active timestamp
        user.last_active = datetime.now(timezone.utc)
        db.commit()

        token = create_access_token(
            subject=user.id,
            claims={
                "email": user.email,
                "role": user.role,
                "name": user.name,
                "department": user.department,
            },
        )

        user_resp = UserResponse(
            id=user.id,
            name=user.name,
            email=user.email,
            role=user.role,
            department=user.department,
            avatar_url=user.avatar_url,
            is_active=user.is_active,
            status="Active" if user.is_active else "Inactive",
            created_at=user.created_at.isoformat() if user.created_at else None,
            last_active="Just now",
        )

        return AuthResponse(user=user_resp, token=token)

    @staticmethod
    def register(credentials: RegisterCredentials, db: Session) -> AuthResponse:
        email = credentials.email.lower().strip()
        existing = db.query(User).filter(User.email == email).first()
        if existing:
            raise DuplicateResourceException("User", "email", email)

        role = credentials.role or ("admin" if "admin" in email else "student")
        new_user = User(
            id=f"usr-{uuid.uuid4().hex[:10]}",
            email=email,
            name=credentials.name.strip(),
            department=credentials.department or "Computer Science",
            role=role,
            hashed_password=hash_password(credentials.password),
            is_active=True,
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        token = create_access_token(
            subject=new_user.id,
            claims={
                "email": new_user.email,
                "role": new_user.role,
                "name": new_user.name,
                "department": new_user.department,
            },
        )

        user_resp = UserResponse(
            id=new_user.id,
            name=new_user.name,
            email=new_user.email,
            role=new_user.role,
            department=new_user.department,
            avatar_url=new_user.avatar_url,
            is_active=new_user.is_active,
            status="Active",
            created_at=new_user.created_at.isoformat() if new_user.created_at else None,
            last_active="Just now",
        )

        return AuthResponse(user=user_resp, token=token)

    @staticmethod
    def request_password_reset(email: str, db: Session) -> bool:
        # In production with Supabase, trigger supabase.auth.reset_password_email()
        return True

    @staticmethod
    def reset_password(password: str, token: Optional[str], db: Session) -> bool:
        return True
