"""Horizon template palette request/response models."""
from __future__ import annotations

import re
from datetime import datetime, timezone

from pydantic import BaseModel, ConfigDict, Field, field_validator


_HEX_COLOR_PATTERN = re.compile(r"^#[0-9A-Fa-f]{6}$")


class HorizonPalette(BaseModel):
    """Palette schema for the Horizon template color keys."""

    model_config = ConfigDict(extra="forbid")

    bg_base: str
    bg_surface: str
    bg_contrast: str
    text_primary: str
    text_secondary: str
    text_inverse: str
    brand_primary: str
    brand_secondary: str
    accent: str
    border: str
    ring: str
    critical: str
    critical_contrast: str

    @field_validator("*")
    @classmethod
    def validate_hex_color(cls, value: str) -> str:
        if not _HEX_COLOR_PATTERN.match(value):
            raise ValueError("Palette values must be hex colors like #RRGGBB")
        return value.lower()


class HorizonPaletteSwapRequest(BaseModel):
    """Optional metadata supplied when requesting a Horizon palette refresh."""

    notes: str | None = Field(
        default=None,
        description="Optional freeform guidance for palette generation.",
    )


class HorizonPaletteSwapResponse(BaseModel):
    """Payload returned after the backend applies a new Horizon palette."""

    palette: HorizonPalette
    applied_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="UTC timestamp when the palette was applied.",
    )
