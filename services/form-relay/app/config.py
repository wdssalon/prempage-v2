"""Configuration management for the form relay service."""
from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path
from typing import List
from urllib.parse import urlparse

from pydantic import Field, computed_field, field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent
DEFAULT_ALLOWED_ORIGINS_PATH = BASE_DIR / "allowed-origins.json"


class Settings(BaseSettings):
    """Service configuration loaded from environment variables and files."""

    service_name: str = Field(default="form-relay")
    log_level: str = Field(default="INFO")

    allowed_origins: List[str] = Field(default_factory=list)
    allowed_origins_file: str | None = Field(default=None)

    sentry_dsn: str | None = Field(default=None)
    sentry_environment: str = Field(default="development")
    sentry_traces_sample_rate: float = Field(default=0.0, ge=0.0, le=1.0)
    sentry_profiles_sample_rate: float = Field(default=0.0, ge=0.0, le=1.0)

    salon_forwarding_enabled: bool = Field(default=False)
    salon_endpoint_url: str | None = Field(default=None)
    salon_auth_token: str | None = Field(default=None)

    model_config = SettingsConfigDict(
        env_prefix="FORM_RELAY_",
        env_file=".env",
        extra="ignore",
    )

    @field_validator("allowed_origins", mode="before")
    @classmethod
    def parse_allowed_origins(cls, value: str | list[str]) -> list[str]:
        """Allow comma-separated values for origins in environment variables."""
        if isinstance(value, str):
            items = [item.strip() for item in value.split(",") if item.strip()]
            return items
        return value

    @model_validator(mode="after")
    def populate_allowed_origins_from_file(self) -> "Settings":
        """Load allowed origins from JSON if not provided via env."""
        if self.allowed_origins:
            return self

        candidate_path = self.allowed_origins_file
        if candidate_path:
            path = Path(candidate_path).expanduser().resolve()
        else:
            path = DEFAULT_ALLOWED_ORIGINS_PATH

        if not path.exists():
            return self

        try:
            data = json.loads(path.read_text())
        except json.JSONDecodeError as exc:  # pragma: no cover - configuration error
            raise ValueError(f"Unable to parse allowed origins file at {path}: {exc}") from exc

        if isinstance(data, list):
            self.allowed_origins = [str(item) for item in data if item]
        return self

    @computed_field(return_type=list[str])
    @property
    def allowed_hosts(self) -> list[str]:
        """Return normalized hostnames derived from allowed origins."""
        hosts: list[str] = []
        for origin in self.allowed_origins:
            parsed = urlparse(origin)
            host = parsed.hostname or origin
            if host:
                hosts.append(host.lower())
        return sorted(set(hosts))


@lru_cache
def get_settings() -> Settings:
    """Return a cached settings instance."""
    return Settings()
