"""Base interfaces for AI-powered features."""
from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Mapping


class PaletteGeneratorError(RuntimeError):
    """Raised when an AI palette generator cannot produce a palette."""


class PaletteGenerator(ABC):
    """Interface implemented by palette generation backends."""

    @abstractmethod
    def generate(self, current_palette: Mapping[str, str], notes: str | None) -> Mapping[str, str]:
        """Return a new palette derived from the current palette and optional notes."""

