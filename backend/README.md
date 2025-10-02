# Prempage V2 Backend

FastAPI backend for the Prempage V2 application. The service exposes health and API docs endpoints and is packaged for local development via Docker or uv.

## Requirements
- Python 3.13+
- [uv](https://docs.astral.sh/uv/) package manager
- Optional: Docker & Docker Compose

## Configuration

Copy `.env.example` to `.env` and populate the required secrets (keep the `.env` file out of version control). At minimum set `OPENAI_API_KEY` so the palette swap endpoint can call OpenAI.

## Local Development
```bash
uv sync
uv run uvicorn main:app --reload --env-file .env
```
The API is available at http://localhost:8000 with interactive docs at `/docs` and `/redoc`.

## Docker
```bash
docker compose up --build -d
```
Runs the full stack (frontend + backend) with hot reloading enabled. The Compose stack loads variables from `backend/.env` when present.

### Deployment

On Render, configure `OPENAI_API_KEY` on the backend service. Additional model/provider support can be added later.

Manage secrets through Render's dashboard; do not commit `.env` files.

## Testing
Tests are executed with pytest through uv:
```bash
uv run pytest
```

## Project Structure
- `main.py` – FastAPI application entry point
- `pyproject.toml` – Python dependencies and configuration
- `uv.lock` – Locked dependency versions for reproducible environments

## Health Check
Verify the service is up:
```bash
curl http://localhost:8000/health
```
