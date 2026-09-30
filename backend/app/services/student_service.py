from typing import List, Optional
from sqlalchemy import or_
from sqlalchemy.orm import Session
from app.core.exceptions import DuplicateResourceException, EntityNotFoundException
from app.models.student import Student
from app.schemas.common import PaginatedResponse
from app.schemas.student import StudentCreate, StudentFilterParams, StudentResponse, StudentUpdate

DEFAULT_MOCK_STUDENTS = [
    {
        "id": "stu-101",
        "name": "Jane Smith",
        "roll_number": "CS-2022-042",
        "email": "jane.smith@college.edu",
        "phone": "+1 (555) 234-8921",
        "department": "Computer Science",
        "course": "BCA",
        "year": "Junior",
        "semester": 5,
        "gpa": 3.88,
        "enrollment_status": "Active",
        "avatar_url": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&q=80",
        "advisor_name": "Dr. Robert Vance",
        "joining_year": 2022,
    },
    {
        "id": "stu-102",
        "name": "Johnathan Doe",
        "roll_number": "MATH-2021-018",
        "email": "john.doe@college.edu",
        "phone": "+1 (555) 456-7812",
        "department": "Mathematics",
        "course": "B.Sc Mathematics",
        "year": "Senior",
        "semester": 7,
        "gpa": 3.65,
        "enrollment_status": "Active",
        "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&q=80",
        "advisor_name": "Prof. Elena Rostova",
        "joining_year": 2021,
    },
    {
        "id": "stu-103",
        "name": "Alice Johnson",
        "roll_number": "PHY-2024-009",
        "email": "alice.j@college.edu",
        "phone": "+1 (555) 678-9034",
        "department": "Physics",
        "course": "B.Sc Physics",
        "year": "Freshman",
        "semester": 1,
        "gpa": 3.92,
        "enrollment_status": "Active",
        "avatar_url": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=128&q=80",
        "advisor_name": "Dr. Marcus Chen",
        "joining_year": 2024,
    },
    {
        "id": "stu-104",
        "name": "Vikram Malhotra",
        "roll_number": "ENG-2023-088",
        "email": "vikram.m@college.edu",
        "phone": "+1 (555) 890-1234",
        "department": "Computer Science",
        "course": "B.Tech CSE",
        "year": "Sophomore",
        "semester": 3,
        "gpa": 3.42,
        "enrollment_status": "Active",
        "avatar_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&q=80",
        "advisor_name": "Prof. Anita Sharma",
        "joining_year": 2023,
    },
    {
        "id": "stu-105",
        "name": "Sarah Williams",
        "roll_number": "BIO-2021-031",
        "email": "s.williams@college.edu",
        "phone": "+1 (555) 345-6789",
        "department": "Life Sciences",
        "course": "B.Sc Biotechnology",
        "year": "Senior",
        "semester": 8,
        "gpa": 3.79,
        "enrollment_status": "Graduated",
        "avatar_url": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=128&q=80",
        "advisor_name": "Dr. Gregory House",
        "joining_year": 2021,
    },
    {
        "id": "stu-106",
        "name": "Devon Patel",
        "roll_number": "CS-2023-014",
        "email": "devon.p@college.edu",
        "phone": "+1 (555) 567-8901",
        "department": "Computer Science",
        "course": "BCA",
        "year": "Sophomore",
        "semester": 4,
        "gpa": 3.51,
        "enrollment_status": "On Leave",
        "avatar_url": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=128&q=80",
        "advisor_name": "Dr. Robert Vance",
        "joining_year": 2023,
    },
]


