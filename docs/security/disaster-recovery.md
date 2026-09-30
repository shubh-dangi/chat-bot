# College AI — Disaster Recovery & Backup Strategy

## 1. Disaster Recovery Objectives

College AI establishes strict recovery metrics to minimize data loss and downtime in the event of an infrastructure failure, data center outage, or accidental data loss:

* **Recovery Point Objective (RPO)**: **< 15 minutes** (Maximum allowable data loss window in a disaster).
* **Recovery Time Objective (RTO)**: **< 60 minutes** (Maximum duration required to restore full service availability).

---

## 2. Backup Architecture & Policies

```
+-------------------------------------------------------------------------+
| Primary Production (Region A)                                           |
|                                                                         |
|  +--------------------+        Continuous WAL       +-----------------+ |
|  | Supabase Postgres  | ==========================> | Write-Ahead Log | |
|  | (Primary Cluster)  |                             | (WAL-G Archive) | |
|  +--------------------+                             +-----------------+ |
|            |                                                 |          |
|            | Daily Logical Dump                              | Real-time|
|            v                                                 v          |
|  +--------------------+       Cross-Region Repl.    +-----------------+ |
|  | Daily Snapshot     | --------------------------> | Disaster Backup | |
|  | (pg_dump + gzip)   |                             | Storage Vault   | |
|  +--------------------+                             | (Region B)      | |
|                                                     +-----------------+ |
|  +--------------------+       Encrypted Sync                 ^          |
|  | Supabase Storage   | -------------------------------------+          |
|  | (Documents Bucket) |                                                 |
|  +--------------------+                                                 |
+-------------------------------------------------------------------------+
```

### Backup Frequency & Retention

| Data Asset | Backup Method | Frequency | Retention Window | Storage Location |
| :--- | :--- | :---: | :---: | :--- |
| **PostgreSQL Database** | Physical WAL Streaming (PITR) | Continuous | 30 Days | Geographically redundant cloud storage |
| **PostgreSQL Logical Dumps** | `pg_dump` compressed & encrypted | Daily (02:00 UTC) | 90 Days | Encrypted S3/GCS Coldline storage bucket |
| **Uploaded Documents** | Object Storage Bucket Replication | Real-time / Hourly | Versioned (Permanent) | Cross-region replicated storage bucket |
| **Configuration & Schemas**| Git Infrastructure-as-Code (IaC) | Per Commit | Indefinite | Private GitHub Organization repository |

---

## 3. Step-by-Step Restoration Procedures

### 3.1 Database Point-in-Time Recovery (PITR)
Used when catastrophic corruption, malicious dropping of tables, or ransomware occurs:
1. Identify the exact target timestamp prior to corruption (e.g., `2026-09-30T10:14:00Z`).
2. Provision a new PostgreSQL instance or trigger Supabase PITR restoration in the console.
3. Apply base backup snapshot and replay Write-Ahead Logs (WAL) up to target timestamp:
   ```bash
   # CLI restoration command
   supabase db restore --timestamp "2026-09-30T10:14:00Z"
   ```
4. Verify table row counts and schema integrity:
   ```sql
   SELECT count(*) FROM students;
   SELECT count(*) FROM profiles;
   SELECT count(*) FROM chat_sessions;
   ```
5. Update application `DATABASE_URL` connection strings to point to restored database cluster.

### 3.2 Storage Recovery (Document Restoration)
1. In the event of bucket corruption or accidental deletion, leverage bucket object versioning.
2. Run synchronization from the cross-region backup bucket to the primary bucket:
   ```bash
   aws s3 sync s3://college-ai-backup-vault/documents/ s3://college-documents/ --delete
   ```
3. Re-verify storage access policies from `database/migrations/003_storage_setup.sql`.

---

## 4. Rollback & Service Restoration Strategy

### 1. Application Deployment Rollback
If a newly deployed backend release introduces critical flaws:
* **Containerized Rollback**: Revert deployment tag to previous stable image digest in container orchestrator (e.g., Docker / Kubernetes / Fly.io):
  ```bash
  flyctl deploy --image registry/college-ai-backend:v1.0.4-stable
  ```
* **Frontend Rollback**: Instant rollback via Vercel/Vite deployment dashboard to previous deployment ID.

### 2. Database Migration Rollback
* All database schema migrations are engineered with reversible down-scripts or non-destructive migrations (additive column additions, deprecation before deletion).
* Before applying migrations in production, automated dry-runs execute against staging environments.

---

## 5. Disaster Recovery Testing Cadence

Backups are deemed unusable until restoration has been empirically validated.
* **Monthly Automated Restoration Drill**: An automated worker restores the latest daily database snapshot to an ephemeral staging instance and executes the full pytest suite (`pytest -v`).
* **Bi-Annual Failover Simulation**: Security and DevOps teams simulate total regional outage by rerouting DNS traffic to secondary failover infrastructure.
