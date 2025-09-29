#!/usr/bin/env python3
"""Apply site configuration overrides for the Horizon app boilerplate.

Accepts a JSON payload either as a file path or as a raw string. The payload can
specify:

- metadata.title / metadata.description
- fonts: list of font loaders from next/font/google with options
- colors.light / colors.dark: maps of CSS custom property tokens (without the
  leading `--`) to `value` strings (e.g. `"30 47% 93%"`).

Example invocation:
    python scripts/apply_site_config.py --config config/example-site.json
    python scripts/apply_site_config.py --config '{"fonts": [...], ...}'
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from typing import Dict, List, Tuple

ROOT = Path(__file__).resolve().parents[1]
LAYOUT_PATH = ROOT / "src" / "app" / "layout.js"
GLOBALS_CSS_PATH = ROOT / "src" / "app" / "globals.css"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Apply site configuration overrides.")
    parser.add_argument(
        "--config",
        required=True,
        help="Path to a JSON file or a raw JSON string containing site overrides.",
    )
    return parser.parse_args()


def load_config(config_arg: str) -> Dict:
    candidate_path = Path(config_arg)
    if candidate_path.exists():
        with candidate_path.open("r", encoding="utf-8") as fh:
            return json.load(fh)

    stripped = config_arg.strip()
    if stripped.startswith("{"):
        return json.loads(stripped)

    raise ValueError(f"Config '{config_arg}' is neither a readable file nor valid JSON.")


# ---------------------------------------------------------------------------
# Font handling
# ---------------------------------------------------------------------------

def _camel_case(name: str) -> str:
    parts = re.split(r"[^0-9a-zA-Z]+", name)
    camel = parts[0].lower() if parts else "font"
    for part in parts[1:]:
        camel += part.capitalize()
    if not camel.endswith("Font"):
        camel += "Font"
    return camel


def render_layout(config: Dict) -> str:
    metadata = config.get("metadata", {})
    title = metadata.get("title", "PremPage Horizon Template")
    description = metadata.get(
        "description",
        "Composable therapy site template powered by PremPage Horizon.",
    )

    fonts_cfg = config.get("fonts", [])
    if not isinstance(fonts_cfg, list) or not fonts_cfg:
        raise ValueError("Config must include at least one font entry in the 'fonts' list.")

    loaders: List[str] = []
    font_consts: List[str] = []
    class_refs: List[str] = []

    for font in fonts_cfg:
        if not isinstance(font, dict):
            raise ValueError("Each font entry must be a JSON object.")

        loader = font.get("loader")
        if not loader:
            raise ValueError("Font entry missing 'loader' (e.g. 'Inter').")
        if loader not in loaders:
            loaders.append(loader)

        font_id = font.get("id") or loader
        const_name = _camel_case(font_id)
        options = font.get("options", {}) or {}
        variable = font.get("variable") or f"--font-{font_id.replace(' ', '-').lower()}"
        options = {**options, "variable": variable}

        options_json = json.dumps(options, indent=2)
        options_json = re.sub(r'"([A-Za-z0-9_]+)":', r'\1:', options_json)
        font_consts.append(f"const {const_name} = {loader}({options_json});")
        class_refs.append(f"{const_name}.variable")

    loaders_import = ", ".join(loaders)
    class_expr = " ".join(f"${{{ref}}}" for ref in class_refs)

    lines: List[str] = []
    lines.append('import { ' + loaders_import + ' } from "next/font/google";')
    lines.append('import "./globals.css";')
    lines.append('')
    lines.extend(font_consts)
    lines.append('')
    lines.append('export const metadata = {')
    lines.append(f'  title: {json.dumps(title)},')
    lines.append(f'  description: {json.dumps(description)},')
    lines.append('};')
    lines.append('')
    lines.append('export default function RootLayout({ children }) {')
    lines.append('  return (')
    lines.append('    <html lang="en" className={`' + class_expr + '`}>')
    lines.append('      <body className="bg-background text-foreground font-body">{children}</body>')
    lines.append('    </html>')
    lines.append('  );')
    lines.append('}')

    return "\n".join(lines) + "\n"


# ---------------------------------------------------------------------------
# Color handling
# ---------------------------------------------------------------------------

def find_block_bounds(lines: List[str], selector: str) -> Tuple[int, int]:
    pattern = re.compile(rf"^\s*{re.escape(selector)}\s*{{")
    brace_balance = 0
    start = -1
    for idx, line in enumerate(lines):
        if start == -1 and pattern.match(line):
            start = idx
            brace_balance = line.count("{") - line.count("}")
            if brace_balance == 0:
                # Selector opens and closes on same line – unlikely but handle.
                return idx, idx
            continue
        if start != -1:
            brace_balance += line.count("{") - line.count("}")
            if brace_balance <= 0:
                return start, idx
    raise ValueError(f"Could not locate block for selector '{selector}'.")


def update_colors(lines: List[str], selector: str, replacements: Dict[str, str]) -> List[str]:
    if not replacements:
        return lines

    start, end = find_block_bounds(lines, selector)
    present = set()

    # Determine indentation for new declarations.
    indent = None
    for search_idx in range(start + 1, end):
        indent_match = re.match(r"(\s*)--", lines[search_idx])
        if indent_match:
            indent = indent_match.group(1)
            break
    if indent is None:
        indent = "  "

    for idx in range(start + 1, end):
        line = lines[idx]
        for key, value in replacements.items():
            pattern = re.compile(rf"(--{re.escape(key)}\s*:\s*)([^;]+)(;)")
            if pattern.search(line):
                lines[idx] = pattern.sub(rf"\g<1>{value}\g<3>", line)
                present.add(key)

    missing = [key for key in replacements.keys() if key not in present]
    if missing:
        insertion_index = end
        for key in missing:
            lines.insert(insertion_index, f"{indent}--{key}: {replacements[key]};\n")
            insertion_index += 1
            end += 1

    return lines


def render_globals(config: Dict) -> str:
    with GLOBALS_CSS_PATH.open("r", encoding="utf-8") as fh:
        lines = fh.readlines()

    colors = config.get("colors", {})
    light = colors.get("light", {}) if isinstance(colors, dict) else {}
    dark = colors.get("dark", {}) if isinstance(colors, dict) else {}

    lines = update_colors(lines, ":root", light)
    lines = update_colors(lines, ".dark", dark)

    return "".join(lines)


def main() -> None:
    args = parse_args()
    config = load_config(args.config)

    # Update layout.js
    layout_contents = render_layout(config)
    LAYOUT_PATH.write_text(layout_contents, encoding="utf-8")

    # Update globals.css colors if provided
    globals_contents = render_globals(config)
    GLOBALS_CSS_PATH.write_text(globals_contents, encoding="utf-8")

    print("Applied configuration to layout.js and globals.css")


if __name__ == "__main__":
    main()
