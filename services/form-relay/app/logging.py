"""Logging configuration helpers."""
from __future__ import annotations

import sys
from typing import Literal

from loguru import logger

LOG_FORMAT = (
    "<green>{time:YYYY-MM-DD HH:mm:ss.SSS}</green> | "
    "<level>{level: <8}</level> | "
    "<cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - "
    "<level>{message}</level>"
)


def configure_logging(level: str = "INFO") -> None:
    """Configure Loguru to emit structured logs to stdout."""
    normalized_level: Literal[
        "TRACE",
        "DEBUG",
        "INFO",
        "SUCCESS",
        "WARNING",
        "ERROR",
        "CRITICAL",
    ] = level.upper() if isinstance(level, str) else "INFO"  # type: ignore[assignment]

    logger.remove()
    logger.add(
        sys.stdout,
        level=normalized_level,
        backtrace=False,
        diagnose=False,
        enqueue=True,
        format=LOG_FORMAT,
    )
