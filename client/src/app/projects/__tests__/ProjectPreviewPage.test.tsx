import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  vi,
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

  const swapResponse = {
    applied_at: new Date("2024-01-01T02:34:56Z").toISOString(),
    palette: {
      primary: "#111111",
      secondary: "#222222",
      accent: "#333333",
      neutrals: [],
    },
  } as HorizonPaletteSwapResponse;

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
