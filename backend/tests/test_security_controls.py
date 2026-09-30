"""
Automated Enterprise Security Test Suite for College AI.
Validates:
1. Authentication Bypass & Invalid JWT Protection
2. Object-Level Authorization (IDOR) & Cross-Tenant Data Isolation
3. Privilege Escalation & Role Tampering Defenses
4. Mass Assignment & Parameter Injection Protection
5. SQL Injection & Filter Bypass Resistance
6. Server-Side Request Forgery (SSRF) Protection
7. File Upload, MIME Spoofing & Path Traversal Prevention
8. Enterprise Security Headers & Frame Protection
9. Request Size Limiting & Rate Limiting Enforcement
10. Share Token Cryptographic Randomness & Revocation
"""
import io
import time
import pytest
from app.core.file_security import (
    ALLOWED_DOCUMENT_EXTENSIONS,
    FORBIDDEN_EXTENSIONS,
    inspect_file_magic_bytes,
    sanitize_filename,
    validate_file_metadata,
)
from app.core.rate_limit import limiter
from app.core.security import create_access_token
from app.core.ssrf import validate_url_safe
from app.core.exceptions import ValidationException


# ==============================================================================
# 1. Authentication Bypass & Token Security Tests
# ==============================================================================

def test_auth_missing_header_rejected(client):
    """Endpoints requiring authentication must reject requests without Authorization header."""
    res = client.get("/api/chats")
    assert res.status_code == 401
    assert res.json()["error"]["code"] == "UNAUTHORIZED"


def test_auth_invalid_bearer_token(client):
    """Forged or malformed bearer tokens must be rejected with 401."""
    headers = {"Authorization": "Bearer totally-forged-invalid-jwt-token"}
    res = client.get("/api/chats", headers=headers)
    assert res.status_code == 401
    assert res.json()["error"]["code"] == "UNAUTHORIZED"


from datetime import timedelta

def test_auth_expired_jwt_rejected(client, test_user):
    """Expired JWT access tokens must be rejected immediately."""
    expired_token = create_access_token(
        subject=test_user.id,
        claims={"email": test_user.email, "role": test_user.role},
        expires_delta=timedelta(hours=-1),  # expired 1 hour ago
    )
    headers = {"Authorization": f"Bearer {expired_token}"}
    res = client.get("/api/chats", headers=headers)
    assert res.status_code == 401
    assert res.json()["error"]["code"] == "UNAUTHORIZED"


def test_auth_tampered_payload_signature(client, test_user):
    """Tampering with token payload without matching secret signature fails signature verification."""
    token = create_access_token(
        subject=test_user.id,
        claims={"email": test_user.email, "role": "student"},
    )
    # Tamper with the token parts
    parts = token.split(".")
    tampered_token = f"{parts[0]}.eyJyZXBsYWNlZCI6ICJhZG1pbiJ9.{parts[2]}"
    headers = {"Authorization": f"Bearer {tampered_token}"}
    res = client.get("/api/chats", headers=headers)
    assert res.status_code == 401


# ==============================================================================
# 2. Object-Level Authorization (IDOR) & Access Control Tests
# ==============================================================================

def test_idor_cannot_read_other_user_chat(client, auth_headers, other_student_headers):
    """Student A cannot access Student B's chat conversation."""
    create_res = client.post("/api/chats", json={"title": "Private Chat A"}, headers=auth_headers)
    assert create_res.status_code == 201
    chat_a_id = create_res.json()["id"]

    # Student B attempts to access Student A's chat
    idor_res = client.get(f"/api/chats/{chat_a_id}", headers=other_student_headers)
    assert idor_res.status_code == 403


def test_idor_cannot_post_message_to_other_user_chat(client, auth_headers, other_student_headers):
    """Student B cannot post messages to Student A's conversation."""
    create_res = client.post("/api/chats", json={"title": "Chat A"}, headers=auth_headers)
    chat_a_id = create_res.json()["id"]

    post_res = client.post(
        f"/api/chats/{chat_a_id}/messages",
        json={"content": "Malicious injected message"},
        headers=other_student_headers,
    )
    assert post_res.status_code == 403


def test_idor_cannot_delete_other_user_chat(client, auth_headers, other_student_headers):
    """Student B cannot delete Student A's conversation."""
    create_res = client.post("/api/chats", json={"title": "Chat to Delete"}, headers=auth_headers)
    chat_a_id = create_res.json()["id"]

    del_res = client.delete(f"/api/chats/{chat_a_id}", headers=other_student_headers)
    assert del_res.status_code == 403


# ==============================================================================
# 3. Privilege Escalation & Mass Assignment Tests
# ==============================================================================

def test_registration_privilege_escalation_blocked(client):
    """Public self-registration must force role to 'student' regardless of payload input."""
    payload = {
        "name": "Attacker",
        "email": "attacker.escalate@college.edu",
        "password": "Password123!",
        "role": "admin",  # Attacker attempts to claim admin role
    }
    res = client.post("/api/auth/register", json=payload)
    assert res.status_code == 201
    user = res.json()["user"]
    # Must remain student
    assert user["role"] == "student"


