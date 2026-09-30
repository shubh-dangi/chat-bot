"""
Enterprise File Security & Path Traversal Prevention for College AI.
Validates file uploads, inspects magic signatures, sanitizes filenames, and isolates storage keys.
"""
import os
import re
import uuid
from typing import Optional, Set
from app.core.exceptions import ValidationException
from app.core.logging import get_logger

logger = get_logger(__name__)

# Max file upload size: 25 MB
MAX_DOCUMENT_SIZE_BYTES = 25 * 1024 * 1024

# Strictly allowlisted extensions
ALLOWED_DOCUMENT_EXTENSIONS: Set[str] = {
    ".pdf",
    ".txt",
    ".md",
    ".doc",
    ".docx",
}

# Strictly allowlisted MIME types
ALLOWED_MIME_TYPES: Set[str] = {
    "application/pdf",
    "text/plain",
    "text/markdown",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}

# Dangerous executable / script extensions strictly forbidden
FORBIDDEN_EXTENSIONS: Set[str] = {
    ".exe", ".bat", ".cmd", ".sh", ".bash", ".ps1", ".vbs",
    ".py", ".pyc", ".js", ".ts", ".jsx", ".tsx", ".mjs",
    ".html", ".htm", ".xhtml", ".svg", ".xml", ".php", ".phtml",
    ".jar", ".war", ".class", ".dll", ".so", ".dylib",
    ".tar", ".gz", ".zip", ".rar", ".7z",
}


def sanitize_filename(filename: str) -> str:
    """
    Strips directory traversal sequences (../, ..\), path separators,
    null bytes, and control characters from user-supplied filenames.
    """
    if not filename:
        return "document"

    # Remove null bytes and control chars
    clean = filename.replace("\x00", "").strip()

    # Strip Windows & Unix path components
    clean = os.path.basename(clean)
    clean = re.sub(r"[\/\\]+", "", clean)

    # Strip dangerous characters
    clean = re.sub(r'[^a-zA-Z0-9_\-\. ]', '_', clean)

    # Prevent hidden files or double dot tricks
    clean = clean.lstrip(".")
    if not clean:
        clean = "document"

    return clean[:200]  # Cap filename length


def generate_secure_storage_path(filename: str) -> str:
    """
    Generates an isolated, non-deterministic UUID storage key.
    Ensures user-supplied filenames never determine backend or bucket storage paths directly.
    """
    safe_name = sanitize_filename(filename)
    _, ext = os.path.splitext(safe_name)
    ext = ext.lower() if ext else ".bin"
    return f"documents/{uuid.uuid4().hex[:12]}/{uuid.uuid4().hex}{ext}"


def validate_file_metadata(filename: str, mime_type: Optional[str] = None, file_size: Optional[int] = None):
    """
    Validates file extension, declared MIME type, and byte size against security policies.
    """
    clean_name = sanitize_filename(filename)
    _, ext = os.path.splitext(clean_name)
    ext = ext.lower()

    # 1. Extension check
    if not ext or ext in FORBIDDEN_EXTENSIONS or ext not in ALLOWED_DOCUMENT_EXTENSIONS:
        raise ValidationException(
            f"File extension '{ext or 'none'}' is not permitted. Allowed: {', '.join(sorted(ALLOWED_DOCUMENT_EXTENSIONS))}"
        )

    # 2. MIME type check
    if mime_type and mime_type.lower() not in ALLOWED_MIME_TYPES:
        raise ValidationException(
            f"MIME type '{mime_type}' is not allowed for institutional document uploads."
        )

    # 3. File size check
    if file_size is not None:
        if file_size <= 0:
            raise ValidationException("File size must be greater than 0 bytes.")
        if file_size > MAX_DOCUMENT_SIZE_BYTES:
            raise ValidationException(
                f"File size ({file_size / (1024*1024):.1f} MB) exceeds maximum limit of 25 MB."
            )


def inspect_file_magic_bytes(header_bytes: bytes, extension: str) -> bool:
    """
    Validates magic byte signatures against expected file types.
    Prevents executable or script files masquerading under allowed extensions (e.g. evil.exe renamed to evil.pdf).
    """
    ext = extension.lower()
    if ext == ".pdf":
        return header_bytes.startswith(b"%PDF-")
    elif ext in (".txt", ".md"):
        # Ensure it is decodable as valid UTF-8 text without control/null bytes
        try:
            sample = header_bytes[:1024].decode("utf-8")
            return "\x00" not in sample
        except UnicodeDecodeError:
            return False
    elif ext == ".docx":
        # DOCX files are zip archives starting with PK\x03\x04
        return header_bytes.startswith(b"PK\x03\x04")
    elif ext == ".doc":
        # Legacy binary DOC header
        return header_bytes.startswith(b"\xd0\xcf\x11\xe0\xa1\xb1\x1a\xe1")
    return True
