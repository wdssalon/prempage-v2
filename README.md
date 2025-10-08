# Prempage V2

Prempage V2 is the monorepo for the Prempage Studio, overlay editor, and supporting FastAPI services used to build and publish marketing sites.

## Repo layout
- `client/` – Next.js 15 Studio web app (React 19, Tailwind 4)
- `packages/editor-overlay/` – browser overlay bundle shared by Studio and preview sites
- `backend/` – FastAPI core API (uv-managed with OpenAPI export script)
- `services/form-relay/` – FastAPI relay for static site form submissions
- `services/static-site-extractor/` – metadata extractor used during onboarding
- `public-sites/` – editable site bundles, templates, and the Horizon example
- `docker-compose.yml` – local stack wiring the Studio, backend, and services

## Prerequisites
- Node.js 24+ with Corepack (pnpm ≥ 8)
- Python 3.13+ with [uv](https://github.com/astral-sh/uv)
- Docker + Docker Compose for the multi-service dev stack (optional but recommended)

## Quick start with Docker
```bash
docker compose up --build -d  # first run or dependency updates
docker compose up -d          # subsequent runs
docker compose down           # stop services
```

Services listen on: Studio `http://localhost:3001`, backend `http://localhost:8000`, form relay `http://localhost:8080`, static-site-extractor `http://localhost:8081`.

## Native development
- Studio: `pnpm --dir client install` then `pnpm --dir client dev`
- Backend: `cd backend && uv sync && uv run uvicorn main:app --reload --port 8000`
- Form relay: `cd services/form-relay && cp .env.example .env` (once) then `uv sync && uv run uvicorn app.main:app --reload --port 8080 --env-file .env`
- Static site extractor: `cd services/static-site-extractor && uv sync && uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8081`
- Horizon example preview site: `pnpm install --filter horizon-example && pnpm --filter horizon-example dev` (port 3000)

## Common workflows
- Clean Horizon example reset + UI smoke test:
  ```bash
  python public-sites/templates/horizon/cookiecutter-config/scripts/run_horizon_example.py
  docker compose up --build -d  # add --force-recreate --remove-orphans if the stack is already running
  pnpm --dir public-sites/sites/horizon-example dev
  ```
  The regeneration script already rebuilds the overlay bundle and refreshes the section catalog—no `uv sync` step is required beforehand.
- Rebuild the overlay bundle when `node_modules` changes:
  ```bash
  pnpm install --filter @prempage/editor-overlay --force
  pnpm --filter @prempage/editor-overlay build
  ```
- Refresh API types after backend schema updates:
  ```bash
  cd backend && uv run python export_openapi.py
  pnpm --dir client openapi:types
  ```

## Testing & checks
- Studio: `pnpm --dir client lint`, `pnpm --dir client typecheck`, `pnpm --dir client test`
- Backend: `cd backend && uv sync && uv run pytest`
- Compose: `docker compose up --build -d` for end-to-end smoke testing

## Guidelines
- Prefer Python for new automation scripts; document any exceptions.
- Static site bundles live under `public-sites/sites/<slug>/`. Read `agents/policy/public-sites.md` before automating edits there.

## AI-Assisted Editing Roadmap
- Goal: ship an internal, behind-auth GPT-5-Codex powered editor that can safely update `public-sites/sites/<slug>` in place while keeping deployments reproducible and auditable.
- Hosting: start with a single Render Private Service (process-level jail) backed by a persistent disk; every session is confined to `/opt/render/project/src/sites/<slug>` via path normalization and explicit allowlists.
- Scope: v1 focuses on internal teammates editing existing site bundles; new site scaffolds remain a local Codex workflow until the hosted pipeline proves stable.
- Tooling surface: expose only `list_dir`, `read_file`, `search`, `apply_patch`, `write_file`, and a `run_script` wrapper for vetted commands (lint, typecheck, build). Budgets cap file size, patch size, call count, and wall time.
- Workflow: React chat UI → FastAPI orchestrator → GPT-5-Codex tool calls → git worktree per session → format/lint/build gates → commit + diff summary surfaced to the UI. Publish jobs run the static export and trigger the Render deploy hook.
- Preview: keep a Next.js/Vite dev server running against the same disk for near-instant hot reload during editing; production builds run in background workers.
- Guardrails: per-site mutexes, audit log of tool calls, secret redaction on reads, automatic halt after repeated failures, and git history for rollback.
- Status: plan only. Update this section as we finalize tool schemas, disk sizing, or decide to move off Render.

### New Feature: In-Page Visual Editing (Lovable-style)

**Goal:** Allow non-technical users to click “Edit,” hover elements, and update text/images directly on the rendered site preview.

**How it works:**
1. **Overlay layer** – React overlay highlights DOM nodes on hover (`getBoundingClientRect`, `elementFromPoint`). Editable targets include headings, paragraphs, list items, links, buttons, or nodes with stable `data-*` attributes.
2. **Inline editing** – Clicking places the element in a `contenteditable` region or overlay editor. Changes serialize to structured patches, e.g.:
   ```json
   {
     "selector": "[data-loc='hero.headline']",
     "type": "text",
     "old": "Therapy for adults",
     "new": "Therapy that feels like you"
   }
   ```
3. **Persistence** – Patches map back to the source of truth (`client-overview.md`, YAML configs, or the site bundle) while the Next.js server stays authoritative during the session. Publishing applies the patches and kicks off a static export so deployed bundles stay auditable.
4. **Selector strategy** – Prefer stable `data-loc`/`data-cms` attributes, falling back to generated CSS paths with fingerprints for drift detection.
5. **UI stack** – Next.js + Tailwind utility classes, Radix UI primitives, Sonner toasts, Vaul drawers, Lucide-react icons, and optional AntD components for complex forms.
6. **Workflow integration** – Visual edits → patch queue → orchestrator validation → file updates → lint/typecheck/build gates → Render deploy hook. Audit logs trace DOM edits to version-controlled diffs.

**Market research notes:**
- **Base44** – React SPA with Tailwind + Ant Design, Radix primitives, and Lucide icons. Keep our overlay lightweight by separating Studio (workflow) from the overlay SDK (DOM editing).
- **Bolt.new** – Remix + React on a Vite toolchain, Tailwind tokens, Radix UI, Toastify, CodeMirror, xterm.js, and extensive instrumentation. Adopt TypeScript-first, evaluate CodeMirror for structured content, and keep instrumentation lean (Sentry + one analytics).
- **Shared patterns** – React + Tailwind + Radix foundation, toast + drawer primitives, selector + patch models, and preview domains (`preview--slug.domain.com`) to isolate draft edits.
- **Prempage direction** – Continue with Next.js App Router, keep the overlay as a standalone bundle (`/packages/editor-overlay`), rely on Tailwind + Radix + Sonner + Vaul + Lucide, and consider CodeMirror later without overcomplicating v1.
