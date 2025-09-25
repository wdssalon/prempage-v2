"""Utility script for exporting the FastAPI OpenAPI schema to disk."""
from __future__ import annotations

import json
from pathlib import Path

from main import app


def export_schema(target: Path) -> None:
    """Write the generated OpenAPI schema to ``target`` as JSON."""
    schema = app.openapi()
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps(schema, indent=2), encoding="utf-8")


def main() -> None:
    """Export the OpenAPI schema to ``openapi.json`` beside this file."""
    target = Path(__file__).with_name("openapi.json")
    export_schema(target)


if __name__ == "__main__":
    main()
