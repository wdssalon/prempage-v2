"""Core utilities for the backend app."""
from __future__ import annotations

from app.core.config import settings  # re-export for convenience
from app.core.logging import configure_logging
from app.core.lifespan import lifespan

__all__ = ["configure_logging", "lifespan", "settings"]
