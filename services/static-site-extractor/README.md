# Static Site Extractor

FastAPI microservice that fetches a static webpage and returns structured JSON containing text nodes, image URLs, and font URLs. Designed to run on Render and be callable by LLM tooling.

## Local development

```bash
uv sync
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8081
```

## Configuration

Environment variables (all optional):

- `REQUEST_TIMEOUT_SECONDS` — HTTP timeout when fetching pages and stylesheets (default `10`).
- `MAX_CONTENT_LENGTH_BYTES` — Maximum size for fetched HTML bodies (default `5_000_000`).
- `MAX_STYLESHEET_BYTES` — Maximum size for individual stylesheets (default `1_000_000`).
- `MAX_STYLESHEETS` — How many linked/imported stylesheets to inspect (default `8`).
- `USER_AGENT` — Custom user agent string for outbound requests.

## Request example

```bash
curl -X POST http://localhost:8081/extract \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

## Response shape

```json
{
  "url": "https://example.com",
  "title": "Example Domain",
  "fetched_at": "2025-02-14T12:34:56.000Z",
  "text": [
    {
      "path": "html.body.div.p",
      "content": "Example Domain"
    }
  ],
  "images": [
    {
      "src": "https://example.com/image.png",
      "alt": "Example image"
    }
  ],
  "fonts": [
    "https://example.com/fonts/example.woff2"
  ]
}
```

## Docker

```bash
docker build -t static-site-extractor .
```

Within the repo's `docker-compose.yml` this service runs under the `static-site-extractor` name, so other containers can reach it at `http://static-site-extractor:8081`.

Run tests with:

```bash
uv run --extra dev pytest
```
