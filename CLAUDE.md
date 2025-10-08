# Prempage V2 – LLM Brief

## Workspace snapshot
- `client/`: Next.js 15 Studio (React 19, Tailwind 4) with scripts in `package.json`
- `packages/editor-overlay/`: reusable overlay bundle injected into previews and static exports
- `backend/`: FastAPI API using uv; regenerate the schema with `export_openapi.py`
- `services/form-relay/` and `services/static-site-extractor/`: FastAPI microservices with `uvicorn` entrypoints
- `public-sites/`: editable site bundles (e.g., `horizon-example`) plus template tooling
- `docker-compose.yml`: wires Studio, backend, and services for local development

## Environment defaults
- Node.js 24+ with pnpm (enable via Corepack)
- Python 3.13+; use `uv sync` and `uv run` inside Python projects
- Ports: Studio 3001, backend 8000, form relay 8080, static-site-extractor 8081, site previews 3000
- `public-sites/sites/*/images/` is gitignored; keep edits scoped to each site

## Primary commands
- Docker stack: `docker compose up --build -d`, `docker compose up -d`, `docker compose down`
- Studio: `pnpm --dir client install`, `pnpm --dir client dev`, `pnpm --dir client build`
- Backend: from `backend/`, `uv sync` then `uv run uvicorn main:app --reload --port 8000`
- Form relay: `cd services/form-relay && uv sync && uv run uvicorn app.main:app --reload --port 8080 --env-file .env`
- Static-site-extractor: `cd services/static-site-extractor && uv sync && uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8081`
- Overlay rebuild: `pnpm install --filter @prempage/editor-overlay --force` and `pnpm --filter @prempage/editor-overlay build`
- Horizon preview: `pnpm install --filter horizon-example` and `pnpm --filter horizon-example dev`

## Workflow reminders
- For a clean Horizon example, run `python public-sites/templates/horizon/cookiecutter-config/scripts/run_horizon_example.py`, rebuild the stack with `docker compose up --build -d` (add `--force-recreate --remove-orphans` if containers are already running), and start the preview via `pnpm --dir public-sites/sites/horizon-example dev`. The python script already rebuilds the overlay bundle and refreshes the section catalog—no `uv sync` prerequisite.
- Regenerate OpenAPI JSON and Studio TypeScript types after backend model changes.
- Use Docker when verifying cross-service flows; the compose stack mounts the repo for hot reload.

### Backend ↔ Frontend Contract

API types flow from backend to frontend automatically:
- Update Pydantic schemas in `backend/app/models/` (for example `system.py`).
- Export the OpenAPI document with `uv run python export_openapi.py` inside `backend/`.
- Regenerate TypeScript bindings with `pnpm --dir client openapi:types`.
- Import the generated shapes; `client/src/api/health.ts` wraps `/health` with the typed response for reference.

The `/health` endpoint is the reference contract. It returns status metadata, a message, and a timestamp to validate the end-to-end generation path.

### Testing Approach

- Target ~80% meaningful coverage; prioritize high-value assertions.
- Keep business logic in services and cover it with focused unit tests; let route tests act as thin smoke checks.
- Avoid redundant assertions between service and route layers—opt for one comprehensive test instead of many near-duplicates.
- Use `pytest.mark.parametrize` to collapse variant cases (e.g. protocol checks).
- Exercise failure paths without over-mocking internals.
- Skip placeholder tests for unimplemented endpoints; land them with the actual feature.
- Prefer a single shared app/client fixture to keep setup simple.
- Merge normalization/basic assertions where possible; reserve multi-case e2e tests for truly distinct behavior.
- Before adding heavy scaffolding for backward compatibility, outline options with pros/cons and choose the simplest path that satisfies requirements.

## Guardrails
- Default to Python for new automation; document any exceptions for reviewers.
- Read `agents/policy/public-sites.md` before editing static site bundles programmatically.
- Keep port assignments and command snippets aligned with `docker-compose.yml` and package scripts.
- Ignore unrelated working tree changes and default to ASCII when writing files.

## Code Style Notes
- Skip "Args"/"Returns" headings in docstrings.
- Keep request handlers slim; move logic into services.

## VERY IMPORTANT
- Favor clear, DRY, simple code.
- Introduce abstraction only when justified; avoid over-engineering.
- Remove dead code as you find it.
- Ask before adding complexity just for backward compatibility.
