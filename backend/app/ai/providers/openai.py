"""OpenAI-powered palette generator."""
from __future__ import annotations

import json
import os
from typing import Mapping

from loguru import logger
from openai import OpenAI

from app.ai.base import PaletteGenerator, PaletteGeneratorError


DEFAULT_OPENAI_MODEL = "gpt-4o-mini"


PALETTE_SCHEMA = {
    "type": "object",
    "properties": {
        "bg_base": {"type": "string"},
        "bg_surface": {"type": "string"},
        "bg_contrast": {"type": "string"},
        "text_primary": {"type": "string"},
        "text_secondary": {"type": "string"},
        "text_inverse": {"type": "string"},
        "brand_primary": {"type": "string"},
        "brand_secondary": {"type": "string"},
        "accent": {"type": "string"},
        "border": {"type": "string"},
        "ring": {"type": "string"},
        "critical": {"type": "string"},
        "critical_contrast": {"type": "string"},
    },
    "required": [
        "bg_base",
        "bg_surface",
        "bg_contrast",
        "text_primary",
        "text_secondary",
        "text_inverse",
        "brand_primary",
        "brand_secondary",
        "accent",
        "border",
        "ring",
        "critical",
        "critical_contrast",
    ],
    "additionalProperties": False,
}

PALETTE_RESPONSE_FORMAT = {
    "type": "json_schema",
    "name": "horizon_palette",
    "schema": PALETTE_SCHEMA,
}


class OpenAIPaletteGenerator(PaletteGenerator):
    """Generate palettes using OpenAI's Responses API."""

    def __init__(self, model: str = DEFAULT_OPENAI_MODEL, api_key: str | None = None) -> None:
        key = api_key or os.getenv("OPENAI_API_KEY")
        if not key:
            raise PaletteGeneratorError("OPENAI_API_KEY is not configured")

        self._client = OpenAI(api_key=key)
        self._model = model
        debug_raw = os.getenv("PREMPAGE_OPENAI_DEBUG", "0")
        self._debug = str(debug_raw).lower() in {"1", "true", "yes", "on"}

    def generate(self, current_palette: Mapping[str, str], notes: str | None) -> Mapping[str, str]:
        system_prompt = (
            "You are an expert brand designer. Given the existing Horizon template palette, "
            "propose a refreshed set of colors that stay visually balanced, accessible, and harmonious. "
            "Return JSON only."
        )

        user_prompt = (
            "Current palette (JSON):\n"
            f"{json.dumps(current_palette, indent=2)}\n"
            "Guidance: "
            f"{notes if notes else 'Create a new harmonious variant while keeping contrast readable.'}"
        )

        if self._debug:
            logger.debug(
                "OpenAI palette request payload",
                instructions=system_prompt,
                input=user_prompt,
                response_format=PALETTE_RESPONSE_FORMAT,
            )

        try:
            response = self._client.responses.create(
                model=self._model,
                instructions=system_prompt,
                input=user_prompt,
                text={"format": PALETTE_RESPONSE_FORMAT},
            )
        except Exception as exc:  # noqa: BLE001
            logger.error("OpenAI palette generation failed: {exc}", exc=str(exc))
            raise PaletteGeneratorError("OpenAI request failed") from exc

        try:
            if self._debug:
                serialized = None
                if hasattr(response, "model_dump"):
                    serialized = response.model_dump(mode="json")  # type: ignore[attr-defined]
                elif hasattr(response, "model_dump_json"):
                    serialized = json.loads(response.model_dump_json())  # type: ignore[attr-defined]
                elif hasattr(response, "to_dict"):
                    serialized = response.to_dict()  # type: ignore[attr-defined]
                elif hasattr(response, "json"):
                    serialized = json.loads(response.json())  # type: ignore[attr-defined]
                logger.debug(
                    "OpenAI palette raw response",
                    response=serialized if serialized is not None else repr(response),
                )

            if getattr(response, "output_text", None):
                data = json.loads(response.output_text)  # type: ignore[arg-type]
                return {k: str(v) for k, v in data.items()}

            for chunk in getattr(response, "output", []) or []:
                for item in getattr(chunk, "content", []) or []:
                    if getattr(item, "type", None) == "output_json" and getattr(item, "json", None) is not None:
                        data = item.json
                        return {k: str(v) for k, v in data.items()}
                    if getattr(item, "type", None) == "output_text" and getattr(item, "text", None):
                        data = json.loads(item.text)
                        return {k: str(v) for k, v in data.items()}
            raise ValueError("No usable content returned")
        except Exception as exc:  # noqa: BLE001
            logger.error("OpenAI returned an unexpected response: {error}", error=str(exc))
            raise PaletteGeneratorError("Failed to parse OpenAI response") from exc
