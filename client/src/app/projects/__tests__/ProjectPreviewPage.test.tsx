import { Suspense, act } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type MockedFunction,
} from "vitest";

vi.mock("@/generated/sections/horizon", () => ({
  HORIZON_SECTIONS: [
    {
      key: "hero",
      label: "Hero",
      category: "hero",
      sectionId: "hero-section",
    },
  ],
}));

type SectionLibraryDialogSnapshot = {
  open: boolean;
  insertFeedback?: { message?: string } | null;
} & Record<string, unknown>;

const dialogPropsRef: { current: SectionLibraryDialogSnapshot | undefined } = {
  current: undefined,
};

vi.mock("@/app/projects/[slug]/SectionLibraryDialog", () => ({
  SectionLibraryDialog: (props: SectionLibraryDialogSnapshot) => {
    dialogPropsRef.current = props;
    if (!props.open) {
      return null;
    }

    return (
      <div data-testid="section-library-dialog">
        {props.insertFeedback?.message ? (
          <p>{props.insertFeedback.message}</p>
        ) : null}
      </div>
    );
  },
}));

vi.mock("@/lib/studioProjects", () => ({
  getStudioProject: vi.fn(),
}));

vi.mock("@/api/palette", () => ({
  swapPalette: vi.fn(),
}));

vi.mock("@/api/overlay", () => ({
  logOverlayEdit: vi.fn(),
}));

vi.mock("@/api/sections", () => ({
  streamInsertSection: vi.fn(),
}));

import ProjectPreviewPage from "@/app/projects/[slug]/page";
import { getStudioProject, type StudioProject } from "@/lib/studioProjects";
import { swapPalette, type HorizonPaletteSwapResponse } from "@/api/palette";
import {
  streamInsertSection,
  type HorizonSectionInsertResponse,
  type SectionInsertStage,
} from "@/api/sections";

