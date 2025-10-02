import type { components } from "./types";

const DEFAULT_API_BASE_URL = "http://localhost:8000";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL;

export type HorizonPaletteSwapRequest =
  components["schemas"]["HorizonPaletteSwapRequest"];

export type HorizonPaletteSwapResponse =
  components["schemas"]["HorizonPaletteSwapResponse"];

export async function swapPalette(
  slug: string,
  body: HorizonPaletteSwapRequest,
  signal?: AbortSignal,
): Promise<HorizonPaletteSwapResponse> {
  const response = await fetch(`${apiBaseUrl}/sites/${slug}/palette/swap`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    signal,
  });

  if (!response.ok) {
    const rawBody = await response.text();
    let parsedDetail: string | null = null;

    if (rawBody) {
      try {
        const payload = JSON.parse(rawBody) as { detail?: unknown };
        if (payload && typeof payload.detail === "string") {
          parsedDetail = payload.detail;
        }
      } catch {
        parsedDetail = rawBody;
      }

      if (!parsedDetail) {
        parsedDetail = rawBody;
      }
    }

    throw new Error(
      `Palette swap failed with status ${response.status}${
        parsedDetail ? `: ${parsedDetail}` : ""
      }`,
    );
  }

  return (await response.json()) as HorizonPaletteSwapResponse;
}
