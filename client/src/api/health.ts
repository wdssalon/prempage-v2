import { getApiBaseUrl } from "./config";
import type { paths } from "./types";

export type HealthResponse =
  paths["/health"]["get"]["responses"]["200"]["content"]["application/json"];

const apiBaseUrl = getApiBaseUrl();

export async function fetchHealth(signal?: AbortSignal): Promise<HealthResponse> {
  const response = await fetch(`${apiBaseUrl}/health`, { signal });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return (await response.json()) as HealthResponse;
}
