from typing import Optional
import uuid
from sqlalchemy.orm import Session
from app.models.profile import Profile
from app.schemas.profile import ProfileUpdate


class ProfileService:
    @staticmethod
    def get_by_id(db: Session, profile_id: uuid.UUID) -> Optional[Profile]:
        return db.query(Profile).filter(Profile.id == profile_id).first()

    @staticmethod
    def get_by_auth_user_id(db: Session, auth_user_id: uuid.UUID) -> Optional[Profile]:
        return db.query(Profile).filter(Profile.auth_user_id == auth_user_id).first()

    @staticmethod
    def update_profile(db: Session, profile: Profile, update_data: ProfileUpdate) -> Profile:
        if update_data.full_name is not None:
            profile.full_name = update_data.full_name
        if update_data.avatar_url is not None:
            profile.avatar_url = update_data.avatar_url
        if update_data.department is not None:
            profile.department = update_data.department

        db.add(profile)
        db.commit()
        db.refresh(profile)
        return profile
