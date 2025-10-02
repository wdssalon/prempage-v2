"""Logging configuration helpers for the backend service."""
from __future__ import annotations

import sys

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
        format=(
            "<green>{time:YYYY-MM-DD HH:mm:ss}</green> | "
            "<level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan> - "
            "<level>{message}</level>"
        ),
    )
