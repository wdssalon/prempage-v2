from __future__ import annotations

from fastapi import FastAPI, HTTPException
from loguru import logger

from .extractor import ExtractionError, extract_page
from .models import ExtractionRequest, ExtractionResponse

app = FastAPI(title="Static Site Extractor", version="0.1.0")


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/extract", response_model=ExtractionResponse)
async def extract(payload: ExtractionRequest) -> ExtractionResponse:
    try:
        return await extract_page(str(payload.url))
    except ExtractionError as exc:  # pragma: no cover - simple mapping
        logger.warning("Extraction failed for %s: %s", payload.url, exc.message)
        raise HTTPException(status_code=exc.status_code, detail=exc.message) from exc


__all__ = ["app"]