describe("ProjectPreviewPage", () => {
  const mockGetStudioProject = getStudioProject as MockedFunction<
    typeof getStudioProject
  >;
  const mockSwapPalette = swapPalette as MockedFunction<typeof swapPalette>;
  const mockStreamInsertSection = streamInsertSection as MockedFunction<
    typeof streamInsertSection
  >;

  const project: StudioProject = {
    slug: "horizon-example",
    name: "Horizon Example",
    description: "Baseline site",
    devUrl: "http://localhost:3000",
    previewBaseUrl: "http://localhost:3000/preview",
    instructions: ["Step one", "Step two"],
  };

  const paletteResponse: HorizonPaletteSwapResponse = {
    applied_at: new Date("2024-02-01T10:00:00Z").toISOString(),
    palette: {
      bg_base: "#111111",
      bg_surface: "#222222",
      bg_contrast: "#000000",
      text_primary: "#111111",
      text_secondary: "#444444",
      text_inverse: "#ffffff",
      brand_primary: "#0066ff",
      brand_secondary: "#0055dd",
      accent: "#ff3366",
      border: "#e2e8f0",
      ring: "#2563eb",
      critical: "#dc2626",
      critical_contrast: "#ffffff",
    },
  };

  let latestStreamHandlers:
    | {
        onStage?: (stage: SectionInsertStage) => void;
        onCompleted?: (result: HorizonSectionInsertResponse) => void;
        onFailed?: (message: string) => void;
      }
    | null = null;

  beforeAll(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation(() => ({
        matches: true,
        media: "(min-width: 1024px)",
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  beforeEach(() => {
    mockGetStudioProject.mockReturnValue(project);
    mockSwapPalette.mockResolvedValue(paletteResponse);
    latestStreamHandlers = null;
    mockStreamInsertSection.mockImplementation((_input, handlers) => {
      latestStreamHandlers = handlers;
      return vi.fn();
    });
    dialogPropsRef.current = undefined;
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const createResolvedParams = (slug: string) => {
    const value = { slug };
    const thenable = Promise.resolve(value) as Promise<{ slug: string }> & {
      status?: "fulfilled";
      value?: { slug: string };
    };
    thenable.status = "fulfilled";
    thenable.value = value;
    return thenable;
  };

  const renderPage = async () => {
    render(
      <Suspense fallback={null}>
        <ProjectPreviewPage params={createResolvedParams(project.slug)} />
      </Suspense>,
    );

    await screen.findByRole("button", { name: /swap colors/i });
  };

  it("surfaces palette swap confirmations", async () => {
    const user = userEvent.setup();
    await renderPage();

    const button = await screen.findByRole("button", { name: /swap colors/i });
    await user.click(button);

    await waitFor(() => expect(mockSwapPalette).toHaveBeenCalledTimes(1));
    expect(mockSwapPalette).toHaveBeenCalledWith(
      project.slug,
      { notes: "Triggered from Studio header button" },
    );

    expect(await screen.findByText(/Palette applied at/i)).toBeInTheDocument();
  });

  it("reports palette swap failures", async () => {
    mockSwapPalette.mockRejectedValueOnce(new Error("Swap failed"));
    const user = userEvent.setup();
    await renderPage();

    const button = await screen.findByRole("button", { name: /swap colors/i });
    await user.click(button);

    expect(await screen.findByText("Swap failed")).toBeInTheDocument();
    await waitFor(() => expect(button).not.toBeDisabled());
  });

  it("syncs overlay state through the bridge", async () => {
    const postMessage = vi.fn();
    const user = userEvent.setup();
    await renderPage();

    const iframe = screen.getByTitle(`${project.name} preview`);
    Object.defineProperty(iframe, "contentWindow", {
      value: { postMessage },
      configurable: true,
    });

    const dispatchOverlayEvent = async (data: unknown) => {
      await act(async () => {
        window.dispatchEvent(new MessageEvent("message", { data }));
      });
    };

    await dispatchOverlayEvent({ source: "prempage-site", type: "bridge-ready" });

    await waitFor(() =>
      expect(postMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          source: "prempage-studio",
          type: "overlay-init",
        }),
        "*",
      ),
    );

    await dispatchOverlayEvent({ source: "prempage-site", type: "overlay-mounted" });

    await waitFor(() =>
      expect(postMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          source: "prempage-studio",
          type: "overlay-set-mode",
          editing: false,
        }),
        "*",
      ),
    );

    await user.click(
      screen.getAllByRole("button", { name: /^edit$/i })[0],
    );
    await user.click(
      await screen.findByRole("button", { name: /enable inline editing/i }),
    );

    await waitFor(() =>
      expect(postMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          source: "prempage-studio",
          type: "overlay-set-mode",
          editing: true,
        }),
        "*",
      ),
    );
  });

  it("reports errors when section insertion fails during drop", async () => {
    const user = userEvent.setup();
    await renderPage();

    await user.click(
      screen.getAllByRole("button", { name: /^edit$/i })[0],
    );
    await user.click(
      await screen.findByRole("button", { name: /edit sections/i }),
    );

    await waitFor(() => expect(dialogPropsRef.current?.open).toBe(true));
    await waitFor(() =>
      expect(dialogPropsRef.current?.selectedSectionKey).toBeTruthy(),
    );

    const selectedKey = dialogPropsRef.current?.selectedSectionKey ?? "hero";

    await act(async () => {
      dialogPropsRef.current?.onRequestDropZone({ sectionKey: selectedKey });
    });

    await act(async () => {
      window.dispatchEvent(
        new MessageEvent("message", {
          data: {
            source: "prempage-overlay",
            type: "overlay-section-drop-selected",
            payload: {
              sectionId: "existing-section",
              position: "before",
            },
          },
        }),
      );
    });

    await waitFor(() => expect(mockStreamInsertSection).toHaveBeenCalled());
    expect(mockStreamInsertSection).toHaveBeenCalledWith(
      {
        projectSlug: project.slug,
        sectionKey: selectedKey,
        customSectionPrompt: undefined,
        position: "before",
        targetSectionId: "existing-section",
      },
      expect.objectContaining({
        onStage: expect.any(Function),
        onCompleted: expect.any(Function),
        onFailed: expect.any(Function),
      }),
    );

    const error = new Error("Insert failed");
    await act(async () => {
      latestStreamHandlers?.onFailed?.(error.message);
    });

    expect(await screen.findByText(error.message)).toBeInTheDocument();
    expect(dialogPropsRef.current?.isSelectingDropZone).toBe(false);
    expect(dialogPropsRef.current?.insertFeedback?.status).toBe("error");
  });
});
