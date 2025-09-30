#!/usr/bin/env python3
"""Update Horizon site theming (palette + fonts) on the fly.

Usage examples:
    python apply_theme.py --site horizon-example --palette '{"bg_base": "#112233", ...}'
    python apply_theme.py --site horizon-example --fonts path/to/fonts.json
    python apply_theme.py --site horizon-example --palette palette.json --fonts fonts.json

The script updates `site-config.json`, reruns `scripts/apply_site_config.py`
to regenerate `globals.css`/`layout.js`, and touches `tailwind.config.js`
so Next.js hot reload picks up the changes immediately.
"""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
from pathlib import Path
from typing import Dict, List, Any


def find_repo_root(start: Path) -> Path:
    for candidate in (start, *start.parents):
        if (candidate / ".git").exists():
            return candidate
    raise SystemExit(f"Unable to locate repo root from {start}")


SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = find_repo_root(SCRIPT_DIR)
SITES_DIR = REPO_ROOT / "public-sites" / "sites"
FONTS_MANIFEST_PATH = SCRIPT_DIR / "google-fonts.json"
if FONTS_MANIFEST_PATH.exists():
    GOOGLE_FONTS = json.loads(FONTS_MANIFEST_PATH.read_text(encoding="utf-8"))
else:
    GOOGLE_FONTS = {}

PALETTE_KEYS = {
    "bg_base",
    "bg_surface",
    "bg_contrast",
    "text_primary",
    "text_secondary",
    "text_inverse",
    "brand_primary",
    "brand_secondary",
    "accent",
    "border",
    "ring",
    "critical",
    "critical_contrast",
}


PALETTE_DESCRIPTION = "\n".join(
    ["Palette keys:"] + [f"  - {key}" for key in sorted(PALETTE_KEYS)]
)

if GOOGLE_FONTS:
    FONT_DESCRIPTION = (
        "Known font loaders (google-fonts.json, used for sensible defaults):\n  - "
        + "\n  - ".join(sorted(GOOGLE_FONTS))
        + "\n\nLoaders outside this list are allowed; provide weights/styles when Next.js requires them."
    )
else:
    FONT_DESCRIPTION = (
        "No preset font loaders found. Provide weights/styles explicitly when Next.js requires them, "
        "or add google-fonts.json beside this script to seed defaults."
    )


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Apply palette and/or font updates to a Horizon site.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=f"{PALETTE_DESCRIPTION}\n\n{FONT_DESCRIPTION}",
    )
    parser.add_argument(
        "--site",
        required=True,
        help="Site slug (e.g. horizon-example).",
    )
    parser.add_argument(
        "--palette",
        help="JSON string or path to a JSON file containing palette overrides.",
    )
    parser.add_argument(
        "--fonts",
        help="JSON string or path to a JSON file containing font definitions (list).",
    )
    args = parser.parse_args()
    if not args.palette and not args.fonts:
        parser.error("Specify at least one of --palette or --fonts")
    return args


def load_palette(palette_arg: str) -> Dict[str, str]:
    stripped = palette_arg.strip()
    if stripped.startswith("{"):
        data = json.loads(stripped)
    else:
        path = Path(palette_arg)
        if not path.exists():
            raise SystemExit(f"Palette file not found: {path}")
        data = json.loads(path.read_text(encoding="utf-8"))

    if not isinstance(data, dict):
        raise SystemExit("Palette must be a JSON object.")

    unknown = data.keys() - PALETTE_KEYS
    if unknown:
        raise SystemExit(f"Palette contains unexpected keys: {sorted(unknown)}")

    return {key: str(value) for key, value in data.items()}


def load_fonts(fonts_arg: str) -> List[Dict[str, Any]]:
    stripped = fonts_arg.strip()
    if stripped.startswith("["):
        data = json.loads(stripped)
    else:
        path = Path(fonts_arg)
        if not path.exists():
            raise SystemExit(f"Fonts file not found: {path}")
        data = json.loads(path.read_text(encoding="utf-8"))

    if not isinstance(data, list) or not data:
        raise SystemExit("Fonts payload must be a non-empty JSON array.")

    normalized: List[Dict[str, Any]] = []
    for entry in data:
        if not isinstance(entry, dict):
            raise SystemExit("Each font entry must be a JSON object.")
        loader = entry.get("loader")
        if not loader or not isinstance(loader, str):
            raise SystemExit("Each font entry must include a string 'loader'.")
        meta = GOOGLE_FONTS.get(loader)

        options = entry.get("options", {}) or {}
        raw_weights = options.get("weight")
        if meta:
            allowed_weights = meta.get("weights", [])
            if raw_weights is None:
                weights = allowed_weights
            else:
                weights = raw_weights if isinstance(raw_weights, list) else [raw_weights]
                weights = [str(w) for w in weights]
                filtered = [w for w in weights if w in allowed_weights]
                if not filtered:
                    filtered = allowed_weights
                weights = filtered
        else:
            if raw_weights is None:
                weights = ["400"]
            else:
                weights = raw_weights if isinstance(raw_weights, list) else [raw_weights]
                weights = [str(w) for w in weights]
        options["weight"] = weights

        style = options.get("style")
        if style is not None:
            styles = style if isinstance(style, list) else [style]
            styles = [str(s) for s in styles]
            if meta:
                allowed_styles = meta.get("styles", [])
                filtered_styles = [s for s in styles if s in allowed_styles]
                if not filtered_styles:
                    filtered_styles = allowed_styles
                styles = filtered_styles
            options["style"] = styles
        elif meta and meta.get("styles"):
            options["style"] = meta.get("styles")

        entry["options"] = options
        normalized.append(entry)

    return normalized


def write_site_config(site_dir: Path, palette: Dict[str, str] | None, fonts: List[Dict[str, Any]] | None) -> None:
    config_path = site_dir / "site-config.json"
    if not config_path.exists():
        raise SystemExit(f"Expected site-config.json at {config_path}")

    config = json.loads(config_path.read_text(encoding="utf-8"))
    if palette:
        config.setdefault("colors", {})
        config["colors"].update(palette)
    if fonts is not None:
        config["fonts"] = fonts
    config_path.write_text(json.dumps(config, indent=2) + "\n", encoding="utf-8")


def run_apply_script(site_dir: Path) -> None:
    script_path = site_dir / "scripts" / "apply_site_config.py"
    if not script_path.exists():
        raise SystemExit(f"apply_site_config.py missing at {script_path}")

    subprocess.run(
        [sys.executable, str(script_path), "--config", "site-config.json"],
        check=True,
        cwd=site_dir,
    )


def touch_tailwind(site_dir: Path) -> None:
    tailwind_config = site_dir / "tailwind.config.js"
    if not tailwind_config.exists():
        return
    tailwind_config.touch()


def main() -> None:
    args = parse_args()

    site_dir = SITES_DIR / args.site
    if not site_dir.exists():
        raise SystemExit(f"Site directory not found: {site_dir}")

    palette = load_palette(args.palette) if args.palette else None
    fonts = load_fonts(args.fonts) if args.fonts else None
    write_site_config(site_dir, palette, fonts)
    run_apply_script(site_dir)
    touch_tailwind(site_dir)
    updated_parts = []
    if palette:
        updated_parts.append("palette")
    if fonts:
        updated_parts.append("fonts")
    summary = ", ".join(updated_parts)
    print(f"Applied {summary} to {args.site} and triggered reload.")


if __name__ == "__main__":
    main()
