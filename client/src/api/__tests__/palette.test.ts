import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from "vitest";

import { swapPalette } from "../palette";

describe("swapPalette", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("sends the palette swap request and returns the response payload", async () => {
    const body = { notes: "test" };
    const payload = {
      applied_at: new Date().toISOString(),
      palette: { primary: "#000000" },
    };

    const response = {
      ok: true,
      json: async () => payload,
    } as unknown as Response;

    const fetchMock = global.fetch as unknown as Mock;
    fetchMock.mockResolvedValue(response);

    const result = await swapPalette("horizon-example", body);

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:8000/sites/horizon-example/palette/swap",
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }),
    );
    expect(result).toEqual(payload);
  });

  it("includes detail information when the server responds with an error payload", async () => {
    const response = {
      ok: false,
      status: 422,
      text: async () => JSON.stringify({ detail: "Invalid slug" }),
    } as unknown as Response;

    const fetchMock = global.fetch as unknown as Mock;
    fetchMock.mockResolvedValue(response);

    await expect(swapPalette("bad", { notes: "" })).rejects.toThrowError(
      "Palette swap failed with status 422: Invalid slug",
    );
  });

  it("falls back to the raw body when parsing fails", async () => {
    const response = {
      ok: false,
      status: 500,
      text: async () => "Internal error",
    } as unknown as Response;

    const fetchMock = global.fetch as unknown as Mock;
    fetchMock.mockResolvedValue(response);

    await expect(swapPalette("slug", { notes: "" })).rejects.toThrowError(
      "Palette swap failed with status 500: Internal error",
    );
  });
});
