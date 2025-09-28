"""Helpers specific to Horizon template automation."""

from __future__ import annotations

from pathlib import Path

PUBLIC_SITES_ROOT = Path(__file__).resolve().parents[3]
TEMPLATE_SLUG = "horizon"
TEMPLATE_ROOT = PUBLIC_SITES_ROOT / "templates" / TEMPLATE_SLUG
BOILERPLATE_ROOT = TEMPLATE_ROOT / "app-boilerplate"
SITES_ROOT = PUBLIC_SITES_ROOT / "sites"

__all__ = [
  "PUBLIC_SITES_ROOT",
  "TEMPLATE_SLUG",
  "TEMPLATE_ROOT",
  "BOILERPLATE_ROOT",
  "SITES_ROOT",
]
