# Prempage V2 - Full Stack Development Project

## Project Overview

Prempage V2 is a modern full-stack application featuring:
- **Frontend**: Next.js Studio + overlay architecture (Next app in `client/`)
- **Backend**: FastAPI with Python 3.13 and uv package management
- **Microservices**: Additional FastAPI services under `services/` (e.g., `form-relay` for static form submissions)
- **Development**: Docker Compose setup with hot reloading across frontend, backend, and services
- **Architecture**: Lightweight, fast iteration focused design

## Frontend Roadmap

Short answer: same repo, separate deployables. Make a single Studio front-end for onboarding and operations, and ship the Lovable-style editor as a separate overlay bundle that the Studio loads into a preview iframe (or that a browser extension injects). This keeps the UX cohesive while isolating responsibilities.

### App A — Studio (Next.js web app)
- Auth, org/projects, onboarding (enter URL -> pick/select photos -> upload), asset library, build/publish, history, roles.
- Hosts the editor shell UI (left sidebar: pages/sections/assets; right: properties; top: Edit toggle).
- Routes like `studio.prempage.com/{org}/{project}`.

### App B — Editor Overlay (standalone JS bundle)
- Pure overlay SDK: hover highlights, selection, inline editors, selector/fingerprint logic, patch queue.
- No routing or stateful pages; exports `initEditor({ container, tools, auth })`.
- Loaded by Studio into the preview iframe via `<script src=".../overlay.js">` with `postMessage` RPC, and can ship as a browser extension later using the same core.

### Preview Target — site under edit
- Prefer a preview domain such as `preview--{slug}.prempagepro.com` (live site stays read-only).
- Exposes a tiny bridge (~1-2 kB) that listens for overlay messages, measures nodes, and reports metadata — no app logic lives here.

**Status:** The Next.js Studio resides in `client/`; the legacy Vite app has been retired. App A is the focus now, with App B (overlay) queued next.

## Running the Application

> **Automation standard**: write new repository scripts in Python unless a different language is absolutely required. Document any exceptions in the PR or commit description so downstream editors understand why the deviation exists.

**Prerequisites:**
- Node.js 24 or newer (Corepack with pnpm ≥ 8)
- Python 3.13 or newer
- Docker and Docker Compose

### Service Port Map
- `client` (Next.js Studio) — http://localhost:3001
- `backend` (FastAPI core API) — http://localhost:8000
- `services/form-relay` (form submission relay) — http://localhost:8080
- Static Site Extractor (`services/static-site-extractor`) — http://localhost:8081
- `public-sites/sites/*` (site bundles) — share http://localhost:3000 when developing inside a site directory; live exports serve from disk

Keep this list up to date whenever a new service ships or a port changes. Every service must claim a unique local port so we can run them together—the only exception is the static site workspaces under `public-sites/sites`, which may reuse port 3000 during development.

### Local Development

**Option 1: Docker Compose (Recommended)**
```bash
# Initial setup or after dependency changes (frontend, backend, form-relay)
docker compose up --build -d

# Regular development
docker compose up -d

# Stop services
docker compose down

# Start specific services (example: backend + form relay + extractor)
docker compose up backend form-relay static-site-extractor
```

**Option 2: Native Development**
```bash
# Studio frontend
cd client
pnpm install
pnpm dev  # http://localhost:3001

# Legacy frontend (optional)
# Backend
cd ../backend
uv sync
uv run uvicorn main:app --reload  # http://localhost:8000

# Form Relay microservice
cd ../services/form-relay
cp .env.example .env  # first time only
uv sync
uv run uvicorn app.main:app --reload --port 8080 --env-file .env  # http://localhost:8080

# Static Site Extractor microservice
cd ../static-site-extractor
uv sync
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8081  # http://localhost:8081
```

- Response payloads include deduplicated image/font lists, a flattened `text_blob`, and an inferred `navigation` hierarchy when menus are detected.

## Core Requirements

### Endpoints

**API Documentation:**
- Interactive docs (Swagger UI): http://localhost:8000/docs
- Alternative docs (ReDoc): http://localhost:8000/redoc
- Health check: http://localhost:8000/health

### Technical Stack

**Frontend:**
- Next.js 15 + React 19 in `client/` (Studio app with App Router and Tailwind)
- TypeScript-first scaffold across both workspaces
- ESLint 9.35.0 for code quality

**Backend:**
- FastAPI (Python web framework)
- Python 3.13
- uv package manager
- Uvicorn ASGI server
- Loguru for logging

**Development:**
- Docker Compose multi-container setup (frontend, backend, form-relay, static site extractor)
- Hot reloading for all containers
- Volume mounting for live code updates

## Static Site Workspace
- The `public-sites/` directory houses the tooling and instructions for the static site deployments.
- Brand-specific exports reside in `public-sites/sites/<site-slug>/`. Keep CSS overrides, fonts, and HTML changes scoped within the relevant site bundle. Per-site `images/` directories are gitignored by default.
- Read `public-sites/AGENTS.md` before automating updates; it captures the guardrails for section rotation, copy edits, navigation rules, and override assets.
- End-to-end build guidance (intake, planning, page assembly, QA) lives in `public-sites/generate-website.md` alongside supporting references such as `client-overview.md`, `template/page-build-edit-overview.md`, and `template/sections.yaml`.
- Template-specific docs live under `public-sites/templates/<template>/`. Use `./public-sites/scripts/build-static-site.sh <site-slug>` to reproduce the static export pipeline locally.

