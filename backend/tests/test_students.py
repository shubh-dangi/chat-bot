def test_list_and_filter_students(client):
    # Test default pre-seeded students list
    res = client.get("/api/students")
    assert res.status_code == 200
    data = res.json()
    assert "items" in data
    assert data["total"] >= 6
    assert len(data["items"]) >= 6

    # Test filtering by searchQuery
    res_search = client.get("/api/students?searchQuery=Jane")
    assert res_search.status_code == 200
    items = res_search.json()["items"]
    assert any("Jane" in s["name"] for s in items)

    # Test filtering by department
    res_dept = client.get("/api/students?department=Computer Science")
    assert res_dept.status_code == 200
    dept_items = res_dept.json()["items"]
    assert all(s["department"] == "Computer Science" for s in dept_items)


def test_get_student_detail(client):
    res = client.get("/api/students/stu-101")
    assert res.status_code == 200
    data = res.json()
    assert data["id"] == "stu-101"
    assert data["rollNumber"] == "CS-2022-042"


def test_create_student_admin(client, admin_headers):
    payload = {
        "name": "Jordan Smith",
        "rollNumber": "CS-2026-999",
        "email": "jordan.smith@college.edu",
        "department": "Computer Science",
        "course": "BCA",
        "year": "Freshman",
        "semester": 1,
        "gpa": 3.75,
        "enrollmentStatus": "Active",
    }
    res = client.post("/api/students", json=payload, headers=admin_headers)
    assert res.status_code == 201
    data = res.json()
    assert data["name"] == "Jordan Smith"
    assert data["rollNumber"] == "CS-2026-999"


def test_create_student_forbidden_for_student(client, auth_headers):
    payload = {
        "name": "Unauthorized Enrollee",
        "rollNumber": "CS-2026-000",
        "email": "unauth@college.edu",
        "department": "Computer Science",
        "course": "BCA",
        "year": "Freshman",
    }
    res = client.post("/api/students", json=payload, headers=auth_headers)
    assert res.status_code == 403
