"""Prempage V2 FastAPI application entry point."""
from __future__ import annotations

from contextlib import asynccontextmanager
from datetime import datetime, timezone
import sys

from fastapi import FastAPI
from loguru import logger

from schemas import HealthCheckResponse, ServiceMetadata


def configure_logging() -> None:
    """Configure Loguru to emit structured logs to stdout."""
    logger.remove()
    logger.add(
        sys.stdout,
        level="INFO",
        enqueue=True,
        backtrace=True,
        diagnose=False,
        format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | "
        "<cyan>{name}</cyan>:<cyan>{function}</cyan> - <level>{message}</level>",
    )


configure_logging()


@asynccontextmanager
async def lifespan(app: FastAPI):  # noqa: D401
    """Manage application startup and shutdown events."""
    logger.info("Starting Prempage backend service")
    try:
        yield
    finally:
        logger.info("Stopping Prempage backend service")


app = FastAPI(
    title="Prempage Backend",
    summary="Boilerplate FastAPI service for Prempage V2",
    version="0.1.0",
    lifespan=lifespan,
)

SERVICE_METADATA = ServiceMetadata(name="prempage-backend", version=app.version)
SERVICE_START_TIME = datetime.now(timezone.utc)


@app.get(
    "/health",
    tags=["health"],
    summary="Health check",
    response_model=HealthCheckResponse,
)
async def health() -> HealthCheckResponse:
    """Return operational metadata used by availability probes."""
    logger.debug("Health endpoint called")
    return HealthCheckResponse(
        status="ok",
        service=SERVICE_METADATA,
        uptime_seconds=(datetime.now(timezone.utc) - SERVICE_START_TIME).total_seconds(),
    )


if __name__ == "__main__":
    import uvicorn

    logger.info("Launching development server with reload enabled")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
