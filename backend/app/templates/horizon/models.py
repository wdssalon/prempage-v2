"""Horizon template palette request/response models."""
from __future__ import annotations

import re
from datetime import datetime, timezone

from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator


_HEX_COLOR_PATTERN = re.compile(r"^#[0-9A-Fa-f]{6}$")
CUSTOM_SECTION_KEY = "custom_blank_section"


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


class HorizonSectionInsertRequest(BaseModel):
    """Request payload for inserting a Horizon section."""

    section_key: str = Field(..., description="Catalog key for the section to insert")
    position: Literal["before", "after", "start", "end"] = Field(
        ..., description="Relative placement for the new section",
    )
    target_section_id: str | None = Field(
        default=None,
        description="Section ID the insertion is relative to (required for before/after)",
    )
    custom_section_prompt: str | None = Field(
        default=None,
        description="Natural language brief used when inserting a custom section.",
        max_length=10_000,
    )

    @field_validator("custom_section_prompt")
    @classmethod
    def normalize_custom_prompt(cls, value: str | None) -> str | None:
        if value is None:
            return None
        stripped = value.strip()
        return stripped or None

    @model_validator(mode="after")
    def validate_target(cls, values: "HorizonSectionInsertRequest") -> "HorizonSectionInsertRequest":
        if values.position in {"before", "after"} and not values.target_section_id:
            raise ValueError("target_section_id is required for before/after positions")
        if values.section_key == CUSTOM_SECTION_KEY and not values.custom_section_prompt:
            raise ValueError("custom_section_prompt is required for custom sections")
        return values


class HorizonSectionInsertResponse(BaseModel):
    """Response payload after inserting a Horizon section."""

    component_relative_path: str = Field(
        ..., description="Path to the cloned component relative to the site root",
    )
    import_identifier: str = Field(
        ..., description="Identifier used in the HomePage.jsx import",
    )
    section_id: str = Field(
        ..., description="Generated sectionId assigned to the new component",
    )
    slot: str = Field(
        ..., description="Slot marker where the component was inserted",
    )
