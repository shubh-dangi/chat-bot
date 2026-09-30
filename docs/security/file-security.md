# College AI — File Upload & Storage Security

## 1. File Upload Threat Landscape

Allowing users to upload documents introduces critical attack vectors:
* **Webshell / Executable Injection**: Uploading `.py`, `.sh`, `.php`, or `.exe` files to gain remote code execution.
* **Path Traversal**: Crafting filenames like `../../app/main.py` to overwrite core backend code.
* **MIME Spoofing**: Renaming a malicious executable as `syllabus.pdf` to bypass simple extension checks.
* **Archive / Decompression Bombs**: Uploading recursive zips that expand to gigabytes, exhausting server memory.
* **Unauthorized Access**: Storing files in publicly readable cloud buckets without access control.

---

## 2. Multi-Stage File Validation Pipeline

Every file submitted to `/api/documents` passes through a rigorous 5-stage validation gate implemented in `app/core/file_security.py`:

```
Uploaded File Stream
        ↓
[Stage 1: File Size Check]
   - Content-Length & Stream byte counting
   - Hard limit: 25 MB max (26,214,400 bytes)
        ↓
[Stage 2: Extension Allowlist]
   - Strictly permitted: .pdf, .txt, .md, .doc, .docx
   - Explicitly blocked: .exe, .sh, .py, .html, .svg, .zip, etc.
        ↓
[Stage 3: MIME Type Verification]
   - Client MIME must match allowlist: application/pdf, text/plain, etc.
        ↓
[Stage 4: Magic Bytes Signature Inspection]
   - Binary header inspection:
     * PDF: Must begin with '%PDF-'
     * DOCX: Must begin with 'PK\x03\x04' (Zip container)
     * Plain Text: Must decode as clean UTF-8 with zero null bytes
        ↓
[Stage 5: Path Traversal Stripping & UUID Keying]
   - Original filename stripped of '../', '..\', and special chars
   - Storage key generated: documents/{uuid_tenant}/{uuid_file}.ext
        ↓
Write to Private Supabase Storage Bucket
```

---

## 3. Filename Sanitization & Storage Key Generation

### The Flaw of Using User Filenames
```python
# VULNERABLE: Direct filesystem / bucket path from user input
path = f"/storage/{user_provided_filename}"  # Attacker submits "../../etc/passwd"
```

### The College AI Implementation
User-supplied filenames are sanitized for display only and **never** used as storage keys:
```python
def sanitize_filename(filename: str) -> str:
    clean = filename.replace("\x00", "").strip()
    clean = os.path.basename(clean)
    clean = re.sub(r"[\/\\]+", "", clean)
    clean = re.sub(r'[^a-zA-Z0-9_\-\. ]', '_', clean)
    clean = clean.lstrip(".")
    return clean[:200] or "document"

def generate_secure_storage_path(filename: str) -> str:
    safe_name = sanitize_filename(filename)
    _, ext = os.path.splitext(safe_name)
    ext = ext.lower() if ext else ".bin"
    return f"documents/{uuid.uuid4().hex[:12]}/{uuid.uuid4().hex}{ext}"
```

---

## 4. Private Supabase Storage Configuration

Configured in `database/migrations/003_storage_setup.sql`:
* **Bucket Name**: `college-documents`
* **Visibility**: `public = false` (Private bucket).
* **Storage Policies**:
  * **Read**: Authenticated users only via signed URLs (`SELECT FROM storage.objects WHERE bucket_id = 'college-documents'`).
  * **Write**: Restricted to authenticated faculty and administrators (`role IN ('teacher', 'admin')`).
  * **Delete**: Restricted exclusively to administrators (`role = 'admin'`).
* **Execution Prevention**: The storage bucket does not serve files with executable MIME headers. Documents are served with `Content-Disposition: attachment` or embedded inside an isolated sandboxed iframe.
