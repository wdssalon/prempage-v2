# Agents Scaffold

This directory houses the coordinator policy, role prompts, workflow definition, and tool/check stubs for the website automation pipeline.

## Directory Map
- `coordinator.md` – supervisor policy that references repository guardrails.
- `workflows/website_build.yaml` – phase DAG describing stage order, gates, and required inputs.
- `roles/` – role-specific prompt guides for each agent (including the style guide stage with option requirements).
- `tools/` – Python wrappers for filesystem, build, and deploy operations.
- `checks/` – initial QA check stubs for allowed sections, SEO metadata, and link validation.

## Runner TODOs
1. Implement logic for the new Phase 2.5 style-guide gate, reading `style_guide` metadata from template config files and persisting option sets.
2. Implement the automation runner (Python) that:
   - Loads `website_build.yaml` and resolves `${site_slug}` / `${template_slug}` placeholders.
   - Maintains `automation-state.json` per `coordinator.md` schema.
   - Orchestrates calls to the OpenAI API (or internal model) using role instructions and captures outputs/diffs.
   - Enforces human approval gates before Phase 2 progression and release.
3. Expand tool wrappers:
   - Add diff-based patch application to `fs.apply_patch` and integrate git awareness for auditing.
   - Capture command output and return structured logs from `tools.build.run_build`.
   - Support dry-run mode plus error translation in `tools.render.trigger_deploy`.
4. Harden checks:
   - Replace lightweight string parsing with real HTML/section validation.
   - Add rotation rule verification leveraging template `config.yaml`.
   - Integrate check execution into the QA stage of the runner.
5. Author initial system prompts using the role files as source material.
6. Wire logging/audit trail (per run log file) and expose CLI entry point: `python -m agents.runner --site <slug> --template <template>`.


### CLI snippets
- Initialize state: `python agents/runner.py --site <slug> --template <template> init`
- Record style guide decisions: `python agents/runner.py --site <slug> --template <template> style-guide --summary-file visual-summary.md --options-file visual-options.md`
