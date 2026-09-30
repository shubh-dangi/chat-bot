from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.schemas.user import UserProfileUpdate, UserResponse

router = APIRouter(prefix="/profile", tags=["Profile"])


@router.get("", response_model=UserResponse, summary="Get user profile")
@router.get("/me", response_model=UserResponse, summary="Get user profile (alias)")
def get_profile(current_user: User = Depends(get_current_user)) -> UserResponse:
    """Returns the authenticated user's profile details."""
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


@router.patch("", response_model=UserResponse, summary="Update user profile")
@router.put("", response_model=UserResponse, summary="Update user profile")
def update_profile(
    data: UserProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> UserResponse:
    """Updates profile attributes (name, department, avatarUrl)."""
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(current_user, key, value)

    db.commit()
    db.refresh(current_user)

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
