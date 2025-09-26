# Prempage V2

This repository hosts the Prempage V2 front end (React + Vite), a companion FastAPI backend, and the static-site workspace used to build and deploy the static sites. All three live side-by-side so the whole project lifecycle—from app development to static marketing exports—travels in a single repo.

## Prerequisites
- Node.js 24 or newer (Corepack with pnpm ≥ 8)
- Python 3.13 or newer
- [uv](https://github.com/astral-sh/uv) Python package manager (already bundled in this repo's tooling)

## Frontend (React + Vite)
1. Change into the frontend workspace:
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
   The app will be available at the URL printed in the terminal (defaults to http://localhost:5173).
4. Build for production:
   ```bash
   pnpm build
   ```

### Frontend Scripts
Run these from `client/`:
- `pnpm dev` – start the Vite dev server with React Fast Refresh.
- `pnpm build` – create a production build in the `dist/` directory.
- `pnpm preview` – preview the production build locally.
- `pnpm lint` – run ESLint against the project source.
- `pnpm typecheck` – run the TypeScript compiler in no-emit mode.

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

## Project Structure
- `client/` – React frontend root with entry files (`index.html`, `src/main.tsx`, `src/App.tsx`), global styles, static assets under `client/public/`, and all frontend tooling (`package.json`, `tsconfig.json`, `vite.config.ts`, `eslint.config.js`).
- `backend/` – FastAPI application managed by uv (`main.py`, `pyproject.toml`, `.venv/`).
- `services/` – Standalone microservices. Currently contains `form-relay/` (FastAPI service for static-site form submissions).
- `public-sites/` – Static site toolkit and exports. Contains process docs (`generate-website.md`, `client-overview.md`, `AGENTS.md`), reusable templates under `template/`, and production-ready HTML/CSS/JS in `public-sites/sites/<site-slug>/` when a brand is ready to ship.
- `prempage-webflow/` – Imported Webflow export available for reference/integration (ignored by git).

## Static Sites
- The `public-sites/` directory houses the tooling and instructions for the static site deployments.

- Read `public-sites/README.md` for deployment notes when pushing updates to the static export.
- Follow `public-sites/generate-website.md` for the multi-phase build process and guardrails. Supporting references—`client-overview.md`, `template/page-build-edit-overview.md`, and `template/sections.yaml`—live in the same directory.
- Automation or human operators should review `public-sites/AGENTS.md` before editing; it centralizes the LLM-specific rules for updating copy, sections, and overrides.
- Template-specific build/deploy instructions live under `public-sites/templates/<template>/README.md`. Run `./public-sites/scripts/build-static-site.sh <site-slug>` to mimic the production static export (`pnpm run check` → `out/`).
- Keep static assets (images, CSS overrides, fonts) scoped inside each `public-sites/sites/<site-slug>/` bundle. The repo-level `.gitignore` already excludes per-site `images/` directories under `public-sites/sites/` so new exports stay clean.

## Backend ↔ Frontend Contract

- Pydantic schemas live in `backend/schemas.py`. The `/health` endpoint in `backend/main.py` returns a `HealthCheckResponse` sample payload that exercises the contract.
- Export the OpenAPI schema anytime those models change:
  ```bash
  cd backend
  uv run python export_openapi.py
  ```
- Generate TypeScript bindings by running from `client/`:
  ```bash
  pnpm openapi:types
  ```
  This writes `client/src/api/types.ts` via `openapi-typescript`.
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

## Next Steps
- Replace the placeholder React component in `client/src/App.tsx` with real UI tied to your data model.
- Integrate assets or templates from `prempage-webflow/` into your React components.
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

The frontend lives at http://localhost:5173, the main FastAPI backend responds at http://localhost:8000, and the form relay service listens at http://localhost:8080.

Code changes on the host trigger hot reloads inside the containers (`pnpm dev` and `uvicorn --reload`).

To start specific services, list them explicitly. For example, to bring up the backend and form relay only:

```bash
docker compose up backend form-relay
```

### Stopping Services
```bash
docker compose down
```
Add `-v` to also clear the cached `node_modules` and virtual environment volumes if you need a clean reinstall.
