# Dev image for the Prempage FastAPI backend
FROM python:3.13-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    UV_LINK_MODE=copy

# Install dependencies required to install uv and build packages
RUN apt-get update \
    && apt-get install --no-install-recommends -y curl build-essential \
    && rm -rf /var/lib/apt/lists/* \
    && curl -LsSf https://astral.sh/uv/install.sh | sh \
    && ln -s /root/.local/bin/uv /usr/local/bin/uv

WORKDIR /app

# Copy project metadata for dependency installation
COPY pyproject.toml uv.lock ./

# Pre-populate the virtual environment layer for faster starts (ignore failures in cold builds)
RUN uv sync --frozen --no-dev || true

# Copy the remaining application code
COPY . .

EXPOSE 8000
CMD ["uv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
