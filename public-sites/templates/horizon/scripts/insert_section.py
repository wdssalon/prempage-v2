#!/usr/bin/env python3
"""CLI wrapper around the Horizon section insertion service."""

from __future__ import annotations

import argparse
import importlib.util
import json
import sys
from dataclasses import asdict
from pathlib import Path


SCRIPT_PATH = Path(__file__).resolve()


def find_repo_root(start: Path) -> Path:
    for candidate in (start, *start.parents):
        if (candidate / ".git").exists():
            return candidate
    raise SystemExit("Unable to locate repository root")


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Clone a Horizon section into a site workspace",
    )
    parser.add_argument(
        "--site",
        required=True,
        help="Site slug under public-sites/sites/",
    )
    parser.add_argument(
        "--section",
        required=True,
        help="Section key from the Horizon catalog",
    )
    parser.add_argument(
        "--slot",
        required=True,
        help="Slot marker (e.g. before-home-stories, end)",
    )
    parser.add_argument(
        "--json",
        action="store_true",
        help="Emit JSON instead of human-readable output",
    )
    return parser


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()

    repo_root = find_repo_root(SCRIPT_PATH)
    module_path = (
        repo_root
        / "backend"
        / "app"
        / "templates"
        / "horizon"
        / "sections.py"
    )

    spec = importlib.util.spec_from_file_location("horizon_sections_cli", module_path)
    if spec is None or spec.loader is None:
        raise SystemExit(f"Unable to import Horizon section service from {module_path}")

    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)  # type: ignore[assignment]

    HorizonSectionLibraryService = module.HorizonSectionLibraryService  # type: ignore[attr-defined]
    HorizonSectionInsertionError = module.HorizonSectionInsertionError  # type: ignore[attr-defined]

    service = HorizonSectionLibraryService(repo_root=repo_root)

    try:
        result = service.insert_section_by_slot(
            site_slug=args.site,
            section_key=args.section,
            slot=args.slot,
        )
    except HorizonSectionInsertionError as exc:
        raise SystemExit(str(exc)) from exc

    if args.json:
        print(json.dumps(asdict(result)))
        return

    print("\n✅ Section inserted")
    print(f"  • Component copy: {result.component_relative_path}")
    print(f"  • Imported as: {result.import_identifier}")
    print(f"  • Inserted at slot: {result.slot}")
    print(f"  • New sectionId: {result.section_id}\n")


if __name__ == "__main__":
    main()
