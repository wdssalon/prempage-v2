export async function getResponseErrorDetail(
  response: Response,
): Promise<string | null> {
  const rawBody = await response.text();

  if (!rawBody) {
    return null;
  }

  try {
    const payload = JSON.parse(rawBody) as { detail?: unknown };
    if (payload && typeof payload.detail === "string") {
      return payload.detail;
    }
  } catch {
    // Fall through to returning the raw body when JSON parsing fails.
  }

  return rawBody;
}
