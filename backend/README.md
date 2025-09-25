# Prempage V2 Backend

FastAPI backend for the Prempage V2 application. The service exposes health and API docs endpoints and is packaged for local development via Docker or uv.

## Requirements
- Python 3.13+
- [uv](https://docs.astral.sh/uv/) package manager
- Optional: Docker & Docker Compose

## Local Development
```bash
uv sync
uv run uvicorn main:app --reload
```
The API is available at http://localhost:8000 with interactive docs at `/docs` and `/redoc`.

## Docker
```bash
docker compose up --build -d
```
Runs the full stack (frontend + backend) with hot reloading enabled.

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
