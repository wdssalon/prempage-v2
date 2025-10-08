"""Routes for managing Horizon section library operations."""
from __future__ import annotations

from fastapi import APIRouter, HTTPException, status

from app.templates.horizon.models import (
    HorizonSectionInsertRequest,
    HorizonSectionInsertResponse,
)
from app.templates.horizon.sections import (
    HorizonSectionInsertionError,
    HorizonSectionLibraryService,
)


router = APIRouter(prefix="/projects/{project_slug}/sections", tags=["sections"])


@router.post(
    "/insert",
    response_model=HorizonSectionInsertResponse,
    status_code=status.HTTP_201_CREATED,
)
def insert_section(
    project_slug: str,
    payload: HorizonSectionInsertRequest,
) -> HorizonSectionInsertResponse:
    """Clone a Horizon section into the specified project workspace."""

    service = HorizonSectionLibraryService()

    try:
        slot = service.resolve_slot(payload.position, payload.target_section_id)
        result = service.insert_section_by_slot(
            site_slug=project_slug,
            section_key=payload.section_key,
            slot=slot,
        )
    except HorizonSectionInsertionError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc

    return HorizonSectionInsertResponse(**result.__dict__)


__all__ = ["router"]
