from __future__ import annotations

import re
from pathlib import Path
from typing import Iterable

SECTION_PATTERN = re.compile(r'data-section="(?P<section>[^"]+)"')


def verify_allowed_sections(page_paths: Iterable[Path], allowed_ids: set[str]) -> list[str]:
    violations: list[str] = []
    for page in page_paths:
        markup = page.read_text()
        illegal = {
            match.group("section")
            for match in SECTION_PATTERN.finditer(markup)
            if match.group("section") not in allowed_ids
        }
        if illegal:
            violations.append(f"{page}: {', '.join(sorted(illegal))}")
    return violations
