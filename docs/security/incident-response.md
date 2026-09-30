# College AI — Incident Response Plan & Runbooks

## 1. Incident Severity Classification

| Severity Level | Definition | Response SLA | Escalation Target |
| :--- | :--- | :---: | :--- |
| **P1 - Critical** | Active compromise of `SUPABASE_SERVICE_ROLE_KEY`, compromised admin account, unauthorized mass exfiltration of student records, total service disruption. | **< 15 minutes** | Lead Security Architect, CTO, Campus IT Director, Legal Counsel. |
| **P2 - High** | Single compromised student/faculty account, isolated IDOR vulnerability identified, persistent brute force on auth endpoints, partial storage leakage. | **< 1 hour** | Security Engineer, Backend Tech Lead. |
| **P3 - Medium** | Localized rate limit violation, suspicious login anomalies, misconfigured CORS on non-sensitive endpoint. | **< 4 hours** | DevSecOps On-Call Engineer. |
| **P4 - Low** | Dependency vulnerability with no active exploit path, minor security header inconsistency. | **< 24 hours** | Engineering Team (Standard Sprint Backlog). |

---

## 2. Runbook 1: Leaked API Key or Supabase Service Role Key

### Phase 1: Containment (Immediate)
1. **Revoke Exposed Credential**:
   * Navigate to the Supabase Management Console $\rightarrow$ Project Settings $\rightarrow$ API.
   * Immediately rotate the `service_role` secret and generate a new key.
   * If a third-party LLM key (OpenAI, Gemini, Anthropic) was exposed, revoke the key in the vendor dashboard immediately.
2. **Deploy Replacement Secrets**:
   * Update the environment secret manager (e.g., Vault, AWS Secrets Manager, Vercel/Fly.io Secrets).
   * Trigger zero-downtime rolling restart of backend API containers.

### Phase 2: Investigation & Blast Radius Analysis
1. Query system audit logs and PostgreSQL access logs for the timestamp window between estimated exposure and key revocation:
   ```sql
   SELECT * FROM audit_logs 
   WHERE created_at >= '<exposure_timestamp>'
   ORDER BY created_at ASC;
   ```
2. Check for unauthorized data export, new administrative accounts created, or altered security policies.

### Phase 3: Post-Mortem & Remediation
* Perform root cause analysis (e.g., commit to public repository, insecure build artifact).
* Ensure git history is purged using `git-filter-repo` or BFG Repo-Cleaner if checked into source control.
* Document findings in a Post-Incident Review (PIR) report.

---

## 3. Runbook 2: Compromised Administrator Account

### Phase 1: Immediate Account Containment
1. **Revoke Active Sessions & Lock Account**:
   * Execute immediate status deactivation via database or admin console:
     ```sql
     UPDATE profiles SET is_active = false WHERE id = '<compromised_admin_id>';
     ```
   * Terminate all active Supabase Auth refresh tokens and sessions for the target user.
2. **Reset MFA and Credentials**:
   * Invalidate existing password and purge registered TOTP/WebAuthn factors.

### Phase 2: Audit Trail Forensic Inspection
1. Query `audit_logs` specifically filtered by the compromised user ID:
   ```sql
   SELECT action, resource_type, resource_id, details, ip_address, created_at
   FROM audit_logs
   WHERE user_id = '<compromised_admin_id>'
     AND created_at >= '<breach_start_time>'
   ORDER BY created_at DESC;
   ```
2. Identify:
   * Any accounts promoted to `admin` or `teacher`.
   * Any student records modified or exported.
   * Any documents deleted or uploaded.
   * Any shared chat links created.

### Phase 3: Resource Restoration
* Revert all unauthorized state changes identified in audit forensics.
* Restore compromised database records from the nearest Point-in-Time Recovery (PITR) backup snapshot if necessary.
* Issue new credentials and require hardware security key (FIDO2) re-enrollment for the administrator.

---

## 4. Runbook 3: Suspected Data Exposure or Student Record Leakage

### Phase 1: Containment
1. If an endpoint or share link is actively leaking records, take immediate mitigation action:
   * If a share link is abused: Revoke via `DELETE /api/chats/{id}/share` or set `revoked_at = NOW()`.
   * If an API endpoint is vulnerable: Enable emergency rate limiting or temporarily disable the affected route via feature flag / API gateway.

### Phase 2: Evidence Preservation & Forensics
1. Preserve server access logs, reverse proxy logs, and database transaction logs.
2. Quantify the exact records accessed:
   * List affected student roll numbers, names, and academic records.
   * Identify attacker IP addresses, user agents, and attack techniques.

### Phase 3: Institutional & Regulatory Notification
1. Brief university executive leadership and legal counsel.
2. If personal educational data (FERPA / GDPR) was accessed, prepare formal notification within the statutory notification window (e.g., 72 hours under GDPR).
3. Provide affected students with direct security advisories, guidance, and institutional support.
