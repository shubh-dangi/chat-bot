import os
import sys

# Ensure backend directory is in python module search path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

# Set testing environment variables before importing app
os.environ["ENVIRONMENT"] = "testing"
os.environ["DATABASE_URL"] = "sqlite:///:memory:"

from app.api.deps import get_db
from app.api.routes.users import ensure_users_seeded
from app.core.security import create_access_token, hash_password
from app.database.session import Base
from app.main import app
from app.models import Profile, User, Document
from app.services.document_service import DocumentService

# In-memory SQLite engine for fast, isolated tests
test_engine = create_engine(
    "sqlite:///:memory:",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    Base.metadata.create_all(bind=test_engine)
    with TestingSessionLocal() as db:
        ensure_users_seeded(db)
        DocumentService.ensure_seeded(db)
    yield
    Base.metadata.drop_all(bind=test_engine)


@pytest.fixture
def db_session():
    connection = test_engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)

    yield session

    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


@pytest.fixture
def test_user(db_session):
    user = db_session.query(User).filter(User.email == "student@college.edu").first()
    if not user:
        user = User(
            id="usr-test-student",
            email="student@college.edu",
            name="Alex Student",
            role="student",
            department="Computer Science",
            hashed_password=hash_password("password123"),
            is_active=True,
        )
        db_session.add(user)
        db_session.commit()
        db_session.refresh(user)
    elif not user.hashed_password:
        user.hashed_password = hash_password("password123")
        db_session.commit()
    return user


@pytest.fixture
def admin_user(db_session):
    user = db_session.query(User).filter(User.email == "admin@college.edu").first()
    if not user:
        user = User(
            id="usr-test-admin",
            email="admin@college.edu",
            name="Dr. Administrator",
            role="admin",
            department="Administration",
            hashed_password=hash_password("password123"),
            is_active=True,
        )
        db_session.add(user)
        db_session.commit()
        db_session.refresh(user)
    elif not user.hashed_password:
        user.hashed_password = hash_password("password123")
        db_session.commit()
    return user


@pytest.fixture
def auth_headers(test_user):
    token = create_access_token(
        subject=test_user.id,
        claims={"email": test_user.email, "role": test_user.role, "name": test_user.name},
    )
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def teacher_user(db_session):
    user = db_session.query(User).filter(User.email == "teacher@college.edu").first()
    if not user:
        user = User(
            id="usr-test-teacher",
            email="teacher@college.edu",
            name="Prof. Sharma",
            role="teacher",
            department="Computer Science",
            hashed_password=hash_password("password123"),
            is_active=True,
        )
        db_session.add(user)
        db_session.commit()
        db_session.refresh(user)
    elif not user.hashed_password:
        user.hashed_password = hash_password("password123")
        db_session.commit()
    return user


@pytest.fixture
def teacher_headers(teacher_user):
    token = create_access_token(
        subject=teacher_user.id,
        claims={"email": teacher_user.email, "role": teacher_user.role, "name": teacher_user.name},
    )
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def other_student_user(db_session):
    user = db_session.query(User).filter(User.email == "other@college.edu").first()
    if not user:
        user = User(
            id="usr-test-other",
            email="other@college.edu",
            name="Other Student",
            role="student",
            department="Mathematics",
            hashed_password=hash_password("password123"),
            is_active=True,
        )
        db_session.add(user)
        db_session.commit()
        db_session.refresh(user)
    elif not user.hashed_password:
        user.hashed_password = hash_password("password123")
        db_session.commit()
    return user


@pytest.fixture
def other_student_headers(other_student_user):
    token = create_access_token(
        subject=other_student_user.id,
        claims={"email": other_student_user.email, "role": other_student_user.role, "name": other_student_user.name},
    )
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def admin_headers(admin_user):
    token = create_access_token(
        subject=admin_user.id,
        claims={"email": admin_user.email, "role": admin_user.role, "name": admin_user.name},
    )
    return {"Authorization": f"Bearer {token}"}
