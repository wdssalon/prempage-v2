"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import type { HorizonPaletteSwapResponse } from "@/api/palette";
import type { StudioProject } from "@/lib/studioProjects";

type PreviewHeaderProps = {
  project: StudioProject;
  isCopilotVisible: boolean;
  onShowCopilot: () => void;
  onSwapPalette: () => void;
  isSwappingPalette: boolean;
  swapError: string | null;
  lastSwap: HorizonPaletteSwapResponse | null;
  paletteSwapTimestamp: string | null;
  isEditMode: boolean;
  onToggleInlineEditing: () => void;
  onOpenSectionLibrary: () => void;
};

export function PreviewHeader({
  project,
  isCopilotVisible,
  onShowCopilot,
  onSwapPalette,
  isSwappingPalette,
  swapError,
  lastSwap,
  paletteSwapTimestamp,
  isEditMode,
  onToggleInlineEditing,
  onOpenSectionLibrary,
}: PreviewHeaderProps) {
  const [isEditMenuOpen, setIsEditMenuOpen] = useState(false);
  const editMenuRef = useRef<HTMLDivElement>(null);

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

  return (
    <>
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
                onClick={onShowCopilot}
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
              onClick={onSwapPalette}
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={isSwappingPalette}
            >
              {isSwappingPalette ? "Swapping…" : "Swap colors"}
            </button>
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
                    onClick={() => {
                      onToggleInlineEditing();
                      setIsEditMenuOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-600 transition hover:bg-stone-50 hover:text-slate-900"
                  >
                    <span>{isEditMode ? "Stop inline editing" : "Enable inline editing"}</span>
                    <span className="text-[10px] uppercase tracking-wide text-slate-400">
                      Text
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onOpenSectionLibrary();
                      setIsEditMenuOpen(false);
                    }}
                    className="mt-1 flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-600 transition hover:bg-stone-50 hover:text-slate-900"
                  >
                    <span>Edit sections…</span>
                    <span className="text-[10px] uppercase tracking-wide text-slate-400">
                      Sections
                    </span>
                  </button>
                </div>
              ) : null}
            </div>
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
    </>
  );
}
