# Base image
FROM python:3.13-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    UV_LINK_MODE=copy

# Install OS-level deps and uv
RUN apt-get update \
    && apt-get install --no-install-recommends -y curl build-essential \
    && rm -rf /var/lib/apt/lists/* \
    && curl -LsSf https://astral.sh/uv/install.sh | sh \
    && ln -s /root/.local/bin/uv /usr/local/bin/uv

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
