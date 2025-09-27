from __future__ import annotations

import asyncio
import re
from collections.abc import Iterable
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import NamedTuple
from urllib.parse import urljoin

import httpx
from bs4 import BeautifulSoup, NavigableString, Tag
from loguru import logger

from . import models
from .config import (
    MAX_CONTENT_LENGTH_BYTES,
    MAX_STYLESHEET_BYTES,
    MAX_STYLESHEETS,
    REQUEST_TIMEOUT_SECONDS,
    USER_AGENT,
)

FONT_EXTENSIONS = (".woff", ".woff2", ".ttf", ".otf", ".eot")
CSS_URL_PATTERN = re.compile(r"url\(([^)]+)\)", re.IGNORECASE)
IMPORT_PATTERN = re.compile(r"@import\s+url\(([^)]+)\)", re.IGNORECASE)
SKIP_TEXT_PARENTS = {
    "script",
    "style",
    "noscript",
    "template",
    "meta",
    "link",
    "head",
    "title",
}


class ExtractionError(Exception):
    def __init__(self, message: str, status_code: int = 400) -> None:
        super().__init__(message)
        self.message = message
        self.status_code = status_code


class StylesheetRef(NamedTuple):
    url: str
    referer: str | None


@dataclass(slots=True)
class FontCandidate:
    url: str
    source: str
    stylesheet_url: str | None


async def extract_page(url: str) -> models.ExtractionResponse:
    async with httpx.AsyncClient(
        timeout=httpx.Timeout(REQUEST_TIMEOUT_SECONDS),
        follow_redirects=True,
        headers={"User-Agent": USER_AGENT},
    ) as client:
        response = await _fetch_html(client, url)
        html = response.text

        soup = BeautifulSoup(html, "html.parser")

        text_nodes = list(_extract_text_nodes(soup))
        images = list(_extract_images(soup, base_url=response.url))
        font_candidates = await _collect_font_candidates(client, soup, base_url=response.url)

    fonts = _dedupe_fonts(font_candidates)

    return models.ExtractionResponse(
        url=str(response.url),
        title=_extract_title(soup),
        fetched_at=datetime.now(timezone.utc),
        text=[models.TextNode(**node._asdict()) for node in text_nodes],
        images=[models.ImageResource(**image._asdict()) for image in images],
        fonts=[
            models.FontResource(url=font.url, source=font.source, stylesheet_url=font.stylesheet_url)
            for font in fonts
        ],
    )


async def _fetch_html(client: httpx.AsyncClient, url: str) -> httpx.Response:
    try:
        response = await client.get(url)
    except httpx.HTTPError as exc:
        logger.warning("Failed to fetch %s: %s", url, exc)
        raise ExtractionError("Failed to fetch the requested URL", status_code=502) from exc

    content_length = response.headers.get("Content-Length")
    if content_length and int(content_length) > MAX_CONTENT_LENGTH_BYTES:
        raise ExtractionError("Fetched content exceeds maximum allowed size", status_code=413)

    if len(response.content) > MAX_CONTENT_LENGTH_BYTES:
        raise ExtractionError("Fetched content exceeds maximum allowed size", status_code=413)

    content_type = response.headers.get("Content-Type", "").lower()
    if "text/html" not in content_type:
        raise ExtractionError("URL does not appear to be HTML content", status_code=415)

    return response


def _extract_title(soup: BeautifulSoup) -> str | None:
    if soup.title and soup.title.string:
        return soup.title.string.strip() or None
    return None


class _TextNode(NamedTuple):
    path: str
    content: str


def _extract_text_nodes(soup: BeautifulSoup) -> Iterable[_TextNode]:
    for text in soup.find_all(string=True):
        if not isinstance(text, NavigableString):
            continue
        stripped = text.strip()
        if not stripped:
            continue
        parent = text.parent
        if not isinstance(parent, Tag):
            continue
        if parent.name in SKIP_TEXT_PARENTS:
            continue
        path = _build_dom_path(parent)
        yield _TextNode(path=path, content=stripped)


def _build_dom_path(element: Tag) -> str:
    parts: list[str] = []
    current: Tag | None = element

    while current and isinstance(current, Tag):
        parent = current.parent if isinstance(current.parent, Tag) else None
        if parent:
            siblings = [sib for sib in parent.find_all(current.name, recursive=False)]
            index = siblings.index(current) + 1 if siblings else 1
            parts.append(f"{current.name}[{index}]")
        else:
            parts.append(current.name)
        current = parent

    return ".".join(reversed(parts))


class _ImageNode(NamedTuple):
    src: str
    alt: str | None


def _extract_images(soup: BeautifulSoup, *, base_url: httpx.URL) -> Iterable[_ImageNode]:
    for img in soup.find_all("img"):
        src = img.get("src") or ""
        if not src:
            continue
        absolute = urljoin(str(base_url), src)
        if not absolute.startswith(("http://", "https://")):
            continue
        alt = img.get("alt")
        yield _ImageNode(src=absolute, alt=alt.strip() if isinstance(alt, str) else None)


