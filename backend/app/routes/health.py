"""Health check endpoint."""
from __future__ import annotations

from datetime import datetime, timezone

from fastapi import APIRouter

from app.core.config import settings
from app.models.system import HealthCheckResponse, ServiceMetadata


router = APIRouter(prefix="", tags=["health"])


SERVICE_METADATA = ServiceMetadata(name="prempage-backend", version=settings.version)
SERVICE_ENVIRONMENT = settings.environment
SERVICE_START_TIME = datetime.now(timezone.utc)


@router.get("/health", response_model=HealthCheckResponse, summary="Health check")
async def health() -> HealthCheckResponse:
    """Return operational metadata used by availability probes."""

    return HealthCheckResponse(
        status="ok",
        service=SERVICE_METADATA,
        environment=SERVICE_ENVIRONMENT,
        uptime_seconds=(datetime.now(timezone.utc) - SERVICE_START_TIME).total_seconds(),
    )
