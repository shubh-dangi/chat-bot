"""
Student Academic and Records Management Routes for College AI.
Enforces strict student privacy, least privilege, and role-based authorization.
"""
from typing import List, Optional, Union
from fastapi import APIRouter, Depends, Query, Request, status
from sqlalchemy.orm import Session
from app.api.deps import get_current_user, require_role
from app.core.rate_limit import enforce_rate_limit
from app.database.session import get_db
from app.models.user import User
from app.schemas.common import PaginatedResponse
from app.schemas.student import StudentCreate, StudentFilterParams, StudentResponse, StudentUpdate
from app.services.student_service import StudentService

router = APIRouter(prefix="/students", tags=["Students"])


@router.get("", response_model=Union[PaginatedResponse[StudentResponse], List[StudentResponse]], summary="Search and list students")
def list_students(
    request: Request,
    searchQuery: Optional[str] = Query(default="", alias="searchQuery"),
    department: Optional[str] = Query(default=None),
    year: Optional[str] = Query(default=None),
    status: Optional[str] = Query(default=None),
    page: int = Query(default=1, ge=1),
    pageSize: int = Query(default=20, ge=1, le=100),
    raw_list: bool = Query(default=False, description="Set true to return array instead of paginated object"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Search and filter student records.
    Restricted: Staff and Admins can query the directory; students can only view their own linked record.
    """
    enforce_rate_limit(request, category="search", custom_key=str(current_user.id))

    params = StudentFilterParams(
        searchQuery=searchQuery,
        department=department,
        year=year,
        status=status,
        page=page,
        pageSize=pageSize,
    )
    result = StudentService.get_students(params, db, current_user=current_user)
    if raw_list:
        return result.items
    return result


@router.get("/{student_id}", response_model=StudentResponse, summary="Get student details by ID")
def get_student(
    student_id: str,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> StudentResponse:
    """
    Retrieves full student profile.
    Enforces object-level authorization: Students may only access their own record.
    """
    enforce_rate_limit(request, category="search", custom_key=str(current_user.id))
    return StudentService.get_student_by_id(student_id, db, current_user=current_user)


@router.post("", response_model=StudentResponse, status_code=status.HTTP_201_CREATED, summary="Create new student record")
def create_student(
    payload: StudentCreate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_role("admin", "faculty", "teacher")),
) -> StudentResponse:
    """Enrolls and registers a new student record (Administrative & Faculty access only)."""
    return StudentService.create_student(payload, db, actor_id=admin_user.id)


@router.patch("/{student_id}", response_model=StudentResponse, summary="Update student record")
def update_student(
    student_id: str,
    payload: StudentUpdate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_role("admin", "faculty", "teacher")),
) -> StudentResponse:
    """Updates academic standing, GPA, or details for an enrolled student."""
    return StudentService.update_student(student_id, payload, db, actor_id=admin_user.id)
