"""Shared fixtures for backend tests."""
from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Iterator

import pytest
from fastapi.testclient import TestClient

# Ensure the backend package root is importable when running via uv/pytest.
BACKEND_ROOT = Path(__file__).resolve().parents[1]
if str(BACKEND_ROOT) not in __import__("sys").path:
    __import__("sys").path.insert(0, str(BACKEND_ROOT))

from app import create_app


EXAMPLE_COMPONENT = """"use client";

export default function Hero() {
  return (
    <section>
      <h1>
        <span data-ppid="code:public-sites/sites/horizon-example/src/components/Hero.jsx#Hero.heading.primary">
          A Safe Space for Your
        </span>
        <span
          className="block text-accent"
          data-ppid="code:public-sites/sites/horizon-example/src/components/Hero.jsx#Hero.heading.highlight"
        >
          Authentic Self
        </span>
      </h1>
      <p>
        <span data-ppid="code:public-sites/sites/horizon-example/src/components/Hero.jsx#Hero.body">
          Progressive therapy rooted in compassion.
        </span>
      </p>
    </section>
  );
}
"""


@dataclass(slots=True)
class OverlayFixture:
  """Snapshot of the temporary overlay workspace."""

  repo_root: Path
  component_path: Path
  primary_ppid: str = (
      "code:public-sites/sites/horizon-example/src/components/Hero.jsx#Hero.heading.primary"
  )
  body_ppid: str = (
      "code:public-sites/sites/horizon-example/src/components/Hero.jsx#Hero.body"
  )


@pytest.fixture
def overlay_repo(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> Iterator[OverlayFixture]:
  repo_root = tmp_path / "repo"
  component_dir = repo_root / "public-sites" / "sites" / "horizon-example" / "src" / "components"
  component_dir.mkdir(parents=True)
  component_file = component_dir / "Hero.jsx"
  component_file.write_text(EXAMPLE_COMPONENT, encoding="utf-8")

  monkeypatch.setenv("PREMPAGE_REPO_ROOT", str(repo_root))

  yield OverlayFixture(repo_root=repo_root, component_path=component_file)


@pytest.fixture
def api_client(overlay_repo: OverlayFixture) -> TestClient:  # pragma: no cover - fixture
  app = create_app()
  return TestClient(app)
