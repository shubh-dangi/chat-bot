# College AI Chatbot

A full-stack, production-grade campus assistant for students, faculty, and administrators. It combines an AI-style chat workspace, document knowledge base, shareable conversations, and a role-gated admin portal.

**Stack:** React + Vite + TypeScript + Tailwind CSS on the front, FastAPI + SQLAlchemy + JWT on the back, SQLite for zero-setup local dev and PostgreSQL/Supabase for production.

---

## Table of Contents

- [What It Does](#what-it-does)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [How a Request Flows](#how-a-request-flows)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Demo Accounts](#demo-accounts)
- [API Reference](#api-reference)
- [Security Model](#security-model)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## What It Does

| Area | Capability |
| --- | --- |
| **Auth** | JWT login/register, password reset, MFA (TOTP) enrolment endpoints, role-based access (student / teacher / admin) |
| **Chat** | Create, rename, delete and continue conversation threads; send messages, edit them, stream-style UI |
| **Sharing** | Generate a share token for a conversation and view it read-only at a public `/shared/:token` link |
| **Documents** | Upload and manage college documents, with status tracking (`uploaded` → `processed`) |
| **Admin** | User directory, student records, document oversight, audit log viewer, dashboard metrics |
| **Profile** | View/update own profile, manage account, change password |
| **Theming** | Light / dark / system theme, persisted locally |

> **On AI integration:** the chat, RAG, and AI service layers are scaffolded (`app/services/ai_service.py`, `app/services/rag_service.py`). Connecting a live LLM provider (Gemini / OpenAI / Ollama) is the next stage — see [Troubleshooting](#troubleshooting) for the current fallback behaviour.

---

## Tech Stack

### Frontend
- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** + **shadcn/ui**-style component primitives
- **Axios** for HTTP, **Zustand** for state
- **React Router v6** with lazy-loaded routes
- **oxlint** for linting, **Vitest** for unit tests

### Backend
- **FastAPI** (async lifespan, OpenAPI/Swagger)
- **SQLAlchemy 2.x** ORM
- **JWT** (HS256) via `python-jose`, **bcrypt** password hashing
- **Pydantic v2** + `pydantic-settings` for validation/config
- **pytest** + **httpx** for testing

### Data
- **SQLite** by default (`college_ai.db`) — zero config, ideal for dev/test
- **PostgreSQL / Supabase** supported by changing one env var
- `database/` holds a separate Supabase-oriented schema + seed set

---

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│  BROWSER  (React + Vite, :5173)                              │
│                                                              │
│   pages/            route-level screens (lazy loaded)       │
│   features/         auth, chat, share, profile, admin, settings│
│   shared/           ui components, hooks, services, config   │
│   stores/           zustand stores (auth, theme)             │
│                                                              │
│              apiClient (axios) ── attaches Bearer JWT        │
└────────────────────────────┬─────────────────────────────────┘
                             │  HTTP + JSON   (CORS allowlist)
┌────────────────────────────▼─────────────────────────────────┐
│  API  (FastAPI, :8000)                                       │
│                                                              │
│   core/middleware.py   security headers, payload size limit  │
│   core/rate_limit.py   per-category rate limiting             │
│   api/routes/          auth, chats, messages, shares,        │
│                        documents, users, profile, audit,     │
│                        health                                │
│   schemas/             pydantic request/response contracts   │
│   services/            business logic + audit logging        │
│   models/              SQLAlchemy ORM (Profile, Chat, ...)   │
│   database/            engine, session, get_db dependency    │
└────────────────────────────┬─────────────────────────────────┘
                             │  SQLAlchemy
                  ┌──────────▼───────────┐
                  │  SQLite (dev)        │
                  │  PostgreSQL (prod)   │
                  └──────────────────────┘
```

### Layering rules

1. **Routes** stay thin — parse input, enforce auth/roles, delegate.
2. **Services** own business logic, transactions, and audit events.
3. **Schemas** define the contract; the client never sees raw ORM objects.
4. **Models** are storage-only and never contain request logic.

---

## How a Request Flows

### Login (what the demo buttons do)

```
LoginForm "Demo Student" click
  └─> authService.login({ email, password: "password123" })
        └─> apiClient.post("/api/auth/login")
              │  axios request interceptor attaches Bearer JWT if one exists
              └─> FastAPI: enforce_rate_limit(auth)
                    └─> AuthService.login(credentials, db, ip)
                          ├─ look up User by lowercase email
                          ├─ bcrypt verify_password(...)      (seeds self-upgrade on first login)
                          ├─ reject if is_active is False
                          ├─ update last_active
                          ├─ AuditService.log_event("login_success")
                          └─ create_access_token(sub=user.id, claims={email, role, name})
                    ◂── 200 { user: {...}, token: "<jwt>" }
        └─<─  frontend reads `token` (falls back to `access_token`)
              ├─ tokenService.setToken(jwt)   → persisted to storage
              └─ authStore.setUser(user, token)
                    └─> router redirects to /chat
```

Subsequent calls re-attach the stored JWT automatically:

```
apiClient.get("/api/chats")
  └─> request interceptor: config.headers.Authorization = `Bearer <jwt>`
        └─> deps.get_current_user() decodes + validates the token
              └─> route handler runs with an authenticated User
```

### Protected vs. public routes

- **Public:** `/api/health`, `/api/health/db`, `POST /api/auth/*`, `GET /api/chats/shared/{token}`, `GET /api/shared/{token}`
- **Authenticated:** everything else — requires a valid, unexpired JWT
- **Role-gated:** `/api/users`, `/api/audit-logs` require `admin` (some allow `teacher`/`faculty`); admin UI additionally blocks non-admins client-side

---

## Project Structure

```
clg-chatbot/
├── backend/                        # FastAPI application
│   ├── app/
│   │   ├── main.py                 # app factory, CORS, exception handlers, startup seeding
│   │   ├── api/
│   │   │   ├── deps.py             # get_current_user, require_role
│   │   │   └── routes/             # auth, chats, messages, shares, documents,
│   │   │                           # users, profile, audit, health, api(aggregator)
│   │   ├── core/                   # config, security(JWT/bcrypt), exceptions,
│   │   │                           # rate_limit, middleware, logging, ssrf, file_security
│   │   ├── database/               # engine, session, Base, get_db
│   │   ├── models/                 # profile, chat, message, document, audit,
│   │   │                           # shared_chat, academic
│   │   ├── schemas/                # pydantic contracts per domain
│   │   ├── services/               # auth, chat, message, document, share,
│   │   │                           # profile, academic, ai, rag, audit, health
│   │   └── utils/
│   ├── tests/                      # 57 pytest tests
│   ├── .env                        # local config (git-ignored)
│   ├── .env.example
│   ├── requirements.txt
│   ├── alembic.ini
│   └── college_ai.db               # SQLite file, auto-created (git-ignored)
│
├── frontend/                       # React + Vite application
│   ├── src/
│   │   ├── app/                    # App.tsx, router.tsx, providers.tsx, global.css
│   │   ├── pages/                  # one file per route (lazy loaded)
│   │   ├── features/               # auth, chat, share, profile, admin, settings
│   │   ├── shared/                 # components/ui, config, hooks, services, types, utils
│   │   ├── layouts/                # app shell w/ collapsible sidebar
│   │   ├── stores/                 # zustand (auth, theme)
│   │   ├── lib/
│   │   └── types/
│   ├── .env                        # VITE_API_URL (git-ignored)
│   ├── vite.config.ts
│   └── package.json
│
├── database/                       # Supabase/Postgres schema + seed reference
│   ├── init.sql
│   ├── seed/seed.sql
│   └── database.md
│
├── docs/                           # security docs: threat model, authorization, checklist
├── design.md
├── theme.md
└── vercel.json                     # frontend hosting config
```

---

## Quick Start

### Prerequisites
- **Node.js 18+**
- **Python 3.10+**

No database installation needed — SQLite is the default.

### 1. Backend

```powershell
cd backend

# Create and activate a virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Create backend/.env (copy the template if you don't have one)
Copy-Item .env.example .env

# Start the API
uvicorn app.main:app --reload --port 8000
```

On startup the app creates the SQLite file, all tables, and seeds the demo users automatically. Verify:

- Health: http://localhost:8000/api/health
- Swagger UI: http://localhost:8000/api/docs
- ReDoc: http://localhost:8000/api/redoc

### 2. Frontend

```powershell
cd frontend

npm install

# Create frontend/.env if needed
Copy-Item .env.example .env      # VITE_API_URL=http://localhost:8000

npm run dev
```

Open http://localhost:5173 and sign in with a demo account.

### 3. Useful commands

```powershell
# Frontend
npm run dev       # dev server
npm run build     # typecheck (tsc -b) + production build
npm run lint      # oxlint
npm run test      # vitest

# Backend
uvicorn app.main:app --reload --port 8000
.\venv\Scripts\python.exe -m pytest -q
```

---

## Demo Accounts

Seeded automatically on first backend startup by `ensure_users_seeded()` in `backend/app/api/routes/users.py`. All demo users share the password **`password123`**.

The login screen has an **"instant demo sign-in"** panel — click a role and you are signed in immediately, no typing required.

| Role | Email | Password | Notes |
| --- | --- | --- | --- |
| Student | `student@college.edu` | `password123` | Default demo student (Alex Student) |
| Admin | `admin@college.edu` | `password123` | Full admin portal access |
| Teacher | `m.chen@college.edu` | `password123` | Faculty view |
| Teacher | `e.rostova@college.edu` | `password123` | Faculty view |
| Student | `jane.smith@college.edu` | `password123` | Secondary student |

**Where demo login lives:**
- Buttons: `frontend/src/features/auth/components/LoginForm.tsx` → `handleDemoLogin()`
- Request: `frontend/src/features/auth/services/authService.ts` → `authService.login()`
- Credentials: `backend/app/api/routes/users.py` → `INITIAL_SEED_USERS`
- Auth logic: `backend/app/services/auth_service.py` → `AuthService.login()`

> **Note:** the login response field is `token`. The client reads `token` and falls back to `access_token` for compatibility. If you change the auth contract, update `extractToken()` in `authService.ts`.

---

## API Reference

All routes are prefixed with `/api`. Authenticated routes require `Authorization: Bearer <jwt>`.

### Health
| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/health` | Liveness probe |
| GET | `/api/health/db` | Database connectivity check |

### Auth
| Method | Path | Description |
| --- | --- | --- |
| POST | `/api/auth/login` | Exchange credentials for a JWT |
| POST | `/api/auth/register` | Create a student account (role is always forced to `student`) |
| POST | `/api/auth/logout` | Log the audit event and clear session |
| POST | `/api/auth/forgot-password` | Request a reset (generic response, no enumeration) |
| POST | `/api/auth/reset-password` | Complete a reset |
| GET | `/api/auth/me` | Current authenticated profile |
| GET | `/api/auth/mfa/status` | MFA enrolment status |
| POST | `/api/auth/mfa/enroll` | Start TOTP enrolment |
| POST | `/api/auth/mfa/verify` | Activate a TOTP factor |

### Profile
| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/profile` · `/api/profile/me` | Read profile |
| PUT · PATCH | `/api/profile` | Update profile |
| DELETE | `/api/profile` | Delete own account (last-admin protected) |

### Chats & Messages
| Method | Path | Description |
| --- | --- | --- |
| GET · POST | `/api/chats` | List / create conversations |
| GET · PATCH · DELETE | `/api/chats/{conversation_id}` | Read / rename / delete |
| GET | `/api/chats/{conversation_id}/messages` | Message history |
| POST | `/api/chats/{conversation_id}/messages` | Send a message |
| PUT | `/api/chats/{conversation_id}/messages/{message_id}` | Edit a message |

### Sharing
| Method | Path | Description |
| --- | --- | --- |
| POST | `/api/chats/{conversation_id}/share` | Create a share link |
| DELETE | `/api/chats/{conversation_id}/share` | Revoke a share link |
| GET | `/api/chats/shared/{share_token}` | Read a shared chat (public) |
| GET | `/api/shared/{share_token}` | Public read-only shared view |

### Documents
| Method | Path | Description |
| --- | --- | --- |
| GET · POST | `/api/documents` | List / upload |
| DELETE | `/api/documents/{document_id}` | Delete |
| PATCH | `/api/documents/{document_id}/status` | Update processing status |

### Administration
| Method | Path | Description | Access |
| --- | --- | --- | --- |
| GET | `/api/users` | User directory | admin / teacher |
| PATCH | `/api/users/{user_id}` | Edit a user | admin |
| PATCH | `/api/users/{user_id}/status` | Activate / deactivate | admin |
| GET | `/api/audit-logs` | Audit trail | admin |

---

## Security Model

- **Passwords** — bcrypt via `passlib`; registration enforces 8+ chars with upper, lower, and digit.
- **Tokens** — HS256 JWT carrying `sub`, `email`, `role`, `name`, `department`, and an `exp` (7 days by default).
- **Password hashing on seed** — demo accounts that were created without a hash upgrade themselves to a real bcrypt hash on first successful login.
- **No self-promotion** — `POST /api/auth/register` always assigns the `student` role regardless of the payload. Admin accounts must be elevated by an existing admin.
- **Last-admin protection** — the final active administrator cannot be demoted or deleted.
- **Rate limiting** — enforced per category (`auth`, `search`, …) in `core/rate_limit.py`.
- **Security headers + payload size cap** — `core/middleware.py`.
- **SSRF and file-upload guards** — `core/ssrf.py` and `core/file_security.py` validate remote URLs and uploads.
- **Audit logging** — login success/failure, registration, role changes, and deletions are recorded to the audit log.
- **No enumeration** — forgot-password and reset endpoints return generic success responses.

Reference docs live in [`docs/security/`](docs/security/).

---

## Testing

```powershell
cd backend
.\venv\Scripts\python.exe -m pytest -q          # 57 tests
```

```powershell
cd frontend
npm run test                                    # vitest
npm run build                                   # tsc typecheck + build
```

Backend coverage spans auth, chats, messages, shares, documents, health, the database layer, and a dedicated security-controls suite (privilege escalation, rate limiting, SSRF, upload validation, last-admin lockout).

---

## Deployment

### Frontend (Vercel)
`vercel.json` is already configured. Set `VITE_API_URL` to your deployed API origin.

### Backend
Run with a production ASGI server and set real secrets:

```env
ENVIRONMENT=production
JWT_SECRET=<a long random secret, never the dev default>
DATABASE_URL=postgresql+psycopg://user:pass@host:5432/college_ai
BACKEND_CORS_ORIGINS=["https://your-frontend-domain.com"]
FRONTEND_URL=https://your-frontend-domain.com
```

> Never deploy the development `JWT_SECRET` or the seeded demo passwords to production, and remove the demo sign-in panel from the login screen.

---

## Troubleshooting

**`no such column: profiles.email` (500 on every request)**

The SQLite file predates a model change. `Base.metadata.create_all()` only creates missing *tables* — it never adds columns to existing ones. Delete the local database and let it rebuild:

```powershell
cd backend
Remove-Item -Force college_ai.db
uvicorn app.main:app --reload --port 8000
```

The file is git-ignored, so this only affects your machine. Use Alembic (`alembic.ini` is present) for real schema migrations.

**Login succeeds but the app still acts signed-out**

The token was not being read from the response. The API returns `token`; make sure the client reads `data.token` (see `extractToken()` in `authService.ts`). Open DevTools → Application → Local Storage and confirm the auth token key holds a JWT, not the string `undefined`.

**Backend reachable from the browser but requests fail CORS**

Add your frontend origin to `BACKEND_CORS_ORIGINS` in `backend/.env` as a JSON array, then restart the API.

**`ECONNREFUSED` on `/api/*`**

The backend is not running, or `VITE_API_URL` in `frontend/.env` points at the wrong host/port.

**Seed users missing**

They are only inserted when the `profiles` table is empty (`ensure_users_seeded`). Delete the DB to reseed, or register a new account.

**Chat replies are not AI-generated**

Expected — the AI/RAG services are scaffolded but no LLM provider is wired up yet. See `backend/app/services/ai_service.py` and `rag_service.py`.

---

## License

See repository settings. All data in `database/seed/seed.sql` is fictional and for development/testing only.