async def _collect_font_candidates(
    client: httpx.AsyncClient, soup: BeautifulSoup, *, base_url: httpx.URL
) -> list[FontCandidate]:
    candidates: list[FontCandidate] = []

    # Fonts exposed directly via <link rel="preload" as="font"> entries
    for link in soup.find_all("link"):
        rel = {value.lower() for value in (link.get("rel") or [])}
        if "preload" in rel and link.get("as") == "font":
            href = link.get("href")
            if not href:
                continue
            absolute = urljoin(str(base_url), href)
            if _looks_like_font(absolute):
                candidates.append(FontCandidate(url=absolute, source="inline", stylesheet_url=None))

    inline_imports: set[str] = set()
    inline_styles = [str(tag.string) for tag in soup.find_all("style") if tag.string]
    for css in inline_styles:
        font_urls, imports = _parse_css_for_fonts(css, base=str(base_url))
        for font_url in font_urls:
            candidates.append(FontCandidate(url=font_url, source="inline", stylesheet_url=None))
        inline_imports.update(imports)

    stylesheet_refs = _stylesheet_urls(soup, str(base_url))
    stylesheet_refs.extend(
        StylesheetRef(url=css_url, referer=str(base_url)) for css_url in inline_imports
    )
    if not stylesheet_refs:
        return candidates

    queue: asyncio.Queue[StylesheetRef] = asyncio.Queue()
    enqueued: set[str] = set()
    for ref in stylesheet_refs[:MAX_STYLESHEETS]:
        queue.put_nowait(ref)
        enqueued.add(ref.url)

    processed = 0
    seen_stylesheets: set[str] = set()

    while not queue.empty() and processed < MAX_STYLESHEETS:
        ref = await queue.get()
        processed += 1
        if ref.url in seen_stylesheets:
            continue
        seen_stylesheets.add(ref.url)

        css = await _fetch_stylesheet(client, ref.url)
        if css is None:
            continue

        font_urls, imports = _parse_css_for_fonts(css, base=ref.url)
        for font_url in font_urls:
            candidates.append(
                FontCandidate(url=font_url, source="stylesheet", stylesheet_url=ref.url)
            )

        for import_url in imports:
            if import_url in seen_stylesheets or import_url in enqueued:
                continue
            if len(enqueued) >= MAX_STYLESHEETS:
                continue
            queue.put_nowait(StylesheetRef(url=import_url, referer=ref.url))
            enqueued.add(import_url)

    return candidates


def _stylesheet_urls(soup: BeautifulSoup, base_url: str) -> list[StylesheetRef]:
    refs: list[StylesheetRef] = []
    for link in soup.find_all("link"):
        rel = {value.lower() for value in (link.get("rel") or [])}
        if "stylesheet" not in rel:
            continue
        href = link.get("href")
        if not href:
            continue
        url = urljoin(base_url, href)
        refs.append(StylesheetRef(url=url, referer=None))
    return refs


async def _fetch_stylesheet(client: httpx.AsyncClient, url: str) -> str | None:
    try:
        response = await client.get(url)
    except httpx.HTTPError as exc:
        logger.debug("Failed to fetch stylesheet %s: %s", url, exc)
        return None

    content_type = response.headers.get("Content-Type", "").lower()
    if "text/css" not in content_type and "text/plain" not in content_type:
        return None

    if len(response.content) > MAX_STYLESHEET_BYTES:
        logger.debug("Skipping stylesheet %s because it exceeds size limit", url)
        return None

    return response.text


def _parse_css_for_fonts(css: str, base: str) -> tuple[set[str], set[str]]:
    font_urls: set[str] = set()
    import_urls: set[str] = set()

    for raw_url in CSS_URL_PATTERN.findall(css):
        cleaned = raw_url.strip().strip("'\"")
        if not cleaned or cleaned.startswith("data:"):
            continue
        absolute = urljoin(base, cleaned)
        if _looks_like_font(absolute):
            font_urls.add(absolute)

    for import_url in IMPORT_PATTERN.findall(css):
        cleaned = import_url.strip().strip("'\"")
        if not cleaned or cleaned.startswith("data:"):
            continue
        import_urls.add(urljoin(base, cleaned))

    return font_urls, import_urls


def _looks_like_font(url: str) -> bool:
    lower = url.lower()
    return lower.startswith(("http://", "https://")) and lower.endswith(FONT_EXTENSIONS)


def _dedupe_fonts(fonts: Iterable[FontCandidate]) -> list[FontCandidate]:
    seen: dict[tuple[str, str | None], FontCandidate] = {}
    for font in fonts:
        key = (font.url, font.stylesheet_url)
        seen[key] = font
    return list(seen.values())
