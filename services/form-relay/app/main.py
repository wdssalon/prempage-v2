"""WSGI-compatible entrypoint for the form relay FastAPI application."""
from __future__ import annotations

import uvicorn

from .application import create_app

app = create_app()


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8080, reload=True)
