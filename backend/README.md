# College AI — Production Backend

A high-performance, modular Python FastAPI SaaS backend powering **College AI**, an intelligent institutional assistant and student information portal.

---

## Architecture Overview

```text
React Frontend (Vite / Tailwind / shadcn)
                │
                ▼ REST API (JWT Bearer Token)
FastAPI Application Layer (Port 8000)
  ├── Core (Config, Structured Logging, Custom Exceptions, Security)
  ├── Database (SQLAlchemy 2.x Session Pooling & Multi-Dialect GUID)
  ├── API Routers (/api/auth, /chats, /messages, /students, /shares, /documents, /users, /search, /health)
  ├── Domain Services (Auth, Chat, Student, Share, Document, AI, RAG)
  └── Models & Schemas (User, Student, ChatSession, Message, SharedChat, Document)
                │
                ▼
Managed Infrastructure Layer (Supabase / Self-Hosted PostgreSQL)
  ├── PostgreSQL (Relational schema, row-level security, constraints)
  ├── Authentication (Supabase Auth JWT verification)
  └── Storage (Bucket: college-documents for PDFs & handbooks)
```

> **Security Note:** The backend strictly isolates sensitive keys. The `SUPABASE_SERVICE_ROLE_KEY` is exclusively consumed on the backend and never transmitted to client devices.

---

## Tech Stack

