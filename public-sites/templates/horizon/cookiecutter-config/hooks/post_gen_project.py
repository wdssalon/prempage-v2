#!/usr/bin/env python3
from __future__ import annotations

import json
import os
import shutil
import subprocess
import sys
from pathlib import Path

PROJECT_DIR = Path.cwd()

TEMPLATE_RAW = "{{ cookiecutter._template }}"
OUTPUT_RAW = "{{ cookiecutter._output_dir }}"

raw_path = Path(TEMPLATE_RAW)
candidate_roots = []
if raw_path.is_absolute():
    candidate_roots.append(raw_path)
else:
    candidate_roots.append((PROJECT_DIR / TEMPLATE_RAW).resolve())
    env_pwd = os.environ.get("PWD")
    if env_pwd:
        candidate_roots.append((Path(env_pwd) / TEMPLATE_RAW).resolve())
    if OUTPUT_RAW:
        candidate_roots.append((Path(OUTPUT_RAW).resolve() / TEMPLATE_RAW).resolve())

TEMPLATE_ROOT = None
for cand in candidate_roots:
    if (cand / "cookiecutter.json").exists():
        TEMPLATE_ROOT = cand
        break

if TEMPLATE_ROOT is None:
    TEMPLATE_ROOT = raw_path.resolve()

BOILERPLATE_ROOT = TEMPLATE_ROOT.parent / "app-boilerplate"
APPLY_SCRIPT = PROJECT_DIR / "scripts" / "apply_site_config.py"
CONFIG_PATH = PROJECT_DIR / "site-config.json"
PACKAGE_JSON_PATH = PROJECT_DIR / "package.json"

SKIP_NAMES = {"node_modules", ".next", "dist", "pnpm-lock.yaml"}


def copy_boilerplate() -> None:
    if not BOILERPLATE_ROOT.exists():
        raise SystemExit(f"Boilerplate directory not found: {BOILERPLATE_ROOT}")

    for item in BOILERPLATE_ROOT.iterdir():
        if item.name in SKIP_NAMES:
            continue
        destination = PROJECT_DIR / item.name
        if item.is_dir():
            shutil.copytree(item, destination, dirs_exist_ok=True)
        else:
            shutil.copy2(item, destination)


def update_package_json() -> None:
    if not PACKAGE_JSON_PATH.exists():
        return

    data = json.loads(PACKAGE_JSON_PATH.read_text(encoding="utf-8"))
    data["name"] = "{{ cookiecutter.project_slug }}"
    PACKAGE_JSON_PATH.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")


def apply_config() -> None:
    if not CONFIG_PATH.exists():
        return
    if not APPLY_SCRIPT.exists():
        raise SystemExit(f"apply_site_config.py not found at {APPLY_SCRIPT}")

    subprocess.run([sys.executable, str(APPLY_SCRIPT), "--config", str(CONFIG_PATH)], check=True)


def main() -> None:
    copy_boilerplate()
    update_package_json()
    apply_config()


if __name__ == "__main__":
    main()
