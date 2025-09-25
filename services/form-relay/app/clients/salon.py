"""Salon service client stub."""
from __future__ import annotations

from dataclasses import asdict, dataclass
from typing import Any, Dict

from loguru import logger


def scrub_sensitive_fields(fields: Dict[str, Any]) -> Dict[str, Any]:
    """Return a copy of the submission fields with sensitive data masked."""
    scrubbed = {}
    for key, value in fields.items():
        lowered = key.lower()
        if any(token in lowered for token in {"password", "passcode", "secret"}):
            scrubbed[key] = "***redacted***"
        else:
            scrubbed[key] = value
    return scrubbed


@dataclass(slots=True)
class SalonSubmission:
    """Payload that will eventually be forwarded to the Salon service."""

    submission_id: str
    origin: str
    hostname: str
    form_name: str | None
    client_ip: str
    user_agent: str | None
    referer: str | None
    fields: Dict[str, Any]
    metadata: Dict[str, Any]


async def forward_to_salon(payload: SalonSubmission) -> None:
    """Send the submission to the Salon application (stubbed for now)."""
    scrubbed_payload = asdict(payload)
    scrubbed_payload["fields"] = scrub_sensitive_fields(scrubbed_payload["fields"])
    logger.info("Salon forward stub: {}", scrubbed_payload)
    # TODO: Replace with actual HTTP client call once Salon endpoint exists.
