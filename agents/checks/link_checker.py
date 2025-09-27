from __future__ import annotations

from pathlib import Path
from typing import Iterable
from urllib.parse import urlparse


def find_broken_links(page_paths: Iterable[Path]) -> list[str]:
    broken: list[str] = []
    for page in page_paths:
        text = page.read_text()
        for token in text.split("\""):
            if token.startswith("http"):
                parsed = urlparse(token)
                if not parsed.scheme or not parsed.netloc:
                    broken.append(f"{page}: {token}")
    return broken
