from __future__ import annotations

from fastapi import status

from app.models.overlay import OverlayEditEvent


def test_overlay_endpoint_applies_edit(api_client, overlay_repo):
    payload = OverlayEditEvent(
        projectSlug="horizon-example",
        payload={
            "ppid": overlay_repo.primary_ppid,
            "text": "Therapy that feels like you",
        },
        meta={"reason": "enter"},
    ).model_dump(by_alias=True)

    response = api_client.post("/overlay/events/edit", json=payload)

    assert response.status_code == status.HTTP_200_OK
    body = response.json()
    assert body["status"] == "applied"
    assert body["relativePath"].endswith("Hero.jsx")
    assert body["updatedText"] == "Therapy that feels like you"

    updated = overlay_repo.component_path.read_text(encoding="utf-8")
    assert "Therapy that feels like you" in updated


def test_overlay_endpoint_rejects_invalid_namespace(api_client):
    payload = OverlayEditEvent(
        projectSlug="horizon-example",
        payload={
            "ppid": "cms:public-sites/sites/horizon-example/src/components/Hero.jsx#heading",
            "text": "Invalid",
        },
        meta={"reason": "enter"},
    ).model_dump(by_alias=True)

    response = api_client.post("/overlay/events/edit", json=payload)

    assert response.status_code == status.HTTP_422_UNPROCESSABLE_CONTENT
