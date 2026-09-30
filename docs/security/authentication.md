# College AI — Authentication Architecture & Controls

## 1. Authentication Overview

College AI relies on an enterprise identity model utilizing **Supabase Auth** as the primary identity provider, augmented with a robust backend verification engine. We deliberately avoid rolling custom cryptographic password authentication mechanisms in production.

### Core Principles
1. **Delegated Cryptographic Authority**: Supabase Auth manages password hashing (Argon2id/bcrypt), credential databases, and cryptographic salt generation.
2. **Never Stored in Application Tables**: Raw passwords, password hashes, access tokens, refresh tokens, and OTP codes are strictly excluded from normal application entity tables.
3. **No Credential Logging**: Authentication credentials and Bearer tokens are masked in logging middleware and never written to application logs.

---

## 2. Token Lifecycle & Session Model

```
[ Client Browser ]                      [ FastAPI Backend ]               [ Supabase Auth ]
        |                                        |                                |
        |--- 1. POST /api/auth/login ----------->|                                |
        |    (email, password)                   |--- 2. Verify Credentials ----->|
        |                                        |<-- 3. Return Auth Claims ------|
        |<-- 4. HTTP 200 OK ---------------------|
        |    { token, user: {...} }              |
        |                                        |
        |--- 5. GET /api/chats ----------------->|
        |    Headers: Authorization: Bearer <jwt>|--- 6. Cryptographic Decode --->|
        |                                        |    (signature, exp, sub)       |
        |<-- 7. Response Data -------------------|
```

### Access Tokens
* **Standard**: JSON Web Token (JWT) signed via HS256/RS256.
* **Claims**:
  * `sub`: Unique Subject Identifier (User UUID)
  * `exp`: Expiration Unix Timestamp (strict verification enforced)
  * `iat`: Issued-at Timestamp
  * `email`: User institutional email address
  * `role`: User institutional role (`student`, `teacher`, `admin`)
* **Expiration Policy**:
  * Default access token lifespan: 15–60 minutes in production.
  * Refresh token lifespan: 7 days with automatic refresh token rotation.
* **Revocation & Logout**:
  * Supabase Auth invalidates the active refresh token upon user logout.
  * Client purges cached memory tokens on sign out.

---

## 3. Password Security & Account Policies

### Password Complexity Requirements
* Minimum 10 characters.
* At least one uppercase letter (`[A-Z]`).
* At least one lowercase letter (`[a-z]`).
* At least one numeric digit (`[0-9]`).
* At least one special character (`[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]`).
* Checked against common password breach databases (HaveIBeenPwned / NIST 800-63B).

### Account Enumeration Protection
All authentication and recovery endpoints return generic, standardized responses regardless of whether the target email exists:
* **Password Reset**: When `/api/auth/forgot-password` is invoked, the API returns:
  ```json
  {
    "success": true,
    "message": "Password reset instructions have been sent if account exists."
  }
  ```
  The response time and status code remain identical whether the email was found or not.
* **Login Failure**: Always returns `"Incorrect email or password."` with HTTP 401.

---

## 4. Multi-Factor Authentication (MFA) Strategy

College AI implements support for strong multi-factor authentication:

### 1. Supported Factors
* **TOTP (Time-based One-Time Password)**: RFC 6238 compliant authenticator applications (Google Authenticator, Microsoft Authenticator, 1Password).
* **FIDO2 / WebAuthn**: Cryptographic hardware keys (YubiKey) and platform biometrics (TouchID, Windows Hello).

### 2. Tiered Enforcement
* **Student Tier**: Optional but strongly recommended for account security.
* **Teacher / Faculty Tier**: Recommended.
* **Administrative Tier (`admin`)**: **MANDATORY**. Administrators must complete MFA challenge during login before obtaining administrative scope or executing privileged endpoints under `/api/users` and `/api/audit-logs`.

### 3. Lost Device & Account Recovery Procedure
1. **Backup Recovery Codes**: Upon MFA enrollment, users are presented with 8 single-use, cryptographically generated recovery codes. Codes are stored in hashed format.
2. **Administrative Override Flow**:
   * If all recovery codes and devices are lost, the user must present verified institutional physical ID to the Campus IT Helpdesk.
   * A designated IT Administrator logs into the admin console, verifies identity, and issues a temporary one-time recovery reset with mandatory audit logging (`action=mfa_admin_override`).

---

## 5. Brute Force & Rate Limiting Safeguards

The authentication tier is guarded by server-side sliding-window rate limiting:
* **Endpoint Category**: `auth` (`/api/auth/login`, `/api/auth/register`, `/api/auth/forgot-password`, `/api/auth/reset-password`).
* **Threshold**: Maximum **10 requests per 60-second window** per client IP / identifier.
* **Response on Violation**:
  ```json
  {
    "error": {
      "code": "RATE_LIMIT_EXCEEDED",
      "message": "Too many requests. Rate limit is 10 requests per 60s.",
      "status": 429
    }
  }
  ```
  HTTP header `Retry-After: <seconds>` informs clients of cooldown duration.
* **Lockout Protection**: Avoids permanent automated lockouts to prevent adversaries from weaponizing lockouts to cause denial of service for legitimate faculty.
