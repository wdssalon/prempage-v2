#!/usr/bin/env python3
"""Annotate JSX templates with data-ppid attributes.

We shell out to a small Babel-powered transformer (`_annotate_ppids_transform.mjs`)
that understands JSX. The surrounding orchestration stays in Python to align
with the repo's automation standard.

Examples:

  python scripts/annotate_ppids.py                 # mutate files in-place
  python scripts/annotate_ppids.py --dry-run       # preview changes only
  python scripts/annotate_ppids.py --path src/components/Hero.jsx
  python scripts/annotate_ppids.py --rewrite       # regenerate existing ids after script upgrades

"""

from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import sys
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parent.parent
SOURCE_ROOT = PROJECT_ROOT / "src"
TRANSFORM_MODULE = Path(__file__).resolve().parent / "_annotate_ppids_transform.mjs"

# Hard-coded prefix per the Horizon example deployment. Update when a template
# needs a different canonical path.
PPID_PREFIX = "code:public-sites/sites/horizon-example"


def _collect_targets(paths: list[str] | None) -> list[Path]:
    if not paths:
        return sorted(SOURCE_ROOT.rglob("*.jsx"))

    collected: list[Path] = []
    for raw_path in paths:
        candidate = (PROJECT_ROOT / raw_path).resolve()
        if candidate.is_dir():
            collected.extend(sorted(candidate.rglob("*.jsx")))
        elif candidate.is_file():
            collected.append(candidate)
    return collected


def _derive_component_name(file_path: Path) -> str:
    stem = file_path.stem
    return stem[:1].upper() + stem[1:]


def _config_payload() -> str:
    slot_map = {
        "h1": "heading",
        "h2": "heading",
        "h3": "heading",
        "h4": "heading",
        "h5": "heading",
        "h6": "heading",
        "p": "body",
        "span": "inline",
        "strong": "inline",
        "em": "inline",
        "small": "inline",
        "label": "label",
        "li": "listItem",
        "ul": "list",
        "ol": "list",
        "blockquote": "quote",
        "cite": "citation",
        "button": "cta",
        "a": "link",
        "Link": "link",
        "img": "image",
        "Image": "image",
        "picture": "image",
        "source": "imageSource",
        "figure": "figure",
        "figcaption": "caption",
        "svg": "icon",
        "path": "iconPath",
        "dt": "metaLabel",
        "dd": "metaDetail",
        "summary": "summary",
        "table": "table",
        "thead": "tableHead",
        "tbody": "tableBody",
        "tr": "tableRow",
        "th": "tableHeader",
        "td": "tableCell",
        "video": "video",
    }

    textual_slots = [
        "heading",
        "body",
        "inline",
        "quote",
        "caption",
        "metaLabel",
        "metaDetail",
        "label",
        "summary",
        "tableHeader",
        "tableCell",
    ]

    always = [
        "image",
        "imageSource",
        "figure",
        "icon",
        "iconPath",
        "cta",
        "ctaPrimary",
        "ctaSecondary",
        "link",
        "video",
    ]

    config = {
        "slotMap": slot_map,
        "textualSlots": textual_slots,
        "alwaysAnnotate": always,
        "ctaPrimaryPatterns": ["primary", "btn-primary", "cta-primary"],
        "ctaSecondaryPatterns": ["secondary", "btn-secondary", "cta-secondary"],
    }
    return json.dumps(config)


def run(prefix: str, targets: list[Path], dry_run: bool, rewrite: bool) -> int:
    if not shutil.which("node"):
        print("Error: Node.js is required to run this script.", file=sys.stderr)
        return 1

    if not TRANSFORM_MODULE.exists():
        print(f"Transformer module missing: {TRANSFORM_MODULE}", file=sys.stderr)
        return 1

    config = _config_payload()
    changed: list[Path] = []

    for file_path in targets:
        rel_path = file_path.relative_to(PROJECT_ROOT)
        component_name = _derive_component_name(file_path)

        process = subprocess.run(
            [
                "node",
                str(TRANSFORM_MODULE),
                str(file_path),
                prefix,
                rel_path.as_posix(),
                component_name,
                config,
                "true" if rewrite else "false",
            ],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            check=False,
            text=True,
        )

        if process.returncode != 0:
            print(process.stderr.strip(), file=sys.stderr)
            return process.returncode

        new_contents = process.stdout
        original = file_path.read_text()

        if new_contents != original:
            changed.append(rel_path)
            if not dry_run:
                file_path.write_text(new_contents)

    if dry_run:
        if changed:
            print("Files that would change:")
            for path in changed:
                print(f"  - {path}")
        else:
            print("No changes required.")
    else:
        if changed:
            print("Annotated data-ppid attributes in:")
            for path in changed:
                print(f"  - {path}")
        else:
            print("All files already annotated for configured selectors.")

    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="Annotate JSX files with data-ppid attributes.")
    parser.add_argument("--prefix", default=PPID_PREFIX, help="Base prefix for generated data-ppid values")
    parser.add_argument("--path", action="append", dest="paths", help="Limit processing to specific path(s)")
    parser.add_argument("--dry-run", action="store_true", help="Preview changes without writing files")
    parser.add_argument("--rewrite", action="store_true", help="Regenerate existing data-ppid attributes")

    args = parser.parse_args()
    targets = _collect_targets(args.paths)

    if not targets:
        print("No JSX files matched the selection.")
        return 0

    return run(args.prefix, targets, args.dry_run, args.rewrite)


if __name__ == "__main__":
    sys.exit(main())
