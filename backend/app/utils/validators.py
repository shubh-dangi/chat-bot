import re
from typing import Optional


def sanitize_text(text: str) -> str:
    """Strips dangerous control characters and trims leading/trailing whitespace."""
    if not text:
        return ""
    # Strip null bytes and normalize whitespace
    cleaned = re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f]", "", text)
    return cleaned.strip()


def is_valid_roll_number(roll_number: str) -> bool:
    """Validates campus roll number format (e.g. CS-2022-042 or 2024CS012)."""
    if not roll_number:
        return False
    pattern = r"^[A-Za-z0-9\-_]{3,20}$"
    return bool(re.match(pattern, roll_number.strip()))
