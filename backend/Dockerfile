# Dev image for the Prempage FastAPI backend
FROM python:3.13-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

RUN pip install --no-cache-dir uv

WORKDIR /app

# Copy project metadata for dependency installation
COPY pyproject.toml uv.lock ./

# Pre-populate the virtual environment layer for faster starts
RUN uv sync --no-dev || true

# Copy the remaining application code
COPY . .

EXPOSE 8000
CMD ["uv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
