#!/bin/sh
set -eu

CLIENT_DIR=${CLIENT_DIR:-/app/client}
LOCKFILE="${CLIENT_DIR}/pnpm-lock.yaml"
NODE_MODULES_DIR="${CLIENT_DIR}/node_modules"
LOCK_HASH_FILE="${NODE_MODULES_DIR}/.pnpm-lock.sha256"

if [ ! -f "$LOCKFILE" ]; then
  echo "Expected lockfile at $LOCKFILE but none was found" >&2
  exit 1
fi

calculate_lock_hash() {
  sha256sum "$LOCKFILE" | awk '{ print $1 }'
}

NEED_INSTALL=0
if [ ! -d "$NODE_MODULES_DIR" ]; then
  echo "No node_modules directory detected; dependencies need to be installed"
  NEED_INSTALL=1
elif [ ! -f "$LOCK_HASH_FILE" ]; then
  echo "Lock hash file missing; dependencies need to be installed"
  NEED_INSTALL=1
else
  DESIRED_HASH=$(calculate_lock_hash)
  STORED_HASH=$(cat "$LOCK_HASH_FILE")
  if [ "$DESIRED_HASH" != "$STORED_HASH" ]; then
    echo "Detected pnpm-lock.yaml change; refreshing dependencies"
    NEED_INSTALL=1
  fi
fi

if [ "$NEED_INSTALL" -ne 0 ]; then
  echo "Installing frontend dependencies with pnpm"
  cd "$CLIENT_DIR"
  pnpm install --frozen-lockfile
  mkdir -p "$NODE_MODULES_DIR"
  calculate_lock_hash > "$LOCK_HASH_FILE"
else
  echo "Frontend dependencies already in sync; skipping pnpm install"
fi

cd "$CLIENT_DIR"
exec pnpm dev --hostname 0.0.0.0
