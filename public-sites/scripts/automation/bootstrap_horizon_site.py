#!/usr/bin/env python3
"""Copy the Horizon Next.js boilerplate into a site workspace.

Outputs a structured JSON payload so the automation runner can audit results.
"""

from __future__ import annotations

import argparse
import shutil
import subprocess
import time
from pathlib import Path
from typing import Any

from _utils import ScriptError, emit_error, emit_success, log_message
from _utils.horizon import BOILERPLATE_ROOT, SITES_ROOT, TEMPLATE_ROOT, TEMPLATE_SLUG


def parse_args() -> argparse.Namespace:
  parser = argparse.ArgumentParser(description="Bootstrap a Horizon site directory with the shared boilerplate app")
  parser.add_argument("--site-slug", required=True, help="Site slug (e.g., acme-horizon)")
  parser.add_argument("--template-slug", default=TEMPLATE_SLUG, help="Template slug; must remain horizon")
  parser.add_argument("--force", action="store_true", help="Overwrite an existing site directory if it already exists")
  parser.add_argument("--skip-install", action="store_true", help="Skip running pnpm install after copying files")
  parser.add_argument("--pnpm", default="pnpm", help="pnpm command to invoke (defaults to pnpm on PATH)")
  return parser.parse_args()


def ensure_template_available(template_slug: str) -> None:
  if template_slug != TEMPLATE_SLUG:
    raise ScriptError(
      f"Unsupported template slug: {template_slug}",
      code="unsupported_template",
      details={"expected": TEMPLATE_SLUG, "received": template_slug},
    )
  if not TEMPLATE_ROOT.exists():
    raise ScriptError(
      "Horizon template root is missing",
      code="missing_template",
      details={"template_root": str(TEMPLATE_ROOT)},
    )
  if not BOILERPLATE_ROOT.exists():
    raise ScriptError(
      "Horizon boilerplate app is missing",
      code="missing_boilerplate",
      details={"boilerplate_root": str(BOILERPLATE_ROOT)},
    )


def copy_boilerplate(destination: Path, *, force: bool) -> dict[str, Any]:
  start = time.perf_counter()
  overwrote_existing = False
  if destination.exists():
    if not force:
      raise ScriptError(
        f"Destination already exists: {destination}",
        code="destination_exists",
        details={"destination": str(destination)},
      )
    log_message("info", f"Removing existing directory {destination}")
    shutil.rmtree(destination)
    overwrote_existing = True
  log_message("info", f"Copying boilerplate from {BOILERPLATE_ROOT} to {destination}")
  shutil.copytree(BOILERPLATE_ROOT, destination)
  duration_ms = int((time.perf_counter() - start) * 1000)
  return {
    "source": str(BOILERPLATE_ROOT),
    "destination": str(destination),
    "duration_ms": duration_ms,
    "overwrote_existing": overwrote_existing,
  }


def _trim_output(text: str, *, max_chars: int = 2000) -> str:
  if len(text) <= max_chars:
    return text
  return text[-max_chars:]


def run_pnpm_install(destination: Path, pnpm_cmd: str) -> dict[str, Any]:
  log_message("info", "Running pnpm install")
  start = time.perf_counter()
  result = subprocess.run(
    [pnpm_cmd, "install"],
    cwd=destination,
    capture_output=True,
    text=True,
  )
  duration_ms = int((time.perf_counter() - start) * 1000)
  output = {
    "ran": True,
    "exit_code": result.returncode,
    "duration_ms": duration_ms,
    "stdout_tail": _trim_output(result.stdout.strip()),
    "stderr_tail": _trim_output(result.stderr.strip()),
  }
  if result.returncode != 0:
    raise ScriptError(
      "pnpm install failed",
      code="pnpm_install_failed",
      details=output,
    )
  return output


def main() -> None:
  args = parse_args()
  ensure_template_available(args.template_slug)

  site_dir = SITES_ROOT / args.site_slug
  copy_info = copy_boilerplate(site_dir, force=args.force)

  install_info: dict[str, Any]
  if args.skip_install:
    log_message("info", "Skipping pnpm install per flag")
    install_info = {"ran": False}
  else:
    install_info = run_pnpm_install(site_dir, args.pnpm)

  emit_success(
    {
      "site_slug": args.site_slug,
      "template_slug": TEMPLATE_SLUG,
      "copy": copy_info,
      "pnpm_install": install_info,
    }
  )


if __name__ == "__main__":
  try:
    main()
  except ScriptError as exc:
    emit_error(str(exc), code=exc.code, details=exc.details, exit_code=exc.exit_code)
  except Exception as exc:  # pragma: no cover - defensive catch-all
    log_message("error", f"Unexpected failure: {exc}")
    emit_error(
      "Unexpected error while bootstrapping Horizon site",
      code="unexpected_error",
      details={"exception": str(exc)},
    )
