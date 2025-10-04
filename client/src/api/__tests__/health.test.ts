import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type Mock,
} from "vitest";

import { fetchHealth } from "../health";

describe("fetchHealth", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("requests the health endpoint and returns the parsed payload", async () => {
    const payload = {
      status: "ok",
      service: { name: "backend", version: "1.0.0" },
      message: "All good",
      environment: "test",
      uptime_seconds: 12.5,
      timestamp: new Date().toISOString(),
    };

    const response = {
      ok: true,
      json: async () => payload,
    } as unknown as Response;

    const fetchMock = global.fetch as unknown as Mock;
    fetchMock.mockResolvedValue(response);

    const controller = new AbortController();

    const result = await fetchHealth(controller.signal);

    expect(fetchMock).toHaveBeenCalledWith("http://localhost:8000/health", {
      signal: controller.signal,
    });
    expect(result).toEqual(payload);
  });

  it("throws when the request fails", async () => {
    const response = {
      ok: false,
      status: 502,
      text: async () => "",
    } as unknown as Response;

    const fetchMock = global.fetch as unknown as Mock;
    fetchMock.mockResolvedValue(response);

    await expect(fetchHealth()).rejects.toThrowError(
      "Request failed with status 502",
    );
  });
});
