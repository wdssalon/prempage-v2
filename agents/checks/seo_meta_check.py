from __future__ import annotations

from html.parser import HTMLParser
from pathlib import Path
from typing import Iterable, Set

REQUIRED_META = {
    ("name", "description"),
    ("property", "og:title"),
    ("property", "og:description"),
    ("property", "og:url"),
}


class MetaScanner(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.has_title = False
        self.found_meta: Set[tuple[str, str]] = set()
        self.has_canonical = False

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag.lower() == "meta":
            attrs_dict = {k.lower(): (v or "") for k, v in attrs}
            for key, value in REQUIRED_META:
                if attrs_dict.get(key) == value:
                    self.found_meta.add((key, value))
        if tag.lower() == "link":
            attrs_dict = {k.lower(): (v or "") for k, v in attrs}
            if attrs_dict.get("rel", "").lower() == "canonical":
                self.has_canonical = True

    def handle_startendtag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        self.handle_starttag(tag, attrs)

    def handle_data(self, data: str) -> None:
        # HTMLParser reports <title> content via handle_data
        if self.lasttag and self.lasttag.lower() == "title" and data.strip():
            self.has_title = True


def verify_seo_fields(page_paths: Iterable[Path]) -> list[str]:
    missing: list[str] = []
    for page in page_paths:
        parser = MetaScanner()
        parser.feed(page.read_text())
        absent: list[str] = []
        if not parser.has_title:
            absent.append("title")
        for entry in REQUIRED_META:
            if entry not in parser.found_meta:
                absent.append(f"meta[{entry[0]}='{entry[1]}']")
        if not parser.has_canonical:
            absent.append("link[rel='canonical']")
        if absent:
            missing.append(f"{page}: {', '.join(absent)}")
    return missing
