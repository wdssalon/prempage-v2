"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

type CopilotPanelProps = {
  instructions: string[];
  isEditMode: boolean;
  isCopilotVisible: boolean;
  leftPaneStyle: CSSProperties | undefined;
  onToggleCopilotVisibility: () => void;
  onToggleInlineEditing: () => void;
  onOpenSectionLibrary: () => void;
};

export function CopilotPanel({
  instructions,
  isEditMode,
  isCopilotVisible,
  leftPaneStyle,
  onToggleCopilotVisibility,
  onToggleInlineEditing,
  onOpenSectionLibrary,
}: CopilotPanelProps) {
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
          onClick={onToggleCopilotVisibility}
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
            Ask the copilot to adjust copy, capture screenshots, or explain how to edit a section.
            We’ll record every patch here once persistence lands.
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
      </form>
    </section>
  );
}
