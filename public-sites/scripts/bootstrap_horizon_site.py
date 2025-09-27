#!/usr/bin/env python3
"""Copy the Horizon Next.js boilerplate into a site workspace and install dependencies."""

from __future__ import annotations

import argparse
import shutil
import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
PUBLIC_SITES_ROOT = REPO_ROOT / "public-sites"
BOILERPLATE_ROOT = PUBLIC_SITES_ROOT / "templates" / "horizon" / "app-boilerplate"


def parse_args() -> argparse.Namespace:
  parser = argparse.ArgumentParser(description="Bootstrap a Horizon site directory with the boilerplate app")
  parser.add_argument("site_slug", help="Site slug (e.g., acme-horizon)")
  parser.add_argument("--force", action="store_true", help="Overwrite an existing site directory")
  parser.add_argument("--skip-install", action="store_true", help="Skip running pnpm install after copying files")
  return parser.parse_args()


def ensure_boilerplate_exists() -> None:
  if not BOILERPLATE_ROOT.exists():
    raise SystemExit(f"Boilerplate not found: {BOILERPLATE_ROOT}")


def copy_boilerplate(destination: Path, *, force: bool) -> None:
  if destination.exists():
    if not force:
      raise SystemExit(
        f"Destination {destination} already exists. Pass --force to overwrite the directory (contents will be replaced)."
      )
    shutil.rmtree(destination)
  shutil.copytree(BOILERPLATE_ROOT, destination)


def run_pnpm_install(destination: Path) -> None:
  package_json = destination / "package.json"
  if not package_json.exists():
    print(f"Skipping pnpm install: {package_json} not found", file=sys.stderr)
    return
  try:
    subprocess.run(["pnpm", "install"], cwd=destination, check=True)
  except FileNotFoundError as exc:
    raise SystemExit("pnpm is required to install dependencies. Install pnpm via corepack or npm.") from exc


def main() -> None:
  args = parse_args()
  ensure_boilerplate_exists()

  site_dir = PUBLIC_SITES_ROOT / "sites" / args.site_slug
  copy_boilerplate(site_dir, force=args.force)

  if args.skip_install:
    print(f"Copied Horizon boilerplate to {site_dir}. Skipped dependency install per flag.")
    return

  run_pnpm_install(site_dir)
  print(f"Copied Horizon boilerplate to {site_dir} and installed dependencies with pnpm.")


if __name__ == "__main__":
  main()
