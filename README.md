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
- `public-sites/` – Static site toolkit and exports. Contains process docs (`generate-website.md`, `client-overview.md`, `AGENTS.md`), reusable templates under `template/`, and production-ready HTML/CSS/JS in `public-sites/sites/<site-slug>/` when a brand is ready to ship.
- `prempage-webflow/` – Imported Webflow export available for reference/integration (ignored by git).

## Static Sites
- The `public-sites/` directory houses the tooling and instructions for the static site deployments.

- Read `public-sites/README.md` for deployment notes when pushing updates to the static export.
- Follow `public-sites/generate-website.md` for the multi-phase build process and guardrails. Supporting references—`client-overview.md`, `template/page-build-edit-overview.md`, and `template/sections.yaml`—live in the same directory.
- Automation or human operators should review `public-sites/AGENTS.md` before editing; it centralizes the LLM-specific rules for updating copy, sections, and overrides.

Keep static assets (images, CSS overrides, fonts) scoped inside each `public-sites/sites/<site-slug>/` bundle. The repo-level `.gitignore` already excludes per-site `images/` directories under `public-sites/sites/` so new exports stay clean.

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

## Next Steps
- Replace the placeholder React component in `client/src/App.tsx` with real UI tied to your data model.
- Integrate assets or templates from `prempage-webflow/` into your React components.
- Flesh out API routes in `backend/main.py` and introduce routers/modules as features grow.
- Add environment-specific configuration (e.g., `.env` files, secrets management) as required.

## Running with Docker Compose

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

The frontend lives at http://localhost:5173 and the FastAPI backend responds at http://localhost:8000.

Code changes on the host trigger hot reloads inside the containers (`pnpm dev` and `uvicorn --reload`).

### Stopping Services
```bash
docker compose down
```
Add `-v` to also clear the cached `node_modules` and virtual environment volumes if you need a clean reinstall.
