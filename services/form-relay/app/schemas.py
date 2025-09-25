"""Pydantic models used by the form relay service."""
from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Dict, Literal, Optional
from uuid import UUID, uuid4

from pydantic import BaseModel, Field, field_validator


class SubmissionRequest(BaseModel):
    """Inbound payload describing a static-site form submission."""

    form_name: str | None = Field(
        default=None,
        description="Human-friendly identifier for the form being submitted.",
    )
    fields: Dict[str, Any] = Field(
        default_factory=dict,
        description="Arbitrary key-value pairs supplied by the submitting form.",
    )
    metadata: Dict[str, Any] = Field(
        default_factory=dict,
        description="Optional additional metadata captured by the caller.",
    )

    @field_validator("fields")
    @classmethod
    def ensure_fields_present(cls, value: Dict[str, Any]) -> Dict[str, Any]:
        """Ensure the submission contains at least one field."""
        if not value:
            raise ValueError("fields cannot be empty")
        return value


class SubmissionContext(BaseModel):
    """Request context derived from headers and connection data."""

    submission_id: UUID = Field(default_factory=uuid4)
    origin: str
    hostname: str
    client_ip: str
    user_agent: Optional[str] = None
    referer: Optional[str] = None
    received_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class SubmissionResponse(BaseModel):
    """Success response returned to callers."""

    status: Literal["accepted"] = "accepted"
    submission_id: UUID
    message: str = "Submission accepted"


class ErrorResponse(BaseModel):
    """Standard error payload."""

    status: Literal["error"] = "error"
    message: str
    detail: str | None = None


class HealthResponse(BaseModel):
    """Service health payload."""

    status: Literal["ok"] = "ok"
    service: str
    message: str = "Service is healthy"
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
