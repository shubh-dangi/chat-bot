from fastapi import APIRouter
from app.api.routes.audit import router as audit_router
from app.api.routes.auth import router as auth_router
from app.api.routes.chats import router as chats_router
from app.api.routes.documents import router as documents_router
from app.api.routes.health import router as health_router
from app.api.routes.messages import router as messages_router
from app.api.routes.profile import router as profile_router
from app.api.routes.shares import router as shares_router
from app.api.routes.users import router as users_router

api_router = APIRouter()

# Register domain sub-routers
api_router.include_router(health_router)
api_router.include_router(auth_router)
api_router.include_router(profile_router)
api_router.include_router(users_router)
api_router.include_router(chats_router)
api_router.include_router(messages_router)
api_router.include_router(shares_router)
api_router.include_router(documents_router)
api_router.include_router(audit_router)
