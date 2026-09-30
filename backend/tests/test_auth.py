def test_login_success(client):
    payload = {"email": "student@college.edu", "password": "password123"}
    response = client.post("/api/auth/login", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "token" in data
    assert "user" in data
    assert data["user"]["email"] == "student@college.edu"


def test_register_new_user(client):
    payload = {
        "name": "New Enrollee",
        "email": "new.enrollee@college.edu",
        "password": "SecurePassword123!",
        "department": "Physics",
    }
    response = client.post("/api/auth/register", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert "token" in data
    assert data["user"]["name"] == "New Enrollee"
    assert data["user"]["department"] == "Physics"


def test_register_duplicate_email(client, test_user):
    payload = {
        "name": "Duplicate User",
        "email": test_user.email,
        "password": "Password123!",
    }
    response = client.post("/api/auth/register", json=payload)
    assert response.status_code == 409
    data = response.json()
    assert "error" in data
    assert data["error"]["code"] == "DUPLICATE_RESOURCE"


def test_auth_me(client, auth_headers):
    response = client.get("/api/auth/me", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "student@college.edu"
    assert data["role"] == "student"


def test_auth_me_unauthorized(client):
    response = client.get("/api/auth/me")
    assert response.status_code == 401
    data = response.json()
    assert "error" in data
    assert data["error"]["code"] == "UNAUTHORIZED"
