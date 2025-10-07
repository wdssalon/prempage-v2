# Dev image for the Prempage FastAPI backend
FROM ghcr.io/astral-sh/uv:python3.13-bookworm-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Copy project metadata for dependency installation
COPY pyproject.toml uv.lock ./

# Pre-populate the virtual environment layer for faster starts (ignore failures in cold builds)
RUN uv sync --frozen --no-dev || true

# Copy the remaining application code
COPY . .

EXPOSE 8000
CMD ["uv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
