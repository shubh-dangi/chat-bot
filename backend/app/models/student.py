from datetime import datetime, timezone
import uuid
from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from app.database.session import Base, GUID


def utcnow():
    return datetime.now(timezone.utc)


class Student(Base):
    """
    Official college student academic and demographic records.
    Restricted privacy: Public vs Private information boundaries enforced in service layer.
    """
    __tablename__ = "students"

    id = Column(GUID, primary_key=True, default=uuid.uuid4, index=True)
    profile_id = Column(GUID, ForeignKey("profiles.id", ondelete="SET NULL"), nullable=True, index=True)
    student_id = Column(String(50), unique=True, nullable=False, index=True)
    full_name = Column(String(255), nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    phone = Column(String(50), nullable=True)
    department = Column(String(100), default="Computer Science", nullable=False, index=True)
    course_name = Column(String(100), default="BCA", nullable=False)
    course_id = Column(GUID, ForeignKey("courses.id", ondelete="RESTRICT"), nullable=True, index=True)
    semester = Column(Integer, nullable=False, default=1, index=True)
    division = Column(String(10), default="A", nullable=False)
    enrollment_year = Column(Integer, nullable=False, default=2024)
    gpa = Column(Float, default=3.5, nullable=False)
    status = Column(String(50), default="Active", nullable=False, index=True)  # Active, Graduated, On Leave, Suspended
    avatar_url = Column(String(500), nullable=True)
    advisor_name = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False)

    # Relationships
    profile = relationship("Profile", back_populates="students")
    course_rel = relationship("Course", back_populates="students")

    @property
    def roll_number(self) -> str:
        return self.student_id

    @roll_number.setter
    def roll_number(self, value: str):
        self.student_id = value

    @property
    def name(self) -> str:
        return self.full_name

    @name.setter
    def name(self, value: str):
        self.full_name = value

    @property
    def course(self) -> str:
        return self.course_name

    @course.setter
    def course(self, value: str):
        self.course_name = value

    @property
    def enrollment_status(self) -> str:
        return self.status

    @enrollment_status.setter
    def enrollment_status(self, value: str):
        self.status = value

    @property
    def joining_year(self) -> int:
        return self.enrollment_year

    @joining_year.setter
    def joining_year(self, value: int):
        self.enrollment_year = value

    @property
    def year(self) -> str:
        if self.semester <= 2:
            return "Freshman"
        elif self.semester <= 4:
            return "Sophomore"
        elif self.semester <= 6:
            return "Junior"
        else:
            return "Senior"

    @year.setter
    def year(self, value: str):
        mapping = {"Freshman": 1, "Sophomore": 3, "Junior": 5, "Senior": 7}
        if value in mapping and self.semester == 1:
            self.semester = mapping[value]
