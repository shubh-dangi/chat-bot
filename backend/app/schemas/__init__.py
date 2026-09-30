"""Pydantic schemas package for College AI."""
from app.schemas.common import PaginationParams, PaginatedResponse
from app.schemas.profile import (
    ProfileBase,
    ProfileCreate,
    ProfileUpdate,
    ProfileResponse,
)
from app.schemas.academic import (
    CourseBase,
    CourseCreate,
    CourseUpdate,
    CourseResponse,
    SubjectBase,
    SubjectCreate,
    SubjectUpdate,
    SubjectResponse,
)
from app.schemas.student import (
    StudentBase,
    StudentCreate,
    StudentUpdate,
    StudentPublic,
    StudentPrivate,
)
from app.schemas.chat import (
    MessageBase,
    MessageCreate,
    MessageResponse,
    ChatSessionCreate,
    ChatSessionUpdate,
    ChatSessionResponse,
    SharedChatCreate,
    SharedChatResponse,
    SharedChatPublicView,
)
from app.schemas.document import (
    DocumentBase,
    DocumentCreate,
    DocumentUpdate,
    DocumentResponse,
    DocumentChunkBase,
    DocumentChunkCreate,
    DocumentChunkResponse,
)
from app.schemas.audit import AuditLogResponse
from app.schemas.health import HealthCheckResponse, DatabaseStatusResponse

__all__ = [
    "PaginationParams",
    "PaginatedResponse",
    "ProfileBase",
    "ProfileCreate",
    "ProfileUpdate",
    "ProfileResponse",
    "CourseBase",
    "CourseCreate",
    "CourseUpdate",
    "CourseResponse",
    "SubjectBase",
    "SubjectCreate",
    "SubjectUpdate",
    "SubjectResponse",
    "StudentBase",
    "StudentCreate",
    "StudentUpdate",
    "StudentPublic",
    "StudentPrivate",
    "MessageBase",
    "MessageCreate",
    "MessageResponse",
    "ChatSessionCreate",
    "ChatSessionUpdate",
    "ChatSessionResponse",
    "SharedChatCreate",
    "SharedChatResponse",
    "SharedChatPublicView",
    "DocumentBase",
    "DocumentCreate",
    "DocumentUpdate",
    "DocumentResponse",
    "DocumentChunkBase",
    "DocumentChunkCreate",
    "DocumentChunkResponse",
    "AuditLogResponse",
    "HealthCheckResponse",
    "DatabaseStatusResponse",
]
