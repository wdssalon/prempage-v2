"""Pydantic schemas shared by the FastAPI application."""
from __future__ import annotations

from datetime import datetime, timezone
from typing import Literal

from pydantic import BaseModel, Field


class ServiceMetadata(BaseModel):
    """Metadata describing the running backend service."""

    name: str
    version: str


class HealthCheckResponse(BaseModel):
    """Standard payload returned by the health check endpoint."""

    status: Literal["ok", "degraded", "error"]
    service: ServiceMetadata
    message: str = "Service is healthy"
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