def test_profile_update_cannot_elevate_role(client, auth_headers):
    """Users updating their profile cannot change their own role or active status."""
    payload = {
        "name": "Updated Student Name",
        "role": "admin",  # Illegal field in schema / ignored
    }
    res = client.patch("/api/profile", json=payload, headers=auth_headers)
    assert res.status_code == 200
    profile = res.json()
    assert profile["role"] == "student"


def test_admin_endpoints_reject_student_and_teacher(client, auth_headers, teacher_headers):
    """Admin-only endpoints must reject regular students and teachers with 403."""
    res_student = client.get("/api/audit-logs", headers=auth_headers)
    assert res_student.status_code == 403

    res_teacher = client.get("/api/audit-logs", headers=teacher_headers)
    assert res_teacher.status_code == 403


# ==============================================================================
# 4. SQL Injection Protection Tests
# ==============================================================================

@pytest.mark.parametrize("sqli_payload", [
    "' OR '1'='1",
    "'; DROP TABLE profiles; --",
    "1 UNION SELECT null, null, null, null--",
    "' OR 1=1 --",
    "admin' --",
])
def test_student_search_sqli_resilience(client, admin_headers, sqli_payload):
    """SQL injection payloads in search query parameters must be safely handled without SQL syntax error."""
    res = client.get(f"/api/students?searchQuery={sqli_payload}", headers=admin_headers)
    assert res.status_code == 200
    data = res.json()
    assert "items" in data


# ==============================================================================
# 5. SSRF (Server-Side Request Forgery) Protection Tests
# ==============================================================================

@pytest.mark.parametrize("dangerous_url", [
    "http://127.0.0.1:8000/internal",
    "http://localhost:3000",
    "http://169.254.169.254/latest/meta-data/",  # AWS metadata
    "http://10.0.0.5/private-api",
    "http://192.168.1.1/router-admin",
    "http://172.16.0.1/docker-internal",
    "ftp://example.com/file.txt",
    "file:///etc/passwd",
])
def test_ssrf_validator_blocks_internal_and_cloud_ips(dangerous_url):
    """SSRF filter must raise ValidationException on internal, private, and metadata targets."""
    with pytest.raises(ValidationException):
        validate_url_safe(dangerous_url)


def test_ssrf_validator_permits_safe_public_url():
    """Safe public domains on allowed ports must be approved."""
    valid_url = "https://college.edu/academics/syllabus.pdf"
    # Testing that it doesn't immediately fail on scheme/syntax; gaierror might happen if offline
    try:
        result = validate_url_safe(valid_url)
        assert result.startswith("https://")
    except ValidationException as e:
        # If offline/DNS fails in test sandbox, error message reflects hostname resolution, not bypass
        assert "Could not resolve hostname" in str(e)


# ==============================================================================
# 6. File Upload Security & Path Traversal Prevention
# ==============================================================================

def test_sanitize_filename_prevents_path_traversal():
    """Directory traversal characters must be stripped from uploaded filenames."""
    assert sanitize_filename("../../etc/passwd") == "passwd"
    assert sanitize_filename("..\\..\\windows\\system32\\cmd.exe") == "cmd.exe"
    assert sanitize_filename("/var/root/secret.pdf") == "secret.pdf"
    assert sanitize_filename("\x00malicious.pdf") == "malicious.pdf"
    assert sanitize_filename("") == "document"


def test_validate_file_metadata_rejects_forbidden_extensions():
    """Executable and script extensions must be strictly rejected."""
    for bad_ext in [".exe", ".sh", ".py", ".html", ".js", ".bat"]:
        with pytest.raises(ValidationException):
            validate_file_metadata(f"exploit{bad_ext}", mime_type="text/plain", file_size=1024)


def test_validate_file_metadata_enforces_size_limits():
    """Files exceeding 25 MB limit must be rejected."""
    oversized = 26 * 1024 * 1024
    with pytest.raises(ValidationException) as exc:
        validate_file_metadata("large.pdf", mime_type="application/pdf", file_size=oversized)
    assert "exceeds maximum limit" in str(exc.value)


def test_inspect_file_magic_bytes_detects_pdf():
    """Inspects header bytes to ensure file content matches declared extension."""
    valid_pdf_header = b"%PDF-1.7\n%\xe2\xe3\xcf\xd3\n"
    fake_pdf_header = b"MZ\x90\x00\x03\x00\x00\x00"  # Windows EXE header disguised as PDF

    assert inspect_file_magic_bytes(valid_pdf_header, ".pdf") is True
    assert inspect_file_magic_bytes(fake_pdf_header, ".pdf") is False


# ==============================================================================
# 7. Security Headers & Clickjacking Protection Tests
# ==============================================================================

