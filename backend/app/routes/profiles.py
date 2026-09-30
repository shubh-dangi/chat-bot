import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.deps import get_current_user, get_db
from app.models.profile import Profile
from app.schemas.profile import ProfileResponse, ProfileUpdate
from app.services.profile_service import ProfileService

router = APIRouter(prefix="/profiles", tags=["Profiles"])


@router.get("/me", response_model=ProfileResponse, summary="Get Current User Profile")
def get_my_profile(current_user: Profile = Depends(get_current_user)):
    """Retrieve profile of the currently authenticated Supabase user."""
    return ProfileResponse.model_validate(current_user)


@router.put("/me", response_model=ProfileResponse, summary="Update Current User Profile")
def update_my_profile(
    update_data: ProfileUpdate,
    current_user: Profile = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update profile information (e.g. name, department, avatar). Role changes are prohibited."""
    updated = ProfileService.update_profile(db, current_user, update_data)
    return ProfileResponse.model_validate(updated)


@router.get("/{profile_id}", response_model=ProfileResponse, summary="Get Profile by ID")
def get_profile_by_id(
    profile_id: uuid.UUID,
    current_user: Profile = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Retrieve a specific profile by ID. Restricted to owner or staff."""
    if current_user.id != profile_id and current_user.role not in ("admin", "teacher"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to view this profile",
        )
    profile = ProfileService.get_by_id(db, profile_id)
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found",
        )
    return ProfileResponse.model_validate(profile)
