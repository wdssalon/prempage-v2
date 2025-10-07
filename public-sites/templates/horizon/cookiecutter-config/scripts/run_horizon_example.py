#!/usr/bin/env python3
"""Generate and prep the Horizon example site via cookiecutter.

Steps performed:
- Regenerate data-ppid attributes in the Horizon app boilerplate template
- Render the cookiecutter template into `public-sites/sites/horizon-example`
- Install dependencies with `pnpm install`

The script deletes any existing `horizon-example` directory before regeneration.
"""

from __future__ import annotations

import os
import shutil
import stat
import subprocess
import sys
from pathlib import Path

SCRIPT_PATH = Path(__file__).resolve()
CONFIG_DIR = SCRIPT_PATH.parent.parent


def find_repo_root(start: Path) -> Path:
    for candidate in (start, *start.parents):
        if (candidate / ".git").exists():
            return candidate
    raise SystemExit(f"Unable to locate repo root from {start}")


REPO_ROOT = find_repo_root(CONFIG_DIR)
SITES_DIR = REPO_ROOT / "public-sites" / "sites"
PROJECT_SLUG = "horizon-example"
PROJECT_DIR = SITES_DIR / PROJECT_SLUG
APP_BOILERPLATE_DIR = REPO_ROOT / "public-sites" / "templates" / "horizon" / "app-boilerplate"
ANNOTATE_SCRIPT = APP_BOILERPLATE_DIR / "scripts" / "annotate_ppids.py"
SECTION_GENERATOR = REPO_ROOT / "public-sites" / "templates" / "horizon" / "scripts" / "generate_section_catalog.py"


def load_context() -> dict[str, str]:
    return {
        "project_name": "Horizon Example",
        "project_slug": PROJECT_SLUG,
        "seo_title": "Horizon Example | Horizon Template",
        "seo_description": "Reference site generated for quick regression testing",
    }


def run_cookiecutter(context: dict[str, str]) -> None:
    remove_existing_project_dir()

    cmd = [
        "uv",
        "tool",
        "run",
        "cookiecutter",
        str(CONFIG_DIR),
        "--overwrite-if-exists",
        "--output-dir",
        str(SITES_DIR),
        "--no-input",
    ]
    cmd.extend(f"{key}={value}" for key, value in context.items())

    subprocess.run(cmd, check=True, cwd=REPO_ROOT)


def annotate_template_ppids() -> None:
    if not ANNOTATE_SCRIPT.exists():
        print(f"Annotation script missing at {ANNOTATE_SCRIPT}; skipping PPID regeneration.")
        return

    print("Regenerating data-ppid attributes in app-boilerplate template...")
    subprocess.run([sys.executable, str(ANNOTATE_SCRIPT), "--rewrite"], check=True, cwd=APP_BOILERPLATE_DIR)


def generate_section_catalog() -> None:
    if not SECTION_GENERATOR.exists():
        print(f"Section generator missing at {SECTION_GENERATOR}; skipping Studio catalog refresh.")
        return

    print("Generating Studio section catalog from template metadata...")
    subprocess.run([sys.executable, str(SECTION_GENERATOR)], check=True, cwd=REPO_ROOT)


def _handle_remove_readonly(func, path, exc_info):  # type: ignore[override]
    """Ensure read-only files are deleted when removing the project directory."""

    if not os.access(path, os.W_OK):
        os.chmod(path, stat.S_IRUSR | stat.S_IWUSR | stat.S_IXUSR)
        func(path)
        return

    raise exc_info[1]


def remove_existing_project_dir() -> None:
    if not PROJECT_DIR.exists():
        return

    print(f"Removing existing project directory: {PROJECT_DIR}")
    shutil.rmtree(PROJECT_DIR, onerror=_handle_remove_readonly)

    if PROJECT_DIR.exists():
        raise SystemExit(f"Unable to remove existing directory: {PROJECT_DIR}")


def run_pnpm(*args: str) -> None:
    subprocess.run(["pnpm", *args], check=True, cwd=PROJECT_DIR)


def main() -> None:
    if not SITES_DIR.exists():
        SITES_DIR.mkdir(parents=True, exist_ok=True)

    annotate_template_ppids()
    context = load_context()
    run_cookiecutter(context)
    run_pnpm("install")
    generate_section_catalog()
    print(f"\n✅ Horizon example regenerated. Run `pnpm dev` inside {PROJECT_DIR} when you want to start the server.\n")


if __name__ == "__main__":
    main()
