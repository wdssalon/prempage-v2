"""Sections route integration tests."""
from __future__ import annotations

import pytest
from fastapi import status

from app.templates.horizon.sections import (
    HorizonSectionInsertionError,
    HorizonSectionInsertionResult,
)


def test_insert_section_returns_created_response(
    api_client, monkeypatch: pytest.MonkeyPatch
) -> None:
    captured: dict[str, object] = {}

    class DummyService:
        def resolve_slot(self, position: str, target_section_id: str | None) -> str:
            captured["resolve"] = (position, target_section_id)
            return "before-section"

        def insert_section_by_slot(
            self,
            *,
            site_slug: str,
            section_key: str,
            slot: str,
            custom_prompt: str | None = None,
        ) -> HorizonSectionInsertionResult:
            captured["insert"] = (site_slug, section_key, slot, custom_prompt)
            return HorizonSectionInsertionResult(
                component_relative_path="src/components/Hero__20240101.jsx",
                import_identifier="Hero20240101",
                section_id="hero--20240101",
                slot=slot,
            )

    monkeypatch.setattr(
        "app.routes.sections.HorizonSectionLibraryService", DummyService
    )

    response = api_client.post(
        "/projects/horizon-example/sections/insert",
        json={
            "section_key": "hero",
            "position": "before",
            "target_section_id": "section-1",
        },
    )

    assert response.status_code == status.HTTP_201_CREATED
    body = response.json()
    assert body["slot"] == "before-section"
    assert body["section_id"] == "hero--20240101"
    assert captured == {
        "resolve": ("before", "section-1"),
        "insert": ("horizon-example", "hero", "before-section", None),
    }


@pytest.mark.parametrize("failing_method", ["resolve", "insert"])
def test_insert_section_propagates_bad_request(
    api_client,
    monkeypatch: pytest.MonkeyPatch,
    failing_method: str,
) -> None:
    class DummyService:
        def resolve_slot(self, position: str, target_section_id: str | None) -> str:
            if failing_method == "resolve":
                raise HorizonSectionInsertionError("invalid position")
            return "before-section"

        def insert_section_by_slot(
            self,
            *,
            site_slug: str,
            section_key: str,
            slot: str,
            custom_prompt: str | None = None,
        ) -> HorizonSectionInsertionResult:
            if failing_method == "insert":
                raise HorizonSectionInsertionError("cannot insert")
            return HorizonSectionInsertionResult(
                component_relative_path="src/components/Placeholder.jsx",
                import_identifier="Placeholder",
                section_id="placeholder",
                slot=slot,
            )

    monkeypatch.setattr(
        "app.routes.sections.HorizonSectionLibraryService", DummyService
    )

    response = api_client.post(
        "/projects/horizon-example/sections/insert",
        json={
            "section_key": "hero",
            "position": "before",
            "target_section_id": "section-1",
        },
    )

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.json()["detail"] in {"invalid position", "cannot insert"}
