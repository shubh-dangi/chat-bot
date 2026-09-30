"""
Global Unified Search Endpoint for College AI.
Enforces authentication, search rate limiting, and role-based student data redaction.
"""
from typing import Any, Dict, List
from fastapi import APIRouter, Depends, Query, Request
from sqlalchemy.orm import Session
from app.api.deps import get_current_user
from app.core.rate_limit import enforce_rate_limit
from app.database.session import get_db
from app.models.chat import Conversation
from app.models.document import Document
from app.models.student import Student
from app.models.user import User

router = APIRouter(prefix="/search", tags=["Global Search"])


@router.get("", summary="Unified search across students, conversations, and documents")
def unified_search(
    request: Request,
    q: str = Query(..., min_length=1, max_length=100, description="Search query string"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Dict[str, Any]:
    """
    Unified search returning matching resources.
    Protects student privacy: Only Teachers and Admins receive student search results.
    """
    enforce_rate_limit(request, category="search", custom_key=str(current_user.id))

    clean_term = q.strip().replace("%", "\\%").replace("_", "\\_")
    term = f"%{clean_term}%"

    # Search students (Restricted to Faculty and Admins)
    students = []
    if current_user.role in ("admin", "teacher", "faculty"):
        student_records = (
            db.query(Student)
            .filter(
                (Student.full_name.ilike(term))
                | (Student.student_id.ilike(term))
                | (Student.department.ilike(term))
            )
            .limit(10)
            .all()
        )
        students = [
            {
                "id": str(s.id),
                "name": s.full_name,
                "rollNumber": s.student_id,
                "department": s.department,
            }
            for s in student_records
        ]

    # Search documents (processed documents available to all authenticated users)
    doc_query = db.query(Document).filter(
        (Document.file_name.ilike(term)) | (Document.category.ilike(term))
    )
    if current_user.role not in ("admin", "teacher", "faculty"):
        doc_query = doc_query.filter(Document.status == "Processed")

    documents = [
        {
            "id": str(d.id),
            "filename": d.file_name,
            "type": d.category,
            "status": d.status,
        }
        for d in doc_query.limit(10).all()
    ]

    # Search user's own conversations strictly isolated to their user_id
    convs = (
        db.query(Conversation)
        .filter(
            Conversation.user_id == current_user.id,
            (Conversation.title.ilike(term)) | (Conversation.last_message_preview.ilike(term)),
        )
        .limit(10)
        .all()
    )
    conversations = [
        {"id": str(c.id), "title": c.title, "lastMessagePreview": c.last_message_preview}
        for c in convs
    ]

    return {
        "query": q,
        "results": {
            "students": students,
            "documents": documents,
            "conversations": conversations,
        },
    }
