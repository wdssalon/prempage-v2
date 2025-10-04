"""Endpoints for ingesting overlay editor events."""
from __future__ import annotations

from fastapi import APIRouter, status
from loguru import logger

from app.models.overlay import OverlayEditEvent


router = APIRouter(prefix="/overlay", tags=["overlay"])


@router.post("/events/edit", status_code=status.HTTP_202_ACCEPTED)
async def ingest_overlay_edit(event: OverlayEditEvent) -> dict[str, str]:
    """Accept an overlay edit payload and log it for downstream processing."""

    logger.bind(
        project_slug=event.project_slug,
        ppid=event.payload.ppid,
        reason=event.meta.reason,
        text_length=len(event.payload.text),
    ).info("Overlay edit received")

    return {"status": "accepted"}


__all__ = ["router"]

