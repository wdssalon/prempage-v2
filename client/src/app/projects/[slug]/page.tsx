"use client";

import { notFound } from "next/navigation";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { use, useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  swapPalette,
  type HorizonPaletteSwapResponse,
} from "@/api/palette";
import { HORIZON_SECTIONS } from "@/generated/sections/horizon";
import { getStudioProject } from "@/lib/studioProjects";
import { CopilotPanel } from "./CopilotPanel";
import { PreviewHeader } from "./PreviewHeader";
import { SectionLibraryDialog } from "./SectionLibraryDialog";
import { overlayDebug } from "./overlayLogging";
import { useOverlayBridge } from "./useOverlayBridge";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export default function ProjectPreviewPage({ params }: ProjectPageProps) {
  const { slug } = use(params);
  const project = getStudioProject(slug);

  if (!project) {
    notFound();
  }

  overlayDebug("[overlay] project page render");

  const [leftRatio, setLeftRatio] = useState(0.4);
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === "undefined") {
      return true;
    }

    return window.matchMedia("(min-width: 1024px)").matches;
  });
  const [isSwapping, setIsSwapping] = useState(false);
  const [swapError, setSwapError] = useState<string | null>(null);
  const [lastSwap, setLastSwap] =
    useState<HorizonPaletteSwapResponse | null>(null);
  const [isCopilotVisible, setIsCopilotVisible] = useState(true);
  const hasHydratedCopilotPreference = useRef(false);
  const layoutRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSectionLibraryOpen, setIsSectionLibraryOpen] = useState(false);
  const [selectedSectionKey, setSelectedSectionKey] = useState<string | null>(
    HORIZON_SECTIONS[0]?.key ?? null,
  );

  const overlay = useOverlayBridge({
    slug,
    iframeRef,
    isEditMode,
    isSectionLibraryOpen,
    setSectionLibraryOpen: setIsSectionLibraryOpen,
    onSectionSelected: setSelectedSectionKey,
  });
  const {
    beginDropZoneSelection,
    handleIframeLoad,
    insertFeedback,
    isInsertingSection,
    isSelectingDropZone,
    requestOverlayInit,
    generationStage,
  } = overlay;

  const lastSwapAppliedAt = lastSwap?.applied_at ?? null;
  const paletteSwapTimestamp = lastSwapAppliedAt
    ? new Date(lastSwapAppliedAt).toLocaleTimeString()
    : null;

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const stored = window.localStorage.getItem("studio:copilotVisible");
    if (stored !== null) {
      const nextVisible = stored === "true";
      setIsCopilotVisible((current) =>
        current === nextVisible ? current : nextVisible,
      );
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (!hasHydratedCopilotPreference.current) {
      hasHydratedCopilotPreference.current = true;
      return;
    }

    window.localStorage.setItem(
      "studio:copilotVisible",
      String(isCopilotVisible),
    );
  }, [isCopilotVisible]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const update = (event: MediaQueryListEvent | MediaQueryList) => {
      setIsDesktop(event.matches);
    };

    update(mediaQuery);
    mediaQuery.addEventListener("change", update);

    return () => {
      mediaQuery.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (isSectionLibraryOpen && !selectedSectionKey && HORIZON_SECTIONS[0]) {
      setSelectedSectionKey(HORIZON_SECTIONS[0].key);
    }
  }, [isSectionLibraryOpen, selectedSectionKey]);

  const handleResize = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (!isDesktop || !isCopilotVisible) {
        return;
      }

      const container = layoutRef.current;

      if (!container) {
        return;
      }

      const handleElement = event.currentTarget;
      handleElement.setPointerCapture?.(event.pointerId);

      const updateRatio = (moveEvent: PointerEvent) => {
        const rect = container.getBoundingClientRect();
        const relativeX = moveEvent.clientX - rect.left;
        const nextRatio = relativeX / rect.width;
        const clamped = Math.min(0.75, Math.max(0.25, nextRatio));
        setLeftRatio(clamped);
      };

      const stopResize = () => {
        handleElement.releasePointerCapture?.(event.pointerId);
        document.body.style.removeProperty("cursor");
        window.removeEventListener("pointermove", updateRatio);
        window.removeEventListener("pointerup", stopResize);
      };

      document.body.style.cursor = "col-resize";
      window.addEventListener("pointermove", updateRatio);
      window.addEventListener("pointerup", stopResize, { once: true });
    },
    [isCopilotVisible, isDesktop],
  );

  const handleToggleInlineEditing = useCallback(() => {
    setIsEditMode((previous) => {
      const next = !previous;
      if (next) {
        requestOverlayInit();
      }
      return next;
    });
  }, [requestOverlayInit]);

  const toggleCopilotVisibility = useCallback(() => {
    setIsCopilotVisible((previous) => !previous);
  }, [setIsCopilotVisible]);

  const showCopilot = useCallback(() => {
    setIsCopilotVisible(true);
  }, [setIsCopilotVisible]);

  const openSectionLibrary = useCallback(() => {
    setIsSectionLibraryOpen(true);
  }, [setIsSectionLibraryOpen]);

  const closeSectionLibrary = useCallback(() => {
    setIsSectionLibraryOpen(false);
  }, [setIsSectionLibraryOpen]);

  const handleSwapPalette = useCallback(async () => {
    setIsSwapping(true);
    setSwapError(null);
    try {
      const response = await swapPalette(slug, {
        notes: "Triggered from Studio header button",
      });
      setLastSwap(response);
    } catch (error) {
      setLastSwap(null);
      setSwapError(error instanceof Error ? error.message : String(error));
    } finally {
      setIsSwapping(false);
    }
  }, [slug]);

  const leftPaneStyle: CSSProperties | undefined = useMemo(() => {
    if (!isDesktop || !isCopilotVisible) {
      return undefined;
    }

    const width = `${Math.round(leftRatio * 1000) / 10}%`;
    return { flex: `0 0 ${width}`, minWidth: "280px" };
  }, [isCopilotVisible, isDesktop, leftRatio]);

  return (
    <div className="flex min-h-screen flex-col bg-stone-100 text-slate-900">
      <PreviewHeader
        project={project}
        isCopilotVisible={isCopilotVisible}
        onShowCopilot={showCopilot}
        onSwapPalette={handleSwapPalette}
        isSwappingPalette={isSwapping}
        swapError={swapError}
        lastSwap={lastSwap}
        paletteSwapTimestamp={paletteSwapTimestamp}
        isEditMode={isEditMode}
        onToggleInlineEditing={handleToggleInlineEditing}
        onOpenSectionLibrary={openSectionLibrary}
      />

      <div className="flex w-full flex-1 flex-col gap-2 px-4 py-3" ref={layoutRef}>
        <div
          className={`flex h-[90vh] flex-col gap-1 ${
            isCopilotVisible ? "lg:flex-row" : ""
          }`}
        >
          {isCopilotVisible ? (
            <CopilotPanel
              isEditMode={isEditMode}
              isCopilotVisible={isCopilotVisible}
              leftPaneStyle={leftPaneStyle}
              onToggleCopilotVisibility={toggleCopilotVisibility}
              onToggleInlineEditing={handleToggleInlineEditing}
              onOpenSectionLibrary={openSectionLibrary}
              generationStage={generationStage}
            />
          ) : null}

          {isDesktop && isCopilotVisible ? (
            <div
              role="separator"
              aria-orientation="vertical"
              aria-label="Resize preview"
              onPointerDown={handleResize}
              className="relative hidden w-2 cursor-col-resize items-center justify-center lg:flex"
            >
              <span className="h-10 w-1 rounded-full bg-stone-300" />
            </div>
          ) : null}

          <section className="flex min-h-[320px] flex-1 flex-col rounded-2xl border border-stone-200 bg-white p-2 shadow-sm lg:min-h-0">
            <div className="flex-1 overflow-hidden rounded-xl border border-stone-200 shadow-inner">
              <iframe
                ref={iframeRef}
                onLoad={handleIframeLoad}
                title={`${project.name} preview`}
                src={project.devUrl}
                className="h-full w-full min-h-[520px] border-0 bg-white"
                allow="clipboard-read; clipboard-write"
                sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock"
              />
            </div>
          </section>
        </div>
      </div>
      <SectionLibraryDialog
        open={isSectionLibraryOpen}
        onClose={closeSectionLibrary}
        projectDevUrl={project.devUrl}
        previewBaseUrl={project.previewBaseUrl ?? project.devUrl}
        selectedSectionKey={selectedSectionKey}
        onSelectSection={setSelectedSectionKey}
        onRequestDropZone={beginDropZoneSelection}
        isSelectingDropZone={isSelectingDropZone}
        isInsertingSection={isInsertingSection}
        insertFeedback={insertFeedback}
        generationStage={generationStage}
      />
    </div>
  );
}
