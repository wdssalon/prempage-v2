#!/usr/bin/env python3
"""Emit the Horizon section catalog for the Studio workspace.

Reads the canonical definitions from `sections/catalog.py` and writes a
TypeScript module under `client/src/generated/sections/horizon.ts`. The module
includes both the type definitions and the Horizon section data so the Studio
can consume it directly.

Usage::

    python public-sites/templates/horizon/scripts/generate_section_catalog.py
"""

from __future__ import annotations

import json
import textwrap
from pathlib import Path
from typing import Any

SCRIPT_DIR = Path(__file__).resolve().parent
TEMPLATE_DIR = SCRIPT_DIR.parent
import sys

if str(TEMPLATE_DIR) not in sys.path:
    sys.path.insert(0, str(TEMPLATE_DIR))

from sections.catalog import SECTION_CATALOG  # type: ignore[import-not-found]

TEMPLATE_ROOT = "public-sites/templates/horizon/app-boilerplate"
SITE_PLACEHOLDER = "{slug}"
OUTPUT_RELATIVE_PATH = Path("client/src/generated/sections/horizon.ts")


def find_repo_root(start: Path) -> Path:
    for candidate in (start, *start.parents):
        if (candidate / ".git").exists():
            return candidate
    raise SystemExit("Unable to locate repository root")


def camel_key(key: str) -> str:
    if key == "section_id":
        return "sectionId"
    if key == "data_dependencies":
        return "dataDependencies"
    if key == "content_slots":
        return "contentSlots"
    if key == "recommended_length":
        return "recommendedLength"
    return key


def transform_source(source: dict[str, Any]) -> dict[str, Any]:
    kind = source.get("kind")
    if kind == "ppid":
        component = source["component"]
        anchor = source["anchor"]
        template = f"code:public-sites/sites/{SITE_PLACEHOLDER}/src/{component}#{anchor}"
        return {"kind": "ppid_template", "template": template}
    if kind == "component":
        result = {
            "kind": "component",
            "file": f"{TEMPLATE_ROOT}/{source['file']}",
        }
        if "identifier" in source:
            result["identifier"] = source["identifier"]
        if "notes" in source:
            result["notes"] = source["notes"]
        return result
    if kind == "data_file":
        result = {
            "kind": "data_file",
            "file": f"{TEMPLATE_ROOT}/{source['file']}",
            "export": source["export"],
        }
        if "path" in source:
            result["path"] = source["path"]
        return result
    if kind == "static":
        return {"kind": "static", "notes": source["notes"]}
    raise ValueError(f"Unknown source kind: {kind}")


def transform_fields(fields: list[dict[str, Any]]) -> list[dict[str, Any]]:
    transformed: list[dict[str, Any]] = []
    for field in fields:
        next_field: dict[str, Any] = {}
        for key, value in field.items():
            if key == "source" and isinstance(value, dict):
                next_field["source"] = transform_source(value)
            elif key == "recommended_length":
                next_field[camel_key(key)] = value
            else:
                next_field[key] = value
        transformed.append(next_field)
    return transformed


def transform_slot(slot: dict[str, Any]) -> dict[str, Any]:
    result: dict[str, Any] = {}
    for key, value in slot.items():
        if key == "source" and isinstance(value, dict):
            result["source"] = transform_source(value)
            continue
        if key == "fields" and isinstance(value, list):
            result["fields"] = transform_fields(value)
            continue
        if key == "recommended_length":
            result[camel_key(key)] = value
            continue
        result[key] = value
    return result


def transform_section(section: dict[str, Any]) -> dict[str, Any]:
    result: dict[str, Any] = {
        "key": section["key"],
        "label": section["label"],
        "category": section["category"],
        "description": section["description"],
        "componentPath": f"{TEMPLATE_ROOT}/{section['component']}",
        "contentSlots": [transform_slot(slot) for slot in section["content_slots"]],
    }
    if section.get("section_id"):
        result["sectionId"] = section["section_id"]
    if section.get("data_dependencies"):
        result["dataDependencies"] = [
            f"{TEMPLATE_ROOT}/{path}" for path in section["data_dependencies"]
        ]
    if section.get("tags"):
        result["tags"] = section["tags"]
    return result


def render_ts(value: Any, indent: int = 0) -> str:
    spacer = "  " * indent
    if isinstance(value, str):
        return json.dumps(value)
    if isinstance(value, bool):
        return "true" if value else "false"
    if value is None:
        return "null"
    if isinstance(value, (int, float)):
        return str(value)
    if isinstance(value, list):
        if not value:
            return "[]"
        items = ",\n".join(
            f"{spacer}  {render_ts(item, indent + 1)}" for item in value
        )
        return f"[\n{items}\n{spacer}]"
    if isinstance(value, dict):
        if not value:
            return "{}"
        lines: list[str] = []
        for key, item in value.items():
            rendered = render_ts(item, indent + 1)
            lines.append(f"{spacer}  {key}: {rendered}")
        inner = ",\n".join(lines)
        return f"{{\n{inner}\n{spacer}}}"
    raise TypeError(f"Unsupported value type: {type(value)!r}")


def build_ts_module(sections: list[dict[str, Any]]) -> str:
    header = textwrap.dedent(
        f"""// AUTO-GENERATED FILE. DO NOT EDIT.
// Run `python public-sites/templates/horizon/scripts/generate_section_catalog.py`

export const SITE_PLACEHOLDER = "{SITE_PLACEHOLDER}";

export type SectionCategory =
  | "navigation"
  | "hero"
  | "services"
  | "story"
  | "cta"
  | "testimonials"
  | "footer"
  | "utility";

export type SlotSource =
  | {{
      kind: "ppid_template";
      template: string;
    }}
  | {{
      kind: "data_file";
      file: string;
      export: string;
      path?: string;
    }}
  | {{
      kind: "component";
      file: string;
      identifier?: string;
      notes?: string;
    }}
  | {{
      kind: "static";
      notes: string;
    }};

export type SectionSlotField = {{
  key: string;
  type: string;
  description?: string;
  recommendedLength?: string;
  optional?: boolean;
  source?: SlotSource;
}};

export type SectionSlot = {{
  name: string;
  type: string;
  description?: string;
  recommendedLength?: string;
  optional?: boolean;
  source?: SlotSource;
  fields?: SectionSlotField[];
}};

export type SectionDefinition = {{
  key: string;
  label: string;
  category: SectionCategory;
  description: string;
  componentPath: string;
  sectionId?: string;
  dataDependencies?: string[];
  tags?: string[];
  contentSlots: SectionSlot[];
}};

export const HORIZON_SECTIONS: SectionDefinition[] =
"""
    )
    rendered_sections = render_ts(sections, indent=0)
    return f"{header}{rendered_sections};\n"


def main() -> None:
    script_path = Path(__file__).resolve()
    repo_root = find_repo_root(script_path.parent)
    output_path = repo_root / OUTPUT_RELATIVE_PATH
    output_path.parent.mkdir(parents=True, exist_ok=True)

    transformed_sections = [transform_section(section) for section in SECTION_CATALOG]
    ts_module = build_ts_module(transformed_sections)
    output_path.write_text(ts_module)
    relative = output_path.relative_to(repo_root)
    print(f"Wrote section catalog to {relative}")


if __name__ == "__main__":
    main()
