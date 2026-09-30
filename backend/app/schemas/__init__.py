from app.schemas.common import ApiResponse, PaginatedResponse, ApiErrorResponse, ApiErrorDetail
from app.schemas.health import HealthCheckResponse, DatabaseStatusResponse
from app.schemas.user import UserResponse, UserCreate, UserUpdate, UserProfileUpdate
from app.schemas.auth import LoginCredentials, RegisterCredentials, AuthResponse, PasswordResetRequest, PasswordResetConfirm
from app.schemas.student import StudentResponse, StudentCreate, StudentUpdate, StudentFilterParams
from app.schemas.chat import ConversationResponse, ConversationCreate, ConversationRenameRequest
from app.schemas.message import MessageResponse, SendMessageRequest, SendMessageResponse, EditMessageRequest
from app.schemas.share import ShareLinkResponse, SharedConversationResponse
from app.schemas.document import DocumentResponse, DocumentCreate

__all__ = [
    "ApiResponse",
    "PaginatedResponse",
    "ApiErrorResponse",
    "ApiErrorDetail",
    "HealthCheckResponse",
    "DatabaseStatusResponse",
    "UserResponse",
    "UserCreate",
    "UserUpdate",
    "UserProfileUpdate",
    "LoginCredentials",
    "RegisterCredentials",
    "AuthResponse",
    "PasswordResetRequest",
    "PasswordResetConfirm",
    "StudentResponse",
    "StudentCreate",
    "StudentUpdate",
    "StudentFilterParams",
    "ConversationResponse",
    "ConversationCreate",
    "ConversationRenameRequest",
    "MessageResponse",
    "SendMessageRequest",
    "SendMessageResponse",
    "EditMessageRequest",
    "ShareLinkResponse",
    "SharedConversationResponse",
    "DocumentResponse",
    "DocumentCreate",
]
