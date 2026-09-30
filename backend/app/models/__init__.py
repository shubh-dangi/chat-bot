"""Database models package registering all core entities for College AI."""
from app.database.session import Base
from app.models.profile import Profile
from app.models.academic import Course, Subject
from app.models.chat import ChatSession, Conversation, Message, SharedChat
from app.models.document import Document, DocumentChunk
from app.models.audit import AuditLog

# Backward compatibility alias
User = Profile

__all__ = [
    "Base",
    "Profile",
    "User",
    "Course",
    "Subject",
    "ChatSession",
    "Conversation",
    "Message",
    "SharedChat",
    "Document",
    "DocumentChunk",
    "AuditLog",
]
