# Prempage V2 - Full Stack Development Project

## Project Overview

Prempage V2 is a modern full-stack application featuring:
- **Frontend**: React 19.1.1 + Vite 7.1.6 with TypeScript support
- **Backend**: FastAPI with Python 3.13 and uv package management
- **Microservices**: Additional FastAPI services under `services/` (e.g., `form-relay` for static form submissions)
- **Development**: Docker Compose setup with hot reloading across frontend, backend, and services
- **Architecture**: Lightweight, fast iteration focused design

## Running the Application

**Prerequisites:**
- Node.js 24 or newer (Corepack with pnpm ≥ 8)
- Python 3.13 or newer
- Docker and Docker Compose

### Local Development

**Option 1: Docker Compose (Recommended)**
```bash
# Initial setup or after dependency changes (frontend, backend, form-relay)
docker compose up --build -d

# Regular development
docker compose up -d

# Stop services
docker compose down

# Start specific services (example: backend + form relay)
docker compose up backend form-relay
```

**Option 2: Native Development**
```bash
# Frontend
pnpm install
pnpm dev  # http://localhost:5173

# Backend
cd backend
uv sync
uv run uvicorn main:app --reload  # http://localhost:8000

# Form Relay microservice
cp services/form-relay/.env.example services/form-relay/.env  # first time only
uv sync --directory services/form-relay
uv run --directory services/form-relay uvicorn app.main:app --reload --port 8080 --env-file .env  # http://localhost:8080
```

## Core Requirements

### Endpoints

**API Documentation:**
- Interactive docs (Swagger UI): http://localhost:8000/docs
- Alternative docs (ReDoc): http://localhost:8000/redoc
- Health check: http://localhost:8000/health

### Technical Stack

**Frontend:**
- React 19.1.1 with React DOM
- Vite 7.1.6 (build tool)
- TypeScript-first scaffold (source in `client/src`)
- ESLint 9.35.0 for code quality

**Backend:**
- FastAPI (Python web framework)
- Python 3.13
- uv package manager
- Uvicorn ASGI server
- Loguru for logging

**Development:**
- Docker Compose multi-container setup (frontend, backend, form-relay)
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
- Ports: Frontend :5173, Backend :8000, Form Relay :8080

**Production Ready:**
- Containerized applications
- Vite production builds
- FastAPI production deployment patterns

### Backend ↔ Frontend Contract

API types flow from backend to frontend automatically:
- Update Pydantic schemas (example: `backend/schemas.py`).
- Export the OpenAPI document with `uv run python export_openapi.py` inside `backend/`.
- Regenerate TypeScript bindings with `pnpm openapi:types` from `client/`.
- Import the generated shapes—`client/src/api/health.ts` shows how to wrap a fetch with strong typing and how `client/src/App.tsx` renders the typed response.

The `/health` endpoint is our reference contract; it surfaces service metadata, message, and a timestamp to validate the end-to-end generation path.

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

- when planning, always present options with pros/cons BEFORE making a decision.
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
