import { getEnvVarOrDefault } from "@/config/env";

const DEFAULT_API_BASE_URL = "http://localhost:8000";

let cachedBaseUrl: string | null = null;

export function getApiBaseUrl(): string {
  if (cachedBaseUrl) {
    return cachedBaseUrl;
  }

  cachedBaseUrl = getEnvVarOrDefault(
    "NEXT_PUBLIC_API_BASE_URL",
    DEFAULT_API_BASE_URL,
  );

  return cachedBaseUrl;
}
