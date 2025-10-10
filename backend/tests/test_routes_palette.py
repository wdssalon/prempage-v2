"""Palette route integration tests."""
from __future__ import annotations

from datetime import datetime, timezone

import pytest
from fastapi import status

from app.templates.horizon.models import (
    HorizonPalette,
    HorizonPaletteSwapResponse,
)
from app.templates.horizon.service import (
    HorizonPaletteApplyError,
    HorizonPaletteGenerationError,
    HorizonPaletteService,
    HorizonSiteNotFoundError,
)


def _sample_response() -> HorizonPaletteSwapResponse:
    return HorizonPaletteSwapResponse(
        palette=HorizonPalette(
            bg_base="#111111",
            bg_surface="#222222",
            bg_contrast="#000000",
            text_primary="#111111",
            text_secondary="#444444",
            text_inverse="#ffffff",
            brand_primary="#0066ff",
            brand_secondary="#0044aa",
            accent="#ff3366",
            border="#e2e8f0",
            ring="#2563eb",
            critical="#dc2626",
            critical_contrast="#ffffff",
        ),
        applied_at=datetime(2024, 1, 1, 12, 0, tzinfo=timezone.utc),
    )


def test_swap_palette_returns_response_payload(
    api_client, monkeypatch: pytest.MonkeyPatch
) -> None:
    captured: dict[str, object] = {}

    class DummyService(HorizonPaletteService):
        def __init__(self) -> None:  # pragma: no cover - stub wiring
            pass

        def swap_palette(self, slug: str, payload):  # type: ignore[override]
            captured["slug"] = slug
            captured["notes"] = payload.notes
            return _sample_response()

    monkeypatch.setattr("app.routes.palette.HorizonPaletteService", DummyService)

    response = api_client.post(
        "/sites/horizon-example/palette/swap",
        json={"notes": "refresh"},
    )

    assert response.status_code == status.HTTP_200_OK
    body = response.json()
    assert body["palette"]["brand_primary"] == "#0066ff"
    assert body["applied_at"] in {
        "2024-01-01T12:00:00+00:00",
        "2024-01-01T12:00:00Z",
    }
    assert captured == {"slug": "horizon-example", "notes": "refresh"}


@pytest.mark.parametrize(
    ("exception_cls", "status_code", "error_code"),
    [
        (HorizonSiteNotFoundError, status.HTTP_404_NOT_FOUND, "not_found"),
        (HorizonPaletteGenerationError, status.HTTP_502_BAD_GATEWAY, "service_unavailable"),
        (HorizonPaletteApplyError, status.HTTP_500_INTERNAL_SERVER_ERROR, "internal_error"),
    ],
)
def test_swap_palette_error_mapping(
    api_client,
    monkeypatch: pytest.MonkeyPatch,
    exception_cls: type[Exception],
    status_code: int,
    error_code: str,
) -> None:
    class DummyService(HorizonPaletteService):
        def __init__(self) -> None:  # pragma: no cover - stub wiring
            pass

        def swap_palette(self, slug: str, payload):  # type: ignore[override]
            raise exception_cls("boom")

    monkeypatch.setattr("app.routes.palette.HorizonPaletteService", DummyService)

    response = api_client.post(
        "/sites/horizon-example/palette/swap",
        json={"notes": "refresh"},
    )

    assert response.status_code == status_code
    assert response.json() == {"detail": "boom", "error_code": error_code}
