"""Helpers for applying overlay edits to project source files."""
from __future__ import annotations

import html
import os
import re
from dataclasses import dataclass
from pathlib import Path

from fastapi import HTTPException, status

from app.models.overlay import OverlayEditEvent

PPID_PREFIX_CODE = "code"


@dataclass
class OverlayApplicationResult:
    """Details about an applied overlay edit."""

    relative_path: str
    previous_text: str
    updated_text: str


def _repo_root() -> Path:
    repo_root = os.environ.get("PREMPAGE_REPO_ROOT")
    if repo_root:
        return Path(repo_root)

    # Fall back to project root relative to this file (../../.. from services)
    return Path(__file__).resolve().parents[3]


def _parse_ppid(ppid: str) -> tuple[str, str]:
    try:
        scheme, remainder = ppid.split(":", 1)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Invalid PPID format",
        ) from exc

    if scheme != PPID_PREFIX_CODE:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Unsupported PPID namespace '{scheme}'",
        )

    try:
        path_fragment, anchor = remainder.split("#", 1)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="PPID missing anchor identifier",
        ) from exc

    return path_fragment, anchor


def _resolve_target_path(path_fragment: str, project_slug: str) -> Path:
    repo_root = _repo_root().resolve()
    candidate = (repo_root / path_fragment).resolve()

    if not candidate.is_file():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Target file not found",
        )

    try:
        candidate.relative_to(repo_root)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Target path escapes repository root",
        ) from exc

    expected_root = (repo_root / "public-sites" / "sites" / project_slug).resolve()
    if expected_root not in candidate.parents:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="PPID does not belong to the specified project",
        )

    return candidate


def apply_overlay_edit(event: OverlayEditEvent) -> OverlayApplicationResult:
    """Apply the requested overlay edit to the target source file."""

    if not event.payload.text:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Overlay text payload is empty",
        )

    path_fragment, _anchor = _parse_ppid(event.payload.ppid)
    target_path = _resolve_target_path(path_fragment, event.project_slug)

    escaped_ppid = re.escape(event.payload.ppid)
    pattern = re.compile(
        rf'(<[^<>]*data-ppid="{escaped_ppid}"[^<>]*>)(.*?)(</[^<>]+>)',
        re.DOTALL,
    )

    content = target_path.read_text(encoding="utf-8")

    match = pattern.search(content)
    if not match:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Target node not found in file",
        )

    previous_text = match.group(2)
    escaped_text = html.escape(event.payload.text, quote=False)
    escaped_text = escaped_text.replace("\n", "<br />")

    if previous_text == escaped_text:
        return OverlayApplicationResult(
            relative_path=path_fragment,
            previous_text=_html_to_plain_text(previous_text),
            updated_text=event.payload.text,
        )

    updated_content = pattern.sub(
        lambda m: f"{m.group(1)}{escaped_text}{m.group(3)}",
        content,
        count=1,
    )

    target_path.write_text(updated_content, encoding="utf-8")

    return OverlayApplicationResult(
        relative_path=path_fragment,
        previous_text=_html_to_plain_text(previous_text),
        updated_text=event.payload.text,
    )


def _html_to_plain_text(value: str) -> str:
    # Normalise <br> variants back to newlines before unescaping
    normalised = value.replace("<br />", "\n").replace("<br>", "\n").replace(
        "<br/>", "\n"
    )
    return html.unescape(normalised)
