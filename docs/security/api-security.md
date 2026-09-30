# College AI — API Security & Gateway Protections

## 1. Uniform Error Handling & Information Disclosure Prevention

In production, College AI never leaks internal technical details (such as Python stack traces, SQL queries, table schemas, or filesystem paths) to clients.

### Standardized Error Format
All API exceptions format responses to match this consistent schema:
```json
{
  "error": {
    "code": "ENTITY_NOT_FOUND",
    "message": "Student with ID 'stu-999' was not found.",
    "status": 404
  }
}
```

### Exception Handlers in `backend/app/main.py`:
* **Domain Exceptions (`AppException`)**: Formatted with user-safe message and designated HTTP code (400, 401, 403, 404, 409, 429).
* **Validation Exceptions (`RequestValidationError`)**: Summarizes schema violations without revealing internal variables.
* **Unhandled System Exceptions (`Exception`)**: Server logs full traceback to secure log storage and returns a generic safe message:
  ```json
  {
    "error": {
      "code": "INTERNAL_SERVER_ERROR",
      "message": "An unexpected error occurred. Please try again later.",
      "status": 500
    }
  }
  ```

---

## 2. Input Validation via Strict Pydantic Models

All untrusted client input (JSON request bodies, query strings, path variables) is strongly validated through Pydantic schemas before reaching business logic:
* Enforces strict type matching (UUIDs, integers, strings, emails).
* Trims whitespace and enforces maximum length constraints (e.g., chat titles capped at 255 chars, messages at 10,000 chars).
* Strip undeclared fields (`extra="ignore"` or `extra="forbid"`) to neutralize mass-assignment attacks.

---

## 3. Strict CORS Configuration

Cross-Origin Resource Sharing (CORS) is explicitly constrained. The wildcard origin `*` is **strictly forbidden** for authenticated APIs:
```python
# Production explicit allowlist
BACKEND_CORS_ORIGINS: List[str] = [
    "https://college-ai.edu",
    "https://app.college-ai.edu",
]
```
Development environments use localized origins (`http://localhost:5173`, `http://127.0.0.1:5173`). Development origins are segregated from production configs via environment variables.

---

## 4. HTTP Security Headers Suite

Enforced on all API responses via `SecurityHeadersMiddleware`:

| Header | Configured Value | Purpose |
| :--- | :--- | :--- |
| **X-Content-Type-Options** | `nosniff` | Blocks MIME-type sniffing attacks. |
| **X-Frame-Options** | `DENY` | Prevents UI redressing and clickjacking embedding. |
| **Referrer-Policy** | `strict-origin-when-cross-origin` | Protects private URLs from leaking in HTTP Referer. |
| **Permissions-Policy** | `geolocation=(), camera=(), microphone=(), payment=()` | Disables sensitive browser hardware APIs. |
| **X-XSS-Protection** | `0` | Disables outdated and problematic browser filters. |
| **Content-Security-Policy**| `default-src 'self'; frame-ancestors 'none'; object-src 'none'` | Restricts executable script/style/frame boundaries. |
| **Strict-Transport-Security**| `max-age=31536000; includeSubDomains` | Enforces HTTPS exclusively across all subdomains. |

---

## 5. Tiered Rate Limiting & Abuse Prevention

College AI implements a thread-safe sliding-window rate limiter (`app/core/rate_limit.py`) tracking requests by Client IP and authenticated User ID:

| Tier Category | Window | Max Requests | Protected Endpoints | Purpose |
| :--- | :---: | :---: | :--- | :--- |
| **auth** | 60s | 10 | `/api/auth/login`, `/register`, `/forgot-password` | Credential stuffing & brute-force defense |
| **shares** | 60s | 30 | `/api/shared/{token}`, `/chats/{id}/share` | Token enumeration & scraping defense |
| **search** | 60s | 30 | `/api/students`, `/api/users`, `/api/search` | Scraping & DoS query prevention |
| **messages** | 60s | 60 | `/api/chats/{id}/messages` | Message spam & AI resource exhaustion |
| **documents**| 60s | 10 | `/api/documents` (upload & delete) | File system abuse & bandwidth flooding |
| **default** | 60s | 120 | General authenticated endpoints | Baseline DDoS & client loop protection |

---

## 6. Server-Side Request Forgery (SSRF) Protection

Outbound network calls (such as URL scrapers, webhooks, or document importers) must pass through `validate_url_safe(url)` in `app/core/ssrf.py`:
1. **Scheme Validation**: Permits only `http` and `https`.
2. **Port Restrictions**: Permits only standard web ports (80, 443, 8080).
3. **DNS Resolution & Subnet Blocking**: Resolves destination hostnames into IP addresses and rejects:
   * Loopback (`127.0.0.0/8`, `::1/128`)
   * RFC 1918 Private ranges (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`)
   * Cloud Instance Metadata Service (`169.254.169.254/16`)
   * Link-local and multicast ranges

---

## 7. Pagination & Search Bounds

To prevent memory exhaustion and database denial of service:
* All list and query endpoints mandate explicit page limits:
  ```python
  page: int = Query(default=1, ge=1)
  pageSize: int = Query(default=20, ge=1, le=100)
  ```
* Requests attempting `pageSize=100000` are rejected immediately by FastAPI schema validators.
* Search strings are capped at 100 characters and stripped of control sequences.
