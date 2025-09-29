#!/usr/bin/env python3
"""Generate and run the Horizon example site via cookiecutter.

Steps performed:
- Render the cookiecutter template into `public-sites/sites/horizon-example`
- Install dependencies with `pnpm install`
- Start the dev server via `pnpm dev`

The script deletes any existing `horizon-example` directory before regeneration.
"""

from __future__ import annotations

import json
import shutil
import subprocess
import sys
from pathlib import Path

SCRIPT_PATH = Path(__file__).resolve()
CONFIG_DIR = SCRIPT_PATH.parent.parent
REPO_ROOT = CONFIG_DIR.parents[4]
SITES_DIR = REPO_ROOT / "public-sites" / "sites"
PROJECT_SLUG = "horizon-example"
PROJECT_DIR = SITES_DIR / PROJECT_SLUG
EXAMPLE_CONTEXT_PATH = CONFIG_DIR / "example-cookiecutter-context.json"


def load_context() -> dict[str, str]:
    base_context = {}
    if EXAMPLE_CONTEXT_PATH.exists():
        with EXAMPLE_CONTEXT_PATH.open("r", encoding="utf-8") as handle:
            data = json.load(handle)
            base_context = data.get("default_context", {})
    context = dict(base_context)
    context.update(
        project_name="Horizon Example",
        project_slug=PROJECT_SLUG,
        seo_title="Horizon Example | Horizon Template",
        seo_description="Reference site generated for quick regression testing",
    )
    return context


def run_cookiecutter(context: dict[str, str]) -> None:
    if PROJECT_DIR.exists():
        shutil.rmtree(PROJECT_DIR)

    cmd = [
        "uv",
        "tool",
        "run",
        "cookiecutter",
        str(CONFIG_DIR),
        "--output-dir",
        str(SITES_DIR),
        "--no-input",
    ]
    cmd.extend(f"{key}={value}" for key, value in context.items())

    subprocess.run(cmd, check=True, cwd=REPO_ROOT)


def run_pnpm(*args: str) -> None:
    subprocess.run(["pnpm", *args], check=True, cwd=PROJECT_DIR)


def main() -> None:
    if not SITES_DIR.exists():
        SITES_DIR.mkdir(parents=True, exist_ok=True)

    context = load_context()
    run_cookiecutter(context)
    run_pnpm("install")

    print("\n\n🚀 Starting dev server — press Ctrl+C to stop.\n")
    try:
        run_pnpm("dev")
    except subprocess.CalledProcessError as exc:
        sys.exit(exc.returncode)


if __name__ == "__main__":
    main()