### Data Storage

Currently lightweight setup with:
- No external database dependencies in base configuration
- Ready for integration with PostgreSQL, Redis, or other databases
- FastAPI supports async database operations

### Deployment

**Development:**
- Docker Compose for local development
- Hot reloading enabled
- Ports: Studio frontend :3001, Backend :8000, Form Relay :8080, Static Site Extractor :8081 (all services must keep unique ports; update the Service Port Map when you add or change services).

**Production Ready:**
- Containerized applications
- Vite production builds
- FastAPI production deployment patterns

### Backend ↔ Frontend Contract

End-to-end types are generated from the FastAPI OpenAPI schema. When you update Pydantic models in the backend:
- Run `uv run python export_openapi.py` from `backend/` to refresh `openapi.json`.
- Run `pnpm openapi:types` from the Studio workspace (`client/`) to regenerate `src/api/types.ts` via `openapi-typescript`.
- Consume the resulting types in client helpers (example: `client/src/api/health.ts`) to keep fetch logic aligned with the API.

The sample `/health` route returns a `HealthCheckResponse` payload that exercises the full pipeline—Pydantic model → OpenAPI schema → generated TypeScript type → React component display.

### Data Persistence

- Backend configured for easy database integration
- uv.lock ensures reproducible Python environments
- pnpm-lock.yaml for consistent Node.js dependencies

## Evaluation Criteria

TBD..


## Testing Commands

**Frontend:**
```bash
pnpm lint        # ESLint code quality checks
pnpm typecheck   # Run the TypeScript compiler w/out emitting files
pnpm build       # Production build verification
pnpm preview     # Preview production build
```

**Backend:**
```bash
cd backend
uv run pytest      # Run test suite (when implemented)
uv sync            # Sync dependencies
```

**Integration:**
```bash
docker compose up --build -d    # Full stack test
curl http://localhost:8000/health
curl http://localhost:8000/docs
```

### Test Architecture

**Frontend Testing:**
- ESLint for code quality and consistency
- Vite build process for integration testing
- Ready for Jest/Vitest unit testing framework

**Backend Testing:**
- pytest framework ready for implementation
- FastAPI TestClient for API testing
- Async test support with Python 3.13

### Testing Approach