class StudentService:
    @staticmethod
    def ensure_seeded(db: Session) -> None:
        """Seed sample student records if table is currently empty."""
        count = db.query(Student).count()
        if count == 0:
            for s in DEFAULT_MOCK_STUDENTS:
                student = Student(
                    id=s["id"],
                    name=s["name"],
                    roll_number=s["roll_number"],
                    email=s["email"],
                    phone=s["phone"],
                    department=s["department"],
                    course=s["course"],
                    year=s["year"],
                    semester=s["semester"],
                    gpa=s["gpa"],
                    enrollment_status=s["enrollment_status"],
                    avatar_url=s["avatar_url"],
                    advisor_name=s["advisor_name"],
                    joining_year=s["joining_year"],
                )
                db.add(student)
            db.commit()

    @staticmethod
    def get_students(params: StudentFilterParams, db: Session) -> PaginatedResponse[StudentResponse]:
        StudentService.ensure_seeded(db)

        query = db.query(Student)

        if params.search_query:
            term = f"%{params.search_query.strip()}%"
            query = query.filter(
                or_(
                    Student.name.ilike(term),
                    Student.roll_number.ilike(term),
                    Student.email.ilike(term),
                    Student.department.ilike(term),
                )
            )

        if params.department and params.department.lower() != "all":
            query = query.filter(Student.department == params.department)

        if params.year and params.year.lower() != "all":
            query = query.filter(Student.year == params.year)

        if params.status and params.status.lower() != "all":
            query = query.filter(Student.enrollment_status == params.status)

        total = query.count()
        page = max(1, params.page)
        page_size = max(1, min(100, params.page_size))
        total_pages = (total + page_size - 1) // page_size if total > 0 else 1

        students = query.offset((page - 1) * page_size).limit(page_size).all()

        items = [
            StudentResponse(
                id=s.id,
                name=s.name,
                roll_number=s.roll_number,
                email=s.email,
                phone=s.phone,
                department=s.department,
                course=s.course,
                year=s.year,
                semester=s.semester,
                gpa=s.gpa,
                enrollment_status=s.enrollment_status,
                avatar_url=s.avatar_url,
                advisor_name=s.advisor_name,
                joining_year=s.joining_year,
            )
            for s in students
        ]

        return PaginatedResponse(
            items=items,
            total=total,
            page=page,
            pageSize=page_size,
            totalPages=total_pages,
        )

    @staticmethod
    def get_student_by_id(student_id: str, db: Session) -> StudentResponse:
        StudentService.ensure_seeded(db)
        student = db.query(Student).filter(Student.id == student_id).first()
        if not student:
            raise EntityNotFoundException("Student", student_id)

        return StudentResponse(
            id=student.id,
            name=student.name,
            roll_number=student.roll_number,
            email=student.email,
            phone=student.phone,
            department=student.department,
            course=student.course,
            year=student.year,
            semester=student.semester,
            gpa=student.gpa,
            enrollment_status=student.enrollment_status,
            avatar_url=student.avatar_url,
            advisor_name=student.advisor_name,
            joining_year=student.joining_year,
        )

    @staticmethod
    def create_student(data: StudentCreate, db: Session) -> StudentResponse:
        existing = db.query(Student).filter(
            or_(Student.roll_number == data.roll_number, Student.email == data.email)
        ).first()
        if existing:
            raise DuplicateResourceException("Student", "roll_number or email", data.roll_number)

        student = Student(
            name=data.name,
            roll_number=data.roll_number,
            email=data.email,
            phone=data.phone,
            department=data.department,
            course=data.course,
            year=data.year,
            semester=data.semester,
            gpa=data.gpa,
            enrollment_status=data.enrollment_status,
            avatar_url=data.avatar_url,
            advisor_name=data.advisor_name,
            joining_year=data.joining_year,
        )
        db.add(student)
        db.commit()
        db.refresh(student)

        return StudentResponse(
            id=student.id,
            name=student.name,
            roll_number=student.roll_number,
            email=student.email,
            phone=student.phone,
            department=student.department,
            course=student.course,
            year=student.year,
            semester=student.semester,
            gpa=student.gpa,
            enrollment_status=student.enrollment_status,
            avatar_url=student.avatar_url,
            advisor_name=student.advisor_name,
            joining_year=student.joining_year,
        )

    @staticmethod
    def update_student(student_id: str, data: StudentUpdate, db: Session) -> StudentResponse:
        student = db.query(Student).filter(Student.id == student_id).first()
        if not student:
            raise EntityNotFoundException("Student", student_id)

        update_dict = data.model_dump(exclude_unset=True)
        for key, val in update_dict.items():
            setattr(student, key, val)

        db.commit()
        db.refresh(student)

        return StudentResponse(
            id=student.id,
            name=student.name,
            roll_number=student.roll_number,
            email=student.email,
            phone=student.phone,
            department=student.department,
            course=student.course,
            year=student.year,
            semester=student.semester,
            gpa=student.gpa,
            enrollment_status=student.enrollment_status,
            avatar_url=student.avatar_url,
            advisor_name=student.advisor_name,
            joining_year=student.joining_year,
        )
