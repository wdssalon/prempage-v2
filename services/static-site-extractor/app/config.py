from __future__ import annotations

import os
from typing import Final

REQUEST_TIMEOUT_SECONDS: Final[float] = float(os.getenv("REQUEST_TIMEOUT_SECONDS", "10"))
MAX_CONTENT_LENGTH_BYTES: Final[int] = int(os.getenv("MAX_CONTENT_LENGTH_BYTES", str(5_000_000)))
MAX_STYLESHEET_BYTES: Final[int] = int(os.getenv("MAX_STYLESHEET_BYTES", str(1_000_000)))
MAX_STYLESHEETS: Final[int] = int(os.getenv("MAX_STYLESHEETS", "8"))
USER_AGENT: Final[str] = os.getenv("USER_AGENT", "Prempage-Content-Extractor/0.1")
