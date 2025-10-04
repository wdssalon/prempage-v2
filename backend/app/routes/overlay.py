"""Endpoints for ingesting overlay editor events."""
from __future__ import annotations

from fastapi import APIRouter, status
from loguru import logger

from app.models.overlay import OverlayEditEvent, OverlayEditResponse
from app.services.overlay import apply_overlay_edit


router = APIRouter(prefix="/overlay", tags=["overlay"])


@router.post(
    "/events/edit",
    status_code=status.HTTP_200_OK,
    response_model=OverlayEditResponse,
)
async def ingest_overlay_edit(event: OverlayEditEvent) -> OverlayEditResponse:
    """Accept an overlay edit payload and apply it to the target source file."""

    result = apply_overlay_edit(event)

    logger.bind(
        project_slug=event.project_slug,
        ppid=event.payload.ppid,
        reason=event.meta.reason,
        text_length=len(event.payload.text),
        path=result.relative_path,
    ).info("Overlay edit applied")

    return OverlayEditResponse(
        projectSlug=event.project_slug,
        relativePath=result.relative_path,
        previousText=result.previous_text,
        updatedText=result.updated_text,
    )


__all__ = ["router"]
