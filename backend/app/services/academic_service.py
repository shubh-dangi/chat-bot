import math
from typing import List, Optional
import uuid
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.models.academic import Course, Subject
from app.schemas.academic import CourseCreate, CourseUpdate, SubjectCreate, SubjectUpdate
from app.schemas.common import PaginatedResponse, PaginationParams


class AcademicService:
    @staticmethod
    def get_courses(db: Session, pagination: PaginationParams) -> PaginatedResponse[Course]:
        query = db.query(Course)
        total = query.count()
        items = query.order_by(Course.code.asc()).offset(pagination.offset).limit(pagination.page_size).all()
        total_pages = math.ceil(total / pagination.page_size) if total > 0 else 0
        return PaginatedResponse(
            items=items,
            total=total,
            page=pagination.page,
            page_size=pagination.page_size,
            total_pages=total_pages,
        )

    @staticmethod
    def get_course_by_id(db: Session, course_id: uuid.UUID) -> Optional[Course]:
        return db.query(Course).filter(Course.id == course_id).first()

    @staticmethod
    def create_course(db: Session, data: CourseCreate) -> Course:
        existing = db.query(Course).filter(Course.code == data.code.strip().upper()).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Course with code '{data.code}' already exists",
            )
        course = Course(
            name=data.name.strip(),
            code=data.code.strip().upper(),
            description=data.description,
        )
        db.add(course)
        db.commit()
        db.refresh(course)
        return course

    @staticmethod
    def get_subjects_by_course(
        db: Session, course_id: uuid.UUID, semester: Optional[int] = None
    ) -> List[Subject]:
        query = db.query(Subject).filter(Subject.course_id == course_id)
        if semester:
            query = query.filter(Subject.semester == semester)
        return query.order_by(Subject.semester.asc(), Subject.code.asc()).all()

    @staticmethod
    def create_subject(db: Session, data: SubjectCreate) -> Subject:
        course = db.query(Course).filter(Course.id == data.course_id).first()
        if not course:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Referenced course not found",
            )
        existing = (
            db.query(Subject)
            .filter(Subject.course_id == data.course_id, Subject.code == data.code.strip().upper())
            .first()
        )
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Subject with code '{data.code}' already exists in this course",
            )
        subject = Subject(
            course_id=data.course_id,
            name=data.name.strip(),
            code=data.code.strip().upper(),
            semester=data.semester,
            description=data.description,
        )
        db.add(subject)
        db.commit()
        db.refresh(subject)
        return subject
