"""Utilities for inserting Horizon sections into site workspaces."""
from __future__ import annotations

import html
import json
import os
import re
from dataclasses import dataclass
from datetime import datetime, timezone
from importlib import util as importlib_util
from pathlib import Path
from textwrap import dedent
from typing import Any
from html.parser import HTMLParser

from app.ai.base import SectionGenerator, SectionGeneratorError
from app.ai.providers.openai import OpenAISectionGenerator
from app.errors import BadRequestError


class HorizonSectionInsertionError(BadRequestError):
    """Raised when a Horizon section cannot be inserted."""


@dataclass
class HorizonSectionInsertionResult:
    """Details about a successfully inserted section."""

    component_relative_path: str
    import_identifier: str
    section_id: str
    slot: str


@dataclass
class SanitisedSectionMarkup:
    """Sanitised HTML fragments for a generated custom section."""

    root_class: str
    root_attributes: dict[str, str]
    inner_html: str


class _SectionHTMLValidator(HTMLParser):
    """Parse and sanitise AI-generated HTML for custom sections."""

    FORBIDDEN_TAGS = {
        "script",
        "style",
        "iframe",
        "object",
        "embed",
        "link",
        "meta",
    }
    VOID_ELEMENTS = {
        "area",
        "base",
        "br",
        "col",
        "embed",
        "hr",
        "img",
        "input",
        "link",
        "meta",
        "param",
        "source",
        "track",
        "wbr",
    }
    SVG_ELEMENTS = {
        "svg",
        "path",
        "circle",
        "rect",
        "g",
        "defs",
        "use",
        "mask",
        "clipPath",
        "polygon",
        "polyline",
        "line",
        "ellipse",
    }

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.errors: list[str] = []
        self.root_seen = False
        self.stack: list[str] = []
        self.root_class_tokens: list[str] = []
        self.root_attrs: dict[str, str] = {}
        self.inner_chunks: list[str] = []

    def handle_starttag(
        self,
        tag: str,
        attrs: list[tuple[str, str | None]],
    ) -> None:
        self._handle_start(tag, attrs, is_self_closing=False)

    def handle_startendtag(
        self,
        tag: str,
        attrs: list[tuple[str, str | None]],
    ) -> None:
        self._handle_start(tag, attrs, is_self_closing=True)

    def _handle_start(
        self,
        tag: str,
        attrs: list[tuple[str, str | None]],
        *,
        is_self_closing: bool,
    ) -> None:
        lower_tag = tag.lower()
        if lower_tag in self.FORBIDDEN_TAGS:
            self.errors.append(f"Tag <{lower_tag}> is not allowed in generated sections.")
            return

        if not self.root_seen:
            if lower_tag != "section":
                self.errors.append("Generated HTML must begin with a <section> element.")
                return
            if is_self_closing:
                self.errors.append("The <section> element cannot be self-closing.")
                return
            self.root_seen = True
            self.stack.append("section")
            class_attr = next(
                (value or "" for name, value in attrs if name and name.lower() == "class"),
                "",
            )
            class_tokens = self._normalise_class(class_attr)
            if "py-24" not in class_tokens:
                class_tokens.insert(0, "py-24")
            self.root_class_tokens = self._dedupe_tokens(class_tokens)
            root_attrs = self._filter_attrs(tag, attrs, is_root=True)
            self.root_attrs = root_attrs
            return

        if not self.stack:
            # Whitespace is fine outside the section; anything else is rejected.
            if any((value or "").strip() for _, value in attrs):
                self.errors.append("Generated HTML cannot include elements outside the root <section>.")
            return

        sanitised_attrs = self._filter_attrs(tag, attrs, is_root=False)
        is_void = lower_tag in self.VOID_ELEMENTS or is_self_closing
        start_tag = self._build_start_tag(tag, sanitised_attrs, is_void)
        self.inner_chunks.append(start_tag)
        if not is_void:
            self.stack.append(lower_tag)

    def _filter_attrs(
        self,
        tag: str,
        attrs: list[tuple[str, str | None]],
        *,
        is_root: bool,
    ) -> dict[str, str]:
        allowed: dict[str, str] = {}
        svg_like = tag in self.SVG_ELEMENTS
        for original_name, value in attrs:
            if not original_name:
                continue
            if value is None:
                continue
            stripped = value.strip()
            if not stripped:
                continue
            lower_name = original_name.lower()
            if lower_name.startswith("on"):
                continue
            if lower_name == "style":
                continue
            if is_root:
                if (
                    lower_name.startswith("data-")
                    or lower_name.startswith("aria-")
                    or lower_name == "role"
                ):
                    allowed[original_name] = stripped
                continue
            if svg_like:
                allowed[original_name] = stripped
                continue
            if lower_name.startswith("data-") or lower_name.startswith("aria-"):
                allowed[original_name] = stripped
                continue
            if lower_name == "class":
                allowed[original_name] = stripped
                continue
            if lower_name == "href":
                lowered = stripped.lower()
                if lowered.startswith("javascript:"):
                    continue
                allowed[original_name] = stripped
                continue
            if lower_name == "src":
                lowered = stripped.lower()
                if lowered.startswith("javascript:"):
                    continue
                if lowered.startswith("data:") and not lowered.startswith("data:image/"):
                    continue
                allowed[original_name] = stripped
                continue
            if lower_name in {
                "target",
                "rel",
                "alt",
                "title",
                "role",
                "id",
                "type",
                "name",
                "value",
                "for",
                "placeholder",
                "cols",
                "rows",
                "width",
                "height",
            }:
                allowed[original_name] = stripped
                continue
        if not is_root and svg_like:
            return allowed
        # Ensure links opened in new tabs remain safe.
        if not is_root and any(k.lower() == "target" for k in allowed):
            target_key = next((k for k in allowed if k.lower() == "target"), None)
            if target_key and allowed[target_key].lower() == "_blank":
                rel_key = next((k for k in allowed if k.lower() == "rel"), None)
                rel_tokens: list[str] = []
                if rel_key:
                    rel_tokens.extend(self._normalise_class(allowed[rel_key]))
                rel_tokens.extend(["noopener", "noreferrer"])
                allowed["rel"] = " ".join(self._dedupe_tokens(rel_tokens))
        if not is_root and tag.lower() == "img":
            if not any(k.lower() == "alt" for k in allowed):
                allowed["alt"] = ""
        return allowed

    def handle_endtag(self, tag: str) -> None:
        lower_tag = tag.lower()
        if not self.root_seen:
            if tag.strip():
                self.errors.append("Closing tag encountered before opening <section>.")
            return

        if lower_tag == "section":
            if not self.stack or self.stack[-1] != "section":
                self.errors.append("Mismatched </section> tag.")
                return
            self.stack.pop()
            return

        if lower_tag in self.VOID_ELEMENTS:
            return

        if not self.stack:
            self.errors.append(f"Unexpected closing tag </{lower_tag}>.")
            return

        expected = self.stack.pop()
        if expected != lower_tag:
            self.errors.append(
                f"Mismatched closing tag </{lower_tag}>; expected </{expected}>."
            )
        self.inner_chunks.append(f"</{tag}>")

    def handle_data(self, data: str) -> None:
        if not self.root_seen:
            if data.strip():
                self.errors.append("Generated HTML must start with a <section> element.")
            return

        if not self.stack:
            if data.strip():
                self.errors.append("Content outside the closing </section> is not allowed.")
            return

        if not data:
            return

        self.inner_chunks.append(html.escape(data, quote=False))

    def handle_comment(self, data: str) -> None:
        # Drop comments to keep output lean.
        return

    def _build_start_tag(
        self,
        tag: str,
        attrs: dict[str, str],
        is_self_closing: bool,
    ) -> str:
        attr_text = self._format_attrs(attrs)
        if attr_text:
            attr_segment = f" {attr_text}"
        else:
            attr_segment = ""
        if is_self_closing:
            return f"<{tag}{attr_segment} />"
        return f"<{tag}{attr_segment}>"

    @staticmethod
    def _format_attrs(attrs: dict[str, str]) -> str:
        if not attrs:
            return ""
        parts: list[str] = []
        for name, value in attrs.items():
            parts.append(f'{name}="{html.escape(value, quote=True)}"')
        return " ".join(parts)

    @staticmethod
    def _normalise_class(value: str) -> list[str]:
        tokens = [token for token in re.split(r"\s+", value.strip()) if token]
        return tokens

    @staticmethod
    def _dedupe_tokens(tokens: list[str]) -> list[str]:
        seen: set[str] = set()
        result: list[str] = []
        for token in tokens:
            if token not in seen:
                seen.add(token)
                result.append(token)
        return result

    def result(self) -> SanitisedSectionMarkup:
        if not self.root_seen:
            raise HorizonSectionInsertionError("Generated HTML must contain a <section> root.")
        if self.stack:
            # Only the root <section> should remain on the stack once parsing is finished.
            remaining = [element for element in self.stack if element != "section"]
            if remaining:
                raise HorizonSectionInsertionError("Generated HTML has unclosed tags.")
        if self.errors:
            raise HorizonSectionInsertionError(self.errors[0])

        inner_html = "".join(self.inner_chunks).strip()
        if not inner_html:
            raise HorizonSectionInsertionError("Generated HTML was empty after sanitisation.")

        class_tokens = list(self.root_class_tokens)
        if CUSTOM_SECTION_DEFAULT_CLASS not in class_tokens:
            class_tokens.insert(0, CUSTOM_SECTION_DEFAULT_CLASS)
        class_value = " ".join(self._dedupe_tokens(class_tokens)) or CUSTOM_SECTION_DEFAULT_CLASS

        return SanitisedSectionMarkup(
            root_class=class_value,
            root_attributes=self.root_attrs,
            inner_html=inner_html,
        )


