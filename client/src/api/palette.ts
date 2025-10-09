import { getApiBaseUrl } from "./config";
import { getResponseErrorDetail } from "./error-utils";
import type { components } from "./types";

const apiBaseUrl = getApiBaseUrl();

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
    const parsedDetail = await getResponseErrorDetail(response);
    throw new Error(
      `Palette swap failed with status ${response.status}${
        parsedDetail ? `: ${parsedDetail}` : ""
      }`,
    );
  }

  return (await response.json()) as HorizonPaletteSwapResponse;
}
