"""Common helpers for automation CLI scripts.

Each script should:
- Parse inputs via argparse.
- Use ``log_message`` for progress updates to stderr.
- Emit a structured JSON payload with ``emit_success`` or ``emit_error``.
"""

from __future__ import annotations

import json
import sys
import time
from pathlib import Path
from typing import Any

ISO_TIMESTAMP_FORMAT = "%Y-%m-%dT%H:%M:%S"


class ScriptError(Exception):
  """Exception class that carries an exit code and structured details."""

  def __init__(self, message: str, *, code: str = "error", exit_code: int = 1, details: dict[str, Any] | None = None) -> None:
    super().__init__(message)
    self.code = code
    self.exit_code = exit_code
    self.details = details or {}


def log_message(level: str, message: str) -> None:
  """Write a timestamped log line to stderr."""
  timestamp = time.strftime(ISO_TIMESTAMP_FORMAT, time.localtime())
  sys.stderr.write(f"[{timestamp}] {level.upper():8s} {message}\n")
  sys.stderr.flush()


def _json_default(value: Any) -> Any:
  if isinstance(value, Path):
    return str(value)
  return value


def _write_payload(payload: dict[str, Any]) -> None:
  sys.stdout.write(json.dumps(payload, default=_json_default, sort_keys=True))
  sys.stdout.write("\n")
  sys.stdout.flush()


def emit_success(data: dict[str, Any], *, exit_code: int = 0) -> None:
  """Emit a success payload and exit."""
  _write_payload({"status": "success", "data": data})
  raise SystemExit(exit_code)


def emit_error(message: str, *, code: str = "error", details: dict[str, Any] | None = None, exit_code: int = 1) -> None:
  """Emit an error payload and exit."""
  payload = {"status": "error", "error": {"code": code, "message": message, "details": details or {}}}
  _write_payload(payload)
  raise SystemExit(exit_code)