* **Framework:** Python 3 (Python 3.14+ compatible) & [FastAPI](https://fastapi.tiangolo.com/)
* **ORM:** [SQLAlchemy 2.x](https://www.sqlalchemy.org/) with declarative mapping and connection pooling
* **Database Drivers:** `psycopg` (binary v3) for PostgreSQL, SQLite for zero-config offline development
* **Migrations:** [Alembic](https://alembic.sqlalchemy.org/)
* **Validation & Settings:** Pydantic v2 & `pydantic-settings`
* **Security:** JWT authentication (`python-jose`) and `bcrypt` password hashing
* **Testing:** `pytest` and `pytest-asyncio` with isolated in-memory test database

---

## Backend Directory Structure

```text
backend/
├── alembic/                      # Database schema migration scripts
│   ├── versions/                 # Versioned migration revisions
│   └── env.py                    # Migration execution environment
├── app/
│   ├── main.py                   # FastAPI app instance, CORS, lifespan & error handlers
│   ├── core/
│   │   ├── config.py             # Pydantic Settings with Supabase & JWT keys
│   │   ├── exceptions.py         # SaaS domain exceptions & uniform JSON error handlers
│   │   ├── logging.py            # Centralized logging with sensitive token masking
│   │   └── security.py           # Bcrypt hashing & Supabase JWT verification
│   ├── database/
│   │   ├── session.py            # Engine, sessionmaker, connect timeouts & GUID decorator
│   │   └── dependencies.py       # FastAPI get_db dependency
│   ├── models/                   # SQLAlchemy ORM database models
│   │   ├── academic.py           # Course and Subject entities
│   │   ├── audit.py              # Administrative action audit logging
│   │   ├── chat.py               # ChatSession, Message, and SharedChat models
│   │   ├── document.py           # Document catalog and DocumentChunk entities
│   │   ├── profile.py            # Profile model (aliased as User)
│   │   └── student.py            # Student academic record entity
│   ├── schemas/                  # Pydantic request & response models
│   │   ├── auth.py               # Credentials, tokens, password resets
│   │   ├── chat.py               # Conversation threads and message payloads
│   │   ├── common.py             # ApiResponse envelope & PaginatedResponse
│   │   ├── document.py           # Document uploads and catalog items
│   │   ├── health.py             # Liveness and database connectivity schemas
│   │   ├── message.py            # Message send, edit, and assistant completion
│   │   ├── share.py              # Cryptographic share tokens and shared chat views
│   │   ├── student.py            # Student directory filters and student profiles
│   │   └── user.py               # User and profile schemas with camelCase aliases
│   ├── api/
│   │   ├── deps.py               # Auth dependency (get_current_user, require_role)
│   │   └── routes/
│   │       ├── api.py            # Central router aggregating domain endpoints
│   │       ├── auth.py           # POST /auth/login, register, forgot/reset password
│   │       ├── chats.py          # GET/POST/PATCH/DELETE /chats
│   │       ├── documents.py      # GET/POST/PATCH/DELETE /documents
│   │       ├── health.py         # GET /health and /health/db
│   │       ├── messages.py       # Message exchange and turn-by-turn editing
│   │       ├── profile.py        # Authenticated user self-service profile
│   │       ├── search.py         # Global search across students, documents, chats
│   │       ├── shares.py         # Share links creation, revocation, and public viewing
│   │       ├── students.py       # Student directory search, filter, and detail views
│   │       └── users.py          # User management and directory for administration
│   ├── services/                 # Decoupled business logic layer
│   │   ├── ai_service.py         # AIServiceInterface & institutional AI mock engine
│   │   ├── auth_service.py       # Authentication logic and JWT token generation
│   │   ├── chat_service.py       # Conversation management, branching & message history
│   │   ├── document_service.py   # Document metadata catalog and status tracking
│   │   ├── health_service.py     # Live database ping checks
│   │   ├── rag_service.py        # RAGServiceInterface & knowledge retrieval engine
│   │   ├── share_service.py      # Cryptographic URL generation and share lifecycle
│   │   └── student_service.py    # Academic records directory & multi-criteria filtering
│   └── utils/
│       ├── pagination.py         # Query pagination helper
│       └── validators.py         # Roll number, email, and input sanitization helpers
├── tests/                        # Comprehensive automated test suite
│   ├── conftest.py               # In-memory SQLite fixtures and test client
│   ├── test_auth.py              # Login, register, token, and permission tests
│   ├── test_chats.py             # Conversation lifecycle tests
│   ├── test_documents.py         # Document upload, status, and deletion tests
│   ├── test_health.py            # Liveness and database connectivity tests
│   ├── test_messages.py          # Message exchange and conversational branching tests
│   ├── test_shares.py            # Cryptographic share generation & revocation tests
│   └── test_students.py          # Student search, filtering, and role protection tests
├── .env.example                  # Documented environment configuration template
├── requirements.txt              # Locked backend dependencies
└── README.md                     # Documentation
```

---

## Quickstart (Windows PowerShell)

### 1. Activate Virtual Environment
```powershell
cd C:\Users\SDX30\Desktop\clg-chatbot\backend
.\venv\Scripts\Activate.ps1
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```powershell
Copy-Item .env.example .env
```

Review `.env` variables:
* `DATABASE_URL`: Set to `sqlite:///./college_ai.db` for instant local development without PostgreSQL, or provide your Supabase PostgreSQL pooler URL:
  `postgresql+psycopg://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`
* `JWT_SECRET`: Secret key used to sign and verify authentication tokens.
* `SUPABASE_URL` / `SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY`: Supabase project credentials.

### 3. Run the Development Server
```powershell
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The server automatically initializes database tables on startup.

---

## Interactive Documentation & Endpoints

Once the server is running, navigate to:
* **Interactive Swagger UI:** [http://localhost:8000/api/docs](http://localhost:8000/api/docs)
* **ReDoc Documentation:** [http://localhost:8000/api/redoc](http://localhost:8000/api/redoc)
* **OpenAPI Specification:** [http://localhost:8000/api/openapi.json](http://localhost:8000/api/openapi.json)

### Core REST Endpoints Summary

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Root service banner & sitemap | No |
| `GET` | `/api/health` | Liveness health check | No |
| `GET` | `/api/health/db` | Database connection status | No |
| `POST` | `/api/auth/login` | Email/password login | No |
| `POST` | `/api/auth/register` | User profile registration | No |
| `GET` | `/api/auth/me` | Fetch active user profile | Yes (Bearer) |
| `GET` | `/api/profile` | Current user profile | Yes (Bearer) |
| `PATCH` | `/api/profile` | Update user profile | Yes (Bearer) |
| `GET` | `/api/chats` | List conversation threads | Yes (Bearer) |
| `POST` | `/api/chats` | Create conversation | Yes (Bearer) |
| `GET` | `/api/chats/{id}` | Conversation details | Yes (Bearer) |
| `PATCH` | `/api/chats/{id}` | Rename conversation | Yes (Bearer) |
| `DELETE`| `/api/chats/{id}` | Delete conversation | Yes (Bearer) |
| `GET` | `/api/chats/{id}/messages` | List thread messages | Yes (Bearer) |
| `POST` | `/api/chats/{id}/messages` | Post message & get AI reply | Yes (Bearer) |
| `PUT` | `/api/chats/{id}/messages/{msg_id}` | Edit message & re-branch | Yes (Bearer) |
| `POST` | `/api/chats/{id}/share` | Generate public share link | Yes (Bearer) |
| `DELETE`| `/api/chats/{id}/share` | Revoke public share link | Yes (Bearer) |
| `GET` | `/api/shared/{token}` | Public shared chat view | No (Token) |
| `GET` | `/api/students` | Search and filter students | Optional |
| `GET` | `/api/students/{id}` | Student record details | Optional |
| `POST` | `/api/students` | Enroll student | Faculty / Admin |
| `PATCH` | `/api/students/{id}` | Update student record | Faculty / Admin |
| `GET` | `/api/documents` | List institutional documents | Yes (Bearer) |
| `POST` | `/api/documents` | Upload/register document | Faculty / Admin |
| `PATCH` | `/api/documents/{id}/status` | Update ingestion status | Admin |
| `DELETE`| `/api/documents/{id}` | Delete document | Admin |
| `GET` | `/api/users` | List managed users | Yes (Bearer) |
| `PATCH` | `/api/users/{id}/status` | Toggle user status | Faculty / Admin |
| `GET` | `/api/search` | Global unified search | Optional |

---

## Running Database Migrations (Alembic)

```powershell
# Create new autogenerated revision after modifying models
python -m alembic revision --autogenerate -m "Describe migration"

# Apply pending migrations to database
python -m alembic upgrade head
```

---

## Running Automated Tests

The test suite runs against an isolated in-memory database with pre-configured fixtures:

```powershell
python -m pytest -v
```

All 17 test suites (auth, chats, messages, shares, students, documents, health) pass in under 1 second.

---

## Connecting External AI / LLM Providers

The architecture isolates model generation behind the `AIServiceInterface` ([`app/services/ai_service.py`](file:///C:/Users/SDX30/Desktop/clg-chatbot/backend/app/services/ai_service.py)) and retrieval behind `RAGServiceInterface` ([`app/services/rag_service.py`](file:///C:/Users/SDX30/Desktop/clg-chatbot/backend/app/services/rag_service.py)).

When ready to integrate OpenAI, Google Gemini, Anthropic, or local Ollama:
1. Create a concrete class implementing `AIServiceInterface`:
   ```python
   class GeminiAIService(AIServiceInterface):
       async def generate_response(self, prompt: str, ...):
           # Call SDK here
           pass
   ```
2. Replace `ai_service = MockAIService()` with `ai_service = GeminiAIService()` in `app/services/ai_service.py`.
3. No router, controller, database model, or frontend code requires alteration.
