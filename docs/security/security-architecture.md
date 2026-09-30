# College AI — Security Architecture

## 1. Executive Summary & Principles

College AI is an enterprise SaaS platform serving educational institutions, handling sensitive student academic records, proprietary college administrative documents, real-time messaging, and shared collaborative discussions. In a future phase, it will also incorporate an enterprise Retrieval-Augmented Generation (RAG) AI assistant.

### Core Security Mandates
* **No "100% Secure" Claims**: Security is an ongoing discipline of risk management. The architecture is engineered to minimize attack surface, enforce least privilege, prevent unauthorized data access, restrict blast radius, and make failures observable.
* **Defense-in-Depth**: Security controls are implemented at multiple, independent tiers. Compromise or misconfiguration at one tier (such as the frontend) does not allow unauthorized access to backend or database resources.
* **Zero Trust & Least Privilege**: Every request must be explicitly authenticated and authorized. No entity—whether internal user, AI agent, or client application—is granted implicit access beyond the minimal permissions necessary for its role.
* **Server-Side Authorization**: The browser is an untrusted runtime. Client-side route guards and UI state changes are strictly for user experience (UX) and never serve as security boundaries.

---

## 2. End-to-End System Security Flow

```
+-------------------------------------------------------------------+
|                        Internet Clients                           |
+-------------------------------------------------------------------+
                                  |
                                  | HTTPS / TLS 1.3
                                  v
+-------------------------------------------------------------------+
|                  Reverse Proxy / Edge CDN                         |
|   - TLS Termination, HSTS (Strict-Transport-Security)             |
|   - DDoS Mitigation & Edge Rate Limiting                          |
+-------------------------------------------------------------------+
                                  |
            +---------------------+---------------------+
            |                                           |
            v                                           v
+-----------------------+                   +-----------------------+
|  Vite / React Client  |                   |   FastAPI Backend     |
|  - Content Security   |                   |  Security Middleware: |
|    Policy (CSP)       |                   |  - CORS Allowlist     |
|  - XSS-Safe Rendering |                   |  - Security Headers   |
|  - No Secret Keys     |                   |  - Size Limiter (DoS) |
+-----------------------+                   |  - Sliding Window     |
            |                               |    Rate Limiting      |
            | API Requests (Bearer Token)   +-----------------------+
            +-----------------------------------------> |
                                                        v
                                            +-----------------------+
                                            | Authentication Layer  |
                                            | - JWT Signature Verify|
                                            | - Supabase Auth Sync  |
                                            | - Expiration Checks   |
                                            +-----------------------+
                                                        v
                                            +-----------------------+
                                            | Authorization & RBAC  |
                                            | - Role: Student/      |
                                            |   Teacher/Admin       |
                                            | - IDOR/Owner Checks   |
                                            +-----------------------+
                                                        v
                                            +-----------------------+
                                            | Input Validation      |
                                            | - Pydantic Strict DTOs|
                                            | - Magic Bytes & MIME  |
                                            | - SSRF Filter         |
                                            +-----------------------+
                                                        v
                                            +-----------------------+
                                            | Application Services  |
                                            | & Audit Trail Engine  |
                                            +-----------------------+
                                            |                       |
                             SQLAlchemy / RLS                       | Supabase Storage SDK
                                            v                       v
                         +--------------------+   +--------------------+
                         | Supabase PostgreSQL|   | Supabase Storage   |
                         | - Row-Level Sec    |   | - Private Bucket   |
                         | - Strict FK & Chk  |   | - UUID Storage Key |
                         | - Append-Only Logs |   | - Presigned URLs   |
                         +--------------------+   +--------------------+
```

---

## 3. Future AI & RAG Security Architecture

When artificial intelligence and RAG pipelines are integrated, requests will follow an isolated AI Gateway pipeline to prevent prompt injection and data leaks:

```
FastAPI Core
   ↓
[AI Gateway]
   ↓
[Input & Prompt Sanitizer]
   - Detect direct injection, jailbreaks, delimiter escape
   ↓
[Authorization & User Context]
   - Retrieve actor role, department, and accessible resource boundaries
   ↓
[RAG Retrieval Engine]
   - Query vector database / document store
   ↓
[Permission Filtering Layer] <--- MANDATORY ENFORCEMENT
   - Filter retrieved chunks against document RLS and user ACLs
   - Strip unauthorized chunks BEFORE context assembly
   ↓
[Isolated LLM Prompt Assembly]
   - Strict separation between system guidelines, developer constraints, and untrusted context
   ↓
[Output Validation & Guardrails]
   - Check for secret leaks, PII leaks, system instruction leaks
   ↓
Sanitized Response
```

---

## 4. Trust Boundaries & Layered Controls

| Boundary | Components Involved | Primary Attack Vectors | Mitigations |
| :--- | :--- | :--- | :--- |
| **Edge Boundary** | Internet $\leftrightarrow$ Frontend / API | MITM, eavesdropping, TLS downgrade | Enforced TLS 1.3, HSTS (`max-age=31536000`), secure cipher suites. |
| **Client Boundary** | Browser $\leftrightarrow$ FastAPI Backend | XSS, CSRF, Clickjacking, MIME sniffing | CSP (`default-src 'self'`), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, DOMPurify, sanitization. |
| **API Boundary** | Ingress $\leftrightarrow$ Endpoint Routes | DDoS, Brute force, Buffer overflow, SSRF | Request size limits (2MB standard, 25MB uploads), Sliding window rate limiting, SSRF IP resolver. |
| **Identity Boundary** | Client $\leftrightarrow$ Authentication Service | Credential stuffing, Token forgery, Replay | Supabase Auth, bcrypt hashing, cryptographically signed HS256/RS256 JWTs, expired token rejection. |
| **Resource Boundary** | Controller $\leftrightarrow$ Service Layer | IDOR, BOLA, Privilege escalation | Explicit owner verification (`user_id == current_user.id`), RBAC dependency checks (`require_role`). |
| **Data Boundary** | Service Layer $\leftrightarrow$ Database & Storage | SQL Injection, RLS bypass, Bucket traversal | Parameterized SQLAlchemy ORM, Supabase Row-Level Security, private buckets, UUID storage paths. |
| **Audit Boundary** | System $\leftrightarrow$ Security Logs | Log tampering, log pollution, secret leaks | Append-only audit tables, credential masking, sanitized structured logging. |

---

## 5. Security Decision Records (SDRs)

1. **Bearer Token Authentication over Cookie Auth**:
   * *Decision*: Use JSON Web Tokens (JWT) in standard HTTP `Authorization: Bearer <token>` headers.
   * *Rationale*: Eliminates Cross-Site Request Forgery (CSRF) attack vectors for cross-origin SPA architectures without requiring anti-CSRF token synchronization.
   * *Trade-off*: Tokens in client memory must be safeguarded against Cross-Site Scripting (XSS). Enforced with strict CSP and sanitization.

2. **Defense-in-Depth Authorization (App-Layer + Database-Layer)**:
   * *Decision*: Enforce authorization both in FastAPI route dependencies and inside PostgreSQL using Row Level Security (RLS).
   * *Rationale*: If an application query inadvertently omits a `WHERE user_id = ...` clause, the database RLS policies guarantee data isolation across tenants.

3. **Safe Storage Keys vs Original Filenames**:
   * *Decision*: User-supplied filenames are retained purely as display metadata; storage paths utilize cryptographically generated UUIDs (`documents/{uuid}/{uuid}.pdf`).
   * *Rationale*: Completely neutralizes path traversal, filename collision, and file overwrite vulnerabilities.
