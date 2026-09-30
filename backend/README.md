# College AI Chatbot - Backend (FastAPI)

FastAPI-powered REST backend providing authentication, session management, and college chatbot business logic.

## Tech Stack
- **Framework**: FastAPI (Python 3)
- **ASGI Server**: Uvicorn
- **ORM**: SQLAlchemy 2.x
- **PostgreSQL Driver**: psycopg 3 (binary)
- **Validation**: Pydantic v2 & Pydantic-Settings
- **Authentication**: JWT (python-jose) & bcrypt (passlib)
- **Environment Management**: python-dotenv

## Directory Structure
```
backend/
├── app/
│   ├── main.py              # Application entrypoint & CORS middleware
│   ├── core/
│   │   ├── config.py        # Settings loaded from environment / .env
│   │   └── security.py      # JWT & bcrypt hashing utilities
│   ├── database/
│   │   └── session.py       # SQLAlchemy engine & session dependency
│   ├── models/
│   │   └── user.py          # SQLAlchemy ORM models
│   ├── schemas/
│   │   ├── health.py        # Pydantic schemas for health checks
│   │   └── user.py          # Pydantic schemas for user data
│   ├── routes/
│   │   ├── api.py           # Combined API router
│   │   └── health.py        # Health & database verification routes
│   └── services/
│       └── health_service.py# Business logic
├── .env                     # Local environment file (git-ignored)
├── .env.example             # Template environment variables
├── requirements.txt         # Production & development dependencies
└── README.md
```

## Running Backend on Windows

### 1. Create and Activate Virtual Environment
```powershell
cd C:\Users\SDX30\Desktop\clg-chatbot\backend
python -m venv venv
.\venv\Scripts\Activate.ps1
```
*(If script execution is disabled in PowerShell, use: `cmd /c "venv\Scripts\activate.bat"`)*

### 2. Install Dependencies
```powershell
pip install -r requirements.txt
```

### 3. Run FastAPI Development Server
```powershell
uvicorn app.main:app --reload --port 8000
```

### 4. Interactive Documentation
- Swagger UI: `http://localhost:8000/api/docs`
- ReDoc: `http://localhost:8000/api/redoc`
- Health check: `http://localhost:8000/api/health`
