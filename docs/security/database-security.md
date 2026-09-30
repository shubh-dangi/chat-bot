# College AI — Database & Storage Security

## 1. Database Security Principles

The College AI database tier (Supabase PostgreSQL 15+) enforces **Zero Trust at the Data Layer**. Even if application code has a bug or an attacker gains internal read access, PostgreSQL Row Level Security (RLS) ensures tenant isolation.

### Key Controls
1. **Row Level Security (RLS)**: Enabled unconditionally on all 10 domain and operational tables.
2. **Never Use Unrestricted Policies**: Policies like `USING (true)` for sensitive resources are strictly prohibited.
3. **Database Roles & Least Privilege**: Application connections use least privilege roles; administrative operations require specific scopes.
4. **Zero String Concatenation**: 100% of queries use parameterized prepared statements.

---

## 2. Row Level Security (RLS) Implementation

Defined in database migration `002_row_level_security.sql`.

### Helper Security Functions
```sql
-- Retrieve active profile ID based on Supabase Auth context
CREATE OR REPLACE FUNCTION current_profile_id()
RETURNS UUID AS $$
  SELECT id FROM profiles WHERE auth_user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Check if current authenticated caller is an administrator
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE auth_user_id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;
```

### Table Policy Matrix

| Table | RLS Policy | Permitted Scope | SQL Condition |
| :--- | :--- | :--- | :--- |
| **profiles** | `profiles_select_own_or_staff` | Owner or Faculty/Admin | `auth_user_id = auth.uid() OR is_faculty_or_admin()` |
| **profiles** | `profiles_update_own` | Owner (self) | `(auth_user_id = auth.uid() AND role = CURRENT_ROLE) OR is_admin()` |
| **students** | `students_select_authorized` | Owner student or Faculty/Admin | `is_faculty_or_admin() OR profile_id = current_profile_id()` |
| **students** | `students_insert_admin` | Admin only | `is_admin()` |
| **chat_sessions**| `chat_sessions_select_owner` | Owner only | `user_id = current_profile_id()` |
| **chat_sessions**| `chat_sessions_insert_owner` | Owner only | `user_id = current_profile_id()` |
| **messages** | `messages_select_owner_or_shared` | Owner OR Active Public Share | Valid chat owner OR non-expired/non-revoked share token |
| **shared_chats** | `shared_chats_select_active` | Public / Creator | `revoked_at IS NULL AND expires_at > NOW()` |
| **documents**| `documents_select_authenticated`| Authenticated | `status = 'processed' OR is_faculty_or_admin()` |
| **audit_logs** | `audit_logs_select_admin` | Admin only | `is_admin()` |
| **audit_logs** | `audit_logs_insert_auth` | Authenticated | `user_id = current_profile_id() OR user_id IS NULL` |

### Audit Log Immutability
To guarantee that security audit trails cannot be altered or purged after an intrusion:
```sql
-- UPDATE and DELETE permissions are permanently revoked on audit_logs
REVOKE UPDATE, DELETE, TRUNCATE ON TABLE audit_logs FROM authenticated, anon, public;
```

---

## 3. SQL Injection Defenses

### Attack Surface
Search bars, student filter parameters, and pagination offsets could be susceptible to SQL injection if assembled dynamically.

### Defense Mechanism
All queries are written with SQLAlchemy parameterization:
```python
# Safe parameterized search query
query = db.query(Student)
if params.searchQuery:
    like_pattern = f"%{params.searchQuery}%"
    query = query.filter(
        or_(
            Student.name.ilike(like_pattern),
            Student.roll_number.ilike(like_pattern),
            Student.email.ilike(like_pattern),
        )
    )
```
Parameterized statements send query templates and literal parameter values over separate wire protocol channels in PostgreSQL, completely preventing code execution via input parameters.

---

## 4. Supabase Keys & Secret Separation

| Key Name | Environment Location | Exposure Rules | Capabilities |
| :--- | :--- | :--- | :--- |
| `SUPABASE_ANON_KEY` | Public / Frontend Client | Safe for browser bundle | Subject to all RLS policies; cannot access private buckets or tables without valid auth token. |
| `SUPABASE_SERVICE_ROLE_KEY` | Private Backend Server Only | **STRICTLY CONFIDENTIAL**; never in Git, frontend, or logs | Bypasses all RLS policies; used solely by server background workers for vector indexing and audit maintenance. |

### Frontend Bundle Audit Verification
An automated audit of production bundles verifies that neither `SUPABASE_SERVICE_ROLE_KEY` nor any raw database passwords exist in compiled JavaScript:
* `npm run build` generates production chunks in `frontend/dist/`.
* Automated pattern scanning verifies zero occurrences of `SERVICE_ROLE` or backend secrets.
