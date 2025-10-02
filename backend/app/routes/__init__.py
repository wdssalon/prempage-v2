"""Aggregate FastAPI routes."""
from __future__ import annotations

from fastapi import APIRouter

from app.routes import health, palette


router = APIRouter()
router.include_router(health.router)
router.include_router(palette.router)


__all__ = ["router"]
