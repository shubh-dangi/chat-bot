from typing import Any, Dict, List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.api.deps import get_optional_user
from app.database.session import get_db
from app.models.chat import Conversation
from app.models.document import Document
from app.models.student import Student
from app.models.user import User

router = APIRouter(prefix="/search", tags=["Global Search"])


@router.get("", summary="Unified search across students, conversations, and documents")
def unified_search(
    q: str = Query(..., min_length=1, description="Search query string"),
    db: Session = Depends(get_db),
    user: User = Depends(get_optional_user),
) -> Dict[str, Any]:
    """Unified search returning matching students, conversations, and institutional documents."""
    term = f"%{q.strip()}%"

    # Search students
    students = (
        db.query(Student)
        .filter(
            (Student.name.ilike(term))
            | (Student.roll_number.ilike(term))
            | (Student.department.ilike(term))
        )
        .limit(10)
        .all()
    )

    # Search documents
    documents = (
        db.query(Document)
        .filter((Document.filename.ilike(term)) | (Document.doc_type.ilike(term)))
        .limit(10)
        .all()
    )

    # Search user's own conversations if authenticated
    conversations = []
    if user:
        convs = (
            db.query(Conversation)
            .filter(
                Conversation.user_id == user.id,
                (Conversation.title.ilike(term)) | (Conversation.last_message_preview.ilike(term)),
            )
            .limit(10)
            .all()
        )
        conversations = [
            {"id": c.id, "title": c.title, "lastMessagePreview": c.last_message_preview}
            for c in convs
        ]

    return {
        "query": q,
        "results": {
            "students": [
                {
                    "id": s.id,
                    "name": s.name,
                    "rollNumber": s.roll_number,
                    "department": s.department,
                }
                for s in students
            ],
            "documents": [
                {
                    "id": d.id,
                    "filename": d.filename,
                    "type": d.doc_type,
                    "status": d.status,
                }
                for d in documents
            ],
            "conversations": conversations,
        },
    }
