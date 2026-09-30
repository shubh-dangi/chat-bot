# College AI — Threat Model

## 1. Scope & Objective

This threat model identifies institutional assets, potential adversaries, attack surfaces, threat vectors, and architectural mitigations for the College AI SaaS platform. It follows the **STRIDE** methodology (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege) aligned with **OWASP Top 10 (2021)** and **OWASP API Security Top 10 (2023)**.

---

## 2. Asset Identification

| Asset Class | Description | Sensitivity | Impact of Compromise |
| :--- | :--- | :--- | :--- |
| **Student Academic Records** | Roll numbers, GPA, semester standing, courses, enrollment status. | **CRITICAL** | FERPA/privacy violations, legal liability, reputational loss. |
| **User Identity & Credentials** | Email addresses, bcrypt password hashes, JWTs, active session tokens. | **CRITICAL** | Account takeover, identity theft, unauthorized administrative access. |
| **Administrative Controls** | User management, account suspension, role modification, system config. | **CRITICAL** | Total system takeover, privilege escalation, data destruction. |
| **Institutional Documents** | Syllabi, exam rubrics, internal regulations, administrative notices. | **HIGH** | Academic integrity breach, premature disclosure of restricted policies. |
| **Chat Conversations & Messages**| Private student queries, academic discussions, advisory history. | **HIGH** | Student privacy violation, unauthorized data disclosure. |
| **System Audit Logs** | Tamper-evident records of logins, permission changes, administrative edits.| **HIGH** | Loss of forensic accountability, regulatory non-compliance. |
| **Service Credentials** | `SUPABASE_SERVICE_ROLE_KEY`, `JWT_SECRET`, database connection strings. | **CRITICAL** | Direct database read/write bypass, complete infrastructure breach. |
| **Shared Chat Tokens** | Public URLs granting read-only access to specific conversations. | **MEDIUM** | Involuntary exposure of conversation context beyond intended audience. |
| **Future AI/RAG Vectors** | Vector embeddings, indexed institutional knowledge, LLM prompt templates.| **HIGH** | Indirect prompt injection, context exfiltration, unauthorized RAG leakage.|

---

## 3. Threat Actors & Motives

| Threat Actor | Capabilities & Access | Motivation |
| :--- | :--- | :--- |
| **Unauthenticated Internet Attacker** | Network scanning, brute force, credential stuffing, automated bots, exploit scripts. | Financial gain, disruption, unauthorized data harvesting. |
| **Malicious Authenticated Student** | Standard student privileges; access to personal chat, profile, and student view. | Grade alteration, viewing peers' records, accessing restricted exams. |
| **Malicious Authenticated Faculty** | Staff privileges; access to student directory and document upload pipeline. | Unauthorized inspection of cross-departmental records, data exfiltration. |
| **Compromised Account (Account Takeover)**| Attacker wielding stolen legitimate session token or credentials. | Exploiting victim's permissions while evading perimeter detection. |
| **Malicious / Disgruntled Administrator**| Elevated institutional privileges; user management and audit querying. | Sabotage, mass data deletion, privilege persistence, log wiping. |
| **Prompt Injection Adversary (Future AI)**| Submits crafted natural language prompts or documents designed to override LLM instructions. | LLM jailbreaking, system prompt extraction, unauthorized document retrieval.|
| **Automated Scraper / Botnet** | High-volume distributed HTTP requests. | Denial of Service (DoS), API quota exhaustion, student enumeration. |

---

## 4. Threat Matrix & STRIDE Analysis

### 4.1 Broken Object-Level Authorization (IDOR / BOLA) — STRIDE: Information Disclosure / Tampering
* **Threat**: Attacker changes `chat_id` in `GET /api/chats/{chat_id}` to inspect another student's conversation or alters `student_id` in `GET /api/students/{id}`.
* **Likelihood**: High | **Impact**: Critical | **Severity**: **CRITICAL**
* **Mitigations**:
  * Mandatory owner check in application service layer: `chat.user_id == current_user.id`.
  * PostgreSQL Row Level Security (RLS) ensures queries at the database tier enforce tenant ownership:
    ```sql
    CREATE POLICY "chat_sessions_select_owner" ON chat_sessions
    FOR SELECT TO authenticated USING (user_id = current_profile_id());
    ```
  * Students can only query their own linked student profile unless possessing the `teacher` or `admin` role.

### 4.2 Privilege Escalation & Mass Assignment — STRIDE: Elevation of Privilege
* **Threat**: A student submits `{"role": "admin"}` during self-registration or sends a `PATCH /api/profile` containing elevated role attributes.
* **Likelihood**: High | **Impact**: Critical | **Severity**: **CRITICAL**
* **Mitigations**:
  * `AuthService.register()` hardcodes assigned role to `"student"`.
  * `UserProfileUpdate` Pydantic model explicitly strips `role`, `id`, and system fields (`extra="ignore"`).
  * Role promotion requires the administrative endpoint `/api/users/{id}` guarded by `require_role("admin")`.
  * Last-admin lockout protection prevents deactivating or demoting the final administrator.

### 4.3 Credential Stuffing & Brute Force — STRIDE: Spoofing
* **Threat**: High-velocity automated password guessing attacks against `/api/auth/login`.
* **Likelihood**: High | **Impact**: High | **Severity**: **HIGH**
* **Mitigations**:
  * Sliding-window rate limiter enforcing a strict limit of 10 requests/minute on all `/api/auth/*` endpoints.
  * Audit logging of all failed attempts (`login_failure`) capturing target email and client IP.
  * Generic failure responses (`"Incorrect email or password."`) preventing email enumeration.

