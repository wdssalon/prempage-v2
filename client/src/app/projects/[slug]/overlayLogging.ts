"use client";

const isOverlayLoggingEnabled =
  typeof process !== "undefined" &&
  process.env.NEXT_PUBLIC_OVERLAY_DEBUG === "true";

export function overlayDebug(...args: unknown[]) {
  if (!isOverlayLoggingEnabled) {
    return;
  }

  console.debug(...args);
}

export function overlayInfo(...args: unknown[]) {
  if (!isOverlayLoggingEnabled) {
    return;
  }

  console.info(...args);
}
