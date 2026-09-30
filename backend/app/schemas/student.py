from datetime import datetime
from typing import Optional, Union
import uuid
from pydantic import BaseModel, ConfigDict, EmailStr, Field


class StudentBase(BaseModel):
    student_id: Optional[str] = Field(default=None, min_length=1, max_length=50)
    full_name: Optional[str] = Field(default=None, min_length=1, max_length=255)
    name: Optional[str] = None
    roll_number: Optional[str] = Field(default=None, alias="rollNumber")
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(default=None, max_length=50)
    department: Optional[str] = "Computer Science"
    course: Optional[str] = "BCA"
    course_id: Optional[uuid.UUID] = None
    year: Optional[str] = "Junior"
    semester: int = Field(default=1, ge=1, le=12)
    division: Optional[str] = Field(default="A", max_length=10)
    enrollment_year: Optional[int] = Field(default=2024, ge=2000, le=2100)
    joining_year: Optional[int] = Field(default=2024, alias="joiningYear")
    gpa: float = 3.5
    status: Optional[str] = Field(default="active")
    enrollment_status: Optional[str] = Field(default="Active", alias="enrollmentStatus")
    avatar_url: Optional[str] = Field(default=None, alias="avatarUrl")
    advisor_name: Optional[str] = Field(default=None, alias="advisorName")
    profile_id: Optional[uuid.UUID] = None

    model_config = ConfigDict(populate_by_name=True)


class StudentCreate(StudentBase):
    pass


class StudentUpdate(BaseModel):
    full_name: Optional[str] = Field(default=None, min_length=1, max_length=255)
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(default=None, max_length=50)
    department: Optional[str] = None
    course: Optional[str] = None
    course_id: Optional[uuid.UUID] = None
    semester: Optional[int] = Field(default=None, ge=1, le=12)
    division: Optional[str] = Field(default=None, max_length=10)
    year: Optional[str] = None
    gpa: Optional[float] = None
    status: Optional[str] = None
    enrollment_status: Optional[str] = Field(default=None, alias="enrollmentStatus")
    avatar_url: Optional[str] = Field(default=None, alias="avatarUrl")
    advisor_name: Optional[str] = Field(default=None, alias="advisorName")
    joining_year: Optional[int] = Field(default=None, alias="joiningYear")
    profile_id: Optional[uuid.UUID] = None

    model_config = ConfigDict(populate_by_name=True)


class StudentResponse(BaseModel):
    id: Union[uuid.UUID, str]
    name: str = Field(..., alias="name")
    roll_number: str = Field(..., alias="rollNumber")
    email: Optional[str] = None
    phone: Optional[str] = None
    department: Optional[str] = "Computer Science"
    course: Optional[str] = "BCA"
    year: Optional[str] = "Junior"
    semester: int = 1
    gpa: float = 3.5
    enrollment_status: str = Field(default="Active", alias="enrollmentStatus")
    avatar_url: Optional[str] = Field(default=None, alias="avatarUrl")
    advisor_name: Optional[str] = Field(default=None, alias="advisorName")
    joining_year: Optional[int] = Field(default=2024, alias="joiningYear")

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class StudentFilterParams(BaseModel):
    search_query: Optional[str] = Field(default="", alias="searchQuery")
    department: Optional[str] = None
    year: Optional[str] = None
    status: Optional[str] = None
    page: int = 1
    page_size: int = Field(default=20, alias="pageSize")

    model_config = ConfigDict(populate_by_name=True)


class StudentPublic(StudentBase):
    id: uuid.UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class StudentPrivate(StudentBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
