# College AI Chatbot (clg-chatbot)

A full-stack College AI Chatbot application designed for university students, faculty, and administrative inquiries.

> **Note on AI/LLM Integration**: This repository contains the complete frontend, backend, and PostgreSQL database environment. AI models (e.g. Gemini, OpenAI, Ollama, LangChain, or custom LLMs) will be integrated in the next stage.

---

## Project Structure

```
clg-chatbot/
├── frontend/             # React + Vite + TypeScript + Tailwind CSS + shadcn/ui
│   ├── src/
│   │   ├── components/   # Sidebar, ChatArea, BackendStatusBadge, UI components
│   │   ├── pages/        # ChatPage, NotFoundPage
│   │   ├── services/     # Axios API service (GET /api/health)
│   │   ├── types/        # TypeScript interfaces
│   │   └── lib/          # Utilities
│   ├── .env              # VITE_API_URL=http://localhost:8000
│   ├── .env.example
│   ├── package.json
│   └── vite.config.ts
├── backend/              # FastAPI + SQLAlchemy + PostgreSQL + JWT
│   ├── app/
│   │   ├── main.py       # FastAPI application, CORS, routers
│   │   ├── core/         # Settings (config.py), JWT & bcrypt (security.py)
│   │   ├── database/     # SQLAlchemy engine, session maker, get_db dependency
│   │   ├── models/       # SQLAlchemy ORM models (User)
│   │   ├── schemas/      # Pydantic schemas (Health, User)
│   │   ├── routes/       # API endpoints (/api/health, /api/health/db)
│   │   └── services/     # Business logic & health checks
│   ├── .env              # Local environment secrets & DB connection
│   ├── .env.example
│   ├── requirements.txt
│   └── README.md
├── database/             # PostgreSQL database resources
│   ├── init.sql          # Initial schema & sample tables
│   └── README.md         # Database guide (Local & Cloud Neon/Supabase)
└── README.md             # Project documentation & run guide
```

---

## Prerequisites (Windows)
- **Node.js**: v18+ (tested with v24.21.0)
- **Python**: 3.10+ (tested with Python 3.14.7)
- **PostgreSQL**: Local PostgreSQL or Cloud PostgreSQL (Neon / Supabase)

---

## Quick Start on Windows

### 1. Backend Setup (FastAPI)

Open a PowerShell or Command Prompt terminal:

```powershell
# Navigate to backend directory
cd C:\Users\SDX30\Desktop\clg-chatbot\backend

# Activate the existing virtual environment:
.\venv\Scripts\activate

# Run the FastAPI server:
uvicorn app.main:app --reload --port 8000
```

- **Health check URL**: `http://localhost:8000/api/health`
- **Interactive API Documentation (Swagger)**: `http://localhost:8000/api/docs`
- **ReDoc Documentation**: `http://localhost:8000/api/redoc`

---

### 2. Frontend Setup (React + Vite)

Open a second PowerShell or Command Prompt terminal:

```powershell
# Navigate to frontend directory
cd C:\Users\SDX30\Desktop\clg-chatbot\frontend

# Start Vite development server
npm.cmd run dev
```

- Open your browser at: `http://localhost:5173`
- The top-left and sidebar will display live backend connectivity (`GET /api/health`).

---

### 3. Database Configuration (PostgreSQL)

Edit `backend/.env` to configure your PostgreSQL credentials:

```env
# For Local PostgreSQL
DATABASE_URL=postgresql+psycopg://postgres:your_password@localhost:5432/college_ai

# Or for Cloud PostgreSQL (e.g., Neon or Supabase)
DATABASE_URL=postgresql+psycopg://user:password@ep-xyz.aws.neon.tech/neondb?sslmode=require
```

To initialize tables, run `database/init.sql` using `psql` or in your database dashboard.

---

## Verification Endpoints
- `GET /api/health`: Returns `{"status": "ok"}`
- `GET /api/health/db`: Tests live database connectivity to PostgreSQL