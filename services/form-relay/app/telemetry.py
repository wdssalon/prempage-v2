"""Telemetry (Sentry) configuration."""
from __future__ import annotations

import logging

import sentry_sdk
from loguru import logger
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.integrations.logging import LoggingIntegration

from .config import Settings


def configure_sentry(settings: Settings) -> None:
    """Initialize Sentry if a DSN is provided."""
    if not settings.sentry_dsn:
        logger.info("Sentry DSN not configured; telemetry disabled")
        return

    sentry_logging = LoggingIntegration(
        level=logging.ERROR,
        event_level=logging.ERROR,
    )

    sentry_sdk.init(
        dsn=settings.sentry_dsn,
        environment=settings.sentry_environment,
        integrations=[FastApiIntegration(), sentry_logging],
        traces_sample_rate=settings.sentry_traces_sample_rate,
        profiles_sample_rate=settings.sentry_profiles_sample_rate,
    )
    logger.info("Sentry telemetry initialized")
