"""Factory for creating the FastAPI application instance."""
from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core import configure_logging, lifespan, settings
from app.core.error_handlers import register_error_handlers
from app.routes import router as api_router


def create_app() -> FastAPI:
    """Create and configure a FastAPI application instance."""

    configure_logging()

    app = FastAPI(
        title=settings.title,
        summary=settings.summary,
        version=settings.version,
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    register_error_handlers(app)

    app.include_router(api_router)

    return app


__all__ = ["create_app"]
