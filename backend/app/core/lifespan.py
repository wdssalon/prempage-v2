"""Application lifespan hooks."""
from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from loguru import logger


@asynccontextmanager
async def lifespan(app: FastAPI):  # noqa: D401
    """Manage application startup and shutdown events."""

    logger.info("Starting Prempage backend service")
    try:
        yield
    finally:
        logger.info("Stopping Prempage backend service")
