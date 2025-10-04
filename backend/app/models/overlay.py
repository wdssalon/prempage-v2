"""Schema definitions for overlay editing events."""
from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


class OverlayEditPayload(BaseModel):
    """Text edit emitted from the in-page overlay."""

    ppid: str = Field(..., min_length=1, description="Stable identifier for the edited node")
    text: str = Field(..., description="Sanitized text content captured from the overlay")


class OverlayEditMeta(BaseModel):
    """Additional metadata describing how the edit was committed."""

    reason: Literal["enter", "blur"] = Field(
        ..., description="Trigger that finalized the edit inside the overlay"
    )


class OverlayEditEvent(BaseModel):
    """Full payload accepted by the overlay ingest endpoint."""

    project_slug: str = Field(
        ...,
        min_length=1,
        alias="projectSlug",
        description="Slug of the Studio project emitting the edit",
    )
    payload: OverlayEditPayload
    meta: OverlayEditMeta


__all__ = [
    "OverlayEditEvent",
    "OverlayEditMeta",
    "OverlayEditPayload",
]

