"""Helpers for emitting debuggable AI interaction logs."""
from __future__ import annotations

import json
import os
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from collections.abc import Mapping, Sequence

from loguru import logger

_TRUTHY_VALUES = {"1", "true", "yes", "on"}


def _ensure_log_path(path_value: str) -> Path | None:
    try:
        candidate = Path(path_value).expanduser()
        candidate.parent.mkdir(parents=True, exist_ok=True)
        return candidate
    except Exception as exc:  # noqa: BLE001
        logger.warning(
            "Failed to prepare AI debug log file at {path}: {error}",
            path=path_value,
            error=str(exc),
        )
        return None


@dataclass(slots=True)
class InteractionDebugger:
    """Utility for recording AI request/response cycles for troubleshooting."""

    enabled: bool
    log_path: Path | None

    @classmethod
    def from_env(
        cls,
        flag_env: str,
        path_env: str,
        default_path: str | None = None,
    ) -> "InteractionDebugger":
        raw_flag = os.getenv(flag_env, "0")
        enabled = str(raw_flag).lower() in _TRUTHY_VALUES

        log_path: Path | None = None
        if enabled:
            fallback = default_path or "/tmp/prempage_ai_debug.log"
            raw_path = os.getenv(path_env, fallback)
            log_path = _ensure_log_path(raw_path)

        return cls(enabled=enabled, log_path=log_path)

    def log_text(self, stage: str, content: str) -> None:
        if not self.enabled:
            return

        message = f"AI debug [{stage}]\n{content}"
        logger.info(message)

        if self.log_path is None:
            return

        try:
            timestamp = datetime.now(timezone.utc).isoformat()
            separator = "=" * 80
            with self.log_path.open("a", encoding="utf-8") as handle:
                handle.write(f"{separator}\n")
                handle.write(f"{timestamp} | stage={stage}\n")
                handle.write(content.rstrip())
                handle.write("\n")
        except Exception as exc:  # noqa: BLE001
            logger.warning("Failed to append AI debug log: {error}", error=str(exc))

    def log_json(self, stage: str, payload: Any) -> None:
        if not self.enabled:
            return

        try:
            serialisable = to_serialisable(payload)
            formatted = json.dumps(serialisable, indent=2, ensure_ascii=False)
        except Exception as exc:  # noqa: BLE001
            logger.warning("Failed to serialise AI debug payload: {error}", error=str(exc))
            formatted = repr(payload)

        self.log_text(stage, formatted)


def to_serialisable(value: Any) -> Any:
    """Convert complex objects into JSON-friendly structures for logging."""

    if value is None or isinstance(value, (str, int, float, bool)):
        return value

    if isinstance(value, Mapping):
        return {str(key): to_serialisable(item) for key, item in value.items()}

    if isinstance(value, Sequence) and not isinstance(value, (bytes, bytearray, str)):
        return [to_serialisable(item) for item in value]

    for attr in ("model_dump", "model_dump_json", "to_dict", "json"):
        method = getattr(value, attr, None)
        if callable(method):
            result = method()
            if isinstance(result, (str, bytes)):
                try:
                    return json.loads(result)
                except Exception:  # noqa: BLE001
                    return result.decode() if isinstance(result, bytes) else result
            return to_serialisable(result)

    return repr(value)


__all__ = ["InteractionDebugger", "to_serialisable"]
