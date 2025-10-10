from __future__ import annotations

import pytest
from app.errors import AppError

from app.models.overlay import OverlayEditEvent
from app.services.overlay import apply_overlay_edit


def _make_event(ppid: str, text: str) -> OverlayEditEvent:
    return OverlayEditEvent(
        projectSlug="horizon-example",
        payload={"ppid": ppid, "text": text},
        meta={"reason": "enter"},
    )


def test_apply_overlay_edit_updates_target_text(overlay_repo):
    event = _make_event(overlay_repo.primary_ppid, "Therapy that meets you where you are")

    result = apply_overlay_edit(event)

    assert result.relative_path.endswith("Hero.jsx")
    assert result.updated_text == "Therapy that meets you where you are"
    assert result.previous_text.strip() == "A Safe Space for Your"

    updated_content = overlay_repo.component_path.read_text(encoding="utf-8")
    assert "Therapy that meets you where you are" in updated_content


def test_apply_overlay_edit_converts_newlines_to_br(overlay_repo):
    multiline_text = "Support built for you\nCompassion on day one"
    event = _make_event(overlay_repo.body_ppid, multiline_text)

    result = apply_overlay_edit(event)

    updated_content = overlay_repo.component_path.read_text(encoding="utf-8")
    assert "Support built for you<br />Compassion on day one" in updated_content
    assert result.updated_text == multiline_text
    assert result.previous_text.strip() == "Progressive therapy rooted in compassion."


def test_apply_overlay_edit_rejects_unknown_namespace(overlay_repo):
    event = _make_event("markdown:some/file.md#heading", "New heading")

    with pytest.raises(AppError) as exc:
        apply_overlay_edit(event)

    assert exc.value.status_code == 422


def test_apply_overlay_edit_missing_node(overlay_repo):
    event = _make_event(
        "code:public-sites/sites/horizon-example/src/components/Hero.jsx#missing",
        "Text",
    )

    with pytest.raises(AppError) as exc:
        apply_overlay_edit(event)

    assert exc.value.status_code == 404
