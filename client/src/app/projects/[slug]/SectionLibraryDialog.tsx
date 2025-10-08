"use client";

import { useEffect, useMemo, useState, type ReactElement } from "react";

import { HORIZON_SECTIONS } from "@/generated/sections/horizon";

type SectionLibraryDialogProps = {
  open: boolean;
  onClose: () => void;
  projectDevUrl: string;
  previewBaseUrl: string;
};

const SUBTITLE_COPY = "Pick a section to preview it in context, then choose where it should land.";

export function SectionLibraryDialog({
  open,
  onClose,
  projectDevUrl,
  previewBaseUrl,
}: SectionLibraryDialogProps): ReactElement | null {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (open) {
      setSelectedKey((current) => current ?? HORIZON_SECTIONS[0]?.key ?? null);
      setStatusMessage(null);
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
    if (!selectedKey) return null;
    return HORIZON_SECTIONS.find((section) => section.key === selectedKey) ?? null;
  }, [selectedKey]);

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
                  {HORIZON_SECTIONS.map((section) => {
                    const isActive = section.key === selectedSection?.key;
                    return (
                      <li key={section.key}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedKey(section.key);
                            setStatusMessage(null);
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
                <iframe
                  key={selectedSection?.key ?? "preview"}
                  src={previewSrc}
                  title={selectedSection?.label ?? "Section preview"}
                  className="h-full min-h-[420px] w-full border-0"
                />
              </div>
              <div className="flex flex-col gap-3 rounded-xl border border-dashed border-stone-300 p-4">
                <p className="text-sm font-semibold text-slate-800">Where should we place it?</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setStatusMessage("Drop zones coming soon – we’ll highlight targets in the page preview.");
                    }}
                    className="inline-flex items-center rounded-full border border-slate-900 px-3 py-1 text-xs font-semibold text-slate-900 transition hover:bg-slate-900 hover:text-white"
                  >
                    Select drop zone
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStatusMessage("Drag-and-drop will be enabled in the next iteration.");
                    }}
                    className="inline-flex items-center rounded-full border border-stone-200 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-stone-300 hover:text-slate-900"
                  >
                    Drag into page (soon)
                  </button>
                </div>
                {statusMessage ? (
                  <p className="text-xs italic text-slate-500">{statusMessage}</p>
                ) : (
                  <p className="text-xs text-slate-500">
                    We’ll integrate with the overlay next—pick a drop zone and we’ll add the section there.
                  </p>
                )}
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
