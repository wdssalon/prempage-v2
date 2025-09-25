# Form Relay Service

Prempage Form Relay is a lightweight FastAPI service that accepts static-site form submissions, enriches them with request metadata, and forwards the payload to the Salon backend (currently stubbed with structured logging).

## Features

- FastAPI endpoint `POST /v1/forms/submissions`
- Origin allow-list enforced via CORS middleware
- Request metadata capture (IP, user agent, referer)
- Structured logging with Loguru
- Optional Sentry telemetry (environment-variable driven)
- Stubbed Salon client ready for future HTTP integration

## Configuration

The service is configured through environment variables prefixed with `FORM_RELAY_` or via the `allowed-origins.json` file in this directory.

| Variable | Description | Default |
| --- | --- | --- |
| `FORM_RELAY_LOG_LEVEL` | Log level for Loguru output | `INFO` |
| `FORM_RELAY_ALLOWED_ORIGINS` | Comma-separated list of allowed origins for CORS | *(empty)* |
| `FORM_RELAY_ALLOWED_ORIGINS_FILE` | Path to a JSON file containing an array of origins | `allowed-origins.json` |
| `FORM_RELAY_SENTRY_DSN` | Sentry DSN string | *(disabled)* |
| `FORM_RELAY_SENTRY_ENVIRONMENT` | Sentry environment tag | `development` |
| `FORM_RELAY_SENTRY_TRACES_SAMPLE_RATE` | Sentry traces sample rate (0.0 – 1.0) | `0.0` |
| `FORM_RELAY_SENTRY_PROFILES_SAMPLE_RATE` | Sentry profiles sample rate (0.0 – 1.0) | `0.0` |
| `FORM_RELAY_SALON_FORWARDING_ENABLED` | Toggle real Salon forwarding when implementation is ready | `false` |
| `FORM_RELAY_SALON_ENDPOINT_URL` | Target URL for Salon submissions | *(unused)* |
| `FORM_RELAY_SALON_AUTH_TOKEN` | Bearer/API token for Salon integration | *(unused)* |

For local development, copy `.env.example` to `.env` inside this directory and adjust the values as needed. Update `allowed-origins.json` (example includes `http://localhost:5173`) or set `FORM_RELAY_ALLOWED_ORIGINS` in your `.env`. In Render, prefer setting `FORM_RELAY_ALLOWED_ORIGINS` directly on the service to keep configuration centralized.

## Running Locally

```bash
cd services/form-relay
uv sync        # install dependencies with uv
uv run uvicorn app.main:app --reload --port 8080 --env-file .env
```

A health check is available at http://localhost:8080/health.

### Docker

To run the service through the repository's compose stack (mirrors the Render deployment):

```bash
docker compose up form-relay
```

The container exposes port 8080 and loads configuration from `services/form-relay/.env`.
Health endpoint: `http://localhost:8080/health`.

Submit a test payload:

```bash
curl -X POST http://localhost:8080/v1/forms/submissions \
  -H 'Content-Type: application/json' \
  -H 'Origin: http://localhost:5173' \
  -d '{
    "form_name": "contact-us",
    "fields": {"name": "Ada Lovelace", "email": "ada@example.com", "message": "Hello"},
    "metadata": {"site_id": "demo"}
  }'
```

## Sentry Setup

1. Create a Sentry project named `form-relay` (or similar) and copy the DSN.
2. On Render, add an environment variable `FORM_RELAY_SENTRY_DSN` with the DSN value.
3. Optionally set `FORM_RELAY_SENTRY_ENVIRONMENT` to distinguish staging vs production deployments.
4. Keep sample rates at zero until you want tracing data; adjust as needed.

## Next Steps

- Implement the real Salon HTTP client once the backend endpoint is available.
- Extend validation rules per-site as forms solidify.
- Integrate spam filtering (Cleantalk/OOPSpam) after Salon exposes the necessary workflow.
