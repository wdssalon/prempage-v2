"""Automation runner scaffold for public-sites workflows.

This module focuses on state management around template metadata and the visual
system gate. It is intentionally light on LLM orchestration—the LLM calls will
be layered on later once the command surface is stable.
"""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
import time
from copy import deepcopy
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

        self.workflow_path = PUBLIC_SITES_ROOT / "agents" / "workflows" / "website_build.yaml"
        if not self.workflow_path.exists():
            raise SystemExit(f"Workflow definition missing: {self.workflow_path}")
        self.workflow_definition = self._load_yaml(self.workflow_path)
        self.plugins_config = self._resolve_plugins(self.workflow_definition.get("plugins", {}))
        self.hooks_config = self._resolve_hooks(self.workflow_definition.get("hooks", {}))
        self.resolved_stages = self._resolve_stages(self.workflow_definition.get("stages", []))

    # ------------------------------------------------------------------
    # Workflow + plugin helpers
    def _load_yaml(self, path: Path) -> dict[str, Any]:
        with path.open("r", encoding="utf-8") as fh:
            data = yaml.safe_load(fh)
        if data is None:
            return {}
        if not isinstance(data, dict):
            raise SystemExit(f"YAML root must be a mapping: {path}")
        return data

    def _render_template_string(self, value: str) -> str:
        rendered = value.replace("{{ site_slug }}", self.site_slug)
        rendered = rendered.replace("{{ template_slug }}", self.template_slug)
        return rendered

    def _render_structure(self, value: Any) -> Any:
        if isinstance(value, str):
            return self._render_template_string(value)
        if isinstance(value, list):
            return [self._render_structure(item) for item in value]
        if isinstance(value, dict):
            return {key: self._render_structure(val) for key, val in value.items()}
        return value

    def _deep_merge(self, base: Any, override: Any) -> Any:
        if override is None:
            return deepcopy(base)
        if base is None:
            return deepcopy(override)
        if isinstance(base, dict) and isinstance(override, dict):
            merged: dict[str, Any] = deepcopy(base)
            for key, value in override.items():
                merged[key] = self._deep_merge(base.get(key), value)
            return merged
        return deepcopy(override)

    def _resolve_plugins(self, plugin_section: dict[str, Any]) -> dict[str, Any]:
        defaults = self._render_structure(plugin_section.get("defaults", {}))
        manifest_template = plugin_section.get("manifest")
        self.plugin_manifest_path: Path | None = None
        manifest_data: dict[str, Any] = {}
        if isinstance(manifest_template, str):
            manifest_rel = self._render_template_string(manifest_template)
            manifest_path = PUBLIC_SITES_ROOT / manifest_rel
            if manifest_path.exists():
                manifest_data = self._render_structure(self._load_yaml(manifest_path))
                self.plugin_manifest_path = manifest_path
            else:
                # Manifest is optional—fall back to defaults when the template has not defined overrides yet.
                self.plugin_manifest_path = manifest_path
        merged = self._deep_merge(defaults, manifest_data)
        # Ensure nested values that remain None become sensible defaults.
        for key, value in merged.items():
            if isinstance(value, dict):
                merged[key] = {k: v for k, v in value.items()}
        return merged

    def _resolve_hooks(self, hooks_section: dict[str, Any]) -> dict[str, Any]:
        manifest_template = hooks_section.get("manifest")
        optional = bool(hooks_section.get("optional", False))
        self.hooks_manifest_path: Path | None = None
        if not manifest_template:
            return {}
        hooks_rel = self._render_template_string(str(manifest_template))
        hooks_path = PUBLIC_SITES_ROOT / hooks_rel
        if not hooks_path.exists():
            if optional:
                self.hooks_manifest_path = hooks_path
                return {}
            raise SystemExit(f"Workflow hooks file not found: {hooks_path}")
        self.hooks_manifest_path = hooks_path
        hooks_data = self._render_structure(self._load_yaml(hooks_path))
        return hooks_data

    def _resolve_reference(self, token: str) -> Any | None:
        if not isinstance(token, str):
            return None
        if not token.startswith("plugins."):
            return None
        parts = token.split(".")[1:]
        value: Any = self.plugins_config
        for part in parts:
            if isinstance(value, dict) and part in value:
                value = value[part]
            else:
                return None
        return value

    def _evaluate_condition(self, condition: Any) -> bool:
        if condition is None:
            return True
        if isinstance(condition, bool):
            return condition
        if isinstance(condition, str):
            referenced = self._resolve_reference(condition)
            if referenced is not None:
                return bool(referenced)
            lowered = condition.strip().lower()
            if lowered in {"true", "false"}:
                return lowered == "true"
        return bool(condition)

    def _normalize_tool_item(self, item: Any) -> list[str]:
        if item is None:
            return []
        if isinstance(item, list):
            return [self._render_template_string(str(entry)) for entry in item]
        if isinstance(item, str):
            return [self._render_template_string(item)]
        return [self._render_template_string(str(item))]

    def _resolve_tools(self, tools_field: Any) -> list[str]:
        if tools_field is None:
            return []
        resolved: list[str] = []
        if isinstance(tools_field, str):
            reference = self._resolve_reference(tools_field)
            if reference is None:
                resolved.extend(self._normalize_tool_item(tools_field))
            else:
                resolved.extend(self._normalize_tool_item(reference))
            return resolved
        if isinstance(tools_field, list):
            for entry in tools_field:
                if isinstance(entry, str):
                    reference = self._resolve_reference(entry)
                    if reference is None:
                        resolved.extend(self._normalize_tool_item(entry))
                    else:
                        resolved.extend(self._normalize_tool_item(reference))
                else:
                    resolved.extend(self._normalize_tool_item(entry))
            return resolved
        return self._normalize_tool_item(tools_field)

    def _resolve_extensions(self, hook_spec: Any) -> dict[str, Any]:
        if not hook_spec or not isinstance(hook_spec, dict):
            return {}
        key = hook_spec.get("extend")
        if not key:
            return {}
        extension = self.hooks_config.get(str(key))
        if not extension:
            return {}
        return self._render_structure(extension)

    def _resolve_stages(self, stages: list[dict[str, Any]]) -> list[dict[str, Any]]:
        resolved: list[dict[str, Any]] = []
        for entry in stages:
            if not isinstance(entry, dict):
                raise SystemExit("Each workflow stage must be a mapping")
            stage = dict(entry)
            stage_condition = stage.get("condition")
            stage["condition"] = stage_condition
            stage["enabled"] = self._evaluate_condition(stage_condition)
            stage["tools"] = self._resolve_tools(stage.get("tools"))
            for key in ("uses", "requires", "optional_requires", "outputs"):
                if key in stage:
                    stage[key] = self._render_structure(stage[key])
            extensions = self._resolve_extensions(stage.get("hooks"))
            if extensions:
                stage["extensions"] = extensions
            resolved.append(stage)
        return resolved

    def _relative_to_repo(self, path: Path | None) -> str | None:
        if path is None:
            return None
        try:
            return str(path.relative_to(REPO_ROOT))
        except ValueError:
            return str(path)

    @staticmethod
    def _trim_output(text: str, *, max_chars: int = 2000) -> str:
        stripped = text.strip()
        if len(stripped) <= max_chars:
            return stripped
        return stripped[-max_chars:]

    @staticmethod
    def _parse_json_output(stdout: str) -> Any | None:
        lines = [line for line in stdout.strip().splitlines() if line.strip()]
        for line in reversed(lines):
            try:
                return json.loads(line)
            except json.JSONDecodeError:
                continue
        return None

    def _get_stage(self, stage_id: str) -> dict[str, Any]:
        for stage in self.resolved_stages:
            if stage.get("id") == stage_id:
                return stage
        raise SystemExit(f"Workflow stage not found: {stage_id}")

    def _get_extension(self, stage: dict[str, Any], when: str, extension_id: str) -> dict[str, Any]:
        extensions = stage.get("extensions") or {}
        bucket = extensions.get(when)
        if not bucket:
            raise SystemExit(f"No extensions defined for stage '{stage.get('id')}' at '{when}'")
        for entry in bucket:
            if entry.get("id") == extension_id:
                if not entry.get("commands"):
                    raise SystemExit(f"Extension '{extension_id}' for stage '{stage.get('id')}' has no commands")
                return entry
        raise SystemExit(f"Extension '{extension_id}' not found for stage '{stage.get('id')}'")

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
            "workflow": {
                "definition_path": "",
                "plugin_manifest_path": "",
                "hooks_manifest_path": "",
                "plugins": {},
                "stages": [],
                "extension_runs": {},
            },
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

        workflow_state = state.get("workflow", {})
        workflow_state["definition_path"] = self._relative_to_repo(self.workflow_path) or ""
        workflow_state["plugin_manifest_path"] = self._relative_to_repo(self.plugin_manifest_path) or ""
        workflow_state["hooks_manifest_path"] = self._relative_to_repo(self.hooks_manifest_path) or ""
        workflow_state["plugins"] = deepcopy(self.plugins_config)
        workflow_state["stages"] = [
            {
                "id": stage.get("id"),
                "label": stage.get("label"),
                "role": stage.get("role"),
                "enabled": bool(stage.get("enabled", True)),
                "condition": stage.get("condition"),
                "gates": stage.get("gates", []),
                "tools": stage.get("tools", []),
                "requires": stage.get("requires", []),
                "optional_requires": stage.get("optional_requires", []),
                "foreach": stage.get("foreach"),
                "extensions": stage.get("extensions", {}),
            }
            for stage in self.resolved_stages
        ]
        workflow_state.setdefault("extension_runs", {})
        state["workflow"] = workflow_state

        self._write_state(state)

        active_stages = sum(1 for stage in workflow_state["stages"] if stage["enabled"])
        total_stages = len(workflow_state["stages"])
        print(
            "Initialized automation state",
            json.dumps(
                {
                    "style_guide_required": state["style_guide_required"],
                    "style_guide_path": state["style_guide_path"],
                    "workflow_definition": workflow_state["definition_path"],
                    "active_stages": active_stages,
                    "total_stages": total_stages,
                }
            ),
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

    # ------------------------------------------------------------------
    def run_extension(self, *, stage_id: str, extension_id: str, when: str) -> None:
        stage = self._get_stage(stage_id)
        extension = self._get_extension(stage, when, extension_id)

        commands = extension.get("commands", [])
        if not isinstance(commands, list):
            raise SystemExit(f"Extension '{extension_id}' commands must be a list")

        command_results: list[dict[str, Any]] = []
        status = "success"
        for command in commands:
            if not isinstance(command, str):
                raise SystemExit(f"Extension command must be a string: {command}")
            start = time.perf_counter()
            result = subprocess.run(
                ["bash", "-lc", command],
                cwd=REPO_ROOT,
                capture_output=True,
                text=True,
            )
            duration_ms = int((time.perf_counter() - start) * 1000)
            stdout = result.stdout or ""
            stderr = result.stderr or ""
            parsed_json = self._parse_json_output(stdout)
            command_results.append(
                {
                    "command": command,
                    "exit_code": result.returncode,
                    "duration_ms": duration_ms,
                    "stdout_tail": self._trim_output(stdout),
                    "stderr_tail": self._trim_output(stderr),
                    "parsed_json": parsed_json,
                }
            )
            if result.returncode != 0:
                status = "failed"
                break

        run_record = {
            "stage_id": stage_id,
            "extension_id": extension_id,
            "when": when,
            "summary": extension.get("summary"),
            "ran_at": time.strftime("%Y-%m-%dT%H:%M:%S", time.localtime()),
            "status": status,
            "commands": command_results,
        }

        state = self._load_state()
        workflow_state = state.setdefault("workflow", {})
        extension_runs = workflow_state.setdefault("extension_runs", {})
        stage_runs = extension_runs.setdefault(stage_id, {})
        ext_state = stage_runs.setdefault(extension_id, {"runs": []})
        runs = ext_state.setdefault("runs", [])
        runs.append(run_record)
        ext_state["last_status"] = status
        ext_state["last_ran_at"] = run_record["ran_at"]
        self._write_state(state)

        payload = {"status": status, "run": run_record}
        print("Extension execution", json.dumps(payload))

        if status != "success":
            failing_command = command_results[-1] if command_results else {}
            message = failing_command.get("stderr_tail") or failing_command.get("stdout_tail") or "Extension command failed"
            raise SystemExit(message)


# ----------------------------------------------------------------------

def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Automation runner for public-sites workflows")
    parser.add_argument("--site", required=True, help="Site slug (e.g., progressivewaytherapy-horizon)")
    parser.add_argument("--template", required=True, help="Template slug (e.g., horizon)")

    subparsers = parser.add_subparsers(dest="command", required=True)

    subparsers.add_parser("init", help="Initialize automation-state.json for the site")

    extension_parser = subparsers.add_parser("run-extension", help="Execute a workflow extension command")
    extension_parser.add_argument("--stage", required=True, help="Workflow stage id (e.g., repo_prep)")
    extension_parser.add_argument("--extension-id", required=True, help="Extension id declared in the workflow hooks")
    extension_parser.add_argument("--when", default="after", help="Extension timing bucket (default: after)")

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

    if args.command == "run-extension":
        runner.run_extension(stage_id=args.stage, extension_id=args.extension_id, when=args.when)
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
