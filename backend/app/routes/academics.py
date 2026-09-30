from typing import List, Optional
import uuid
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.core.deps import get_current_user, get_db, get_pagination, require_role
from app.models.profile import Profile
from app.schemas.academic import (
    CourseCreate,
    CourseResponse,
    SubjectCreate,
    SubjectResponse,
)
from app.schemas.common import PaginatedResponse, PaginationParams
from app.services.academic_service import AcademicService

router = APIRouter(prefix="", tags=["Academics"])


@router.get("/courses", response_model=PaginatedResponse[CourseResponse], summary="List Degree Courses")
def list_courses(
    pagination: PaginationParams = Depends(get_pagination),
    db: Session = Depends(get_db),
    _current_user: Profile = Depends(get_current_user),
):
    """Retrieve all available academic courses (e.g. BCA, B.Tech, MCA)."""
    return AcademicService.get_courses(db, pagination)


@router.post("/courses", response_model=CourseResponse, status_code=status.HTTP_201_CREATED, summary="Create New Course")
def create_course(
    data: CourseCreate,
    db: Session = Depends(get_db),
    _admin: Profile = Depends(require_role("admin")),
):
    """Create a new degree program. Restricted to Administrators."""
    course = AcademicService.create_course(db, data)
    return CourseResponse.model_validate(course)


@router.get("/courses/{course_id}", response_model=CourseResponse, summary="Get Course Details")
def get_course(
    course_id: uuid.UUID,
    db: Session = Depends(get_db),
    _current_user: Profile = Depends(get_current_user),
):
    """Retrieve course information by ID."""
    course = AcademicService.get_course_by_id(db, course_id)
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found",
        )
    return CourseResponse.model_validate(course)


@router.get("/courses/{course_id}/subjects", response_model=List[SubjectResponse], summary="List Subjects in Course")
def list_subjects_for_course(
    course_id: uuid.UUID,
    semester: Optional[int] = Query(default=None, ge=1, le=12, description="Filter by semester"),
    db: Session = Depends(get_db),
    _current_user: Profile = Depends(get_current_user),
):
    """Retrieve subjects associated with a course and optional semester."""
    subjects = AcademicService.get_subjects_by_course(db, course_id, semester)
    return [SubjectResponse.model_validate(s) for s in subjects]


@router.post("/subjects", response_model=SubjectResponse, status_code=status.HTTP_201_CREATED, summary="Create Subject")
def create_subject(
    data: SubjectCreate,
    db: Session = Depends(get_db),
    _admin: Profile = Depends(require_role("admin")),
):
    """Add a subject to a course curriculum. Restricted to Administrators."""
    subject = AcademicService.create_subject(db, data)
    return SubjectResponse.model_validate(subject)
