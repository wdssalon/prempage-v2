"""Application lifespan hooks."""
from __future__ import annotations

from contextlib import asynccontextmanager
from datetime import datetime, timezone

from fastapi import FastAPI
from loguru import logger


@asynccontextmanager
async def lifespan(app: FastAPI):  # noqa: D401
    """Manage application startup and shutdown events."""

    app.state.service_start_time = datetime.now(timezone.utc)
    logger.info("Starting Prempage backend service")
    try:
        yield
    finally:
        logger.info("Stopping Prempage backend service")
