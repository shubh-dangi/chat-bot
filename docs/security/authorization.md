# College AI — Authorization & Access Control

## 1. Authorization Philosophy

Authorization is the primary security boundary of College AI. Our model combines:
```
Authentication + Role-Based Access Control (RBAC) + Resource Ownership + Least Privilege
```

### Critical Rules
1. **Never Trust Client Routing**: Hiding navigation buttons or views in React does **NOT** secure an API endpoint. Every request must be independently authenticated and authorized on the backend.
2. **Never Trust Client-Supplied Identifiers**: An attacker can easily substitute an ID parameter. Every lookup must enforce tenant ownership checks.

---

## 2. Institutional Role Hierarchy

```
       +-----------------------+
       |         Admin         |  Full administrative access, user lifecycle,
       +-----------------------+  status toggle, audit trail inspection.
                   |
                   v
       +-----------------------+
       |   Teacher / Faculty   |  Can view institutional student records,
       +-----------------------+  upload regulations/syllabi, create documents.
                   |
                   v
       +-----------------------+
       |        Student        |  Default self-registration role. Can view own
       +-----------------------+  profile, own student record, and own private chats.
```

### RBAC Permission Matrix

| Resource & Operation | Student | Teacher / Faculty | Administrator |
| :--- | :---: | :---: | :---: |
| **View Own Profile** (`GET /api/profile`) | Allowed | Allowed | Allowed |
| **Update Own Profile** (`PATCH /api/profile`) | Allowed (Non-role fields) | Allowed (Non-role fields) | Allowed |
| **Manage Users / Roles** (`PATCH /api/users/{id}`) | Denied (403) | Denied (403) | Allowed |
| **Toggle User Status** (`PATCH /api/users/{id}/status`)| Denied (403) | Denied (403) | Allowed (Lockout-guarded) |
| **View Student Directory** (`GET /api/students`) | Denied (Own record only)| Allowed | Allowed |
| **Create Student Record** (`POST /api/students`) | Denied (403) | Allowed | Allowed |
| **Edit Student Record** (`PATCH /api/students/{id}`) | Denied (403) | Allowed | Allowed |
| **Create / Read Own Chats** (`/api/chats`) | Allowed (Owner only) | Allowed (Owner only) | Allowed (Owner only) |
| **Read Peer's Chat** (`GET /api/chats/{peer_id}`) | Denied (403 IDOR) | Denied (403 IDOR) | Denied (403 IDOR) |
| **Create Public Share Link** (`POST /api/chats/{id}/share`)| Allowed (Owner only) | Allowed (Owner only) | Allowed (Owner only) |
| **Upload Institutional Documents** (`POST /api/documents`)| Denied (403) | Allowed | Allowed |
| **Delete Institutional Documents** (`DELETE /api/documents/{id}`)| Denied (403) | Denied (403) | Allowed |
| **View System Audit Logs** (`GET /api/audit-logs`)| Denied (403) | Denied (403) | Allowed |

---

## 3. Object-Level Authorization (IDOR / BOLA Prevention)

To prevent Insecure Direct Object References (IDOR), the backend never performs unguarded database queries by primary key alone.

### Insecure Implementation (Vulnerable)
```python
# BAD: Vulnerable to IDOR! Returns another user's chat if ID is guessed.
@router.get("/chats/{chat_id}")
def get_chat(chat_id: str, db: Session = Depends(get_db)):
    chat = db.query(Conversation).filter(Conversation.id == chat_id).first()
    return chat
```

### College AI Implementation (Secure)
```python
# GOOD: Enforces resource ownership before returning data.
@router.get("/chats/{chat_id}")
def get_chat(
    chat_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    chat = db.query(Conversation).filter(Conversation.id == chat_id).first()
    if not chat:
        raise EntityNotFoundException("Conversation", chat_id)
        
    if chat.user_id != current_user.id:
        raise AuthorizationException("You do not have permission to access this conversation.")
        
    return chat
```

This pattern is strictly applied to:
* **Chat Conversations**: Only the session owner can view or rename.
* **Chat Messages**: Messages can only be fetched or posted by the parent conversation owner.
* **Student Academic Records**: Regular students querying `/api/students` or `/api/students/{id}` are restricted to their own linked record.
* **Shared Chat Revocation**: Only the creator of a share link can revoke it.

---

## 4. Privilege Escalation Defenses

### 1. Hardcoded Self-Registration Role
In `AuthService.register()`:
```python
# Self-registration is strictly restricted to student role
assigned_role = "student"
new_user = User(
    role=assigned_role,
    ...
)
```
Any incoming request payload field attempting `{"role": "admin"}` is ignored.

### 2. Mass Assignment Shielding
All updates use strictly defined Pydantic input schemas:
* `UserProfileUpdate` defines only mutable user-facing fields:
  ```python
  class UserProfileUpdate(BaseModel):
      name: Optional[str] = None
      department: Optional[str] = None
      avatar_url: Optional[str] = Field(default=None, alias="avatarUrl")
      
      model_config = ConfigDict(extra="ignore")
  ```
* Privileged fields (`id`, `role`, `is_active`, `created_at`, `hashed_password`) cannot be injected via request JSON.

### 3. Last-Admin Demotion / Lockout Guard
In `/api/users/{id}`:
```python
if user.role == "admin" and update_dict.get("role") != "admin":
    active_admin_count = db.query(User).filter(User.role == "admin", User.is_active == True).count()
    if active_admin_count <= 1:
        raise ValidationException("Cannot demote the only active administrator.")
```
Guarantees institutional administrators cannot accidentally or maliciously lock the organization out of system management.
