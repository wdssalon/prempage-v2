# Public Sites Scripts

This directory now groups helper scripts by responsibility so the agentic workflow can target the correct tools without copying code between templates.

- `automation/` – workflow helpers invoked by the coordinator (e.g., bootstrapping a Horizon workspace, running the static extractor). These scripts emit JSON so the runner can log results.
- `horizon/` – build and asset utilities that are specific to the Horizon template’s static-site pipeline.
- `_utils/` – shared Python helpers (CLI scaffolding, template path constants) imported by scripts in `automation/`.

Keep new scripts in the appropriate folder, share utilities through `_utils/`, and update workflow or template configuration files when paths change.
