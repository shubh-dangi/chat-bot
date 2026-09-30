import uuid
import pytest


def test_profile_access(client, auth_headers):
    # Authenticated user can access their own profile
    res = client.get("/api/profile/me", headers=auth_headers)
    assert res.status_code == 200
    profile = res.json()
    assert "id" in profile
    assert profile["email"] == "student@college.edu"
    assert profile["role"] == "student"

    # Unauthenticated user cannot access protected profile
    unauth_res = client.get("/api/profile/me")
    assert unauth_res.status_code == 401


def test_chat_ownership_isolation(client, auth_headers, other_student_headers):
    # User A creates a chat session
    create_res = client.post(
        "/api/chats",
        json={"title": "User A Private Inquiries"},
        headers=auth_headers,
    )
    assert create_res.status_code == 201
    chat_id = create_res.json()["id"]

    # User A can access their chat
    get_res_a = client.get(f"/api/chats/{chat_id}", headers=auth_headers)
    assert get_res_a.status_code == 200
    assert get_res_a.json()["id"] == chat_id

    # User B cannot access User A's chat (403 Forbidden)
    get_res_b = client.get(f"/api/chats/{chat_id}", headers=other_student_headers)
    assert get_res_b.status_code == 403


def test_messages_chat_isolation(client, auth_headers, other_student_headers):
    # User A creates chat and posts a message
    create_res = client.post("/api/chats", json={"title": "Private Chat"}, headers=auth_headers)
    chat_id = create_res.json()["id"]

    send_res = client.post(
        f"/api/chats/{chat_id}/messages",
        json={"content": "Confidential academic inquiry"},
        headers=auth_headers,
    )
    assert send_res.status_code == 201

    # User B cannot list messages of User A's chat
    list_res = client.get(f"/api/chats/{chat_id}/messages", headers=other_student_headers)
    assert list_res.status_code == 403


def test_shared_chat_lifecycle_and_readonly(client, auth_headers):
    # 1. Create chat and message
    create_res = client.post("/api/chats", json={"title": "Shareable Discussion"}, headers=auth_headers)
    chat_id = create_res.json()["id"]

    client.post(
        f"/api/chats/{chat_id}/messages",
        json={"content": "Here is the shared project plan for semester 5."},
        headers=auth_headers,
    )

    # 2. Generate share link
    share_res = client.post(f"/api/chats/{chat_id}/share", headers=auth_headers)
    assert share_res.status_code == 200
    share_data = share_res.json()
    token = share_data["shareToken"]
    assert token.startswith("s-")

    # 3. Public read-only access (no auth headers required)
    public_res = client.get(f"/api/shared/{token}")
    assert public_res.status_code == 200
    public_view = public_res.json()
    assert public_view["conversation"]["title"] == "Shareable Discussion"
    assert len(public_view["messages"]) >= 1

    # 4. Revoke share link
    revoke_res = client.delete(f"/api/chats/{chat_id}/share", headers=auth_headers)
    assert revoke_res.status_code == 204

    # 5. Accessing revoked share link is rejected (404 Not Found)
    revoked_res = client.get(f"/api/shared/{token}")
    assert revoked_res.status_code == 404


def test_documents_authorization(client, auth_headers, teacher_headers, admin_headers):
    doc_payload = {
        "filename": "Lab_Safety_Protocol_2026.pdf",
        "type": "Regulations",
        "size": "1.2 MB",
        "status": "Processed",
    }

    # Student cannot upload document (403)
    student_res = client.post("/api/documents", json=doc_payload, headers=auth_headers)
    assert student_res.status_code == 403

    # Teacher can upload document (201)
    teacher_res = client.post("/api/documents", json=doc_payload, headers=teacher_headers)
    assert teacher_res.status_code == 201
    doc_id = teacher_res.json()["id"]

    # Student cannot delete document (403)
    del_student_res = client.delete(f"/api/documents/{doc_id}", headers=auth_headers)
    assert del_student_res.status_code == 403

    # Admin can delete document (204)
    del_admin_res = client.delete(f"/api/documents/{doc_id}", headers=admin_headers)
    assert del_admin_res.status_code == 204
