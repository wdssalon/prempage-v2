"""Automation runner scaffold for public-sites workflows.

This module focuses on state management around template metadata and the new
style-guide gate (Phase 2.5). It is intentionally light on LLM orchestration—the
LLM calls will be layered on later once the command surface is stable.
"""

from __future__ import annotations

import argparse
import json
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Any

try:
    import yaml
except ModuleNotFoundError as exc:  # pragma: no cover - import guard
    raise SystemExit(
        "PyYAML is required to run the automation runner. Install it with `uv pip install pyyaml` or equivalent."
    ) from exc

REPO_ROOT = Path(__file__).resolve().parent.parent
PUBLIC_SITES_ROOT = REPO_ROOT / "public-sites"


@dataclass
class StyleGuideConfig:
    enabled: bool
    route: str
    template_path: str | None
    requires_approval: bool

    @classmethod
    def from_mapping(cls, data: dict[str, Any]) -> "StyleGuideConfig":
        return cls(
            enabled=bool(data.get("enabled", False)),
            route=str(data.get("route", "")),
            template_path=data.get("template_path"),
            requires_approval=bool(data.get("requires_approval", False)),
        )


class AutomationRunner:
    def __init__(self, site_slug: str, template_slug: str) -> None:
        self.site_slug = site_slug
        self.template_slug = template_slug
        self.site_root = PUBLIC_SITES_ROOT / "sites" / site_slug
        self.template_root = PUBLIC_SITES_ROOT / "templates" / template_slug
        if not self.site_root.exists():
            raise SystemExit(f"Site directory not found: {self.site_root}")
        if not self.template_root.exists():
            raise SystemExit(f"Template directory not found: {self.template_root}")
        self.state_path = self.site_root / "automation-state.json"
        self.client_overview_path = self.site_root / "client-overview.md"

        config_path = self.template_root / "config.yaml"
        if not config_path.exists():
            raise SystemExit(f"Template config missing: {config_path}")
        with config_path.open("r", encoding="utf-8") as fh:
            config_data = yaml.safe_load(fh) or {}
        self.style_guide_config = StyleGuideConfig.from_mapping(config_data.get("style_guide", {}))

    # ------------------------------------------------------------------
    # State helpers
    def _default_state(self) -> dict[str, Any]:
        return {
            "phase": "0",
            "approvals": {"phase1": False, "assembly": False, "release": False},
            "trackers": {"section_usage": "", "sections_remaining": ""},
            "style_guide_required": False,
            "style_guide_path": "",
            "style_guide_summary": "",
            "style_guide_options": "",
            "outstanding_todos": [],
        }

    def _load_state(self) -> dict[str, Any]:
        if not self.state_path.exists():
            return self._default_state()
        with self.state_path.open("r", encoding="utf-8") as fh:
            return json.load(fh)

    def _write_state(self, state: dict[str, Any]) -> None:
        self.state_path.write_text(json.dumps(state, indent=2, sort_keys=True) + "\n", encoding="utf-8")

    # ------------------------------------------------------------------
    def initialize(self) -> None:
        state = self._load_state()
        state["style_guide_required"] = self.style_guide_config.enabled
        if self.style_guide_config.enabled:
            # Record the default style-guide route as the expected path.
            default_path = self.style_guide_config.route
            if not state.get("style_guide_path"):
                state["style_guide_path"] = default_path
        state.setdefault("style_guide_summary", "")
        state.setdefault("style_guide_options", "")
        self._write_state(state)
        print(
            "Initialized automation state",
            json.dumps({"style_guide_required": state["style_guide_required"], "style_guide_path": state["style_guide_path"]}),
        )

    # ------------------------------------------------------------------
    def record_style_guide(self, *, path: str | None, summary: str, options: str) -> None:
        state = self._load_state()
        if not state.get("style_guide_required"):
            print("Warning: template does not require a style guide; recording anyway for completeness.", file=sys.stderr)
        style_path = path or self.style_guide_config.route
        state["style_guide_path"] = style_path
        state["style_guide_summary"] = summary.strip()
        state["style_guide_options"] = options.strip()
        self._write_state(state)
        self._update_client_overview(summary=summary, options=options, style_path=style_path)
        print(
            "Recorded style guide",
            json.dumps({"style_guide_path": style_path, "summary_length": len(summary.strip()), "options_length": len(options.strip())}),
        )

    # ------------------------------------------------------------------
    def _update_client_overview(self, *, summary: str, options: str, style_path: str) -> None:
        if not self.client_overview_path.exists():
            raise SystemExit(f"client-overview.md not found: {self.client_overview_path}")
        content = self.client_overview_path.read_text(encoding="utf-8")
        visual_section = self._build_visual_section(summary=summary, options=options, style_path=style_path)
        if "## Visual System" in content:
            head, _sep, tail = content.partition("## Visual System")
            # Remove existing section up to the next heading.
            remainder = tail.split("\n## ", 1)
            updated = head
            updated += visual_section
            if len(remainder) == 2:
                updated += "\n## " + remainder[1]
            self.client_overview_path.write_text(updated, encoding="utf-8")
            return
        # Append section at end, ensuring trailing newline
        if not content.endswith("\n"):  # pragma: no cover - formatting guard
            content += "\n"
        content += "\n" + visual_section
        self.client_overview_path.write_text(content, encoding="utf-8")

    def _build_visual_section(self, *, summary: str, options: str, style_path: str) -> str:
        summary_lines = [line.rstrip() for line in summary.strip().splitlines() if line.strip()]
        option_lines = [line.rstrip() for line in options.strip().splitlines() if line.strip()]
        indented_summary = "\n".join(f"  {line}" for line in summary_lines) if summary_lines else "  (summary pending)"
        indented_options = "\n".join(f"  {line}" for line in option_lines) if option_lines else "  (options pending)"
        section = (
            "## Visual System\n"
            f"- Style guide route: `{style_path}`\n"
            "- Selected System Summary:\n"
            f"{indented_summary}\n"
            "- Presented Options:\n"
            f"{indented_options}\n"
        )
        return section


