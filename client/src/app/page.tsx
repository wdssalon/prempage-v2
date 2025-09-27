"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchHealth, type HealthResponse } from "@/api/health";

export default function HomePage() {
  const [count, setCount] = useState(0);
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [healthError, setHealthError] = useState<string | null>(null);

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
    <div className="flex min-h-screen flex-col items-center gap-8 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-12 text-slate-100">
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
          <p className="max-w-2xl text-balance text-base text-slate-300 sm:text-lg">
            This placeholder mirrors the previous Vite app: a counter for client
            interactivity and the backend health check wired through our
            typed OpenAPI client.
          </p>
        </div>
      </header>

      <main className="flex w-full max-w-3xl flex-col gap-6">
        <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg backdrop-blur">
          <h2 className="text-xl font-medium text-slate-100">Counter</h2>
          <p className="mt-2 text-sm text-slate-400">
            This stateful widget verifies that client-side hydration still
            works as expected inside the new Next.js shell.
          </p>
          <button
            type="button"
            onClick={() => setCount((value) => value + 1)}
            className="mt-4 inline-flex items-center justify-center rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-200"
          >
            Count is {count}
          </button>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg backdrop-blur">
          <h2 className="text-xl font-medium text-slate-100">Backend Health</h2>
          <p className="mt-2 text-sm text-slate-400">
            Powered by `openapi-typescript` to keep the Studio UI in lockstep with
            the FastAPI contract.
          </p>
          <div className="mt-4 space-y-2 text-sm">
            {healthError ? (
              <p className="text-rose-400">Error fetching health: {healthError}</p>
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
              <p className="text-slate-300">Loading health information…</p>
            )}
          </div>
        </section>
      </main>

      <footer className="pb-6 text-xs text-slate-500">
        Edit <code className="rounded bg-slate-800 px-1 py-0.5">src/app/page.tsx</code>
        {" "}and <code className="rounded bg-slate-800 px-1 py-0.5">src/api/health.ts</code>
        {" "}to continue building the Studio.
      </footer>
    </div>
  );
}
