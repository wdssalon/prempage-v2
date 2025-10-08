#!/usr/bin/env python3
"""Clone a Horizon section into a site bundle and place it in the layout.

Usage::

    python public-sites/templates/horizon/scripts/insert_section.py \
        --site horizon-example \
        --section horizon_navigation_primary \
        --slot before-services

This script:
  1. Copies the section's component from the template app-boilerplate into the
     destination site's components directory, giving it a unique filename so
     existing customisations remain untouched.
  2. Adds an import for that component inside the site's `HomePage.jsx` file.
  3. Injects the component call at the requested drop slot, wrapping it with
     audit comments so future tooling can recognise the inserted block.

Slots correspond to the JSX markers in `HomePage.jsx`, e.g. `before-hero`,
`after-services`, `start`, `end`, etc.
"""

from __future__ import annotations

import argparse
import datetime as dt
import os
import re
import sys
from pathlib import Path

SCRIPT_PATH = Path(__file__).resolve()
TEMPLATE_ROOT = SCRIPT_PATH.parent.parent
APP_BOILERPLATE = TEMPLATE_ROOT / "app-boilerplate"
PUBLIC_SITES_ROOT = TEMPLATE_ROOT.parent.parent
SITE_ROOT = PUBLIC_SITES_ROOT / "sites"
HOME_PAGE_RELATIVE = Path("src/components/HomePage.jsx")
SLOT_MARKER_TEMPLATE = "        {{/* prempage:slot:{slot_name} */}}\n"


def find_repo_root(start: Path) -> Path:
    for candidate in (start, *start.parents):
        if (candidate / ".git").exists():
            return candidate
    raise SystemExit("Unable to locate repository root")


def load_catalog() -> list[dict[str, object]]:
    if str(TEMPLATE_ROOT) not in sys.path:
        sys.path.insert(0, str(TEMPLATE_ROOT))

    from sections.catalog import SECTION_CATALOG  # type: ignore[import-not-found]

    return SECTION_CATALOG


def sanitize_identifier(value: str) -> str:
    # Collapse snake/kebab identifiers into PascalCase so each cloned component
    # can be imported as a unique React component name.
    parts = re.split(r"[^0-9a-zA-Z]+", value)
    collapsed = "".join(part[:1].upper() + part[1:] for part in parts if part)
    return collapsed or "Section"



def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Insert a Horizon section into a site")
    parser.add_argument("--site", required=True, help="Site slug under public-sites/sites/")
    parser.add_argument("--section", required=True, help="Section key from the Horizon catalog")
    parser.add_argument("--slot", required=True, help="Slot marker (e.g. before-services, end)")
    return parser


def ensure_site_exists(site_slug: str) -> Path:
    site_dir = SITE_ROOT / site_slug
    if not site_dir.exists():
        raise SystemExit(f"Site directory not found: {site_dir}")
    return site_dir


def select_section(catalog: list[dict[str, object]], key: str) -> dict[str, object]:
    for entry in catalog:
        if entry.get("key") == key:
            return entry
    raise SystemExit(f"Section '{key}' not found in catalog")


def copy_component(entry: dict[str, object], site_dir: Path, timestamp: str) -> tuple[str, Path, str]:
    component_rel = Path(str(entry["component"]))
    source_path = APP_BOILERPLATE / component_rel
    if not source_path.exists():
        raise SystemExit(f"Template component missing: {source_path}")

    destination_rel = component_rel.with_name(f"{component_rel.stem}__{timestamp}{component_rel.suffix}")
    destination_path = (site_dir / destination_rel).resolve()
    destination_path.parent.mkdir(parents=True, exist_ok=True)
    destination_path.write_text(source_path.read_text())

    relative_import = destination_rel.relative_to("src").with_suffix("")
    import_path = relative_import.as_posix()
    identifier = sanitize_identifier(f"{component_rel.stem}_{timestamp}")
    return identifier, destination_path, import_path


def insert_import(homepage_text: str, identifier: str, import_path: str) -> str:
    marker = "\n\nconst SECTION_IDS"
    if marker not in homepage_text:
        raise SystemExit("Unable to locate SECTION_IDS marker in HomePage.jsx")

    imports_marker = "// prempage:imports"
    marker_idx = homepage_text.find(imports_marker)
    if marker_idx == -1:
        raise SystemExit("Unable to locate '// prempage:imports' marker in HomePage.jsx")

    import_line = f"import {identifier} from \"@/{import_path}\";\n"
    insertion_point = marker_idx + len(imports_marker)
    return homepage_text[:insertion_point] + f"\n{import_line}" + homepage_text[insertion_point:]


def build_section_id(entry: dict[str, object], timestamp: str) -> str:
    base = str(entry.get("section_id") or entry.get("key") or "section")
    safe_base = re.sub(r"[^0-9a-zA-Z_-]+", "-", base).strip("-") or "section"
    return f"{safe_base}--{timestamp}"


def insert_component_block(
    homepage_text: str,
    slot: str,
    identifier: str,
    section_id: str,
    section_key: str,
) -> str:
    marker_line = SLOT_MARKER_TEMPLATE.format(slot_name=slot)
    idx = homepage_text.find(marker_line)
    if idx == -1:
        raise SystemExit(f"Slot marker '{{/* prempage:slot:{slot} */}}' not found in HomePage.jsx")

    block = (
        f"        {{/* prempage:section:{section_key}:{section_id}:start */}}\n"
        f"        <{identifier} sectionId=\"{section_id}\" variant={{variant}} />\n"
        f"        {{/* prempage:section:{section_key}:{section_id}:end */}}\n"
    )

    insertion_point = idx + len(marker_line)
    return homepage_text[:insertion_point] + block + homepage_text[insertion_point:]


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()

    find_repo_root(SCRIPT_PATH)
    site_dir = ensure_site_exists(args.site)
    home_page_path = site_dir / HOME_PAGE_RELATIVE
    if not home_page_path.exists():
        raise SystemExit(f"Home page file not found: {home_page_path}")

    catalog = load_catalog()
    entry = select_section(catalog, args.section)

    timestamp = dt.datetime.now(dt.timezone.utc).strftime("%Y%m%d%H%M%S")
    identifier, component_path, import_path = copy_component(entry, site_dir, timestamp)

    homepage_text = home_page_path.read_text()
    homepage_text = insert_import(homepage_text, identifier, import_path)

    section_id = build_section_id(entry, timestamp)
    homepage_text = insert_component_block(
        homepage_text,
        args.slot,
        identifier,
        section_id,
        str(entry.get("key")),
    )

    home_page_path.write_text(homepage_text)

    rel_component = component_path.relative_to(site_dir)
    print("\n✅ Section inserted")
    print(f"  • Component copy: {rel_component}")
    print(f"  • Imported as: {identifier}")
    print(f"  • Inserted at slot: {args.slot}")
    print(f"  • New sectionId: {section_id}\n")


if __name__ == "__main__":
    main()
