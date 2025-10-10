"""Helpers for applying overlay edits to project source files."""
from __future__ import annotations

import html
import json
import os
import re
from dataclasses import dataclass
from pathlib import Path

from app.errors import (
    BadRequestError,
    ForbiddenError,
    InternalServerError,
    NotFoundError,
    RequestEntityTooLargeError,
    UnprocessableEntityError,
)
from app.models.overlay import OverlayEditEvent

PPID_PREFIX_CODE = "code"
MAX_EDITABLE_FILE_SIZE_BYTES = 512 * 1024  # 512 KiB


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
        raise UnprocessableEntityError(
            "Invalid PPID format",
            error_code="overlay_invalid_ppid_format",
        ) from exc

    if scheme != PPID_PREFIX_CODE:
        raise UnprocessableEntityError(
            f"Unsupported PPID namespace '{scheme}'",
            error_code="overlay_unsupported_namespace",
        )

    try:
        path_fragment, anchor = remainder.split("#", 1)
    except ValueError as exc:
        raise UnprocessableEntityError(
            "PPID missing anchor identifier",
            error_code="overlay_missing_anchor",
        ) from exc

    return path_fragment, anchor


def _resolve_target_path(path_fragment: str, project_slug: str) -> Path:
    repo_root = _repo_root().resolve()
    candidate = (repo_root / path_fragment).resolve()

    if not candidate.is_file():
        raise NotFoundError(
            "Target file not found",
            error_code="overlay_target_not_found",
            context={"path": str(candidate)},
        )

    try:
        candidate.relative_to(repo_root)
    except ValueError as exc:
        raise ForbiddenError(
            "Target path escapes repository root",
            error_code="overlay_path_escape",
            context={"path": str(candidate)},
        ) from exc

    expected_root = (repo_root / "public-sites" / "sites" / project_slug).resolve()
    if expected_root not in candidate.parents:
        raise BadRequestError(
            "PPID does not belong to the specified project",
            error_code="overlay_project_mismatch",
            context={
                "expected_root": str(expected_root),
                "candidate": str(candidate),
            },
        )

    return candidate


def apply_overlay_edit(event: OverlayEditEvent) -> OverlayApplicationResult:
    """Apply the requested overlay edit to the target source file."""

    if not event.payload.text:
        raise UnprocessableEntityError(
            "Overlay text payload is empty",
            error_code="overlay_empty_text",
        )

    path_fragment, _anchor = _parse_ppid(event.payload.ppid)
    target_path = _resolve_target_path(path_fragment, event.project_slug)

    try:
        file_size = target_path.stat().st_size
    except OSError as exc:
        raise InternalServerError(
            "Unable to inspect target file",
            error_code="overlay_stat_failed",
            context={"path": str(target_path)},
        ) from exc

    if file_size > MAX_EDITABLE_FILE_SIZE_BYTES:
        raise RequestEntityTooLargeError(
            "Target file exceeds editable size limit",
            context={
                "path": str(target_path),
                "size_bytes": file_size,
                "limit_bytes": MAX_EDITABLE_FILE_SIZE_BYTES,
            },
        )

    escaped_ppid = re.escape(event.payload.ppid)
    block_pattern = re.compile(
        rf'(?P<open><(?P<tag>[a-zA-Z][\w:-]*)[^<>]*data-ppid="{escaped_ppid}"[^<>]*>)'
        rf'(?P<body>.*?)'
        rf'(?P<close></(?P=tag)>)',
        re.DOTALL,
    )

    content = target_path.read_text(encoding="utf-8")

    match = block_pattern.search(content)

    if match:
        previous_text = match.group("body")
        escaped_text = html.escape(event.payload.text, quote=False).replace("\n", "<br />")

        if previous_text == escaped_text:
            return OverlayApplicationResult(
                relative_path=path_fragment,
                previous_text=_html_to_plain_text(previous_text),
                updated_text=event.payload.text,
            )

        updated_content = (
            content[: match.start("body")] + escaped_text + content[match.end("body") :]
        )

        target_path.write_text(updated_content, encoding="utf-8")

        return OverlayApplicationResult(
            relative_path=path_fragment,
            previous_text=_html_to_plain_text(previous_text),
            updated_text=event.payload.text,
        )

    # Fallback: update structured data entries that declare a sibling `<key>Ppid`
    escaped_ppid = re.escape(event.payload.ppid)
    fallback_pattern = re.compile(rf'(\w+)Ppid\s*:\s*"{escaped_ppid}"')
    fallback_match = fallback_pattern.search(content)

    if not fallback_match:
        raise NotFoundError(
            (
                f"Unable to locate PPID '{event.payload.ppid}' "
                f"in '{path_fragment}'"
            ),
            error_code="overlay_ppid_not_found",
        )

    value_key = fallback_match.group(1)
    search_window = content[: fallback_match.start()]
    value_pattern = re.compile(rf'{value_key}\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"')

    value_match: re.Match[str] | None = None
    for match_candidate in value_pattern.finditer(search_window):
        value_match = match_candidate

    if value_match is None:
        raise NotFoundError(
            (
                f"Unable to locate value for '{value_key}' associated with "
                f"PPID '{event.payload.ppid}' in '{path_fragment}'"
            ),
            error_code="overlay_value_not_found",
        )

    value_start = value_match.start(1)
    value_end = value_match.end(1)
    previous_encoded = content[value_start:value_end]
    previous_text_plain = json.loads(f'"{previous_encoded}"')
    updated_encoded = json.dumps(event.payload.text)[1:-1]

    if previous_encoded == updated_encoded:
        return OverlayApplicationResult(
            relative_path=path_fragment,
            previous_text=previous_text_plain,
            updated_text=event.payload.text,
        )

    updated_content = content[:value_start] + updated_encoded + content[value_end:]

    target_path.write_text(updated_content, encoding="utf-8")

    return OverlayApplicationResult(
        relative_path=path_fragment,
        previous_text=previous_text_plain,
        updated_text=event.payload.text,
    )


def _html_to_plain_text(value: str) -> str:
    # Normalise <br> variants back to newlines before unescaping
    normalised = value.replace("<br />", "\n").replace("<br>", "\n").replace(
        "<br/>", "\n"
    )
    return html.unescape(normalised)
