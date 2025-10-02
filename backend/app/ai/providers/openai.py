"""OpenAI-powered palette generator."""
from __future__ import annotations

import json
import os
import random
from typing import ClassVar, Mapping, Optional, Tuple

from loguru import logger
from openai import OpenAI

from app.ai.base import PaletteGenerator, PaletteGeneratorError
from app.ai.debug import InteractionDebugger, to_serialisable


DEFAULT_OPENAI_MODEL = "gpt-4.1-mini"


HEX_COLOR_PATTERN = r"^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$"


PALETTE_SCHEMA = {
    "type": "object",
    "properties": {
        "bg_base": {"type": "string", "pattern": HEX_COLOR_PATTERN},
        "bg_surface": {"type": "string", "pattern": HEX_COLOR_PATTERN},
        "bg_contrast": {"type": "string", "pattern": HEX_COLOR_PATTERN},
        "text_primary": {"type": "string", "pattern": HEX_COLOR_PATTERN},
        "text_secondary": {"type": "string", "pattern": HEX_COLOR_PATTERN},
        "text_inverse": {"type": "string", "pattern": HEX_COLOR_PATTERN},
        "brand_primary": {"type": "string", "pattern": HEX_COLOR_PATTERN},
        "brand_secondary": {"type": "string", "pattern": HEX_COLOR_PATTERN},
        "accent": {"type": "string", "pattern": HEX_COLOR_PATTERN},
        "border": {"type": "string", "pattern": HEX_COLOR_PATTERN},
        "ring": {"type": "string", "pattern": HEX_COLOR_PATTERN},
        "critical": {"type": "string", "pattern": HEX_COLOR_PATTERN},
        "critical_contrast": {"type": "string", "pattern": HEX_COLOR_PATTERN},
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

    # Broad hue bands with descriptive language to keep guidance fresh while covering the full wheel.
    _HUE_BANDS: ClassVar[Tuple[Tuple[float, float, Tuple[str, ...], Tuple[str, ...]], ...]] = (
        (0.0, 20.0, ("crimson red", "ruby scarlet", "garnet red"), ("velvet-rich", "sunset-kissed", "dramatic")),
        (20.0, 50.0, ("amber orange", "burnt sienna", "tangerine"), ("sun-warmed", "terra cotta", "glowing")),
        (50.0, 80.0, ("citrine yellow", "goldenrod", "honey ochre"), ("luminous", "buttery", "sun-baked")),
        (80.0, 110.0, ("chartreuse", "lime green", "fresh citrus"), ("zesty", "spring-lit", "vibrant")),
        (110.0, 150.0, ("emerald green", "verdant green", "forest green"), ("lush", "grounded", "serene")),
        (150.0, 180.0, ("teal", "seafoam teal", "aquamarine"), ("oceanic", "mineral-rich", "tranquil")),
        (180.0, 210.0, ("cerulean blue", "turquoise blue", "aqua blue"), ("breezy", "open-sky", "freshwater")),
        (210.0, 240.0, ("azure blue", "sapphire blue", "cobalt blue"), ("crisp", "luminous", "midnight-edge")),
        (240.0, 270.0, ("indigo", "ultramarine", "midnight violet"), ("deep twilight", "nocturnal", "mysterious")),
        (270.0, 300.0, ("amethyst violet", "orchid", "royal purple"), ("ethereal", "dreamy", "glowing dusk")),
        (300.0, 330.0, ("magenta", "fuchsia", "electric berry"), ("vibrant", "electric", "bold")),
        (330.0, 360.0, ("rose pink", "blush rose", "cerise"), ("romantic", "soft-glow", "flushed")),
    )
    _last_anchor: ClassVar[Optional[float]] = None
    _rng: ClassVar[random.Random] = random.SystemRandom()

    def __init__(self, model: str = DEFAULT_OPENAI_MODEL, api_key: str | None = None) -> None:
        key = api_key or os.getenv("OPENAI_API_KEY")
        if not key:
            raise PaletteGeneratorError("OPENAI_API_KEY is not configured")

        self._client = OpenAI(api_key=key)
        self._model = model
        self._debugger = InteractionDebugger.from_env(
            flag_env="PREMPAGE_OPENAI_DEBUG",
            path_env="PREMPAGE_OPENAI_DEBUG_LOG",
            default_path="/tmp/prempage_openai_debug.log",
        )

    @staticmethod
    def _angular_distance(a: float, b: float) -> float:
        diff = abs(a - b) % 360.0
        return diff if diff <= 180.0 else 360.0 - diff

    @classmethod
    def _band_for_hue(cls, hue: float) -> Tuple[Tuple[str, ...], Tuple[str, ...]]:
        hue = hue % 360.0
        for start, end, names, moods in cls._HUE_BANDS:
            if start <= hue < end:
                return names, moods
        # Wraparound fallback
        names, moods = cls._HUE_BANDS[0][2], cls._HUE_BANDS[0][3]
        return names, moods

    @classmethod
    def _describe_hue(cls, hue: float, variant: str = "long") -> str:
        names, moods = cls._band_for_hue(hue)
        name = cls._rng.choice(names)
        mood = cls._rng.choice(moods)
        if variant == "short":
            return name
        return f"{mood} {name}"

    @classmethod
    def _anchor_context(cls) -> Tuple[float, str, str]:
        hue = cls._rng.uniform(0.0, 360.0)
        if cls._last_anchor is not None:
            for _ in range(8):
                if cls._angular_distance(hue, cls._last_anchor) >= 45.0:
                    break
                hue = cls._rng.uniform(0.0, 360.0)
        cls._last_anchor = hue

        anchor_long = cls._describe_hue(hue, variant="long")
        anchor_short = cls._describe_hue(hue, variant="short")

        mode = cls._rng.choice(("tonal", "analogous", "complementary"))
        if mode == "tonal":
            combo_hint = (
                "Keep brand_secondary as a lighter or darker tonal shift of the primary hue so the story stays monochromatic."
            )
        elif mode == "analogous":
            neighbor_hue = (hue + cls._rng.uniform(20.0, 35.0)) % 360.0
            neighbor_desc = cls._describe_hue(neighbor_hue, variant="short")
            combo_hint = (
                f"Let brand_secondary drift into an analogous {neighbor_desc} range while preserving harmony with the {anchor_short} anchor."
            )
        else:
            complement_hue = (hue + 180.0 + cls._rng.uniform(-20.0, 20.0)) % 360.0
            complement_desc = cls._describe_hue(complement_hue, variant="short")
            combo_hint = (
                f"Set brand_secondary as a complementary {complement_desc} accent so the primary {anchor_short} remains dominant."
            )

        return hue, anchor_long, combo_hint

    def generate(self, current_palette: Mapping[str, str], notes: str | None) -> Mapping[str, str]:
        anchor_hue, anchor_description, combination_hint = self._anchor_context()

        system_prompt = (
            "You are the brand design system steward for the Prempage Horizon template. "
            "Produce a fresh colour palette that keeps the Horizon token structure intact while feeling cohesive, "
            "AA-accessible, and editorial. Return JSON only.")

        previous_primary = current_palette.get("brand_primary")
        guidance_lines = [
            "Palette requirements:",
            "- All values must be HEX strings (e.g. #1d675a).",
            "- Keep backgrounds in a warm or cool neutral ramp: base < surface < contrast in lightness.",
            "- `text_primary` / `text_secondary` should provide 4.5:1 contrast on their respective surfaces; `text_inverse` pairs with brand fills.",
            "- Anchor the scheme to the requested hue while keeping the overall palette cohesive and therapeutic.",
            "- Follow the anchor/complement guidance above when selecting `brand_secondary` and `accent`.",
            "- `accent` is either a higher-chroma lift of the brand hue or a neighbouring hue that still supports the story.",
            "- `border`/`ring` stay derivative of the brand family so components feel unified.",
            "- `critical` stays a clear alert red with a matching low-intensity background for contrast.",
            "- Return a palette meaningfully different from the input so back-to-back runs explore new territory.",
            "- Provide mixes that can extend to a dark theme by inverting the neutrals while keeping the brand hue intact.",
        ]
        if previous_primary:
            guidance_lines.insert(
                4,
                f"- Avoid reusing the existing brand_primary ({previous_primary}); lean into the new anchor hue.",
            )
        core_guidance = "\n".join(guidance_lines)

        user_prompt = (
            f"Anchor this run near hue {anchor_hue:.0f}° ({anchor_description}).\n"
            f"{combination_hint}\n"
            "Current palette (JSON):\n"
            f"{json.dumps(current_palette, indent=2)}\n"
            f"Guidance notes: {notes if notes else 'Invent a new, polished variation that still feels therapeutic and modern.'}\n\n"
            f"{core_guidance}"
        )

        if self._debugger.enabled:
            summary = (
                f"model: {self._model}\n"
                f"instructions:\n{system_prompt}\n\n"
                f"input:\n{user_prompt}"
            )
            self._debugger.log_text("request", summary)

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
            if self._debugger.enabled:
                payload = to_serialisable(response)
                summary = (
                    f"model: {self._model}\n"
                    f"raw_response:\n{json.dumps(payload, indent=2, ensure_ascii=False)}"
                )
                self._debugger.log_text("response", summary)

            if getattr(response, "output_text", None):
                data = json.loads(response.output_text)  # type: ignore[arg-type]
                if self._debugger.enabled:
                    self._debugger.log_json("parsed", data)
                return {k: str(v) for k, v in data.items()}

            for chunk in getattr(response, "output", []) or []:
                for item in getattr(chunk, "content", []) or []:
                    if getattr(item, "type", None) == "output_json" and getattr(item, "json", None) is not None:
                        data = item.json
                        if self._debugger.enabled:
                            self._debugger.log_json("parsed", data)
                        return {k: str(v) for k, v in data.items()}
                    if getattr(item, "type", None) == "output_text" and getattr(item, "text", None):
                        data = json.loads(item.text)
                        if self._debugger.enabled:
                            self._debugger.log_json("parsed", data)
                        return {k: str(v) for k, v in data.items()}
            raise ValueError("No usable content returned")
        except Exception as exc:  # noqa: BLE001
            logger.error("OpenAI returned an unexpected response: {error}", error=str(exc))
            raise PaletteGeneratorError("Failed to parse OpenAI response") from exc