def _sanitise_custom_section_html(markup: str) -> SanitisedSectionMarkup:
    """Validate and sanitise AI-generated custom section HTML."""
    parser = _SectionHTMLValidator()
    parser.feed(markup)
    parser.close()
    return parser.result()


HOME_PAGE_RELATIVE = Path("src/components/HomePage.jsx")
IMPORT_MARKER = "// prempage:imports"
SLOT_MARKER_TEMPLATE = "        {{/* prempage:slot:{slot_name} */}}\n"
CUSTOM_SECTION_KEY = "custom_blank_section"
CUSTOM_SECTION_BASENAME = "CustomSection"
CUSTOM_SECTION_DEFAULT_CLASS = "py-24"
CUSTOM_SECTION_TEMPLATE_HTML = dedent(
    """\
    <section class="py-24">
      <div class="mx-auto max-w-5xl px-6">
        <!-- Replace this comment with HTML content that fits the Horizon visual language. -->
      </div>
    </section>
    """
).strip()
SECTION_ID_PLACEHOLDER = "__SECTION_ID__"
SECTION_VARIANT_PLACEHOLDER = "__SECTION_VARIANT__"


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
        self._section_generator: SectionGenerator | None = None

    def insert_section_by_slot(
        self,
        site_slug: str,
        section_key: str,
        slot: str,
        custom_prompt: str | None = None,
    ) -> HorizonSectionInsertionResult:
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
        if section_key == CUSTOM_SECTION_KEY:
            if not custom_prompt or not custom_prompt.strip():
                raise HorizonSectionInsertionError(
                    "custom_section_prompt is required for custom sections"
                )
            section_id = self._build_section_id(
                {"section_id": "custom-section", "key": CUSTOM_SECTION_KEY},
                timestamp,
            )
            generator = self._resolve_section_generator()
            try:
                generated_html = generator.generate(
                    user_prompt=custom_prompt.strip(),
                    template_html=CUSTOM_SECTION_TEMPLATE_HTML,
                )
            except SectionGeneratorError as exc:  # pragma: no cover - provider errors
                raise HorizonSectionInsertionError(
                    f"Section generator failed: {exc}"
                ) from exc

            try:
                sanitised = _sanitise_custom_section_html(generated_html)
            except HorizonSectionInsertionError:
                raise
            except Exception as exc:  # noqa: BLE001
                raise HorizonSectionInsertionError(
                    "Generated HTML could not be validated"
                ) from exc

            (
                identifier,
                component_rel_path,
                import_path,
            ) = self._write_custom_section_component(
                site_dir,
                timestamp,
                sanitised,
            )
        else:
            entry = self._find_section(section_key)
            (
                identifier,
                component_rel_path,
                import_path,
            ) = self._copy_component(entry, site_dir, timestamp)
            section_id = self._build_section_id(entry, timestamp)

        homepage_text = home_page_path.read_text(encoding="utf-8")
        homepage_text = self._insert_import(
            homepage_text, identifier, import_path
        )

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

    def _resolve_section_generator(self) -> SectionGenerator:
        if self._section_generator is not None:
            return self._section_generator

        provider = os.getenv(
            "PREMPAGE_SECTION_GENERATOR_PROVIDER",
            "openai",
        ).lower()

        if provider != "openai":
            raise HorizonSectionInsertionError(
                f"Unsupported section generator provider '{provider}'"
            )

        try:
            generator = OpenAISectionGenerator()
        except SectionGeneratorError as exc:
            raise HorizonSectionInsertionError(str(exc)) from exc

        self._section_generator = generator
        return generator

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

    def _write_custom_section_component(
        self,
        site_dir: Path,
        timestamp: str,
        markup: SanitisedSectionMarkup,
    ) -> tuple[str, str, str]:
        component_rel = Path("src/components") / (
            f"{CUSTOM_SECTION_BASENAME}__{timestamp}.jsx"
        )
        destination_path = (site_dir / component_rel).resolve()
        destination_path.parent.mkdir(parents=True, exist_ok=True)

        identifier = self._sanitize_identifier(component_rel.stem)
        component_source = self._render_custom_section_component(identifier, markup)
        destination_path.write_text(component_source, encoding="utf-8")

        relative_import = component_rel.relative_to("src").with_suffix("")
        import_path = relative_import.as_posix()

        return identifier, component_rel.as_posix(), import_path

    def _render_custom_section_component(
        self,
        identifier: str,
        markup: SanitisedSectionMarkup,
    ) -> str:
        root_class_literal = json.dumps(markup.root_class, ensure_ascii=False)
        root_attributes_literal = json.dumps(
            markup.root_attributes,
            ensure_ascii=False,
            indent=2,
        )
        inner_html_literal = json.dumps(markup.inner_html, ensure_ascii=False)

        lines = [
            "\"use client\";",
            "",
            f"const ROOT_CLASSNAME = {root_class_literal};",
            f"const ROOT_ATTRIBUTES = {root_attributes_literal};",
            f"const SECTION_HTML = {inner_html_literal};",
            "",
            f"export default function {identifier}({{ sectionId, variant = \"default\" }}) {{",
            "  return (",
            "    <section",
            "      id={sectionId}",
            "      data-section-id={sectionId}",
            "      data-variant={variant}",
            "      className={ROOT_CLASSNAME}",
            "      {...ROOT_ATTRIBUTES}",
            "      dangerouslySetInnerHTML={{ __html: SECTION_HTML }}",
            "    />",
            "  );",
            "}",
            "",
        ]

        return "\n".join(lines)


__all__ = [
    "HorizonSectionLibraryService",
    "HorizonSectionInsertionResult",
    "HorizonSectionInsertionError",
]
