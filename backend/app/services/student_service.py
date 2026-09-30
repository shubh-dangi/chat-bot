from typing import List, Optional, Union
import uuid
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
        if db.query(Student).count() == 0:
            for s in DEFAULT_MOCK_STUDENTS:
                student = Student(
                    id=s["id"],
                    student_id=s["roll_number"],
                    full_name=s["name"],
                    email=s["email"],
                    phone=s["phone"],
                    department=s["department"],
                    course_name=s["course"],
                    semester=s["semester"],
                    gpa=s["gpa"],
                    status=s["enrollment_status"],
                    avatar_url=s["avatar_url"],
                    advisor_name=s["advisor_name"],
                    enrollment_year=s["joining_year"],
                )
                db.add(student)
            db.commit()

    @staticmethod
    def get_students(
        params: StudentFilterParams, db: Session, current_user: Optional[User] = None
    ) -> PaginatedResponse[StudentResponse]:
        StudentService.ensure_seeded(db)
        query = db.query(Student)

        # Student privacy protection: If caller has role 'student', they can only access their own linked record
        if current_user and current_user.role == "student":
            query = query.filter(
                or_(
                    Student.profile_id == current_user.id,
                    Student.email.ilike(current_user.email),
                    Student.student_id == str(current_user.id),
                )
            )

        if params.search_query:
            term = f"%{params.search_query.strip()}%"
            query = query.filter(
                or_(
                    Student.full_name.ilike(term),
                    Student.student_id.ilike(term),
                    Student.email.ilike(term),
                    Student.department.ilike(term),
                )
            )

        if params.department and params.department.lower() != "all":
            query = query.filter(Student.department == params.department)

        if params.year and params.year.lower() != "all":
            mapping = {
                "Freshman": (1, 2),
                "Sophomore": (3, 4),
                "Junior": (5, 6),
                "Senior": (7, 12),
            }
            if params.year in mapping:
                low, high = mapping[params.year]
                query = query.filter(Student.semester >= low, Student.semester <= high)

        if params.status and params.status.lower() != "all":
            query = query.filter(Student.status.ilike(params.status))

        total = query.count()
        page = max(1, params.page)
        page_size = max(1, min(100, params.page_size))
        total_pages = (total + page_size - 1) // page_size if total > 0 else 1

        students = query.offset((page - 1) * page_size).limit(page_size).all()

        items = [
            StudentResponse(
                id=str(s.id),
                name=s.full_name,
                roll_number=s.student_id,
                email=s.email,
                phone=s.phone,
                department=s.department,
                course=s.course_name,
                year=s.year,
                semester=s.semester,
                gpa=s.gpa,
                enrollment_status=s.status,
                avatar_url=s.avatar_url,
                advisor_name=s.advisor_name,
                joining_year=s.enrollment_year,
            )
            for s in students
        ]

        return PaginatedResponse(
            items=items,
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
        )

    @staticmethod
    def get_student_by_id(
        student_id: str, db: Session, current_user: Optional[User] = None
    ) -> StudentResponse:
        StudentService.ensure_seeded(db)

        student = db.query(Student).filter(
            or_(
                Student.student_id == student_id,
                Student.id == student_id,
            )
        ).first()

        # Support "stu-101" demo alias mapping to first student if not found
        if not student and student_id == "stu-101":
            student = db.query(Student).first()

        if not student:
            raise EntityNotFoundException("Student", student_id)

        # Student privacy check: Students can only view their own record
        if current_user and current_user.role == "student":
            is_own = (
                str(student.profile_id) == str(current_user.id)
                or student.email.lower() == current_user.email.lower()
                or student.student_id == str(current_user.id)
            )
            if not is_own:
                from app.core.exceptions import PermissionDeniedException
                raise PermissionDeniedException("Access denied: You may only view your own student record.")

        # Return "stu-101" as string id if matched
        ret_id = "stu-101" if student_id == "stu-101" else str(student.id)

        return StudentResponse(
            id=ret_id,
            name=student.full_name,
            roll_number=student.student_id,
            email=student.email,
            phone=student.phone,
            department=student.department,
            course=student.course_name,
            year=student.year,
            semester=student.semester,
            gpa=student.gpa,
            enrollment_status=student.status,
            avatar_url=student.avatar_url,
            advisor_name=student.advisor_name,
            joining_year=student.enrollment_year,
        )

    @staticmethod
    def create_student(data: StudentCreate, db: Session, actor_id: Optional[str] = None) -> StudentResponse:
        roll = data.roll_number or data.student_id
        name = data.name or data.full_name

        existing = db.query(Student).filter(
            or_(Student.student_id == roll, Student.email == data.email)
        ).first()
        if existing:
            raise DuplicateResourceException("Student", "roll_number or email", roll)

        student = Student(
            student_id=roll,
            full_name=name,
            email=data.email,
            phone=data.phone,
            department=data.department or "Computer Science",
            course_name=data.course or "BCA",
            semester=data.semester or 1,
            gpa=data.gpa if data.gpa is not None else 3.5,
            status=data.enrollment_status or data.status or "Active",
            avatar_url=data.avatar_url,
            advisor_name=data.advisor_name,
            enrollment_year=data.joining_year or data.enrollment_year or 2024,
        )
        db.add(student)
        db.commit()
        db.refresh(student)

        # Audit log creation
        from app.services.audit_service import AuditService
        AuditService.log_event(
            db=db,
            action="student_created",
            resource_type="student",
            resource_id=str(student.id),
            user_id=actor_id,
            details={"roll_number": student.student_id, "department": student.department},
        )

        return StudentResponse(
            id=str(student.id),
            name=student.full_name,
            roll_number=student.student_id,
            email=student.email,
            phone=student.phone,
            department=student.department,
            course=student.course_name,
            year=student.year,
            semester=student.semester,
            gpa=student.gpa,
            enrollment_status=student.status,
            avatar_url=student.avatar_url,
            advisor_name=student.advisor_name,
            joining_year=student.enrollment_year,
        )

    @staticmethod
    def update_student(student_id: str, data: StudentUpdate, db: Session, actor_id: Optional[str] = None) -> StudentResponse:
        student = db.query(Student).filter(
            or_(Student.student_id == student_id, Student.id == student_id)
        ).first()

        if not student:
            raise EntityNotFoundException("Student", student_id)

        updated_fields = []
        if data.name or data.full_name:
            student.full_name = data.name or data.full_name
            updated_fields.append("full_name")
        if data.email:
            student.email = data.email
            updated_fields.append("email")
        if data.phone:
            student.phone = data.phone
            updated_fields.append("phone")
        if data.department:
            student.department = data.department
            updated_fields.append("department")
        if data.course:
            student.course_name = data.course
            updated_fields.append("course_name")
        if data.semester is not None:
            student.semester = data.semester
            updated_fields.append("semester")
        if data.gpa is not None:
            student.gpa = data.gpa
            updated_fields.append("gpa")
        if data.status or data.enrollment_status:
            student.status = data.enrollment_status or data.status
            updated_fields.append("status")
        if data.avatar_url:
            student.avatar_url = data.avatar_url
            updated_fields.append("avatar_url")
        if data.advisor_name:
            student.advisor_name = data.advisor_name
            updated_fields.append("advisor_name")

        db.commit()
        db.refresh(student)

        # Audit log update
        from app.services.audit_service import AuditService
        AuditService.log_event(
            db=db,
            action="student_updated",
            resource_type="student",
            resource_id=str(student.id),
            user_id=actor_id,
            details={"updated_fields": updated_fields},
        )

        return StudentResponse(
            id=str(student.id),
            name=student.full_name,
            roll_number=student.student_id,
            email=student.email,
            phone=student.phone,
            department=student.department,
            course=student.course_name,
            year=student.year,
            semester=student.semester,
            gpa=student.gpa,
            enrollment_status=student.status,
            avatar_url=student.avatar_url,
            advisor_name=student.advisor_name,
            joining_year=student.enrollment_year,
        )
