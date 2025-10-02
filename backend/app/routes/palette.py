"""Palette swapping endpoint."""
from __future__ import annotations

from fastapi import APIRouter, HTTPException

from app.templates.horizon.models import (
    HorizonPaletteSwapRequest,
    HorizonPaletteSwapResponse,
)
from app.templates.horizon.service import (
    HorizonPaletteApplyError,
    HorizonPaletteGenerationError,
    HorizonPaletteService,
    HorizonSiteNotFoundError,
)


router = APIRouter(prefix="/sites", tags=["palette"])


@router.post(
    "/{slug}/palette/swap",
    response_model=HorizonPaletteSwapResponse,
    summary="Generate and apply a new palette",
)
async def swap_site_palette(
    slug: str, request: HorizonPaletteSwapRequest
) -> HorizonPaletteSwapResponse:
    """Generate a new palette and apply it to the requested site."""

    try:
        service = HorizonPaletteService()
        return service.swap_palette(slug, request)
    except HorizonSiteNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except HorizonPaletteGenerationError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
    except HorizonPaletteApplyError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
