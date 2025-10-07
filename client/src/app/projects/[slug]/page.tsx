"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { use, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { getStudioProject } from "@/lib/studioProjects";
import {
  swapPalette,
  type HorizonPaletteSwapResponse,
} from "@/api/palette";
import { logOverlayEdit } from "@/api/overlay";
import { SectionLibraryDialog } from "./SectionLibraryDialog";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export default function ProjectPreviewPage({ params }: ProjectPageProps) {
  const { slug } = use(params);
  const project = getStudioProject(slug);

  if (!project) {
    notFound();
  }

  console.debug("[overlay] project page render");

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
  const editMenuRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const overlayMountedRef = useRef(false);
  const overlayInitIntervalRef = useRef<number | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isEditMenuOpen, setIsEditMenuOpen] = useState(false);
  const [isSectionLibraryOpen, setIsSectionLibraryOpen] = useState(false);

  const lastSwapAppliedAt = lastSwap?.applied_at ?? null;
  const paletteSwapTimestamp = lastSwapAppliedAt
    ? new Date(lastSwapAppliedAt).toLocaleTimeString()
    : null;

  const instructions = useMemo(() => project.instructions, [project.instructions]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const stored = window.localStorage.getItem("studio:copilotVisible");
    if (stored !== null) {
      const nextVisible = stored === "true";
      setIsCopilotVisible((current) => (current === nextVisible ? current : nextVisible));
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
    if (!isEditMenuOpen) {
      return;
    }

    const handleClick = (event: MouseEvent) => {
      if (!editMenuRef.current?.contains(event.target as Node)) {
        setIsEditMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [isEditMenuOpen]);

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

  const handleResize = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
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
  }, [isCopilotVisible, isDesktop]);

  const postToIframe = useCallback((message: unknown) => {
    const frame = iframeRef.current;
    if (!frame) {
      return;
    }

    frame.contentWindow?.postMessage(message, "*");
  }, []);

  const sendOverlayInit = useCallback(() => {
    postToIframe({ source: "prempage-studio", type: "overlay-init" });
  }, [postToIframe]);

  const syncOverlayMode = useCallback(() => {
    postToIframe({
      source: "prempage-studio",
      type: "overlay-set-mode",
      editing: isEditMode,
    });
  }, [isEditMode, postToIframe]);

  const clearOverlayInitInterval = useCallback(() => {
    if (overlayInitIntervalRef.current !== null) {
      clearInterval(overlayInitIntervalRef.current);
      overlayInitIntervalRef.current = null;
    }
  }, []);

  const requestOverlayInit = useCallback(() => {
    sendOverlayInit();
    console.debug("[overlay] requested overlay init");

    if (overlayMountedRef.current) {
      clearOverlayInitInterval();
      return;
    }

    if (overlayInitIntervalRef.current === null) {
      console.debug("[overlay] starting overlay init polling interval");
      overlayInitIntervalRef.current = window.setInterval(() => {
        if (overlayMountedRef.current) {
          clearOverlayInitInterval();
          return;
        }

        sendOverlayInit();
        console.debug("[overlay] re-posted overlay init");
      }, 1000);
    }
  }, [clearOverlayInitInterval, sendOverlayInit]);

  const handleIframeLoad = useCallback(() => {
    overlayMountedRef.current = false;
    requestOverlayInit();
  }, [requestOverlayInit]);

  const handleToggleInlineEditing = useCallback(() => {
    setIsEditMode((previous) => {
      const next = !previous;
      if (next && !overlayMountedRef.current) {
        requestOverlayInit();
      }
      return next;
    });
    setIsEditMenuOpen(false);
  }, [requestOverlayInit]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      console.debug("[overlay] message event", event.data, event.origin);
      const { data } = event;
      if (!data || typeof data !== "object") {
        return;
      }

      if (data.source === "prempage-site") {
        if (data.type === "bridge-ready") {
          console.debug("[overlay] bridge-ready received from site");
          overlayMountedRef.current = false;
          requestOverlayInit();
        } else if (data.type === "overlay-mounted") {
          console.debug("[overlay] overlay-mounted received from site");
          overlayMountedRef.current = true;
          clearOverlayInitInterval();
          syncOverlayMode();
        } else if (data.type === "overlay-destroy") {
          console.debug("[overlay] overlay-destroy received from site");
          overlayMountedRef.current = false;
          requestOverlayInit();
        }
        return;
      }

      if (data.source === "prempage-overlay" && data.type === "overlay-edit") {
        console.info("Overlay edit", data.payload, data.meta);
        void logOverlayEdit({
          projectSlug: slug,
          payload: data.payload,
          meta: data.meta,
        })
          .then((result) => {
            console.info("Overlay edit applied", result);
          })
          .catch((error) => {
            console.error("Failed to log overlay edit", error);
          });
      }
    };

    window.addEventListener("message", handleMessage);
    console.debug("[overlay] message listener mounted");
    return () => {
      window.removeEventListener("message", handleMessage);
      clearOverlayInitInterval();
    };
  }, [
    clearOverlayInitInterval,
    requestOverlayInit,
    slug,
    syncOverlayMode,
  ]);

  useEffect(() => {
    overlayMountedRef.current = false;
    requestOverlayInit();
  }, [requestOverlayInit]);

  useEffect(() => {
    syncOverlayMode();
  }, [syncOverlayMode]);

  const leftPaneStyle: CSSProperties | undefined = useMemo(() => {
    if (!isDesktop || !isCopilotVisible) {
      return undefined;
    }

    const width = `${Math.round(leftRatio * 1000) / 10}%`;
    return { flex: `0 0 ${width}`, minWidth: "280px" };
  }, [isCopilotVisible, isDesktop, leftRatio]);

  return (
    <div className="flex min-h-screen flex-col bg-stone-100 text-slate-900">
        <header className="border-b border-stone-200 bg-white">
          <div className="flex w-full items-center justify-between gap-3 px-4 py-3">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 bg-white text-sm font-medium text-slate-600 shadow-sm transition hover:border-stone-300 hover:text-slate-900"
                aria-label="Back to projects"
              >
                ←
              </Link>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold sm:text-xl">{project.name}</h1>
                <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                  Live preview
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="hidden items-center gap-1 rounded-full border border-stone-200 bg-white px-3 py-1 sm:inline-flex">
                <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
                Connected
              </span>
              <span className="hidden text-xs uppercase tracking-[0.2em] text-slate-400 sm:inline">
              Preview url
            </span>
            <code className="rounded-md border border-stone-200 bg-stone-50 px-2 py-1 text-xs text-slate-600">
              {project.devUrl}
            </code>
            {isCopilotVisible ? (
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full border border-stone-200 px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-stone-300 hover:text-slate-900"
              >
                History
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsCopilotVisible(true);
                }}
                aria-pressed={isCopilotVisible}
                className="inline-flex items-center justify-center rounded-full border border-stone-200 px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-stone-300 hover:text-slate-900"
              >
                Show Copilot
              </button>
            )}
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full border border-stone-200 px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-stone-300 hover:text-slate-900"
            >
              Publish
            </button>
            <button
              type="button"
              onClick={async () => {
                setIsSwapping(true);
                setSwapError(null);
                try {
                  const response = await swapPalette(slug, {
                    notes: "Triggered from Studio header button",
                  });
                  setLastSwap(response);
                } catch (error) {
                  setLastSwap(null);
                  setSwapError(
                    error instanceof Error ? error.message : String(error),
                  );
                } finally {
                  setIsSwapping(false);
                }
              }}
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={isSwapping}
            >
              {isSwapping ? "Swapping…" : "Swap colors"}
            </button>
          </div>
        </div>
        {swapError ? (
          <div className="px-4 pb-3 text-xs text-rose-600">{swapError}</div>
        ) : lastSwap ? (
          <div className="px-4 pb-3 text-xs text-emerald-600">
            {paletteSwapTimestamp
              ? `Palette applied at ${paletteSwapTimestamp}.`
              : "Palette swap applied."}
          </div>
        ) : null}
      </header>

      <div className="flex w-full flex-1 flex-col gap-2 px-4 py-3" ref={layoutRef}>
        <div
          className={`flex h-[90vh] flex-col gap-1 ${
            isCopilotVisible ? "lg:flex-row" : ""
          }`}
        >
          {isCopilotVisible ? (
            <section
              className="flex min-h-[320px] flex-col rounded-2xl border border-stone-200 bg-white shadow-sm lg:min-h-0"
              style={leftPaneStyle}
            >
              <div className="flex items-center justify-between border-b border-stone-200 px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                    AI
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Studio Copilot</p>
                    <p className="text-xs text-slate-500">Ask for edits, track changes</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsCopilotVisible((previous) => !previous);
                  }}
                  aria-pressed={isCopilotVisible}
                  className="inline-flex items-center rounded-full border border-stone-200 px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-stone-300 hover:text-slate-900"
                >
                  {isCopilotVisible ? "Hide Copilot" : "Show Copilot"}
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-3">
                <div className="space-y-4">
                  <article className="rounded-2xl bg-stone-50 p-3 text-sm text-slate-700">
                    <p className="font-medium text-slate-900">
                      Ready when you are—here’s how to start editing this site:
                    </p>
                    <ol className="mt-3 space-y-2">
                      {instructions.map((step, index) => (
                        <li key={step} className="flex gap-3">
                          <span className="mt-0.5 inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-white text-xs font-semibold text-slate-600">
                            {index + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </article>
                  <article className="rounded-2xl border border-dashed border-stone-200 p-3 text-sm text-slate-500">
                    Ask the copilot to adjust copy, capture screenshots, or explain how to edit a section. We’ll record every patch here once persistence lands.
                  </article>
                </div>
              </div>

              <form className="border-t border-stone-200 px-4 py-3">
                <label htmlFor="copilot-input" className="sr-only">
                  Ask Studio Copilot
                </label>
                <div className="relative flex items-end gap-3">
                  <textarea
                    id="copilot-input"
                    placeholder="Ask Studio Copilot to tweak copy or track a change…"
                    className="h-16 w-full resize-none rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-slate-700 shadow-inner focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  />
                  <button
                    type="button"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white transition hover:bg-slate-800"
                    aria-label="Send message"
                  >
                    →
                  </button>
                </div>
                <div className="mt-3 flex flex-col gap-2 text-[11px] text-slate-400 sm:flex-row sm:items-center sm:justify-between">
                  <span>
                    {isEditMode
                      ? "Links disabled while editing"
                      : "All links active until you enter edit"}
                  </span>
                  <div className="relative" ref={editMenuRef}>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditMenuOpen((previous) => !previous);
                      }}
                      aria-haspopup="menu"
                      aria-expanded={isEditMenuOpen}
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700 ${
                        isEditMode
                          ? "bg-slate-900 text-white hover:bg-slate-800"
                          : "border border-stone-200 bg-white text-slate-600 hover:border-stone-300 hover:text-slate-900"
                      } ${isEditMenuOpen ? "ring-2 ring-slate-200" : ""}`}
                    >
                      <span>{isEditMode ? "Editing" : "Edit"}</span>
                      <span aria-hidden className="text-[10px]">
                        {isEditMenuOpen ? "▲" : "▼"}
                      </span>
                    </button>
                    {isEditMenuOpen ? (
                      <div
                        role="menu"
                        className="absolute right-0 z-20 mt-2 w-56 rounded-xl border border-stone-200 bg-white p-1 shadow-xl"
                      >
                        <button
                          type="button"
                          onClick={handleToggleInlineEditing}
                          className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-600 transition hover:bg-stone-50 hover:text-slate-900"
                        >
                          <span>{isEditMode ? "Stop inline editing" : "Enable inline editing"}</span>
                          <span className="text-[10px] uppercase tracking-wide text-slate-400">Text</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsSectionLibraryOpen(true);
                            setIsEditMenuOpen(false);
                          }}
                          className="mt-1 flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-600 transition hover:bg-stone-50 hover:text-slate-900"
                        >
                          <span>Edit sections…</span>
                          <span className="text-[10px] uppercase tracking-wide text-slate-400">Sections</span>
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </form>
            </section>
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
        onClose={() => setIsSectionLibraryOpen(false)}
        projectDevUrl={project.devUrl}
        previewBaseUrl={project.previewBaseUrl ?? project.devUrl}
      />
    </div>
  );
}
