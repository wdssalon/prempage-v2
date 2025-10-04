#!/usr/bin/env python3
"""Ensure OpenAPI schema and generated TypeScript types are in sync."""
from __future__ import annotations

import shutil
import subprocess
import sys
from pathlib import Path


def find_repo_root() -> Path:
    current = Path(__file__).resolve()
    for candidate in (current, *current.parents):
        if (candidate / ".git").exists():
            return candidate
    raise SystemExit("Unable to locate repository root (no .git directory found)")


def run(cmd: list[str], cwd: Path) -> None:
    try:
        subprocess.run(cmd, cwd=cwd, check=True)
    except FileNotFoundError as exc:  # command missing
        raise SystemExit(f"Command not found: {cmd[0]}") from exc
    except subprocess.CalledProcessError as exc:
        raise SystemExit(
            f"Command {' '.join(cmd)} failed with exit code {exc.returncode}"
        ) from exc


def ensure_tool(name: str) -> None:
    if shutil.which(name) is None:
        raise SystemExit(f"Required tool '{name}' not found on PATH")


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
    except SystemExit as exc:
        print(
            "Failed to regenerate client API types. Make sure client dependencies are installed "
            "(pnpm install) before pushing.",
            file=sys.stderr,
        )
        raise

    diff = subprocess.run(
        [
            "git",
            "status",
            "--porcelain",
            "backend/openapi.json",
            "client/src/api/types.ts",
        ],
        cwd=repo_root,
        check=True,
        capture_output=True,
        text=True,
    )

    if diff.stdout.strip():
        print(
            "OpenAPI schema or generated types changed. Regenerate and commit "
            "before pushing:\n"
            "    python scripts/fix_openapi_sync.py\n"
            "Then stage backend/openapi.json and client/src/api/types.ts.",
            file=sys.stderr,
        )
        sys.exit(1)


if __name__ == "__main__":
    main()
