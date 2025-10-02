"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchHealth, type HealthResponse } from "@/api/health";
import { listStudioProjects } from "@/lib/studioProjects";

export default function HomePage() {
  const [count, setCount] = useState(0);
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [healthError, setHealthError] = useState<string | null>(null);
  const projects = useMemo(() => listStudioProjects(), []);

  useEffect(() => {
    const controller = new AbortController();

    fetchHealth(controller.signal)
      .then((payload) => {
        setHealth(payload);
        setHealthError(null);
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setHealth(null);
        setHealthError(error instanceof Error ? error.message : String(error));
      });

    return () => controller.abort();
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center gap-8 bg-stone-100 px-4 py-12 text-slate-900">
      <header className="flex flex-col items-center gap-6 text-center">
        <div className="flex items-center gap-6">
          <a href="https://vite.dev" target="_blank" rel="noreferrer">
            <Image
              className="transition-transform hover:scale-110"
              src="/vite.svg"
              alt="Vite logo"
              width={96}
              height={96}
              priority
            />
          </a>
          <a href="https://react.dev" target="_blank" rel="noreferrer">
            <Image
              className="transition-transform hover:scale-110"
              src="/react.svg"
              alt="React logo"
              width={96}
              height={96}
              priority
            />
          </a>
          <a href="https://nextjs.org" target="_blank" rel="noreferrer">
            <Image
              className="transition-transform hover:scale-110 dark:invert"
              src="/next.svg"
              alt="Next.js logo"
              width={140}
              height={30}
              priority
            />
          </a>
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold sm:text-4xl">
            Prempage Studio — Next.js bootstrap
          </h1>
          <p className="max-w-2xl text-balance text-base text-slate-500 sm:text-lg">
            This placeholder mirrors the previous Vite app: a counter for client
            interactivity and the backend health check wired through our
            typed OpenAPI client.
          </p>
        </div>
      </header>

      <main className="flex w-full max-w-3xl flex-col gap-6">
        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Counter</h2>
          <p className="mt-2 text-sm text-slate-500">
            This stateful widget verifies that client-side hydration still
            works as expected inside the new Next.js shell.
          </p>
          <button
            type="button"
            onClick={() => setCount((value) => value + 1)}
            className="mt-4 inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700"
          >
            Count is {count}
          </button>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Backend Health</h2>
          <p className="mt-2 text-sm text-slate-500">
            Powered by `openapi-typescript` to keep the Studio UI in lockstep with
            the FastAPI contract.
          </p>
          <div className="mt-4 space-y-2 text-sm text-slate-600">
            {healthError ? (
              <p className="text-rose-600">Error fetching health: {healthError}</p>
            ) : health ? (
              <>
                <p>
                  Status: <span className="font-semibold">{health.status}</span>
                </p>
                <p>
                  Service: {health.service.name} v{health.service.version}
                </p>
                <p>Message: {health.message ?? "No message provided"}</p>
                <p>Environment: <span className="font-semibold">{health.environment}</span></p>
                <p>
                  Uptime: {typeof health.uptime_seconds === "number"
                    ? `${health.uptime_seconds.toFixed(1)}s`
                    : "Unavailable"}
                </p>
                <p>
                  Timestamp: {health.timestamp
                    ? new Intl.DateTimeFormat("en-US", {
                        dateStyle: "short",
                        timeStyle: "medium",
                        timeZone: "UTC",
                      }).format(new Date(health.timestamp))
                    : "No timestamp provided"}
                </p>
              </>
            ) : (
              <p className="text-slate-500">Loading health information…</p>
            )}
          </div>
        </section>
      </main>

      <footer className="pb-2 text-xs text-slate-500">
        Edit <code className="rounded bg-stone-200 px-1 py-0.5">src/app/page.tsx</code>
        {" "}and <code className="rounded bg-stone-200 px-1 py-0.5">src/api/health.ts</code>
        {" "}to continue building the Studio.
      </footer>

      <section className="w-full max-w-3xl rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Project Sandboxes</h2>
        <p className="mt-2 text-sm text-slate-500">
          Each project opens a live Next.js preview in the editor shell so we can
          iterate on overlay features without shipping auth or persistence yet.
        </p>
        <div className="mt-4 space-y-3">
          {projects.map((project) => (
            <div
              key={project.slug}
              className="flex flex-col gap-2 rounded-xl border border-stone-200 bg-stone-50 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-base font-medium text-slate-900">
                  {project.name}
                </p>
                <p className="text-sm text-slate-600">{project.description}</p>
              </div>
              <Link
                href={`/projects/${project.slug}`}
                className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700"
              >
                Open preview
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