### 4.4 SQL Injection (SQLi) — STRIDE: Tampering / Information Disclosure
* **Threat**: Malicious SQL fragments supplied in student search queries or filters.
* **Likelihood**: Medium | **Impact**: Critical | **Severity**: **HIGH**
* **Mitigations**:
  * 100% parameterized queries utilizing SQLAlchemy ORM.
  * Zero string concatenation or f-strings in SQL execution.
  * Input sanitization and length capping on search parameters.

### 4.5 File Upload Exploits & Path Traversal — STRIDE: Tampering / Elevation of Privilege
* **Threat**: Uploading executable binaries (`.exe`, `.sh`, `.php`), webshells, or crafting paths like `../../etc/passwd` to overwrite server files.
* **Likelihood**: Medium | **Impact**: Critical | **Severity**: **CRITICAL**
* **Mitigations**:
  * File extension allowlist strictly limited to `.pdf`, `.txt`, `.md`, `.doc`, `.docx`.
  * Magic byte signature verification preventing extension spoofing (e.g., verifying `%PDF-` header).
  * Storage path isolation: user filenames are discarded for storage; non-deterministic UUID keys are generated.
  * Storage in private Supabase Storage buckets with strict RLS policies.
  * 25 MB payload cap to prevent decompression/storage exhaustion attacks.

### 4.6 Server-Side Request Forgery (SSRF) — STRIDE: Information Disclosure
* **Threat**: Providing internal or cloud metadata URLs (e.g., `http://169.254.169.254/latest/meta-data/` or `http://localhost:8000`) for remote fetching.
* **Likelihood**: Medium | **Impact**: Critical | **Severity**: **HIGH**
* **Mitigations**:
  * Strict URL validator (`validate_url_safe`) resolving hostnames and inspecting resolved IP addresses.
  * Outbound requests blocked to RFC 1918 private subnets (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`), loopback (`127.0.0.0/8`), and link-local cloud metadata (`169.254.0.0/16`).
  * Only `http` and `https` schemes permitted on standard web ports.

### 4.7 Cross-Site Scripting (XSS) & Markdown Injection — STRIDE: Tampering
* **Threat**: Rendering unescaped HTML, malicious `javascript:` URI links, or SVG payloads in chat or document views.
* **Likelihood**: Medium | **Impact**: High | **Severity**: **HIGH**
* **Mitigations**:
  * React JSX default HTML escaping.
  * Strict Content Security Policy (`script-src 'self'`, `object-src 'none'`, `frame-ancestors 'none'`).
  * DOMPurify sanitization of user and AI markdown before rendering.
  * Sanitizing dangerous URL schemes (`javascript:`, `data:text/html`).

### 4.8 Service Role Key & Secrets Exposure — STRIDE: Information Disclosure
* **Threat**: `SUPABASE_SERVICE_ROLE_KEY` or `JWT_SECRET` accidentally committed to Git, logged, or exposed in frontend client bundles.
* **Likelihood**: Low | **Impact**: Catastrophic | **Severity**: **CRITICAL**
* **Mitigations**:
  * `SUPABASE_SERVICE_ROLE_KEY` resides strictly in backend server environment variables.
  * Frontend Vite configuration exposes only `VITE_`-prefixed public variables.
  * Bundle verification tests confirm zero occurrences of `SERVICE_ROLE` or secret keys in client JavaScript.
  * `.gitignore` prevents `.env` check-in; credential masking in structured application logs.

### 4.9 Prompt Injection & RAG Data Leakage (Future AI Phase) — STRIDE: Information Disclosure / Tampering
* **Threat**: Direct jailbreak prompts or indirect malicious document content prompting the LLM to ignore boundaries, leak system prompts, or divulge private student records.
* **Likelihood**: High | **Impact**: High | **Severity**: **HIGH**
* **Mitigations**:
  * User context and retrieved chunks are treated as untrusted data, distinctly separated from system instructions.
  * Permission filtering layer intercepts vector retrieval, verifying that the current user has read permissions on each document chunk BEFORE passing it into the LLM context.
  * Output validation checks for credential patterns, system prompt leakage, and unauthorized student PII.

---

## 5. Blast Radius & Defense-in-Depth Summary

```
+-------------------------------------------------------------------------------+
| Layer           | Failure Scenario                 | Confining Control        |
+=================+==================================+==========================+
| Frontend        | Attacker modifies client React   | Backend API dependencies |
| (Client)        | state to bypass UI guards        | enforce role & ownership |
+-----------------+----------------------------------+--------------------------+
| Controller      | Developer forgets owner check in | Database RLS policy      |
| (FastAPI)       | specific GET endpoint            | restricts query to user  |
+-----------------+----------------------------------+--------------------------+
| File Ingestion  | Attacker renames malicious file  | Magic byte inspection &  |
| (Uploads)       | to syllabus.pdf                  | non-executable bucket    |
+-----------------+----------------------------------+--------------------------+
| Sharing Link    | Attacker obtains shared chat URL | Link is read-only; no    |
| (Public Share)  |                                  | write/delete permitted   |
+-----------------+----------------------------------+--------------------------+
| Future AI Agent | User tricks LLM via jailbreak    | Tool endpoints execute   |
| (LLM Tooling)   | prompt to call "delete_student"  | independent server-side  |
|                 |                                  | RBAC authorization checks|
+-------------------------------------------------------------------------------+
```
