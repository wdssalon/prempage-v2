# Prempage V2 - Full Stack Development Project

## Project Overview

Prempage V2 is a modern full-stack application featuring:
- **Frontend**: React 19.1.1 + Vite 7.1.6 with TypeScript support
- **Backend**: FastAPI with Python 3.13 and uv package management
- **Development**: Docker Compose setup with hot reloading
- **Architecture**: Lightweight, fast iteration focused design

## Running the Application

**Prerequisites:**
- Node.js 24 or newer (includes npm ≥ 10)
- Python 3.13 or newer
- Docker and Docker Compose

### Local Development

**Option 1: Docker Compose (Recommended)**
```bash
# Initial setup or after dependency changes
docker compose up --build -d

# Regular development
docker compose up -d

# Stop services
docker compose down
```

**Option 2: Native Development**
```bash
# Frontend
npm install
npm run dev  # http://localhost:5173

# Backend
cd backend
uv sync
uv run uvicorn main:app --reload  # http://localhost:8000
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
- TypeScript support
- ESLint 9.35.0 for code quality

**Backend:**
- FastAPI (Python web framework)
- Python 3.13
- uv package manager
- Uvicorn ASGI server
- Loguru for logging

**Development:**
- Docker Compose multi-container setup
- Hot reloading for both frontend and backend
- Volume mounting for live code updates

## Static Site Workspace
- The `public-sites/` directory houses the tooling and instructions for the static site deployments.
- Brand-specific exports reside in `public-sites/sites/<site-slug>/`. Keep CSS overrides, fonts, and HTML changes scoped within the relevant site bundle. Per-site `images/` directories are gitignored by default.
- Read `public-sites/AGENTS.md` before automating updates; it captures the guardrails for section rotation, copy edits, navigation rules, and override assets.
- End-to-end build guidance (intake, planning, page assembly, QA) lives in `public-sites/generate-website.md` alongside supporting references such as `client-overview.md`, `template/page-build-edit-overview.md`, and `template/sections.yaml`.

### Data Storage

Currently lightweight setup with:
- No external database dependencies in base configuration
- Ready for integration with PostgreSQL, Redis, or other databases
- FastAPI supports async database operations

### Deployment

**Development:**
- Docker Compose for local development
- Hot reloading enabled
- Ports: Frontend :5173, Backend :8000

**Production Ready:**
- Containerized applications
- Vite production builds
- FastAPI production deployment patterns

### Data Persistence

- Backend configured for easy database integration
- uv.lock ensures reproducible Python environments
- package-lock.json for consistent Node.js dependencies

## Evaluation Criteria

TBD..


## Testing Commands

**Frontend:**
```bash
npm run lint        # ESLint code quality checks
npm run build       # Production build verification
npm run preview     # Preview production build
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
