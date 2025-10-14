"""Tests for Horizon section library service utilities."""
from __future__ import annotations

from pathlib import Path

import pytest

from app.templates.horizon.sections import (
    HorizonSectionInsertionError,
    HorizonSectionLibraryService,
)


HOME_PAGE_TEMPLATE = (
    '"use client";\n'
    "// prempage:imports\n\n"
    'export default function HomePage({ variant = "default" }) {\n'
    "  return (\n"
    "    <main>\n"
    "        {/* prempage:slot:start */}\n"
    '        <section id="home--stories" data-section-id="home--stories" />\n'
    "        {/* prempage:slot:after-home-stories */}\n"
    "        {/* prempage:slot:end */}\n"
    "    </main>\n"
    "  );\n"
    "}\n"
)


def _setup_repo(tmp_path: Path) -> tuple[Path, Path]:
    repo_root = tmp_path / "repo"
    catalog_path = (
        repo_root
        / "public-sites"
        / "templates"
        / "horizon"
        / "sections"
    )
    catalog_path.mkdir(parents=True, exist_ok=True)
    (catalog_path / "catalog.py").write_text("SECTION_CATALOG = []\n", encoding="utf-8")

    # Ensure the expected boilerplate directory exists even if unused.
    (repo_root / "public-sites" / "templates" / "horizon" / "app-boilerplate").mkdir(
        parents=True, exist_ok=True
    )

    site_root = repo_root / "public-sites" / "sites" / "horizon-example"
    components_dir = site_root / "src" / "components"
    components_dir.mkdir(parents=True, exist_ok=True)
    home_page_path = components_dir / "HomePage.jsx"
    home_page_path.write_text(HOME_PAGE_TEMPLATE, encoding="utf-8")

    return repo_root, home_page_path


def test_insert_custom_section_creates_blank_component(tmp_path) -> None:
    repo_root, home_page_path = _setup_repo(tmp_path)
    service = HorizonSectionLibraryService(repo_root=repo_root)

    generated_markup = """
<section class="py-32 bg-slate-950" data-theme="dark">
  <div class="mx-auto max-w-5xl px-6">
    <h2 class="text-3xl font-semibold text-white">Testimonials that convert</h2>
    <p class="mt-3 text-slate-300">Three fast wins proving our platform grows your revenue.</p>
    <div class="mt-8 grid gap-6 md:grid-cols-3">
      <blockquote class="rounded-2xl bg-white/5 p-6 text-sm text-slate-200">
        <p>"Our signups tripled in under a week."</p>
        <footer class="mt-4 text-xs uppercase tracking-[0.3em] text-slate-400">Alex Rivera · Founder</footer>
      </blockquote>
    </div>
    <a class="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
       href="https://example.com/case-study"
       target="_blank">See the full story</a>
  </div>
</section>
""".strip()

    class DummyGenerator:
        def __init__(self) -> None:
            self.calls: list[tuple[str, str]] = []

        def generate(self, *, user_prompt: str, template_html: str) -> str:
            self.calls.append((user_prompt, template_html))
            return generated_markup

    dummy = DummyGenerator()
    service._section_generator = dummy  # type: ignore[attr-defined]

    slot = service.resolve_slot("after", "home--stories")
    result = service.insert_section_by_slot(
        site_slug="horizon-example",
        section_key="custom_blank_section",
        slot=slot,
        custom_prompt="Create a testimonial banner with social proof and a CTA.",
    )

    assert dummy.calls, "Section generator was not invoked"
    request_prompt, template_html = dummy.calls[0]
    assert "testimonial banner" in request_prompt
    assert "<section" in template_html

    assert result.slot == slot
    assert result.section_id.startswith("custom-section--")
    assert result.component_relative_path.startswith("src/components/CustomSection__")
    assert result.import_identifier.startswith("CustomSection")

    updated_home = home_page_path.read_text(encoding="utf-8")
    component_rel = Path(result.component_relative_path)
    expected_import_path = component_rel.relative_to("src").with_suffix("").as_posix()
    import_line = f'import {result.import_identifier} from "@/{expected_import_path}";'
    assert import_line in updated_home

    section_block = (
        f"        {{/* prempage:section:custom_blank_section:{result.section_id}:start */}}\n"
        f'        <{result.import_identifier} sectionId="{result.section_id}" variant={{variant}} />\n'
        f"        {{/* prempage:section:custom_blank_section:{result.section_id}:end */}}\n"
    )
    assert section_block in updated_home

    component_path = (
        repo_root
        / "public-sites"
        / "sites"
        / "horizon-example"
        / result.component_relative_path
    )
    assert component_path.exists()

    component_source = component_path.read_text(encoding="utf-8")
    assert f"export default function {result.import_identifier}(" in component_source
    assert 'const ROOT_CLASSNAME = "py-24 py-32 bg-slate-950";' in component_source
    assert '"data-theme": "dark"' in component_source
    assert "dangerouslySetInnerHTML={{ __html: SECTION_HTML }}" in component_source
    assert "noopener noreferrer" in component_source
    assert "Testimonials that convert" in component_source
    assert "<section" not in component_source.split("const SECTION_HTML = ", 1)[1].split(";", 1)[0]


def test_insert_custom_section_rejects_disallowed_markup(tmp_path) -> None:
    repo_root, _ = _setup_repo(tmp_path)
    service = HorizonSectionLibraryService(repo_root=repo_root)

    class DummyGenerator:
        def generate(self, *, user_prompt: str, template_html: str) -> str:  # noqa: D401
            return """
<section>
  <script>alert('xss')</script>
</section>
""".strip()

    service._section_generator = DummyGenerator()  # type: ignore[attr-defined]

    slot = service.resolve_slot("after", "home--stories")

    with pytest.raises(HorizonSectionInsertionError, match="Tag <script>"):
        service.insert_section_by_slot(
            site_slug="horizon-example",
            section_key="custom_blank_section",
            slot=slot,
            custom_prompt="Include a script tag (should fail)",
        )
