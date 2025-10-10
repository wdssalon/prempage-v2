"""Health check endpoint."""
from __future__ import annotations

from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Request

from app.core.config import settings
from app.models.system import HealthCheckResponse, ServiceMetadata


router = APIRouter(prefix="", tags=["health"])


SERVICE_METADATA = ServiceMetadata(name="prempage-backend", version=settings.version)
SERVICE_ENVIRONMENT = settings.environment


def _calculate_uptime_seconds(start_time: Optional[datetime]) -> float:
    if not isinstance(start_time, datetime):
        return 0.0

    return max(
        0.0,
        (datetime.now(timezone.utc) - start_time).total_seconds(),
    )


@router.get("/health", response_model=HealthCheckResponse, summary="Health check")
async def health(request: Request) -> HealthCheckResponse:
    """Return operational metadata used by availability probes."""

    return HealthCheckResponse(
        status="ok",
        service=SERVICE_METADATA,
        environment=SERVICE_ENVIRONMENT,
        uptime_seconds=_calculate_uptime_seconds(
            getattr(request.app.state, "service_start_time", None),
        ),
    )
