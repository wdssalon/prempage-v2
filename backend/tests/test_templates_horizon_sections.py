"""Tests for Horizon section library service utilities."""
from __future__ import annotations

from pathlib import Path

from app.templates.horizon.sections import HorizonSectionLibraryService


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

    slot = service.resolve_slot("after", "home--stories")
    result = service.insert_section_by_slot(
        site_slug="horizon-example",
        section_key="custom_blank_section",
        slot=slot,
    )

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
    assert 'function CustomSection({ sectionId, variant = "default" })' in component_source
    assert "data-section-id={sectionId}" in component_source
    assert "Build out your custom layout here" in component_source
