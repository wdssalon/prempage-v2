#!/usr/bin/env python3
"""Fetch structured content from the static-site-extractor service.

Usage
-----
python public-sites/scripts/extract_site.py <site_slug> <url> [--service-url http://localhost:8081] [--output <path>]

The script writes the JSON response into `public-sites/sites/<site_slug>/artifacts/` unless an
explicit output path is provided. The filename defaults to the target domain with a timestamp
suffix to avoid accidental overwrites.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from datetime import datetime
from pathlib import Path
from urllib.parse import urlparse
from urllib.request import Request, urlopen

DEFAULT_SERVICE_URL = "http://localhost:8081"
REPO_ROOT = Path(__file__).resolve().parents[2]
PUBLIC_SITES_ROOT = REPO_ROOT / "public-sites" / "sites"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Call the static-site-extractor service and store the JSON output")
    parser.add_argument("site_slug", help="Site slug under public-sites/sites (e.g., acme-horizon)")
    parser.add_argument("url", help="URL to extract (include protocol, e.g., https://example.com)")
    parser.add_argument(
        "--service-url",
        default=os.environ.get("STATIC_SITE_EXTRACTOR_URL", DEFAULT_SERVICE_URL),
        help="Base URL of the extractor service (default: %(default)s)",
    )
    parser.add_argument(
        "--output",
        help="Optional explicit output path for the JSON file. Defaults to artifacts/ under the site directory.",
    )
    return parser.parse_args()


def ensure_site_directory(site_slug: str) -> Path:
    site_dir = PUBLIC_SITES_ROOT / site_slug
    if not site_dir.exists():
        raise SystemExit(f"Site directory not found: {site_dir}")
    artifacts_dir = site_dir / "artifacts"
    artifacts_dir.mkdir(parents=True, exist_ok=True)
    return artifacts_dir


def derive_default_output(artifacts_dir: Path, target_url: str) -> Path:
    parsed = urlparse(target_url)
    domain = parsed.netloc or "unknown-domain"
    timestamp = datetime.utcnow().strftime("%Y%m%d-%H%M%S")
    filename = f"extract-{domain}-{timestamp}.json"
    return artifacts_dir / filename


def call_extractor(service_url: str, target_url: str) -> dict:
    endpoint = service_url.rstrip("/") + "/extract"
    payload = json.dumps({"url": target_url}).encode("utf-8")
    request = Request(endpoint, data=payload, headers={"Content-Type": "application/json"})

    try:
        with urlopen(request, timeout=60) as response:
            if response.status != 200:
                raise SystemExit(f"Extractor returned HTTP {response.status}: {response.read().decode('utf-8')}")
            raw = response.read().decode("utf-8")
            return json.loads(raw)
    except OSError as exc:  # includes URLError
        raise SystemExit(f"Failed to reach extractor service at {endpoint}: {exc}") from exc


def main() -> None:
    args = parse_args()
    artifacts_dir = ensure_site_directory(args.site_slug)
    output_path = Path(args.output) if args.output else derive_default_output(artifacts_dir, args.url)

    data = call_extractor(args.service_url, args.url)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(data, indent=2, sort_keys=True) + "\n", encoding="utf-8")

    print(f"Saved extraction to {output_path}")


if __name__ == "__main__":
    main()
