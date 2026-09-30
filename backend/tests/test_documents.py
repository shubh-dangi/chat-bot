def test_list_documents(client, auth_headers):
    res = client.get("/api/documents", headers=auth_headers)
    assert res.status_code == 200
    docs = res.json()
    assert len(docs) >= 4
    assert any("University_Academic_Curriculum" in d["filename"] for d in docs)


def test_create_and_delete_document(client, admin_headers):
    payload = {
        "filename": "Examination_Guidelines_2026.pdf",
        "type": "Syllabus / Regulations",
        "size": "3.5 MB",
        "status": "Processed",
    }
    # Create document
    create_res = client.post("/api/documents", json=payload, headers=admin_headers)
    assert create_res.status_code == 201
    doc = create_res.json()
    doc_id = doc["id"]
    assert doc["filename"] == "Examination_Guidelines_2026.pdf"

    # Update status
    patch_res = client.patch(
        f"/api/documents/{doc_id}/status",
        json={"status": "Processing"},
        headers=admin_headers,
    )
    assert patch_res.status_code == 200
    assert patch_res.json()["status"] == "Processing"

    # Delete document
    del_res = client.delete(f"/api/documents/{doc_id}", headers=admin_headers)
    assert del_res.status_code == 204
