"""FastAPI application factory for the form relay service."""
from __future__ import annotations

from contextlib import asynccontextmanager
from urllib.parse import urlparse

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from loguru import logger

from .clients.salon import SalonSubmission, forward_to_salon
from .config import Settings, get_settings
from .logging import configure_logging
from .schemas import (
    ErrorResponse,
    HealthResponse,
    SubmissionContext,
    SubmissionRequest,
    SubmissionResponse,
)
from .telemetry import configure_sentry


def resolve_origin(request: Request, settings: Settings) -> tuple[str, str]:
    """Derive the caller origin string and hostname, enforcing allow-list rules."""
    origin = request.headers.get("origin")
    referer = request.headers.get("referer")
    host_header = request.headers.get("host")

    candidate = origin or referer
    if not candidate and host_header:
        scheme = request.url.scheme or "https"
        candidate = f"{scheme}://{host_header}"

    if not candidate:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Origin header missing")

    parsed = urlparse(candidate)
    hostname = parsed.hostname or candidate
    if not hostname:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unable to parse request origin")

    normalized_host = hostname.lower()
    if settings.allowed_hosts and normalized_host not in settings.allowed_hosts:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Origin is not allowed")

    origin_root = f"{parsed.scheme}://{parsed.netloc}" if parsed.scheme and parsed.netloc else candidate
    return origin_root, normalized_host


def resolve_client_ip(request: Request) -> str:
    """Determine the caller IP, honoring X-Forwarded-For when present."""
    forwarded_for = request.headers.get("x-forwarded-for")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()
    if request.client and request.client.host:
        return request.client.host
    return "unknown"


@asynccontextmanager
async def lifespan(app: FastAPI):  # noqa: D401
    """Manage application startup and shutdown events."""
    settings: Settings = app.state.settings
    logger.info("Starting {} service", settings.service_name)
    try:
        yield
    finally:
        logger.info("Stopping {} service", settings.service_name)


def create_app() -> FastAPI:
    """Application factory used by both tests and runtime."""
    settings = get_settings()
    configure_logging(settings.log_level)
    configure_sentry(settings)

    app = FastAPI(
        title="Prempage Form Relay",
        version="0.1.0",
        summary="Receives static-site form submissions and forwards them to Salon.",
        lifespan=lifespan,
    )
    app.state.settings = settings

    if settings.allowed_origins:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=settings.allowed_origins,
            allow_credentials=False,
            allow_methods=["POST", "OPTIONS"],
            allow_headers=["*"]
        )
    else:  # pragma: no cover - misconfiguration safeguard
        logger.warning("No CORS origins configured; cross-site requests will be rejected")

    @app.exception_handler(HTTPException)
    async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
        message = exc.detail if isinstance(exc.detail, str) else "Request failed"
        logger.warning(
            "HTTP error handling submission: status={}, message={}, path={}",
            exc.status_code,
            message,
            request.url.path,
        )
        payload = ErrorResponse(message=message)
        return JSONResponse(status_code=exc.status_code, content=payload.model_dump())

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
        logger.exception("Unhandled error processing submission")
        payload = ErrorResponse(message="Internal server error")
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content=payload.model_dump())

    @app.post(
        "/v1/forms/submissions",
        response_model=SubmissionResponse,
        status_code=status.HTTP_202_ACCEPTED,
        tags=["forms"],
        summary="Receive a form submission",
    )
    async def submit_form(request_payload: SubmissionRequest, request: Request) -> SubmissionResponse:
        origin, hostname = resolve_origin(request, settings)
        client_ip = resolve_client_ip(request)

        context = SubmissionContext(
            origin=origin,
            hostname=hostname,
            client_ip=client_ip,
            user_agent=request.headers.get("user-agent"),
            referer=request.headers.get("referer"),
        )

        logger.info(
            "Accepted submission {} from host={} ip={} form={}",
            context.submission_id,
            hostname,
            client_ip,
            request_payload.form_name,
        )

        salon_payload = SalonSubmission(
            submission_id=str(context.submission_id),
            origin=context.origin,
            hostname=context.hostname,
            form_name=request_payload.form_name,
            client_ip=context.client_ip,
            user_agent=context.user_agent,
            referer=context.referer,
            fields=request_payload.fields,
            metadata={
                **request_payload.metadata,
                "received_at": context.received_at.isoformat(),
            },
        )

        await forward_to_salon(salon_payload)

        return SubmissionResponse(submission_id=context.submission_id)

    @app.get(
        "/health",
        response_model=HealthResponse,
        tags=["health"],
        summary="Service health check",
    )
    async def health() -> HealthResponse:
        return HealthResponse(service=settings.service_name)

    return app
