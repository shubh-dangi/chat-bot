from typing import Optional
from pydantic import BaseModel, ConfigDict, EmailStr, Field


class StudentBase(BaseModel):
    name: str
    roll_number: str = Field(..., alias="rollNumber")
    email: EmailStr
    phone: Optional[str] = None
    department: str
    course: str
    year: str  # Freshman, Sophomore, Junior, Senior
    semester: int = 1
    gpa: float = 0.0
    enrollment_status: str = Field(default="Active", alias="enrollmentStatus")
    avatar_url: Optional[str] = Field(default=None, alias="avatarUrl")
    advisor_name: Optional[str] = Field(default=None, alias="advisorName")
    joining_year: Optional[int] = Field(default=None, alias="joiningYear")

    model_config = ConfigDict(populate_by_name=True)


class StudentCreate(StudentBase):
    pass


class StudentUpdate(BaseModel):
    name: Optional[str] = None
    roll_number: Optional[str] = Field(default=None, alias="rollNumber")
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    department: Optional[str] = None
    course: Optional[str] = None
    year: Optional[str] = None
    semester: Optional[int] = None
    gpa: Optional[float] = None
    enrollment_status: Optional[str] = Field(default=None, alias="enrollmentStatus")
    avatar_url: Optional[str] = Field(default=None, alias="avatarUrl")
    advisor_name: Optional[str] = Field(default=None, alias="advisorName")
    joining_year: Optional[int] = Field(default=None, alias="joiningYear")

    model_config = ConfigDict(populate_by_name=True)


class StudentResponse(StudentBase):
    id: str

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class StudentFilterParams(BaseModel):
    search_query: Optional[str] = Field(default="", alias="searchQuery")
    department: Optional[str] = None
    year: Optional[str] = None
    status: Optional[str] = None
    page: int = 1
    page_size: int = Field(default=20, alias="pageSize")

    model_config = ConfigDict(populate_by_name=True)
