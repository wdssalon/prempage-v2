# Prempage V2

This repository hosts the Prempage V2 workspaces: the current React + Vite client, the FastAPI backend, and the static-site tooling used to build and deploy static sites. We're transitioning to a two-deployable front-end model built around a Next.js Studio app and a standalone editor overlay bundle so the whole project lifecycle—from app development to static exports—remains in a single repo.

## Prerequisites
- Node.js 24 or newer (Corepack with pnpm ≥ 8)
- Python 3.13 or newer
- [uv](https://github.com/astral-sh/uv) Python package manager (already bundled in this repo's tooling)
- Prefer Python for internal automation scripts. If another language is required, document the reasoning in the PR or commit description.
- [direnv](https://direnv.net/) (optional but recommended for loading environment variables)

## Service Port Map
- `client` (Next.js Studio) — http://localhost:3001
- `backend` (FastAPI core API) — http://localhost:8000
- `services/form-relay` (form submission relay) — http://localhost:8080
- `services/static-site-extractor` — http://localhost:8081
- `public-sites/sites/*` (site bundles) — share http://localhost:3000 when running `pnpm dev` inside a site directory; static exports otherwise serve from disk

Every service in this repository must use a unique local port. The only exception is the static site workspaces under `public-sites/sites`, which can reuse the same development port. Update the table above whenever you add a new service or change a port assignment so local development stays collision-free.

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

**Status:** The Next.js Studio lives in `client/`; the legacy Vite app has been retired so all frontend work now happens inside the Studio workspace. App B (overlay bundle) is the next focus once the Studio shell solidifies.

## Studio Frontend (Next.js)
1. Change into the Studio workspace:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Start the development server with hot reloading:
   ```bash
   pnpm dev
   ```
   The app listens on http://localhost:3001 by default. Set `NEXT_PUBLIC_API_BASE_URL` if your backend runs elsewhere.
4. Build for production:
   ```bash
   pnpm build
   ```
5. Preview the production build locally:
   ```bash
   pnpm start
   ```

### Studio Scripts
Run these from `client/`:
- `pnpm dev` – start the Next.js dev server.
- `pnpm build` – create an optimized production build.
- `pnpm start` – serve the production build locally.
- `pnpm lint` – run ESLint against the project source.
- `pnpm typecheck` – run the TypeScript compiler in no-emit mode.
- `pnpm openapi:types` – regenerate typed API bindings from the FastAPI OpenAPI schema.

## Backend (FastAPI + uv)
1. Change into the backend project:
   ```bash
   cd backend
   ```
2. Sync the virtual environment (installs dependencies into `.venv/`):
   ```bash
   uv sync
   ```
3. Run the API locally with autoreload enabled:
   ```bash
   uv run uvicorn main:app --reload
   ```
   The service listens on http://127.0.0.1:8000 by default. A health check is available at `/health`.

   **API Documentation:**
   - Interactive docs (Swagger UI): http://localhost:8000/docs
   - Alternative docs (ReDoc): http://localhost:8000/redoc

### Backend Notes
- FastAPI app lives in `backend/main.py` and is pre-configured with Loguru logging.
- Adjust logging behavior in `configure_logging()` as your deployment targets evolve.
- When adding dependencies, run `uv add <package>` from the `backend/` directory to keep the lockfile in sync.
- Docker Compose injects `STATIC_SITE_EXTRACTOR_URL=http://static-site-extractor:8081`; use that host when wiring the backend to the microservice.

## Render Automation
- Use `scripts/render_apply.py` to sync static-site services with their `render.yaml` blueprints (format mirrors Render's current "type: web" + "runtime: static" schema).
- Export `RENDER_API_KEY` (and optionally override `RENDER_API_URL`).
- The helper depends on `requests` and `PyYAML`; install them with `pip install -r requirements.txt` (if a shared file exists) or `pip install requests pyyaml`.
- Example:
  ```bash
  export RENDER_API_KEY=xxxxxxxx
  python scripts/render_apply.py public-sites/sites/progressivewaytherapy-horizon/render.yaml --deploy
  ```
  The `--dry-run` flag prints the API payloads without executing the changes.
- Run `python scripts/render_apply.py --list` to print all static-site services when you need to confirm the exact name Render expects.
- Plan to host the Static Site Extractor as a Render Private Service named `static-site-extractor`, built from `services/static-site-extractor/` and exposing port `8081`. Downstream apps should read its URL from `STATIC_SITE_EXTRACTOR_URL` (e.g., `https://static-site-extractor.onrender.com` in production).

## Direnv Usage
- Install direnv for your shell and add the hook as described in the [direnv docs](https://direnv.net/docs/installation.html).
- Run `direnv allow` once in the repo root to trust the generated `.envrc`.
- `.envrc` sources `.env.defaults`, `.env`, and any site-level env files if present, then adds `.venv/bin` to your `PATH` so the uv-managed virtualenv is active automatically.
- Adjust or extend `.envrc` locally as needed; the file is ignored by git.

## Project Structure
- `client/` – Next.js Studio workspace (App Router, Tailwind, TypeScript).
- `backend/` – FastAPI application managed by uv (`main.py`, `pyproject.toml`, `.venv/`).
- `services/` – Standalone microservices: `form-relay/` (FastAPI service for static-site form submissions) and `static-site-extractor/` (Static Site Extractor FastAPI service for parsing static pages).
- `public-sites/` – Static site toolkit and exports. Load `agents/policy/public-sites.md` and the active template supplement before working on a site.
- `prempage-webflow/` – Imported Webflow export available for reference/integration (ignored by git).

## Static Sites
- The `public-sites/` directory houses the tooling and instructions for the static site deployments.

- Review `agents/policy/public-sites.md` before editing. Per-stage guidance lives in `agents/roles/`.
- Template-specific build/deploy instructions live under `public-sites/templates/<template>/` (config, supplement) with automation manifests in `agents/templates/<template>/`. Run `./public-sites/scripts/horizon/build-static-site.sh <site-slug>` to mimic the production static export (`pnpm run check` → `out/`).
- Keep static assets (images, CSS overrides, fonts) scoped inside each `public-sites/sites/<site-slug>/` bundle. The repo-level `.gitignore` already excludes per-site `images/` directories under `public-sites/sites/` so new exports stay clean.

## Backend ↔ Frontend Contract

- Pydantic schemas live in `backend/schemas.py`. The `/health` endpoint in `backend/main.py` returns a `HealthCheckResponse` sample payload that exercises the contract.
- Export the OpenAPI schema anytime those models change:
  ```bash
  cd backend
  uv run python export_openapi.py
  ```
- Generate TypeScript bindings from the Studio workspace (`client/`):
  ```bash
  pnpm openapi:types
  ```
  The command writes `src/api/types.ts` via `openapi-typescript` so the UI always reflects the backend schema.
- Use the generated types to keep fetch helpers and UI in sync. See `client/src/api/health.ts` for a typed fetch wrapper and `client/src/App.tsx` for how the React view consumes that data.

Docker builds run the same pipeline, so containerized runs will always ship matching backend and frontend contracts.

## Form Relay Service

`services/form-relay/` hosts a standalone FastAPI service that accepts static-site form submissions and forwards them to the Salon backend (forwarding is stubbed today). To work on it locally:

1. Copy the example env file and edit values as needed:
   ```bash
   cp services/form-relay/.env.example services/form-relay/.env
   ```
2. Install dependencies and run the dev server:
   ```bash
   uv sync --directory services/form-relay
   uv run --directory services/form-relay uvicorn app.main:app --reload --port 8080 --env-file .env
   ```

   See `services/form-relay/README.md` for curl examples and Sentry configuration notes.
   A health check is available at http://localhost:8080/health.

## Static Site Extractor

Static Site Extractor (`services/static-site-extractor/`) exposes a FastAPI endpoint that fetches static pages and returns normalized text, image, font metadata, and an inferred navigation tree for downstream tooling. To run it locally:

1. Change into the service directory:
   ```bash
   cd services/static-site-extractor
   ```
2. Install dependencies:
   ```bash
   uv sync
   ```
3. Start the API with autoreload:
   ```bash
   uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8081
   ```

   The service listens on http://localhost:8081/ and responds to `/health`.

- Responses include a `text_blob` for quick review, deduplicated image/font lists, and a `navigation` array that captures menu items and nesting when detected.

## Next Steps
- Flesh out the Next.js Studio experience in `client/`, starting with the onboarding flow and layering real data.
- Integrate assets or templates from `prempage-webflow/` into the Studio UI.
- Flesh out API routes in `backend/main.py` and introduce routers/modules as features grow.
- Add environment-specific configuration (e.g., `.env` files, secrets management) as required.

## AI-Assisted Editing Roadmap
- Goal: ship an internal, behind-auth GPT-5-Codex powered editor that can safely update `public-sites/sites/<slug>` in place while keeping deployments reproducible and auditable.
- Hosting: start with a single Render Private Service (process-level jail) backed by a persistent disk; every session is confined to `/opt/render/project/src/sites/<slug>` via path normalization and explicit allowlists.
- Scope: v1 focuses on internal teammates editing existing site bundles; brand-new site scaffolds are built locally with Codex for now.
- Tooling surface: only expose `list_dir`, `read_file`, `search`, `apply_patch`, `write_file`, and a `run_script` wrapper for vetted commands (`fmt`, `lint`, `build`). Budgets cap file size, patch size, call count, and wall time.
- Workflow: React chat UI → FastAPI orchestrator → GPT-5-Codex tool calls → git worktree per session → format/lint/build gates → commit + diff summary surfaced to the UI. Publish jobs build and call the Render deploy hook.
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

## Git Hooks
- Git hooks live in `.githooks/`. Point your repo at them once per checkout:
  ```bash
  git config core.hooksPath .githooks
  ```
- The `pre-push` hook installs + lints Horizon static sites with pnpm before any push. Keep Node ≥ 20 with pnpm available locally.

## Running with Docker Compose

Each service ships its own Dockerfile (`Dockerfile.frontend`, `backend/Dockerfile`, `services/form-relay/Dockerfile`). The compose stack stitches them together for local development, and Render can consume the same images for deployment.

### Initial Setup or After Changes to Dependencies
Use `--build` to rebuild images when:
- First time running the project
- After changes to `client/package.json`, `pyproject.toml`, or `uv.lock`
- After changes to Dockerfiles
- When you need a fresh build

```bash
docker compose up --build -d
```

### Regular Development
For day-to-day development when only source code changes:
```bash
docker compose up -d
```

The Studio frontend lives at http://localhost:3001, the main FastAPI backend responds at http://localhost:8000, the form relay service listens at http://localhost:8080, and the Static Site Extractor is available at http://localhost:8081.

Code changes on the host trigger hot reloads inside the containers (`pnpm dev` and `uvicorn --reload`).

To start specific services, list them explicitly. For example, to bring up only the backend, form relay, and Static Site Extractor:

```bash
docker compose up backend form-relay static-site-extractor
```

### Stopping Services
```bash
docker compose down
```
Add `-v` to also clear the cached `node_modules` and virtual environment volumes if you need a clean reinstall.
