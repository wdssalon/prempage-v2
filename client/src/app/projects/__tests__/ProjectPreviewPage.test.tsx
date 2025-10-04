import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  vi,
  it,
  type MockedFunction,
} from "vitest";

vi.mock("@/lib/studioProjects", () => ({
  getStudioProject: vi.fn(),
}));

vi.mock("@/api/palette", () => ({
  swapPalette: vi.fn(),
}));

vi.mock("@/api/overlay", () => ({
  logOverlayEdit: vi.fn(),
}));

import ProjectPreviewPage from "../[slug]/page";
import { getStudioProject, type StudioProject } from "@/lib/studioProjects";
import { swapPalette, type HorizonPaletteSwapResponse } from "@/api/palette";

type ParamsThenable = Promise<{ slug: string }> & {
  status?: "fulfilled";
  value?: { slug: string };
};

function createResolvedParams(slug: string): ParamsThenable {
  const value = { slug };
  const promise = Promise.resolve(value) as ParamsThenable;
  promise.status = "fulfilled";
  promise.value = value;
  return promise;
}

describe("ProjectPreviewPage", () => {
  const mockGetStudioProject =
    getStudioProject as MockedFunction<typeof getStudioProject>;
  const mockSwapPalette = swapPalette as MockedFunction<typeof swapPalette>;

  const project: StudioProject = {
    slug: "horizon-example",
    name: "Horizon Example",
    description: "Example",
    devUrl: "http://localhost:3000",
    instructions: ["Run pnpm dev", "Open the preview"],
  };

  const swapResponse: HorizonPaletteSwapResponse = {
    applied_at: new Date("2024-01-01T02:34:56Z").toISOString(),
    palette: {
      bg_base: "#111111",
      bg_surface: "#1f1f1f",
      bg_contrast: "#000000",
      text_primary: "#f8fafc",
      text_secondary: "#cbd5f5",
      text_inverse: "#000000",
      brand_primary: "#312e81",
      brand_secondary: "#4338ca",
      accent: "#f59e0b",
      border: "#334155",
      ring: "#c084fc",
      critical: "#ef4444",
      critical_contrast: "#0f172a",
    },
  };

  beforeEach(() => {
    mockGetStudioProject.mockReturnValue(project);
    mockSwapPalette.mockResolvedValue(swapResponse);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders the project instructions", () => {
    render(<ProjectPreviewPage params={createResolvedParams(project.slug)} />);

    expect(screen.getByText(/Ready when you are/i)).toBeInTheDocument();
    expect(screen.getAllByRole("listitem").length).toBe(project.instructions.length);
  });

  it("sends a palette swap request when the action is invoked", async () => {
    const user = userEvent.setup();
    render(<ProjectPreviewPage params={createResolvedParams(project.slug)} />);

    const button = screen.getByRole("button", { name: /swap colors/i });
    await user.click(button);

    expect(mockSwapPalette).toHaveBeenCalledWith(
      project.slug,
      expect.objectContaining({
        notes: expect.stringContaining("header button"),
      }),
    );

    expect(await screen.findByText(/Palette applied at/i)).toBeInTheDocument();
  });

});
