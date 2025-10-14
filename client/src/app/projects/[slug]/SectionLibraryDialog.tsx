"use client";

import { useEffect, useMemo, useState, useId, type ReactElement } from "react";

import { HORIZON_SECTIONS } from "@/generated/sections/horizon";

type SectionLibraryDialogProps = {
  open: boolean;
  onClose: () => void;
  projectDevUrl: string;
  previewBaseUrl: string;
  selectedSectionKey: string | null;
  onSelectSection: (sectionKey: string) => void;
  onRequestDropZone: (request: SectionLibraryDropRequest) => void;
  isSelectingDropZone: boolean;
  isInsertingSection: boolean;
  insertFeedback: InsertFeedback;
};

type SectionLibraryDropRequest = {
  sectionKey: string;
  customPrompt?: string;
};

const SUBTITLE_COPY = "Pick a section to preview it in context, then choose where it should land.";
const CUSTOM_SECTION_KEY = "custom_blank_section";
const CUSTOM_SECTION_LABEL = "Create custom section";
const CUSTOM_SECTION_HELP = "Start from a blank canvas with a minimal <section> wrapper.";

type InsertFeedback = {
  status: "idle" | "success" | "error";
  message?: string;
};

export function SectionLibraryDialog({
  open,
  onClose,
  projectDevUrl,
  previewBaseUrl,
  selectedSectionKey,
  onSelectSection,
  onRequestDropZone,
  isSelectingDropZone,
  isInsertingSection,
  insertFeedback,
}: SectionLibraryDialogProps): ReactElement | null {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [customSectionPrompt, setCustomSectionPrompt] = useState("");
  const [customPromptTouched, setCustomPromptTouched] = useState(false);
  const isCustomSectionSelected = selectedSectionKey === CUSTOM_SECTION_KEY;
  const customPromptId = useId();
  const selectedSectionLabel = isCustomSectionSelected
    ? CUSTOM_SECTION_LABEL
    : selectedSectionKey
        ? HORIZON_SECTIONS.find((section) => section.key === selectedSectionKey)?.label ?? null
        : null;

  useEffect(() => {
    if (open) {
      setIsSidebarCollapsed(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeydown);
    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [open, onClose]);

  const selectedSection = useMemo(() => {
    if (!selectedSectionKey) return null;
    return (
      HORIZON_SECTIONS.find((section) => section.key === selectedSectionKey) ?? null
    );
  }, [selectedSectionKey]);

  useEffect(() => {
    if (!open) {
      setCustomSectionPrompt("");
      setCustomPromptTouched(false);
    }
  }, [open]);

  useEffect(() => {
    if (!isCustomSectionSelected) {
      setCustomSectionPrompt("");
      setCustomPromptTouched(false);
    }
  }, [isCustomSectionSelected]);

  const trimmedPrompt = customSectionPrompt.trim();
  const requiresPrompt = isCustomSectionSelected;
  const isPromptMissing = requiresPrompt && trimmedPrompt.length === 0;
  const canRequestDropZone =
    !!selectedSectionKey && !isPromptMissing && !isSelectingDropZone && !isInsertingSection;

  if (!open) {
    return null;
  }

  const basePreview = previewBaseUrl || projectDevUrl;
  const previewSrc = selectedSection?.sectionId
    ? `${basePreview}?section=${encodeURIComponent(selectedSection.sectionId)}&variant=default`
    : basePreview;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 flex max-h-[90vh] w-full flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
        <header className="flex items-start justify-between gap-4 border-b border-stone-200 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Section library</p>
            <h2 className="text-lg font-semibold text-slate-900">Drop a new section into this page</h2>
            <p className="mt-1 text-sm text-slate-600">{SUBTITLE_COPY}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-full border border-stone-200 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-stone-300 hover:text-slate-900"
          >
            Close
          </button>
        </header>

        <div className="flex flex-1 flex-col gap-4 overflow-hidden px-6 py-5">
          <div className="relative flex flex-1 flex-col gap-4 overflow-hidden lg:flex-row">
            {!isSidebarCollapsed ? (
              <aside className="w-full max-w-xs flex-shrink-0 overflow-y-auto pr-2">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400">
                    Sections
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsSidebarCollapsed(true)}
                    aria-expanded={!isSidebarCollapsed}
                    className="inline-flex items-center rounded-full border border-stone-200 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 transition hover:border-stone-300 hover:text-slate-900"
                  >
                    Collapse
                  </button>
                </div>
                <ul className="space-y-2">
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectSection(CUSTOM_SECTION_KEY);
                      }}
                      className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                        isCustomSectionSelected
                          ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                          : "border-dashed border-stone-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-stone-50"
                      }`}
                    >
                      <p className="text-sm font-semibold">{CUSTOM_SECTION_LABEL}</p>
                      <p className={`text-xs ${isCustomSectionSelected ? "text-slate-200" : "text-slate-500"}`}>
                        {CUSTOM_SECTION_HELP}
                      </p>
                    </button>
                  </li>
                  {HORIZON_SECTIONS.map((section) => {
                    const isActive = section.key === selectedSection?.key;
                    return (
                      <li key={section.key}>
                        <button
                          type="button"
                          onClick={() => {
                            onSelectSection(section.key);
                          }}
                          className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                            isActive
                              ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                              : "border-stone-200 bg-white text-slate-700 hover:border-stone-300 hover:bg-stone-50"
                          }`}
                        >
                          <p className="text-sm font-semibold">{section.label}</p>
                          <p className={`text-xs ${isActive ? "text-slate-200" : "text-slate-500"}`}>
                            {section.category}
                          </p>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </aside>
            ) : null}

                <div className="flex flex-1 flex-col gap-4 overflow-hidden">
              <div className="flex-1 overflow-hidden rounded-xl border border-stone-200">
                {isCustomSectionSelected ? (
                  <div className="flex h-full min-h-[420px] flex-col items-center justify-center gap-3 bg-slate-50 px-6 text-center">
                    <p className="text-sm font-semibold text-slate-800">{CUSTOM_SECTION_LABEL}</p>
                    <p className="text-xs text-slate-600">
                      Describe what you want to see in this section. We&apos;ll ask our builder to draft
                      the HTML and keep it within the Horizon wrapper.
                    </p>
                  </div>
                ) : (
                  <iframe
                    key={selectedSection?.key ?? "preview"}
                    src={previewSrc}
                    title={selectedSection?.label ?? "Section preview"}
                    className="h-full min-h-[420px] w-full border-0"
                  />
                )}
              </div>
              <div className="flex flex-col gap-3 rounded-xl border border-dashed border-stone-300 p-4">
                {isCustomSectionSelected ? (
                  <div className="flex flex-col gap-2">
                    <label htmlFor={customPromptId} className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Custom section brief
                    </label>
                    <textarea
                      id={customPromptId}
                      value={customSectionPrompt}
                      onChange={(event) => {
                        setCustomSectionPrompt(event.target.value);
                      }}
                      onBlur={() => setCustomPromptTouched(true)}
                      placeholder="Example: An eye-catching testimonial strip with a bold headline, three quotes, and a call-to-action button."
                      rows={4}
                      className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/30 ${
                        isPromptMissing && customPromptTouched ? "border-rose-400 focus:ring-rose-400/30" : "border-stone-300"
                      }`}
                    />
                    <p className={`text-xs ${isPromptMissing && customPromptTouched ? "text-rose-500" : "text-slate-500"}`}>
                      {isPromptMissing && customPromptTouched
                        ? "Describe the content so we know what to generate."
                        : "Keep it short—mention layout, tone, or any key elements."}
                    </p>
                  </div>
                ) : null}
                <p className="text-sm font-semibold text-slate-800">Where should we place it?</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (!selectedSectionKey) {
                        return;
                      }
                      if (isPromptMissing) {
                        setCustomPromptTouched(true);
                        return;
                      }
                      onRequestDropZone({
                        sectionKey: selectedSectionKey,
                        customPrompt: isCustomSectionSelected ? trimmedPrompt : undefined,
                      });
                    }}
                    disabled={!canRequestDropZone}
                    className="inline-flex items-center rounded-full border border-slate-900 px-3 py-1 text-xs font-semibold text-slate-900 transition hover:bg-slate-900 hover:text-white disabled:cursor-not-allowed disabled:border-stone-200 disabled:text-stone-400"
                  >
                    {isSelectingDropZone ? "Click in preview…" : "Select drop zone"}
                  </button>
                </div>
                <InsertionStatus
                  feedback={insertFeedback}
                  isSelecting={isSelectingDropZone}
                  isInserting={isInsertingSection}
                  selectedSectionLabel={selectedSectionLabel}
                />
              </div>
            </div>

          {isSidebarCollapsed ? (
              <button
                type="button"
                onClick={() => setIsSidebarCollapsed(false)}
                aria-expanded={false}
                className="absolute left-0 top-2 inline-flex items-center rounded-full border border-stone-200 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 shadow-sm transition hover:border-stone-300 hover:text-slate-900"
              >
                Show section list
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function InsertionStatus({
  isSelecting,
  isInserting,
  feedback,
  selectedSectionLabel,
}: {
  isSelecting: boolean;
  isInserting: boolean;
  feedback: InsertFeedback;
  selectedSectionLabel: string | null;
}) {
  if (feedback.status === "success") {
    return <p className="text-xs text-emerald-600">{feedback.message ?? "Section inserted."}</p>;
  }

  if (feedback.status === "error") {
    return <p className="text-xs text-rose-600">{feedback.message ?? "Unable to insert section."}</p>;
  }

  if (isSelecting) {
    return <p className="text-xs text-slate-500">Click the preview to choose where this section should land.</p>;
  }

  if (isInserting) {
    return <p className="text-xs text-slate-500">Inserting section…</p>;
  }

  return (
    <p className="text-xs text-slate-500">
      {selectedSectionLabel
        ? `Click “Select drop zone” then choose where ${selectedSectionLabel} should land.`
        : "Pick a section and choose where it should land."}
    </p>
  );
}
