from datetime import datetime, timezone
import uuid
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import relationship
from app.database.session import Base, GUID


def utcnow():
    return datetime.now(timezone.utc)


class Course(Base):
    """College degree programs (e.g. BCA, B.Tech, MCA, BBA)."""
    __tablename__ = "courses"

    id = Column(GUID, primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String(255), nullable=False, index=True)
    code = Column(String(50), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False)

    # Relationships
    subjects = relationship("Subject", back_populates="course", cascade="all, delete-orphan")


class Subject(Base):
    """Subjects belonging to a degree curriculum."""
    __tablename__ = "subjects"

    id = Column(GUID, primary_key=True, default=uuid.uuid4, index=True)
    course_id = Column(GUID, ForeignKey("courses.id", ondelete="RESTRICT"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    code = Column(String(50), nullable=False, index=True)
    semester = Column(Integer, nullable=False, index=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False)

    __table_args__ = (
        UniqueConstraint("course_id", "code", name="uq_course_subject_code"),
    )

    # Relationships
    course = relationship("Course", back_populates="subjects")
