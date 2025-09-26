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
DIST_ROOT="public-sites/dist"
DIST_DIR="${DIST_ROOT}/${SLUG}"
SITE_OUT_DIR="${SITE_DIR}/out"
MANIFEST_SOURCE="${SITE_DIR}/src/data/asset-manifest.json"
MANIFEST_DEST="${DIST_DIR}/assets-manifest.json"

if [[ ! -d "${SITE_DIR}" ]]; then
  echo "[build-static-site] Unknown site slug '${SLUG}' (expected ${SITE_DIR})" >&2
  exit 1
fi

echo "[build-static-site] Installing dependencies for ${SLUG}"
pnpm --dir "${SITE_DIR}" install --frozen-lockfile --prefer-offline

if [[ "${SKIP_SITE_LINT:-0}" == "1" ]]; then
  echo "[build-static-site] Running static export (lint skipped via SKIP_SITE_LINT=1)"
  pnpm --dir "${SITE_DIR}" run build
else
  echo "[build-static-site] Running lint + static export"
  pnpm --dir "${SITE_DIR}" run check
fi

if [[ ! -d "${SITE_OUT_DIR}" ]]; then
  echo "[build-static-site] Expected static export at ${SITE_OUT_DIR} but it was not created" >&2
  exit 1
fi

echo "[build-static-site] Preparing dist bundle in ${DIST_DIR}"
rm -rf "${DIST_DIR}"
mkdir -p "${DIST_DIR}"
cp -R "${SITE_OUT_DIR}/." "${DIST_DIR}/"

if [[ -f "${MANIFEST_SOURCE}" ]]; then
  mkdir -p "${DIST_DIR}"
  cp "${MANIFEST_SOURCE}" "${MANIFEST_DEST}"
  echo "[build-static-site] Copied asset manifest to ${MANIFEST_DEST}"
else
  echo "[build-static-site] Warning: asset manifest ${MANIFEST_SOURCE} not found"
fi

echo "[build-static-site] Static assets available in ${DIST_DIR}"
