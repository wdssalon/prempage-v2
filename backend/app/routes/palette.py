"""Palette swapping endpoint."""
from __future__ import annotations

from fastapi import APIRouter

from app.templates.horizon.models import (
    HorizonPaletteSwapRequest,
    HorizonPaletteSwapResponse,
)
from app.templates.horizon.service import HorizonPaletteService


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

    service = HorizonPaletteService()
    return service.swap_palette(slug, request)
