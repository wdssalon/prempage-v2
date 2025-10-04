from __future__ import annotations

import pytest

from app.ai.base import PaletteGeneratorError
from app.ai.providers.openai import OpenAIPaletteGenerator


def test_generator_requires_api_key(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)

    with pytest.raises(PaletteGeneratorError):
        OpenAIPaletteGenerator()


def test_generator_uses_provided_api_key(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("OPENAI_API_KEY", "sk-test")

    calls: dict[str, str] = {}

    class DummyClient:
        def __init__(self, api_key: str) -> None:
            calls["api_key"] = api_key

    monkeypatch.setattr("app.ai.providers.openai.OpenAI", DummyClient)

    OpenAIPaletteGenerator()

    assert calls.get("api_key") == "sk-test"


def test_generator_reports_missing_dependency(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("OPENAI_API_KEY", "sk-test")

    def missing_dependency(*_: object, **__: object) -> None:
        raise ModuleNotFoundError("No module named 'httpcore'", name="httpcore")

    monkeypatch.setattr("app.ai.providers.openai.OpenAI", missing_dependency)

    with pytest.raises(PaletteGeneratorError) as excinfo:
        OpenAIPaletteGenerator()

    assert "httpcore" in str(excinfo.value)
