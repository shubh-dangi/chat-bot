"""
User Management and Administration Endpoints for College AI.
Restricts administrative actions to authorized roles with audit logging and lockout protection.
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, Request
from sqlalchemy.orm import Session
from app.api.deps import get_current_user, require_role
from app.core.exceptions import EntityNotFoundException, ValidationException
from app.core.rate_limit import enforce_rate_limit
from app.core.security import hash_password
from app.database.session import get_db
from app.models.user import User
from app.schemas.user import UserResponse, UserUpdate
from app.services.audit_service import AuditService

router = APIRouter(prefix="/users", tags=["Users"])

INITIAL_SEED_USERS = [
    {
        "id": "usr-1",
        "name": "Dr. Marcus Chen",
        "email": "m.chen@college.edu",
        "role": "teacher",
        "department": "Physics",
        "is_active": True,
        "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&q=80",
    },
    {
        "id": "usr-2",
        "name": "Prof. Elena Rostova",
        "email": "e.rostova@college.edu",
        "role": "teacher",
        "department": "Mathematics",
        "is_active": True,
        "avatar_url": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=128&q=80",
    },
    {
        "id": "usr-3",
        "name": "Administrator SDX",
        "email": "admin@college.edu",
        "role": "admin",
        "department": "IT Infrastructure",
        "is_active": True,
    },
    {
        "id": "usr-4",
        "name": "Jane Smith",
        "email": "jane.smith@college.edu",
        "role": "student",
        "department": "Computer Science",
        "is_active": True,
        "avatar_url": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&q=80",
    },
    {
        "id": "usr-5",
        "name": "Alex Student",
        "email": "student@college.edu",
        "role": "student",
        "department": "Computer Science",
        "is_active": True,
        "avatar_url": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&q=80",
    },
]


def ensure_users_seeded(db: Session) -> None:
    if db.query(User).count() == 0:
        default_hash = hash_password("password123")
        for u in INITIAL_SEED_USERS:
            db_user = User(
                id=u["id"],
                name=u["name"],
                email=u["email"],
                role=u["role"],
                department=u["department"],
                is_active=u["is_active"],
                hashed_password=default_hash,
                avatar_url=u.get("avatar_url"),
            )
            db.add(db_user)
        db.commit()


@router.get("", response_model=List[UserResponse], summary="List managed institutional users")
def list_users(
    request: Request,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin", "teacher", "faculty")),
) -> List[UserResponse]:
    """
    Returns directory of registered institutional users.
    Restricted strictly to Faculty and Administrators to protect user privacy.
    """
    enforce_rate_limit(request, category="search", custom_key=str(current_user.id))
    ensure_users_seeded(db)

    offset = (page - 1) * page_size
    users = db.query(User).order_by(User.created_at.desc()).offset(offset).limit(page_size).all()

    return [
        UserResponse(
            id=u.id,
            name=u.name,
            email=u.email,
            role=u.role,
            department=u.department,
            avatar_url=u.avatar_url,
            is_active=u.is_active,
            status="Active" if u.is_active else "Inactive",
            created_at=u.created_at.isoformat() if u.created_at else None,
            last_active="10 mins ago" if u.id != current_user.id else "Just now",
        )
        for u in users
    ]


@router.patch("/{user_id}/status", response_model=UserResponse, summary="Toggle active/inactive status")
def toggle_user_status(
    user_id: str,
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_role("admin")),
) -> UserResponse:
    """Toggles user account status. Admin access only, with self-lockout prevention."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise EntityNotFoundException("User", user_id)

    # Lockout protection: Cannot deactivate the last remaining active administrator
    if user.is_active and user.role == "admin":
        active_admin_count = db.query(User).filter(User.role == "admin", User.is_active == True).count()
        if active_admin_count <= 1:
            raise ValidationException("Cannot deactivate the only active administrator.")

    new_status = not user.is_active
    user.is_active = new_status
    db.commit()
    db.refresh(user)

    # Audit log status toggle
    AuditService.log_event(
        db=db,
        action="user_status_toggled",
        resource_type="user",
        resource_id=str(user.id),
        user_id=admin_user.id,
        details={"new_active_status": new_status, "target_email": user.email},
    )

    return UserResponse(
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


@router.patch("/{user_id}", response_model=UserResponse, summary="Update user attributes")
def update_user(
    user_id: str,
    data: UserUpdate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_role("admin")),
) -> UserResponse:
    """Updates user roles, departmental assignment, or contact info with audit logging."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise EntityNotFoundException("User", user_id)

    update_dict = data.model_dump(exclude_unset=True)

    # Privilege escalation / lockout check
    if "role" in update_dict and update_dict["role"] != user.role:
        if user.role == "admin" and update_dict["role"] != "admin":
            active_admin_count = db.query(User).filter(User.role == "admin", User.is_active == True).count()
            if active_admin_count <= 1:
                raise ValidationException("Cannot demote the only active administrator.")

    for key, val in update_dict.items():
        setattr(user, key, val)

    db.commit()
    db.refresh(user)

    # Audit log user update
    AuditService.log_event(
        db=db,
        action="user_updated",
        resource_type="user",
        resource_id=str(user.id),
        user_id=admin_user.id,
        details={"updated_fields": list(update_dict.keys()), "target_email": user.email},
    )

    return UserResponse(
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
