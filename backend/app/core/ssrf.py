"""
SSRF (Server-Side Request Forgery) Protection Module for College AI.
Validates outbound URLs to prevent requests to localhost, internal networks, or cloud metadata services.
"""
import ipaddress
import socket
from urllib.parse import urlparse
from app.core.exceptions import ValidationException
from app.core.logging import get_logger

logger = get_logger(__name__)

# Forbidden IP networks
BLOCKED_IP_NETWORKS = [
    ipaddress.ip_network("127.0.0.0/8"),          # Loopback
    ipaddress.ip_network("10.0.0.0/8"),           # RFC 1918 Private
    ipaddress.ip_network("172.16.0.0/12"),        # RFC 1918 Private
    ipaddress.ip_network("192.168.0.0/16"),       # RFC 1918 Private
    ipaddress.ip_network("169.254.0.0/16"),       # Link-local / Cloud metadata (AWS, GCP, Azure)
    ipaddress.ip_network("0.0.0.0/8"),            # Broadcast / Current network
    ipaddress.ip_network("::1/128"),              # IPv6 Loopback
    ipaddress.ip_network("fc00::/7"),             # IPv6 Unique Local
    ipaddress.ip_network("fe80::/10"),            # IPv6 Link-Local
]


def validate_url_safe(url: str, allow_custom_ports: bool = False) -> str:
    """
    Validates that a URL does not target loopback, private RFC 1918, or cloud metadata addresses.
    Raises ValidationException if the target address is unsafe.
    """
    if not url or not isinstance(url, str):
        raise ValidationException("URL must be a non-empty string.")

    parsed = urlparse(url.strip())

    # 1. Scheme check: only http and https allowed
    if parsed.scheme.lower() not in ("http", "https"):
        raise ValidationException(f"Unsupported URL scheme '{parsed.scheme}'. Only http and https are permitted.")

    hostname = parsed.hostname
    if not hostname:
        raise ValidationException("URL is missing a valid hostname.")

    # 2. Port check
    if not allow_custom_ports and parsed.port and parsed.port not in (80, 443, 8080):
        raise ValidationException(f"Access to port {parsed.port} is restricted.")

    # 3. Resolve DNS and inspect target IP addresses
    try:
        # Resolve hostname to all associated IP addresses
        addr_info = socket.getaddrinfo(hostname, None)
        ips = [info[4][0] for info in addr_info]
    except socket.gaierror as exc:
        raise ValidationException(f"Could not resolve hostname '{hostname}': {exc}")

    for raw_ip in ips:
        try:
            ip_obj = ipaddress.ip_address(raw_ip)
            for blocked_net in BLOCKED_IP_NETWORKS:
                if ip_obj in blocked_net:
                    logger.warning(f"SSRF blocked: URL {url} resolves to restricted IP {raw_ip} in {blocked_net}")
                    raise ValidationException(
                        f"Access to target address '{raw_ip}' is restricted for security reasons."
                    )
        except ValueError:
            raise ValidationException(f"Invalid IP address resolved: {raw_ip}")

    return url
