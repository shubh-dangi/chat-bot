from datetime import datetime, timezone
import uuid
from sqlalchemy import Column, DateTime, Float, Integer, String
from app.database.session import Base


def utcnow():
    return datetime.now(timezone.utc)


class Student(Base):
    """Student academic and profile entity."""

    __tablename__ = "students"

    id = Column(String(64), primary_key=True, index=True, default=lambda: f"stu-{uuid.uuid4().hex[:8]}")
    roll_number = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    phone = Column(String(50), nullable=True)
    department = Column(String(100), nullable=False, index=True)
    course = Column(String(100), nullable=False)
    year = Column(String(50), nullable=False, index=True)  # Freshman, Sophomore, Junior, Senior
    semester = Column(Integer, default=1, nullable=False)
    gpa = Column(Float, default=0.0, nullable=False)
    enrollment_status = Column(String(50), default="Active", nullable=False, index=True)  # Active, Graduated, On Leave, Suspended
    avatar_url = Column(String(500), nullable=True)
    advisor_name = Column(String(255), nullable=True)
    joining_year = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False)
