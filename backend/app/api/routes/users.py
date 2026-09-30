from typing import List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.api.deps import get_current_user, require_role
from app.core.exceptions import EntityNotFoundException
from app.database.session import get_db
from app.models.user import User
from app.schemas.user import UserResponse, UserUpdate

router = APIRouter(prefix="/users", tags=["Users"])

INITIAL_SEED_USERS = [
    {
        "id": "usr-1",
        "name": "Dr. Marcus Chen",
        "email": "m.chen@college.edu",
        "role": "faculty",
        "department": "Physics",
        "is_active": True,
        "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&q=80",
    },
    {
        "id": "usr-2",
        "name": "Prof. Elena Rostova",
        "email": "e.rostova@college.edu",
        "role": "faculty",
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
]


def ensure_users_seeded(db: Session) -> None:
    if db.query(User).count() == 0:
        for u in INITIAL_SEED_USERS:
            db_user = User(
                id=u["id"],
                name=u["name"],
                email=u["email"],
                role=u["role"],
                department=u["department"],
                is_active=u["is_active"],
                avatar_url=u.get("avatar_url"),
            )
            db.add(db_user)
        db.commit()


@router.get("", response_model=List[UserResponse], summary="List managed institutional users")
def list_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> List[UserResponse]:
    """Returns directory of registered institutional users and administrators."""
    ensure_users_seeded(db)
    users = db.query(User).order_by(User.created_at.desc()).all()
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
    admin_user: User = Depends(require_role("admin", "faculty")),
) -> UserResponse:
    """Toggles user account status between Active and Inactive."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise EntityNotFoundException("User", user_id)

    user.is_active = not user.is_active
    db.commit()
    db.refresh(user)

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
    """Updates user roles, departmental assignment, or contact info."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise EntityNotFoundException("User", user_id)

    update_dict = data.model_dump(exclude_unset=True)
    for key, val in update_dict.items():
        setattr(user, key, val)

    db.commit()
    db.refresh(user)

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
