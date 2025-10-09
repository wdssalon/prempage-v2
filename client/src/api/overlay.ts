import { getApiBaseUrl } from "./config";
import { getResponseErrorDetail } from "./error-utils";
import type { components } from "./types";

const apiBaseUrl = getApiBaseUrl();

export type OverlayEditEvent = components["schemas"]["OverlayEditEvent"];
export type OverlayEditResponse = components["schemas"]["OverlayEditResponse"];

export async function logOverlayEdit(
  event: OverlayEditEvent,
  signal?: AbortSignal,
): Promise<OverlayEditResponse> {
  const response = await fetch(`${apiBaseUrl}/overlay/events/edit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(event),
    signal,
  });

  if (!response.ok) {
    const detail = await getResponseErrorDetail(response);
    throw new Error(
      `Overlay edit logging failed with status ${response.status}${
        detail ? `: ${detail}` : ""
      }`,
    );
  }

  return (await response.json()) as OverlayEditResponse;
}