# ----------------------------------------------------------------------

def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Automation runner for public-sites workflows")
    parser.add_argument("--site", required=True, help="Site slug (e.g., progressivewaytherapy-horizon)")
    parser.add_argument("--template", required=True, help="Template slug (e.g., horizon)")

    subparsers = parser.add_subparsers(dest="command", required=True)

    subparsers.add_parser("init", help="Initialize automation-state.json for the site")

    style_parser = subparsers.add_parser("style-guide", help="Record style-guide output and update client overview")
    style_parser.add_argument("--path", help="Relative path to the generated style-guide page", default=None)
    style_parser.add_argument("--summary", help="Inline summary text for the visual system", default=None)
    style_parser.add_argument(
        "--summary-file",
        help="Path to a file containing the summary text (takes precedence over --summary)",
        default=None,
    )
    style_parser.add_argument(
        "--options",
        help="Inline description of the three presented options",
        default=None,
    )
    style_parser.add_argument(
        "--options-file",
        help="Path to a file containing the option descriptions (takes precedence over --options)",
        default=None,
    )

    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> None:
    args = parse_args(argv or sys.argv[1:])
    runner = AutomationRunner(site_slug=args.site, template_slug=args.template)

    if args.command == "init":
        runner.initialize()
        return

    if args.command == "style-guide":
        summary_text = ""
        if args.summary_file:
            summary_path = Path(args.summary_file)
            if not summary_path.exists():
                raise SystemExit(f"Summary file not found: {summary_path}")
            summary_text = summary_path.read_text(encoding="utf-8")
        elif args.summary:
            summary_text = args.summary
        else:
            raise SystemExit("style-guide command requires --summary or --summary-file")
        options_text = ""
        if args.options_file:
            options_path = Path(args.options_file)
            if not options_path.exists():
                raise SystemExit(f"Options file not found: {options_path}")
            options_text = options_path.read_text(encoding="utf-8")
        elif args.options:
            options_text = args.options
        else:
            raise SystemExit("style-guide command requires --options or --options-file")
        runner.record_style_guide(path=args.path, summary=summary_text, options=options_text)
        return

    raise SystemExit(f"Unknown command: {args.command}")


if __name__ == "__main__":  # pragma: no cover
    main()
