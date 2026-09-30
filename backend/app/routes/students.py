from typing import Optional, Union
import uuid
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.core.deps import get_current_user, get_db, get_pagination, require_role
from app.models.profile import Profile
from app.schemas.common import PaginatedResponse, PaginationParams
from app.schemas.student import (
    StudentCreate,
    StudentPrivate,
    StudentPublic,
    StudentUpdate,
)
from app.services.student_service import StudentService

router = APIRouter(prefix="/students", tags=["Students"])


@router.get("", response_model=PaginatedResponse[Union[StudentPrivate, StudentPublic]], summary="List & Search Students")
def list_students(
    search: Optional[str] = Query(default=None, description="Search by name, roll number, or ID"),
    course_id: Optional[uuid.UUID] = Query(default=None, description="Filter by course"),
    semester: Optional[int] = Query(default=None, ge=1, le=12, description="Filter by semester"),
    status: Optional[str] = Query(default=None, description="Filter by enrollment status"),
    pagination: PaginationParams = Depends(get_pagination),
    db: Session = Depends(get_db),
    current_user: Profile = Depends(get_current_user),
):
    """
    Search student directory.
    Privacy Rule:
    - Faculty and Admins receive full private details (including phone, email).
    - Students receive only permitted public fields (excluding phone, email, profile_id).
    """
    return StudentService.list_students(
        db=db,
        current_user=current_user,
        pagination=pagination,
        search=search,
        course_id=course_id,
        semester=semester,
        status_filter=status,
    )


@router.get("/{student_id}", response_model=Union[StudentPrivate, StudentPublic], summary="Get Student Details")
def get_student(
    student_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(get_current_user),
):
    """
    Get student record by ID.
    Privacy Rule:
    - Sensitive contact details (phone, email) are returned ONLY to staff or the student themselves.
    """
    return StudentService.get_student_by_id(db, student_id, current_user)


@router.post("", response_model=StudentPrivate, status_code=status.HTTP_201_CREATED, summary="Create Student Record")
def create_student(
    data: StudentCreate,
    db: Session = Depends(get_db),
    admin_user: Profile = Depends(require_role("admin")),
):
    """Register a new student in the college system. Restricted to Administrators."""
    return StudentService.create_student(db, data, admin_user)


@router.put("/{student_id}", response_model=StudentPrivate, summary="Update Student Record")
def update_student(
    student_id: uuid.UUID,
    data: StudentUpdate,
    db: Session = Depends(get_db),
    staff_user: Profile = Depends(require_role("admin", "teacher")),
):
    """Update student academic or contact details. Restricted to Faculty and Administrators."""
    return StudentService.update_student(db, student_id, data, staff_user)


@router.delete("/{student_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete Student Record")
def delete_student(
    student_id: uuid.UUID,
    db: Session = Depends(get_db),
    admin_user: Profile = Depends(require_role("admin")),
):
    """Remove student record. Restricted to Administrators."""
    StudentService.delete_student(db, student_id, admin_user)
    return None