- Coverage target: Aim for 80%+ meaningful coverage; optimize for fewer, higher-value tests.
- Prioritize units: Put core logic in services; unit-test services thoroughly. Keep route tests as slim end-to-end smoke checks.
- Avoid redundancy: Don't duplicate assertions across service and route tests. Prefer one comprehensive service test over multiple granular variants.
- Parametrize duplicates: Use pytest.mark.parametrize to collapse similar cases (e.g., redis:// vs rediss://).
- Error handling: Include explicit tests for failure paths without over-mocking internals.
- No placeholders: Do not add tests for unimplemented endpoints; add them when functionality lands
- Fixture simplicity: Prefer a single app/client fixtures
- Combine where possible: Merge basic/multiple/normalization assertions into one test per unit; keep route e2e to one or two scenarios.
- Pros/cons first: Before adding complex or backward-compat test scaffolding, present options with pros/cons and choose the simplest that meets requirements.

## Code Style Notes

- Do not include "Args" and "Returns" in function comments.
- Handlers should be slim.

## Code Review Process

When receiving code review feedback:

1. **Analyze Each Point**: Go through feedback one by one
2. **Provide Analysis**: For each point, give:
   - Your assessment of the feedback
   - Pros and cons of making the change
   - Alternative approaches if applicable
3. **Wait for Approval**: Don't make changes until explicitly approved
4. **Implement Approved Changes**: Only make changes that have been approved

### Code Review Flow

```
Reviewer Feedback → Analysis + Pros/Cons → User Approval → Implementation
```

This ensures all changes are deliberate and agreed upon.

## VERY IMPORTANT

- Focus on writing clear, DRY, simple code.
- Only add abstrction when it's justified. Do not over-engineer!!
- DO NOT include any dead code. Remove any you find.
- Always ask before adding complexity to support backwards compatibility.

## AI-Assisted Editing Roadmap
- Goal: ship an internal, behind-auth GPT-5-Codex powered editor that can safely update `public-sites/sites/<slug>` in place while keeping deployments reproducible and auditable.
- Hosting: start with a single Render Private Service (process-level jail) backed by a persistent disk; every session is confined to `/opt/render/project/src/sites/<slug>` via path normalization and explicit allowlists.
- Scope: v1 focuses on internal teammates editing existing site bundles; brand-new site scaffolds stay a local Codex workflow until the hosted pipeline proves stable.
- Tooling surface: only expose `list_dir`, `read_file`, `search`, `apply_patch`, `write_file`, and a `run_script` wrapper for vetted commands (`fmt`, `lint`, `build`). Budgets cap file size, patch size, call count, and wall time.
- Workflow: React chat UI → FastAPI orchestrator → GPT-5-Codex tool calls → git worktree per session → format/lint/build gates → commit + diff summary surfaced to the UI. Publish jobs run the static export and call the Render deploy hook.
- Preview: keep a Next.js/Vite dev server running against the same disk for near-instant hot reload during editing; production builds stay in background workers.
- Guardrails: per-site mutexes, audit log of tool calls, secret redaction on reads, automatic halt after repeated failures, and git history for rollback.
- Status: plan only. Update this section as we finalize tool schemas, disk sizing, or decide to move off Render.

### New Feature: In-Page Visual Editing (Lovable-style)

**Goal:** Allow non-technical users (e.g., therapists) to click **“Edit”**, hover elements, and update text/images directly on the rendered site preview.

**How it works:**
1. **Overlay Layer**  
   - React overlay highlights DOM nodes on hover (`getBoundingClientRect`, `elementFromPoint`).  
   - Editable candidates limited to `h1-h6`, `p`, `li`, `a`, `button`, or nodes with `data-*` attributes.

2. **Inline Editing**  
   - Clicking swaps the element into a `contenteditable` region or overlay editor.  
   - Changes captured as structured patches:
     ```json
     {
       "selector": "[data-loc='hero.headline']",
       "type": "text",
       "old": "Therapy for adults",
       "new": "Therapy that feels like you"
     }
     ```

3. **Persistence**  
   - Patches map back to source of truth (`client-overview.md`, YAML configs, or site bundle).  
   - Site rebuild + redeploy ensures edits are reproducible and auditable.

4. **Selector Strategy**  
   - Prefer stable `data-loc` or `data-cms` attributes.  
   - Fall back to generated CSS paths with checksums/fingerprints for drift detection.

5. **UI Stack (learned from Lovable)**  
   - **Next.js + Tailwind** with reusable utility classes (`heading is-section`, `text is-lead`, etc.).  
   - **Radix UI primitives** for dialogs/menus.  
   - **Sonner** for toasts, **Vaul** for side drawers.  
   - **Lucide-react icons** for inline controls.  
   - **AntD components** may also be used for forms and modals.

6. **Workflow Integration**  
   - Visual edits → patch queue → orchestrator validation → file updates → rebuild (`pnpm check`) → Render deploy hook.  
   - Audit logs map DOM-level edits back to version-controlled file changes.

**Note about Lovable:**  
Lovable implements this by overlaying a React editor on top of Next.js static exports, powered by Tailwind, Radix UI, AntD, and Sonner toasts. Their approach demonstrates how in-browser editing can feel live while still preserving reproducibility through static builds and deploy hooks.

### Additional Notes from Market Research

**Learnings from Base44**
- Their editor is a **React SPA** built with **Tailwind CSS** and **Ant Design** components.
- They lean heavily on **Radix UI primitives** for accessibility and interactive elements.
- **Lucide-react** icons are used consistently across the UI.
- The architecture is a single-page app with clear overlay/editor panels, which makes state management simpler but can bloat the main bundle.
- **Takeaway for PremPage:** Favor keeping our editor lightweight. Split the **Studio app** (onboarding, content, assets) from the **Overlay SDK** (DOM highlighting + inline editing), to avoid bundle creep and keep the overlay re-usable in different contexts.

**Learnings from Bolt.new**
- Bolt uses **Remix + React** with a **Vite + TypeScript** toolchain.
- Styling: **Tailwind CSS** with custom DS tokens, **Radix UI**, **React Toastify**, and icon libraries like **Lucide/Heroicons/Phosphor**.
- Embedded editors: **CodeMirror 6** for code and **xterm.js** for terminal simulation.
- Heavy instrumentation: **Sentry**, **HubSpot**, **Chameleon** tours, and multiple ad/analytics SDKs.
- **Takeaway for PremPage:** 
  - Adopt **TypeScript-first** for type safety across the editor and Studio.
  - Consider **CodeMirror** for structured content blocks (blog editing, schema-driven forms) if we expand beyond simple text replacement.
  - Keep instrumentation minimal (Sentry + one analytics) to avoid Bolt’s SDK overhead.

**Shared Patterns (Lovable / Base44 / Bolt)**
- All rely on **React + Tailwind + Radix** as the foundation.
- Toast notifications (Sonner, Toastify) and drawer/panel systems (Vaul, Radix Drawer) are common.
- In-page editors always build around a **selector + patch model** for reproducible changes.
- Preview domains are essential (`preview--slug.domain.com`) to separate draft vs. production safely.

**PremPage Direction**
- Stick with **Next.js (App Router + Static Export)** for Studio and client sites.
- Keep the **editor overlay as a separate bundle** (`/packages/editor-overlay`) injected into preview iframes.
- **Tech stack commitment:** 
  - **Next.js + Tailwind + Radix** as the base.
  - **Sonner** for toasts, **Vaul** for drawers, **Lucide-react** icons.
  - **TypeScript** across all apps/packages.
- Future exploration: evaluate **CodeMirror** for schema-aware editing, but don’t overcomplicate v1.
