def test_messages_flow(client, auth_headers):
    # Create conversation first
    conv_res = client.post("/api/chats", json={"title": "Academic Policies"}, headers=auth_headers)
    conv_id = conv_res.json()["id"]

    # Send message
    send_res = client.post(
        f"/api/chats/{conv_id}/messages",
        json={"content": "When are the final semester exams held?"},
        headers=auth_headers,
    )
    assert send_res.status_code == 201
    data = send_res.json()
    assert "userMessage" in data
    assert "assistantMessage" in data
    assert data["userMessage"]["sender"] == "user"
    assert data["assistantMessage"]["sender"] == "assistant"
    assert "examination" in data["assistantMessage"]["content"].lower() or "exam" in data["assistantMessage"]["content"].lower()

    user_msg_id = data["userMessage"]["id"]

    # Get messages
    list_res = client.get(f"/api/chats/{conv_id}/messages", headers=auth_headers)
    assert list_res.status_code == 200
    messages = list_res.json()
    assert len(messages) >= 2

    # Edit message
    edit_res = client.put(
        f"/api/chats/{conv_id}/messages/{user_msg_id}",
        json={"newContent": "What are the rules regarding campus hostels?"},
        headers=auth_headers,
    )
    assert edit_res.status_code == 200
    updated_messages = edit_res.json()
    assert len(updated_messages) >= 2
    assert updated_messages[0]["content"] == "What are the rules regarding campus hostels?"
