"""Runtime entrypoint for the form relay service."""
from __future__ import annotations

from fastapi import FastAPI

from .application import create_app

__all__ = ["create_app", "FastAPI"]
