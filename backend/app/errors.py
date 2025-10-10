"""Shared application error hierarchy used across services."""
from __future__ import annotations

from http import HTTPStatus
from typing import Any, Mapping


class AppError(Exception):
    """Base class for domain errors that map to HTTP responses."""

    def __init__(
        self,
        detail: str,
        *,
        status_code: int = HTTPStatus.INTERNAL_SERVER_ERROR,
        error_code: str = "internal_error",
        context: Mapping[str, Any] | None = None,
    ) -> None:
        super().__init__(detail)
        self.detail = detail
        self.status_code = int(status_code)
        self.error_code = error_code
        self.context = dict(context) if context is not None else None


class BadRequestError(AppError):
    """Raised when the client sends an invalid request."""

    def __init__(
        self,
        detail: str,
        *,
        error_code: str = "bad_request",
        context: Mapping[str, Any] | None = None,
    ) -> None:
        super().__init__(
            detail,
            status_code=HTTPStatus.BAD_REQUEST,
            error_code=error_code,
            context=context,
        )


class ForbiddenError(AppError):
    """Raised when a client attempts an action they are not allowed to perform."""

    def __init__(
        self,
        detail: str,
        *,
        error_code: str = "forbidden",
        context: Mapping[str, Any] | None = None,
    ) -> None:
        super().__init__(
            detail,
            status_code=HTTPStatus.FORBIDDEN,
            error_code=error_code,
            context=context,
        )


class NotFoundError(AppError):
    """Raised when a requested resource cannot be located."""

    def __init__(
        self,
        detail: str,
        *,
        error_code: str = "not_found",
        context: Mapping[str, Any] | None = None,
    ) -> None:
        super().__init__(
            detail,
            status_code=HTTPStatus.NOT_FOUND,
            error_code=error_code,
            context=context,
        )


class ConflictError(AppError):
    """Raised when a request conflicts with existing state."""

    def __init__(
        self,
        detail: str,
        *,
        error_code: str = "conflict",
        context: Mapping[str, Any] | None = None,
    ) -> None:
        super().__init__(
            detail,
            status_code=HTTPStatus.CONFLICT,
            error_code=error_code,
            context=context,
        )


class UnprocessableEntityError(AppError):
    """Raised when the request payload cannot be processed."""

    def __init__(
        self,
        detail: str,
        *,
        error_code: str = "unprocessable_entity",
        context: Mapping[str, Any] | None = None,
    ) -> None:
        super().__init__(
            detail,
            status_code=HTTPStatus.UNPROCESSABLE_ENTITY,
            error_code=error_code,
            context=context,
        )


class RequestEntityTooLargeError(AppError):
    """Raised when the request payload exceeds accepted size limits."""

    def __init__(
        self,
        detail: str,
        *,
        error_code: str = "request_entity_too_large",
        context: Mapping[str, Any] | None = None,
    ) -> None:
        super().__init__(
            detail,
            status_code=HTTPStatus.REQUEST_ENTITY_TOO_LARGE,
            error_code=error_code,
            context=context,
        )


class ServiceUnavailableError(AppError):
    """Raised when a dependent service fails or is unavailable."""

    def __init__(
        self,
        detail: str,
        *,
        error_code: str = "service_unavailable",
        context: Mapping[str, Any] | None = None,
    ) -> None:
        super().__init__(
            detail,
            status_code=HTTPStatus.BAD_GATEWAY,
            error_code=error_code,
            context=context,
        )


class InternalServerError(AppError):
    """Raised when an unexpected server-side error occurs."""

    def __init__(
        self,
        detail: str,
        *,
        error_code: str = "internal_error",
        context: Mapping[str, Any] | None = None,
    ) -> None:
        super().__init__(
            detail,
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
            error_code=error_code,
            context=context,
        )


__all__ = [
    "AppError",
    "BadRequestError",
    "ConflictError",
    "ForbiddenError",
    "InternalServerError",
    "NotFoundError",
    "RequestEntityTooLargeError",
    "ServiceUnavailableError",
    "UnprocessableEntityError",
]
