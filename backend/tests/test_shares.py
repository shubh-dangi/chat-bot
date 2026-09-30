def test_share_flow(client, auth_headers):
    # 1. Create a conversation and post a message
    conv_res = client.post("/api/chats", json={"title": "Shared Research Discussion"}, headers=auth_headers)
    conv_id = conv_res.json()["id"]

    client.post(
        f"/api/chats/{conv_id}/messages",
        json={"content": "Can you summarize the placement eligibility criteria?"},
        headers=auth_headers,
    )

    # 2. Generate public share link
    share_res = client.post(f"/api/chats/{conv_id}/share", headers=auth_headers)
    assert share_res.status_code == 200
    share_data = share_res.json()
    assert "shareToken" in share_data
    token = share_data["shareToken"]
    assert token.startswith("s-")

    # 3. Access shared conversation publicly without authentication
    public_res = client.get(f"/api/shared/{token}")
    assert public_res.status_code == 200
    public_data = public_res.json()
    assert "conversation" in public_data
    assert "messages" in public_data
    assert len(public_data["messages"]) >= 2
    assert public_data["conversation"]["isShared"] is True

    # 4. Revoke share link
    revoke_res = client.delete(f"/api/chats/{conv_id}/share", headers=auth_headers)
    assert revoke_res.status_code == 204

    # 5. Accessing after revocation must yield 404
    after_revoke_res = client.get(f"/api/shared/{token}")
    assert after_revoke_res.status_code == 404
