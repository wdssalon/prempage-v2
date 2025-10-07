# Base image
FROM ghcr.io/astral-sh/uv:python3.13-bookworm-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Copy dependency metadata first
COPY pyproject.toml uv.lock ./

# Install dependencies (production only by default)
RUN uv sync --frozen --no-dev || true

# Copy application code
COPY app ./app
COPY allowed-origins.json ./allowed-origins.json

EXPOSE 8080

CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
