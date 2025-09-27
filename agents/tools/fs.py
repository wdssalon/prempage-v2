from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

SITE_ROOT = Path("public-sites/sites")
TEMPLATE_ROOT = Path("public-sites/templates")


@dataclass
class FSResult:
    path: str
    content: str | None = None


def _resolve_site_path(site_slug: str, target: str) -> Path:
    base = SITE_ROOT / site_slug
    resolved = (base / target).resolve()
    if not resolved.is_relative_to(base):  # type: ignore[attr-defined]
        msg = f"Write access denied outside site root: {resolved}"
        raise PermissionError(msg)
    return resolved


def list_dir(site_slug: str, relative_path: str = ".") -> list[str]:
    target = _resolve_site_path(site_slug, relative_path)
    if not target.exists() or not target.is_dir():
        raise FileNotFoundError(target)
    return sorted(entry.name for entry in target.iterdir())


def read_file(path: str) -> FSResult:
    resolved = Path(path).resolve()
    if resolved.is_relative_to(SITE_ROOT.resolve()):  # type: ignore[attr-defined]
        return FSResult(path=str(resolved), content=resolved.read_text())
    if resolved.is_relative_to(TEMPLATE_ROOT.resolve()):  # type: ignore[attr-defined]
        return FSResult(path=str(resolved), content=resolved.read_text())
    msg = f"Read access denied: {resolved}"
    raise PermissionError(msg)


def write_file(site_slug: str, relative_path: str, content: str) -> FSResult:
    target = _resolve_site_path(site_slug, relative_path)
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(content)
    return FSResult(path=str(target), content=content)


def apply_patch(site_slug: str, relative_path: str, patch: Iterable[str]) -> FSResult:
    # For v1 we simply rewrite the file with supplied content. Later we can add unified diff support.
    rendered = "".join(patch)
    return write_file(site_slug, relative_path, rendered)
