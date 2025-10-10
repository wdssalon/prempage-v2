"""Service responsible for generating and applying Horizon palettes."""
from __future__ import annotations

import json
import subprocess
import sys
import os
from datetime import datetime, timezone
from pathlib import Path
from tempfile import NamedTemporaryFile
from typing import Mapping

from loguru import logger
from pydantic import ValidationError

from app.ai.base import PaletteGenerator, PaletteGeneratorError
from app.ai.providers.openai import DEFAULT_OPENAI_MODEL, OpenAIPaletteGenerator
from app.errors import InternalServerError, NotFoundError, ServiceUnavailableError
from app.templates.horizon.models import (
    HorizonPalette,
    HorizonPaletteSwapRequest,
    HorizonPaletteSwapResponse,
)


class HorizonSiteNotFoundError(NotFoundError):
    """Raised when the requested Horizon site workspace is missing."""


class HorizonPaletteGenerationError(ServiceUnavailableError):
    """Raised when a Horizon palette cannot be generated or validated."""


class HorizonPaletteApplyError(InternalServerError):
    """Raised when applying a Horizon palette via the theme script fails."""


class HorizonPaletteService:
    """Coordinates palette generation and application for Horizon sites."""

    def __init__(
        self,
        repo_root: Path | None = None,
        generator: PaletteGenerator | None = None,
    ) -> None:
        self._repo_root = self._resolve_repo_root(repo_root)
        self._sites_dir = self._repo_root / "public-sites" / "sites"
        self._apply_theme_script = (
            self._repo_root
            / "public-sites"
            / "templates"
            / "horizon"
            / "cookiecutter-config"
            / "scripts"
            / "apply_theme.py"
        )
        try:
            self._generator = generator or OpenAIPaletteGenerator(
                model=DEFAULT_OPENAI_MODEL
            )
        except PaletteGeneratorError as exc:
            raise HorizonPaletteGenerationError(str(exc)) from exc

    def swap_palette(
        self, site_slug: str, payload: HorizonPaletteSwapRequest
    ) -> HorizonPaletteSwapResponse:
        site_dir = self._sites_dir / site_slug
        if not site_dir.exists():
            raise HorizonSiteNotFoundError(f"Site directory not found: {site_dir}")

        current_palette = self._load_palette(site_dir)
        if payload.notes:
            logger.info(
                "Generating Horizon palette for '{slug}' with notes: {notes}",
                slug=site_slug,
                notes=payload.notes,
            )
        candidate_palette = self._generate_palette(current_palette, payload.notes)
        self._apply_palette(site_slug, candidate_palette)
        updated_palette = self._load_palette(site_dir)
        logger.info(
            "Applied Horizon palette swap for site '{slug}'", slug=site_slug
        )
        return HorizonPaletteSwapResponse(
            palette=updated_palette,
            applied_at=datetime.now(timezone.utc),
        )

    def _load_palette(self, site_dir: Path) -> HorizonPalette:
        config_path = site_dir / "site-config.json"
        if not config_path.exists():
            raise HorizonSiteNotFoundError(
                f"site-config.json missing at {config_path}"
            )

        try:
            config = json.loads(config_path.read_text(encoding="utf-8"))
        except json.JSONDecodeError as exc:
            raise HorizonPaletteGenerationError(
                f"Invalid JSON in {config_path}"
            ) from exc

        colors = config.get("colors")
        if not isinstance(colors, Mapping):
            raise HorizonPaletteGenerationError(
                "site-config.json does not contain a valid colors mapping",
            )

        try:
            return HorizonPalette(**colors)
        except ValidationError as exc:
            raise HorizonPaletteGenerationError(
                "Existing palette is invalid",
            ) from exc
        except TypeError as exc:
            raise HorizonPaletteGenerationError(
                "Existing palette has unexpected structure",
            ) from exc

    def _generate_palette(
        self, current: HorizonPalette, notes: str | None
    ) -> HorizonPalette:
        source: Mapping[str, str] = current.model_dump()
        try:
            raw_palette = self._generator.generate(source, notes)
        except PaletteGeneratorError as exc:
            raise HorizonPaletteGenerationError(str(exc)) from exc

        try:
            return HorizonPalette(**raw_palette)
        except ValidationError as exc:
            raise HorizonPaletteGenerationError(
                "Generated palette failed validation",
            ) from exc
        except TypeError as exc:
            raise HorizonPaletteGenerationError(
                "Generated palette has unexpected structure",
            ) from exc

    def _apply_palette(self, site_slug: str, palette: HorizonPalette) -> None:
        if not self._apply_theme_script.exists():
            raise HorizonPaletteApplyError("apply_theme.py script is missing")

        temp_path: Path | None = None
        with NamedTemporaryFile("w", suffix=".json", delete=False, encoding="utf-8") as temp_file:
            json.dump(palette.model_dump(), temp_file)
            temp_file.flush()
            temp_path = Path(temp_file.name)

        try:
            completed = subprocess.run(
                [
                    sys.executable,
                    str(self._apply_theme_script),
                    "--site",
                    site_slug,
                    "--palette",
                    str(temp_path),
                ],
                check=True,
                cwd=self._repo_root,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
            )
        except subprocess.CalledProcessError as exc:  # noqa: BLE001
            logger.error(
                "apply_theme.py failed for Horizon site '{slug}': {stderr}",
                slug=site_slug,
                stderr=exc.stderr.strip(),
            )
            raise HorizonPaletteApplyError("Theme application failed") from exc
        finally:
            if temp_path is not None:
                try:
                    temp_path.unlink(missing_ok=True)
                except FileNotFoundError:
                    pass

        if completed.stdout:
            logger.debug(
                "apply_theme.py stdout for Horizon site '{slug}': {stdout}",
                slug=site_slug,
                stdout=completed.stdout.strip(),
            )
        if completed.stderr:
            logger.warning(
                "apply_theme.py stderr for Horizon site '{slug}': {stderr}",
                slug=site_slug,
                stderr=completed.stderr.strip(),
            )

    def _resolve_repo_root(self, override: Path | None) -> Path:
        candidates: list[Path] = []

        if override is not None:
            candidates.append(override)

        env_override = os.getenv("PREMPAGE_REPO_ROOT")
        if env_override:
            candidates.append(Path(env_override))

        discovered = self._discover_repo_root()
        if discovered is not None:
            candidates.append(discovered)

        logger.debug(
            "Evaluating repo root candidates for Horizon palette service: {}",
            [str(candidate) for candidate in candidates],
        )

        for candidate in candidates:
            resolved = candidate.expanduser().resolve()
            if self._is_valid_repo_root(resolved):
                logger.info(
                    "Resolved Horizon repo root to {}", resolved,
                )
                return resolved

            logger.debug(
                "Skipping candidate {} (missing public-sites directory)", resolved,
            )

        message = "Unable to locate repository root with a public-sites directory"
        logger.error(message)
        raise HorizonPaletteGenerationError(message)

    @staticmethod
    def _discover_repo_root() -> Path | None:
        for candidate in Path(__file__).resolve().parents:
            if HorizonPaletteService._is_valid_repo_root(candidate):
                return candidate
        return None

    @staticmethod
    def _is_valid_repo_root(path: Path) -> bool:
        return path.is_dir() and (path / "public-sites").is_dir()
