#!/usr/bin/env python3
"""Regenerate the backend OpenAPI schema and frontend API types."""
from __future__ import annotations

import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(SCRIPT_DIR))

from check_openapi_sync import (  # noqa: E402
    ensure_tool,
    find_repo_root,
    run,
)


def main() -> None:
    repo_root = find_repo_root()
    backend_dir = repo_root / "backend"
    client_dir = repo_root / "client"

    ensure_tool("uv")
    ensure_tool("pnpm")

    backend_python = backend_dir / ".venv" / "bin" / "python"
    python_cmd = [str(backend_python)] if backend_python.exists() else ["uv", "run", "python"]
    run([*python_cmd, "export_openapi.py"], cwd=backend_dir)

    try:
        run(["pnpm", "openapi:types"], cwd=client_dir)
    except SystemExit:
        print(
            "Failed to regenerate client API types. Run 'pnpm --dir client install' first if "
            "dependencies are missing.",
            file=sys.stderr,
        )
        raise

    print(
        "OpenAPI schema and TypeScript types refreshed. Stage backend/openapi.json "
        "and client/src/api/types.ts before pushing."
    )


if __name__ == "__main__":
    main()