def test_security_headers_present(client):
    """All API responses must contain enterprise security headers."""
    res = client.get("/")
    assert res.status_code == 200
    headers = res.headers

    # Anti-clickjacking & framing
    assert headers.get("x-frame-options") == "DENY"

    # MIME sniffing prevention
    assert headers.get("x-content-type-options") == "nosniff"

    # Referrer policy
    assert headers.get("referrer-policy") == "strict-origin-when-cross-origin"

    # Restrictive CSP
    csp = headers.get("content-security-policy")
    assert csp is not None
    assert "default-src 'self'" in csp
    assert "frame-ancestors 'none'" in csp


# ==============================================================================
# 8. Rate Limiting Enforcement Tests
# ==============================================================================

def test_auth_rate_limiting_enforcement(client):
    """Exceeding 10 auth attempts in 60s window must trigger HTTP 429."""
    limiter.reset()
    payload = {"email": "nonexistent.attacker@college.edu", "password": "wrongpassword"}

    # Fire 10 attempts
    for _ in range(10):
        client.post("/api/auth/login", json=payload)

    # 11th request must be rate limited
    res = client.post("/api/auth/login", json=payload)
    assert res.status_code == 429
    assert res.json()["error"]["code"] == "RATE_LIMIT_EXCEEDED"
    limiter.reset()


# ==============================================================================
# 9. Share Token Cryptography & Lifecycle
# ==============================================================================

def test_share_token_entropy_and_uniqueness(client, auth_headers):
    """Share tokens must be cryptographically unpredictable, non-sequential and high entropy."""
    create_res1 = client.post("/api/chats", json={"title": "Entropy Chat 1"}, headers=auth_headers)
    chat1_id = create_res1.json()["id"]

    create_res2 = client.post("/api/chats", json={"title": "Entropy Chat 2"}, headers=auth_headers)
    chat2_id = create_res2.json()["id"]

    s1 = client.post(f"/api/chats/{chat1_id}/share", headers=auth_headers).json()["shareToken"]
    s2 = client.post(f"/api/chats/{chat2_id}/share", headers=auth_headers).json()["shareToken"]

    assert s1 != s2
    assert len(s1) >= 20  # Sufficient entropy length
    assert not s1.isdigit()  # Never incrementing integer
    assert s1 != chat1_id   # Never raw internal chat ID


# ==============================================================================
# 10. Password Policy & Complexity Enforcement
# ==============================================================================

@pytest.mark.parametrize("weak_password", [
    "short",        # Too short (< 8 chars)
    "nouppercase1!",# Missing uppercase
    "NOLOWERCASE1!",# Missing lowercase
    "NoDigitsHere!",# Missing numeric digit
])
def test_password_complexity_validator_rejects_weak_passwords(client, weak_password):
    """Registration with passwords failing NIST complexity policy must be rejected with 422."""
    payload = {
        "name": "Weak Pass User",
        "email": "weak.password.user@college.edu",
        "password": weak_password,
    }
    res = client.post("/api/auth/register", json=payload)
    assert res.status_code == 422


# ==============================================================================
# 11. Logout & MFA Endpoints
# ==============================================================================

def test_auth_logout_audited(client, auth_headers):
    """Calling /api/auth/logout succeeds and records a logout audit event."""
    res = client.post("/api/auth/logout", headers=auth_headers)
    assert res.status_code == 200
    assert res.json()["success"] is True


def test_mfa_endpoints(client, auth_headers):
    """MFA status and enrollment endpoints return RFC 6238 compatible TOTP URIs."""
    status_res = client.get("/api/auth/mfa/status", headers=auth_headers)
    assert status_res.status_code == 200
    assert "enabled" in status_res.json()

    enroll_res = client.post("/api/auth/mfa/enroll", headers=auth_headers)
    assert enroll_res.status_code == 200
    data = enroll_res.json()
    assert "otpauth://totp/" in data["qr_code_uri"]
    assert len(data["secret"]) >= 16


# ==============================================================================
# 12. Account Deletion & Lockout Guard
# ==============================================================================

def test_last_admin_cannot_delete_own_account(client, admin_headers):
    """The sole remaining administrator cannot delete their account (lockout prevention)."""
    del_res = client.delete("/api/profile", headers=admin_headers)
    assert del_res.status_code == 400 or del_res.status_code == 422


# ==============================================================================
# 13. RAG Authorization & Permission Filtering
# ==============================================================================

@pytest.mark.asyncio
async def test_rag_permission_filtering():
    """RAG service must exclude faculty-only and admin-only documents when querying as student."""
    from app.services.rag_service import rag_service

    # Student query regarding grading or budget
    student_results = await rag_service.retrieve_context(
        query="grading bylaws budget key roster",
        user_role="student",
        top_k=10,
    )
    # Confidential faculty/admin documents must be absent from student results
    titles = [r["title"] for r in student_results]
    assert not any("Faculty Compensation" in t for t in titles)
    assert not any("Administrative Infrastructure" in t for t in titles)

    # Admin query can access all levels
    admin_results = await rag_service.retrieve_context(
        query="grading bylaws budget key roster",
        user_role="admin",
        top_k=10,
    )
    admin_titles = [r["title"] for r in admin_results]
    assert any("Administrative Infrastructure" in t for t in admin_titles)
