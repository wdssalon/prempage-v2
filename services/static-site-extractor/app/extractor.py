from __future__ import annotations

import asyncio
import re
from collections.abc import Iterable
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import NamedTuple
from urllib.parse import urljoin, urlparse

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
NAV_KEYWORDS = (
    "nav",
    "menu",
    "menubar",
    "navbar",
    "main-nav",
    "primary-nav",
    "primary-menu",
    "topnav",
    "site-nav",
    "header-nav",
)
FOOTER_KEYWORDS = ("footer", "foot", "bottom")
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
    "[document]",
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
    text_models = [models.TextNode(content=node.content) for node in text_nodes]
    text_blob = _compose_text_blob(text_nodes)
    navigation = _extract_navigation(soup, base_url=response.url)
    image_nodes = _dedupe_image_nodes(images)

    return models.ExtractionResponse(
        url=str(response.url),
        title=_extract_title(soup),
        fetched_at=datetime.now(timezone.utc),
        text=text_models,
        text_blob=text_blob,
        images=[models.ImageResource(**_image_dict(image)) for image in image_nodes],
        fonts=[
            models.FontResource(url=font.url, source=font.source, stylesheet_url=font.stylesheet_url)
            for font in fonts
        ],
        navigation=navigation,
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


class _NavLink(NamedTuple):
    title: str
    href: str | None


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
        if path == "[document]":
            continue
        yield _TextNode(path=path, content=stripped)


def _compose_text_blob(nodes: Iterable[_TextNode]) -> str:
    return "\n\n".join(node.content for node in nodes)


def _extract_navigation(soup: BeautifulSoup, *, base_url: httpx.URL) -> list[models.NavigationItem]:
    candidates = _navigation_candidates(soup)
    if not candidates:
        return []

    scored: list[tuple[float, int, Tag]] = []
    base_host = urlparse(str(base_url)).netloc

    for idx, candidate in enumerate(candidates):
        links = _candidate_links(candidate)
        if len(links) < 2:
            continue

        internal_links = sum(1 for link in links if _is_internal_link(link.href, base_host))
        if internal_links == 0:
            continue

        score = internal_links * 2 + len(links)
        if _looks_like_footer(candidate):
            score -= 3

        if score <= 0:
            continue

        scored.append((score, idx, candidate))

    if not scored:
        return []

    scored.sort(key=lambda entry: (entry[0], -entry[1]), reverse=True)
    best_candidate = scored[0][2]

    items = _build_navigation_structure(best_candidate, base_url)
    return items


def _navigation_candidates(soup: BeautifulSoup) -> list[Tag]:
    candidates: list[Tag] = []
    seen: set[int] = set()

    def _register(tag: Tag) -> None:
        identity = id(tag)
        if identity in seen:
            return
        seen.add(identity)
        candidates.append(tag)

    for element in soup.find_all("nav"):
        _register(element)

    for element in soup.find_all(attrs={"role": re.compile("navigation|menubar", re.I)}):
        _register(element)

    keyword_pattern = re.compile("|".join(re.escape(k) for k in NAV_KEYWORDS), re.I)
    for element in soup.find_all(
        attrs={"class": keyword_pattern}
    ):
        _register(element)
    for element in soup.find_all(id=keyword_pattern):
        _register(element)

    return candidates


def _candidate_links(container: Tag) -> list[_NavLink]:
    links: list[_NavLink] = []
    for anchor in container.find_all("a", href=True):
        title = _normalize_nav_text(anchor.get_text(separator=" ", strip=True))
        if not title:
            continue
        href = _normalize_href(anchor.get("href"), base_url=None)
        links.append(_NavLink(title=title, href=href))
    return links


def _build_navigation_structure(root: Tag, base_url: httpx.URL) -> list[models.NavigationItem]:
    primary_lists = [
        lst
        for lst in root.find_all(["ul", "ol"])
        if lst.find_parent(["ul", "ol"]) is None or lst.find_parent(["nav", "div", "header"]) is root
    ]

    for lst in primary_lists:
        items = _parse_list(lst, base_url)
        if items:
            return items

    flat_items = _flat_navigation(root, base_url)
    return flat_items


def _parse_list(list_tag: Tag, base_url: httpx.URL) -> list[models.NavigationItem]:
    items: list[models.NavigationItem] = []
    seen: set[tuple[str, str | None]] = set()

    for li in list_tag.find_all("li", recursive=False):
        anchor = _first_anchor(li)
        if anchor is None:
            continue
        title = _normalize_nav_text(anchor.get_text(separator=" ", strip=True))
        if not title:
            continue

        href = _normalize_href(anchor.get("href"), base_url)
        key = (title.lower(), href or "")
        if key in seen:
            continue
        seen.add(key)

        children = _collect_submenus(li, base_url)
        items.append(models.NavigationItem(title=title, href=href, children=children))

    return items


def _collect_submenus(li: Tag, base_url: httpx.URL) -> list[models.NavigationItem]:
    for child in li.children:
        if isinstance(child, Tag) and child.name in {"ul", "ol"}:
            return _parse_list(child, base_url)
    # fallback: nested lists wrapped in div/span
    nested = li.find(["ul", "ol"])
    if nested is not None:
        return _parse_list(nested, base_url)
    return []


def _flat_navigation(container: Tag, base_url: httpx.URL) -> list[models.NavigationItem]:
    items: list[models.NavigationItem] = []
    seen: set[tuple[str, str | None]] = set()
    for anchor in container.find_all("a", href=True):
        title = _normalize_nav_text(anchor.get_text(separator=" ", strip=True))
        if not title:
            continue
        href = _normalize_href(anchor.get("href"), base_url)
        key = (title.lower(), href or "")
        if key in seen:
            continue
        seen.add(key)
        items.append(models.NavigationItem(title=title, href=href, children=[]))
    return items


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
        if isinstance(alt, str):
            alt = alt.strip() or None
        else:
            alt = None
        yield _ImageNode(src=absolute, alt=alt)


def _image_dict(image: _ImageNode) -> dict[str, str | None]:
    data = image._asdict()
    if not data.get("alt"):
        data.pop("alt", None)
    return data


def _dedupe_image_nodes(images: Iterable[_ImageNode]) -> list[_ImageNode]:
    seen: set[str] = set()
    unique: list[_ImageNode] = []
    for image in images:
        if image.src in seen:
            continue
        seen.add(image.src)
        unique.append(image)
    return unique


def _first_anchor(li: Tag) -> Tag | None:
    for child in li.children:
        if isinstance(child, Tag) and child.name == "a":
            return child
    for anchor in li.find_all("a"):
        return anchor
    return None


def _normalize_nav_text(text: str | None) -> str | None:
    if not text:
        return None
    normalized = re.sub(r"\s+", " ", text.strip())
    if not normalized:
        return None
    if not any(char.isalnum() for char in normalized):
        return None
    return normalized


def _normalize_href(href: str | None, base_url: httpx.URL | None) -> str | None:
    if not href:
        return None
    href = href.strip()
    if not href:
        return None
    lowered = href.lower()
    if lowered.startswith("javascript:"):
        return None
    if href.startswith(("mailto:", "tel:")):
        return href
    if base_url is None:
        return href
    return urljoin(str(base_url), href)


def _is_internal_link(href: str | None, base_host: str) -> bool:
    if href is None:
        return False
    if href.startswith(("mailto:", "tel:")):
        return True
    parsed = urlparse(href)
    if not parsed.netloc:
        return True
    return parsed.netloc == base_host


def _looks_like_footer(tag: Tag) -> bool:
    if tag.find_parent("footer") is not None:
        return True
    values: list[str] = []
    for key, value in tag.attrs.items():
        if key not in {"id", "class", "role"}:
            continue
        if isinstance(value, (list, tuple)):
            values.extend(str(item) for item in value)
        else:
            values.append(str(value))
    attrs = " ".join(values).lower()
    return any(keyword in attrs for keyword in FOOTER_KEYWORDS)


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
    seen: dict[str, FontCandidate] = {}
    for font in fonts:
        if font.url in seen:
            continue
        seen[font.url] = font
    return list(seen.values())
