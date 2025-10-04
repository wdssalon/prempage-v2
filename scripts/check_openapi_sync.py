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


def run_with_result(cmd: list[str], cwd: Path) -> subprocess.CompletedProcess[str]:
    try:
        return subprocess.run(
            cmd,
            cwd=cwd,
            check=False,
            capture_output=True,
            text=True,
        )
    except FileNotFoundError as exc:
        raise SystemExit(f"Command not found: {cmd[0]}") from exc


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
    if backend_python.exists():
        run([str(backend_python), "export_openapi.py"], cwd=backend_dir)
    else:
        run(["uv", "run", "python", "export_openapi.py"], cwd=backend_dir)

    install_cmd = [
        "pnpm",
        "install",
        "--frozen-lockfile",
    ]
    install_result = run_with_result(install_cmd, cwd=client_dir)
    if install_result.returncode != 0:
        stderr = install_result.stderr
        if "Cannot install with \"frozen-lockfile\"" in stderr:
            print(
                "[check_openapi_sync] pnpm lockfile out of date, retrying without --frozen-lockfile",
                file=sys.stderr,
            )
            fallback_cmd = [
                "pnpm",
                "install",
                "--no-frozen-lockfile",
            ]
            run(fallback_cmd, cwd=client_dir)
        else:
            if install_result.stdout:
                print(install_result.stdout, end="", file=sys.stdout)
            if install_result.stderr:
                print(install_result.stderr, end="", file=sys.stderr)
            sys.exit(install_result.returncode)
    run(["pnpm", "openapi:types"], cwd=client_dir)

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
            "    cd backend && uv run python export_openapi.py\n"
            "    cd client && pnpm openapi:types\n"
            "Then stage backend/openapi.json and client/src/api/types.ts.",
            file=sys.stderr,
        )
        sys.exit(1)


if __name__ == "__main__":
    main()
