"""Utilities for inserting Horizon sections into site workspaces."""
from __future__ import annotations

import os
import re
from dataclasses import dataclass
from datetime import datetime, timezone
from importlib import util as importlib_util
from pathlib import Path
from typing import Any


class HorizonSectionInsertionError(RuntimeError):
    """Raised when a Horizon section cannot be inserted."""


@dataclass
class HorizonSectionInsertionResult:
    """Details about a successfully inserted section."""

    component_relative_path: str
    import_identifier: str
    section_id: str
    slot: str


HOME_PAGE_RELATIVE = Path("src/components/HomePage.jsx")
IMPORT_MARKER = "// prempage:imports"
SLOT_MARKER_TEMPLATE = "        {{/* prempage:slot:{slot_name} */}}\n"


class HorizonSectionLibraryService:
    """Clones Horizon template sections into site workspaces."""

    def __init__(self, repo_root: Path | None = None) -> None:
        self._repo_root = self._resolve_repo_root(repo_root)
        self._templates_root = (
            self._repo_root / "public-sites" / "templates" / "horizon"
        )
        self._app_boilerplate = self._templates_root / "app-boilerplate"
        self._sites_root = self._repo_root / "public-sites" / "sites"
        self._catalog = self._load_catalog()

    def insert_section_by_slot(
        self, site_slug: str, section_key: str, slot: str
    ) -> HorizonSectionInsertionResult:
        entry = self._find_section(section_key)
        site_dir = self._sites_root / site_slug
        if not site_dir.exists():
            raise HorizonSectionInsertionError(
                f"Site directory not found: {site_dir}" 
            )

        home_page_path = site_dir / HOME_PAGE_RELATIVE
        if not home_page_path.exists():
            raise HorizonSectionInsertionError(
                f"Home page file not found: {home_page_path}"
            )

        timestamp = datetime.now(timezone.utc).strftime("%Y%m%d%H%M%S")
        identifier, component_rel_path, import_path = self._copy_component(
            entry, site_dir, timestamp
        )

        homepage_text = home_page_path.read_text(encoding="utf-8")
        homepage_text = self._insert_import(
            homepage_text, identifier, import_path
        )

        section_id = self._build_section_id(entry, timestamp)
        homepage_text = self._insert_component_block(
            homepage_text, slot, identifier, section_id, section_key
        )

        home_page_path.write_text(homepage_text, encoding="utf-8")

        return HorizonSectionInsertionResult(
            component_relative_path=component_rel_path,
            import_identifier=identifier,
            section_id=section_id,
            slot=slot,
        )

    def resolve_slot(
        self, position: str, target_section_id: str | None
    ) -> str:
        if position in {"start", "end"}:
            return position

        if position not in {"before", "after"}:
            raise HorizonSectionInsertionError(
                f"Unsupported position '{position}'"
            )

        if not target_section_id:
            raise HorizonSectionInsertionError(
                "target_section_id is required for before/after positions"
            )

        canonical = target_section_id.replace("--", "-")
        return f"{position}-{canonical}"

    def _resolve_repo_root(self, override: Path | None) -> Path:
        if override is not None:
            resolved = override.expanduser().resolve()
            if (resolved / "public-sites").exists():
                return resolved
            raise HorizonSectionInsertionError(
                f"Provided repo root is invalid: {resolved}"
            )

        env_root = os.getenv("PREMPAGE_REPO_ROOT")
        if env_root:
            candidate = Path(env_root).expanduser().resolve()
            if (candidate / "public-sites").exists():
                return candidate

        backend_root = Path(__file__).resolve().parents[3]
        for candidate in (backend_root, *backend_root.parents):
            if (candidate / "public-sites").exists():
                return candidate

        raise HorizonSectionInsertionError(
            "Unable to locate repository root containing public-sites"
        )

    def _load_catalog(self) -> list[dict[str, Any]]:
        catalog_path = self._templates_root / "sections" / "catalog.py"
        spec = importlib_util.spec_from_file_location(
            "horizon_section_catalog", catalog_path
        )
        if spec is None or spec.loader is None:
            raise HorizonSectionInsertionError(
                f"Unable to import section catalog from {catalog_path}"
            )

        module = importlib_util.module_from_spec(spec)
        spec.loader.exec_module(module)  # type: ignore[assignment]

        try:
            catalog = module.SECTION_CATALOG  # type: ignore[attr-defined]
        except AttributeError as exc:  # pragma: no cover - defensive
            raise HorizonSectionInsertionError(
                "SECTION_CATALOG missing from catalog module"
            ) from exc

        if not isinstance(catalog, list):
            raise HorizonSectionInsertionError(
                "SECTION_CATALOG must be a list of sections"
            )

        return catalog

    def _find_section(self, key: str) -> dict[str, Any]:
        for entry in self._catalog:
            if entry.get("key") == key:
                return entry
        raise HorizonSectionInsertionError(f"Section '{key}' not found in catalog")

    def _copy_component(
        self, entry: dict[str, Any], site_dir: Path, timestamp: str
    ) -> tuple[str, str, str]:
        component_rel = Path(str(entry["component"]))
        source_path = self._app_boilerplate / component_rel
        if not source_path.exists():
            raise HorizonSectionInsertionError(
                f"Template component missing: {source_path}"
            )

        destination_rel = component_rel.with_name(
            f"{component_rel.stem}__{timestamp}{component_rel.suffix}"
        )
        destination_path = (site_dir / destination_rel).resolve()
        destination_path.parent.mkdir(parents=True, exist_ok=True)
        destination_path.write_text(source_path.read_text(encoding="utf-8"), encoding="utf-8")

        relative_import = destination_rel.relative_to("src").with_suffix("")
        import_path = relative_import.as_posix()
        identifier = self._sanitize_identifier(
            f"{component_rel.stem}_{timestamp}"
        )
        component_relative_path = destination_rel.as_posix()
        return identifier, component_relative_path, import_path

    def _insert_import(
        self, homepage_text: str, identifier: str, import_path: str
    ) -> str:
        marker_idx = homepage_text.find(IMPORT_MARKER)
        if marker_idx == -1:
            raise HorizonSectionInsertionError(
                "HomePage.jsx is missing the '// prempage:imports' marker"
            )

        import_line = f"import {identifier} from \"@/{import_path}\";\n"
        insertion_point = marker_idx + len(IMPORT_MARKER)
        return (
            homepage_text[:insertion_point]
            + "\n"
            + import_line
            + homepage_text[insertion_point:]
        )

    def _insert_component_block(
        self,
        homepage_text: str,
        slot: str,
        identifier: str,
        section_id: str,
        section_key: str,
    ) -> str:
        marker_line = SLOT_MARKER_TEMPLATE.format(slot_name=slot)
        idx = homepage_text.find(marker_line)
        if idx == -1:
            raise HorizonSectionInsertionError(
                f"Slot marker '{marker_line.strip()}' not found in HomePage.jsx"
            )

        block = (
            f"        {{/* prempage:section:{section_key}:{section_id}:start */}}\n"
            f"        <{identifier} sectionId=\"{section_id}\" variant={{variant}} />\n"
            f"        {{/* prempage:section:{section_key}:{section_id}:end */}}\n"
        )

        insertion_point = idx + len(marker_line)
        return (
            homepage_text[:insertion_point]
            + block
            + homepage_text[insertion_point:]
        )

    @staticmethod
    def _sanitize_identifier(value: str) -> str:
        parts = re.split(r"[^0-9a-zA-Z]+", value)
        collapsed = "".join(part[:1].upper() + part[1:] for part in parts if part)
        return collapsed or "Section"

    @staticmethod
    def _build_section_id(entry: dict[str, Any], timestamp: str) -> str:
        base = str(entry.get("section_id") or entry.get("key") or "section")
        safe_base = re.sub(r"[^0-9a-zA-Z_-]+", "-", base).strip("-") or "section"
        return f"{safe_base}--{timestamp}"


__all__ = [
    "HorizonSectionLibraryService",
    "HorizonSectionInsertionResult",
    "HorizonSectionInsertionError",
]
