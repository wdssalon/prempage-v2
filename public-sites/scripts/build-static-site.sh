#!/usr/bin/env bash
set -euo pipefail

if ! command -v pnpm >/dev/null 2>&1; then
  echo "[build-static-site] pnpm is required but not available" >&2
  exit 1
fi

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <site-slug>" >&2
  exit 1
fi

SLUG="$1"
SITE_DIR="public-sites/sites/${SLUG}"

if [[ ! -d "${SITE_DIR}" ]]; then
  echo "[build-static-site] Unknown site slug '${SLUG}' (expected ${SITE_DIR})" >&2
  exit 1
fi

echo "[build-static-site] Installing dependencies for ${SLUG}"
pnpm --dir "${SITE_DIR}" install --frozen-lockfile

echo "[build-static-site] Running lint + static export"
pnpm --dir "${SITE_DIR}" run check

echo "[build-static-site] Static assets available in ${SITE_DIR}/out"
