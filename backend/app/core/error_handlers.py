"""Centralised FastAPI exception handlers."""
from __future__ import annotations

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from loguru import logger

from app.errors import AppError


def register_error_handlers(app: FastAPI) -> None:
    """Register shared exception handlers on the FastAPI app."""

    async def handle_app_error(request: Request, exc: AppError) -> JSONResponse:
        logger.warning(
            "Handled AppError",
            status_code=exc.status_code,
            error_code=exc.error_code,
            detail=exc.detail,
            path=request.url.path,
        )

        payload: dict[str, object] = {
            "detail": exc.detail,
            "error_code": exc.error_code,
        }

        if exc.context:
            payload["context"] = exc.context

        return JSONResponse(status_code=exc.status_code, content=payload)

    app.add_exception_handler(AppError, handle_app_error)


__all__ = ["register_error_handlers"]
