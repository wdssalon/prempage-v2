"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getStudioProject } from "@/lib/studioProjects";

type ProjectPageProps = {
  params: { slug: string };
};

export default function ProjectPreviewPage({ params }: ProjectPageProps) {
  const project = getStudioProject(params.slug);

  if (!project) {
    notFound();
  }

  const [leftRatio, setLeftRatio] = useState(0.4);
  const layoutRef = useRef<HTMLDivElement>(null);

  const instructions = useMemo(() => project.instructions, [project.instructions]);

  const handleResize = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    const container = layoutRef.current;

    if (!container) {
      return;
    }

    const updateRatio = (moveEvent: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const relativeX = moveEvent.clientX - rect.left;
      const nextRatio = relativeX / rect.width;
      const clamped = Math.min(0.75, Math.max(0.25, nextRatio));
      setLeftRatio(clamped);
    };

    const stopResize = () => {
      document.body.style.removeProperty("cursor");
      window.removeEventListener("pointermove", updateRatio);
      window.removeEventListener("pointerup", stopResize);
    };

    document.body.style.cursor = "col-resize";
    window.addEventListener("pointermove", updateRatio);
    window.addEventListener("pointerup", stopResize, { once: true });
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-stone-100 text-slate-900">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 bg-white text-sm font-medium text-slate-600 shadow-sm transition hover:border-stone-300 hover:text-slate-900"
              aria-label="Back to projects"
            >
              ←
            </Link>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-slate-400">
                  Preview sandbox
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <h1 className="text-base font-semibold sm:text-lg">{project.name}</h1>
                  <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                    Live preview
                  </span>
                </div>
              </div>
              <p className="text-sm text-slate-500 sm:max-w-xs sm:text-left">
                {project.description}
              </p>
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
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full border border-stone-200 px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-stone-300 hover:text-slate-900"
            >
              Publish
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 px-6 pb-8 pt-6" ref={layoutRef}>
        <div className="flex flex-1 flex-col gap-4 lg:flex-row">
          <section
            className="flex min-h-[320px] flex-col rounded-2xl border border-stone-200 bg-white shadow-sm"
            style={{ flexBasis: `${leftRatio * 100}%`, maxWidth: `${leftRatio * 100}%` }}
          >
            <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
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
                className="inline-flex items-center rounded-full border border-stone-200 px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-stone-300 hover:text-slate-900"
              >
                History
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              <div className="space-y-4">
                <article className="rounded-2xl bg-stone-50 p-4 text-sm text-slate-700">
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
                <article className="rounded-2xl border border-dashed border-stone-200 p-4 text-sm text-slate-500">
                  Ask the copilot to adjust copy, capture screenshots, or explain how to edit a section. We’ll record every patch here once persistence lands.
                </article>
              </div>
            </div>

            <form className="border-t border-stone-200 px-5 py-4">
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
            </form>
          </section>

          <div
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize preview"
            onPointerDown={handleResize}
            className="relative hidden w-2 cursor-col-resize items-center justify-center lg:flex"
          >
            <span className="h-10 w-1 rounded-full bg-stone-300" />
          </div>

          <section className="flex min-h-[320px] flex-1 flex-col rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-3 text-sm text-slate-600">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                  iframe preview
                </span>
                <span>Served from</span>
                <code className="rounded-md border border-stone-200 bg-stone-50 px-2 py-1 text-xs text-slate-600">
                  {project.devUrl}
                </code>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="rounded-full border border-stone-200 px-3 py-1 uppercase tracking-[0.2em] text-slate-500">
                  Preview
                </span>
                <span className="rounded-full border border-stone-200 px-3 py-1 uppercase tracking-[0.2em] text-slate-400">
                  Overlay off
                </span>
              </div>
            </div>
            <div className="mt-4 flex-1 overflow-hidden rounded-xl border border-stone-200 shadow-inner">
              <iframe
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
    </div>
  );
}
