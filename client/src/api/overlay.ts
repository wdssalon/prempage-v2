import type { components } from "./types";

const DEFAULT_API_BASE_URL = "http://localhost:8000";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL;

export type OverlayEditEvent = components["schemas"]["OverlayEditEvent"];

export async function logOverlayEdit(
  event: OverlayEditEvent,
  signal?: AbortSignal,
): Promise<void> {
  const response = await fetch(`${apiBaseUrl}/overlay/events/edit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(event),
    signal,
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(
      `Overlay edit logging failed with status ${response.status}${
        detail ? `: ${detail}` : ""
      }`,
    );
  }
}
