def test_create_and_list_conversations(client, auth_headers):
    # 1. Create a conversation
    payload = {"initialMessage": "Hello College AI, what is the semester fee schedule?"}
    create_res = client.post("/api/chats", json=payload, headers=auth_headers)
    assert create_res.status_code == 201
    created_conv = create_res.json()
    assert "id" in created_conv
    assert "Hello College AI" in created_conv["title"]

    conv_id = created_conv["id"]

    # 2. List conversations
    list_res = client.get("/api/chats", headers=auth_headers)
    assert list_res.status_code == 200
    conv_list = list_res.json()
    assert any(c["id"] == conv_id for c in conv_list)

    # 3. Get single conversation
    get_res = client.get(f"/api/chats/{conv_id}", headers=auth_headers)
    assert get_res.status_code == 200
    assert get_res.json()["id"] == conv_id

    # 4. Rename conversation
    rename_res = client.patch(
        f"/api/chats/{conv_id}", json={"title": "Updated Tuition Inquiries"}, headers=auth_headers
    )
    assert rename_res.status_code == 200
    assert rename_res.json()["title"] == "Updated Tuition Inquiries"

    # 5. Delete conversation
    del_res = client.delete(f"/api/chats/{conv_id}", headers=auth_headers)
    assert del_res.status_code == 204

    # Verify deleted
    verify_res = client.get(f"/api/chats/{conv_id}", headers=auth_headers)
    assert verify_res.status_code == 404
