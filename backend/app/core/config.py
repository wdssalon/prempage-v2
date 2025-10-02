"""Static configuration constants and helpers."""
from __future__ import annotations

from pydantic import BaseModel


class AppConfig(BaseModel):
    """Minimal configuration for application bootstrap."""

    allowed_origins: list[str] = [
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]
    environment: str = "dev"
    title: str = "Prempage Backend"
    summary: str = "Backend service supporting the Prempage Studio"
    version: str = "0.1.0"


settings = AppConfig()
