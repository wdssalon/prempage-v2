from __future__ import annotations

import os
import subprocess
from pathlib import Path
from typing import Mapping

SCRIPT_PATH = Path("public-sites/scripts/horizon/build-static-site.sh")


def run_build(site_slug: str, *, env: Mapping[str, str] | None = None) -> subprocess.CompletedProcess[str]:
    if not SCRIPT_PATH.exists():
        msg = f"Build script missing: {SCRIPT_PATH}"
        raise FileNotFoundError(msg)
    command = ["bash", str(SCRIPT_PATH), site_slug]
    merged_env = {**os.environ, **(env or {}), "SITE_SLUG": site_slug}
    return subprocess.run(
        command,
        check=False,
        capture_output=True,
        text=True,
        env=merged_env,
    )
