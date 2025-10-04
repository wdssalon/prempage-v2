import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  describe,
  expect,
  beforeEach,
  afterEach,
  vi,
  type MockedFunction,
} from "vitest";

vi.mock("@/api/health", () => ({
  fetchHealth: vi.fn(),
}));

vi.mock("@/api/palette", () => ({
  swapPalette: vi.fn(),
}));

vi.mock("@/lib/studioProjects", () => ({
  listStudioProjects: vi.fn(),
}));

import HomePage from "../page";
import { fetchHealth, type HealthResponse } from "@/api/health";
import { swapPalette, type HorizonPaletteSwapResponse } from "@/api/palette";
import { listStudioProjects, type StudioProject } from "@/lib/studioProjects";

describe("HomePage", () => {
  const mockFetchHealth = fetchHealth as MockedFunction<typeof fetchHealth>;
  const mockSwapPalette = swapPalette as MockedFunction<typeof swapPalette>;
  const mockListStudioProjects =
    listStudioProjects as MockedFunction<typeof listStudioProjects>;

  const waitForHealthStatus = () => screen.findByText("ok", { selector: "span" });

  const project: StudioProject = {
    slug: "horizon-example",
    name: "Horizon Example",
    description: "Example site",
    devUrl: "http://localhost:3000",
    instructions: ["Start dev server"],
  };

  const healthPayload: HealthResponse = {
    status: "ok",
    message: "All good",
    environment: "test",
    uptime_seconds: 120,
    timestamp: new Date("2024-01-01T00:00:00Z").toISOString(),
    service: {
      name: "backend",
      version: "1.0.0",
    },
  };

  const swapPayload = {
    applied_at: new Date("2024-01-01T01:23:45Z").toISOString(),
    palette: {
      primary: "#111111",
      secondary: "#222222",
      accent: "#333333",
      neutrals: [],
    },
  } as HorizonPaletteSwapResponse;

  beforeEach(() => {
    mockFetchHealth.mockResolvedValue(healthPayload);
    mockSwapPalette.mockResolvedValue(swapPayload);
    mockListStudioProjects.mockReturnValue([project]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("fetches backend health information on mount", async () => {
    render(<HomePage />);

    const statusValue = await waitForHealthStatus();

    expect(statusValue).toBeInTheDocument();
    expect(mockFetchHealth).toHaveBeenCalledTimes(1);
    const [signal] = mockFetchHealth.mock.calls[0] ?? [];
    expect(signal).toBeInstanceOf(AbortSignal);
  });

  it("increments the counter when the button is clicked", async () => {
    const user = userEvent.setup();
    render(<HomePage />);
    await waitForHealthStatus();

    const button = screen.getByRole("button", { name: /count is/i });
    await user.click(button);

    expect(button).toHaveTextContent("Count is 1");
  });

  it("renders available studio projects with links", async () => {
    render(<HomePage />);
    await waitForHealthStatus();

    expect(screen.getByText(project.name)).toBeInTheDocument();
    const link = screen.getByRole("link", { name: /open preview/i });
    expect(link).toHaveAttribute("href", `/projects/${project.slug}`);
  });

  it("requests a palette swap when the action button is pressed", async () => {
    const user = userEvent.setup();
    render(<HomePage />);
    await waitForHealthStatus();

    const button = screen.getByRole("button", { name: /swap colors/i });
    await user.click(button);

    expect(mockSwapPalette).toHaveBeenCalledWith(
      project.slug,
      expect.objectContaining({
        notes: expect.stringContaining("Studio swap button"),
      }),
    );
    expect(await screen.findByText(/Applied at/i)).toBeInTheDocument();
  });
});
