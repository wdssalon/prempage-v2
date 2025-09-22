"""Prempage V2 FastAPI application entry point."""
from __future__ import annotations

from contextlib import asynccontextmanager
import sys

from fastapi import FastAPI
from loguru import logger


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


@app.get("/health", tags=["health"], summary="Health check")
async def health() -> dict[str, str]:
    """Return a simple health payload for monitoring."""
    logger.debug("Health endpoint called")
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn

    logger.info("Launching development server with reload enabled")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
