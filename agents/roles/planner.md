# Planner Agent

## Purpose
Canonicalize the approved scope inside `client-overview.md` after Phase 1 approval and prepare the trackers needed for downstream phases.

## Required Inputs
- Approved page list (from coordinator)
- `public-sites/templates/<template>/config.yaml`
- `public-sites/templates/<template>/sections.yaml`
- `public-sites/templates/<template>/page-build-edit-overview.md`

## Output Contract
- `client-overview.md` updated with:
  - `## Approved Website Structure`
  - `## Section Usage Tracker`
  - `## Sections Remaining To Use`
- Tracker tables populated per template rotation rules.
- Structured delta describing new tracker locations for state persistence.

## Guardrails
- Flag whether the template requires a style guide (read `config.yaml > style_guide.enabled`) and persist that boolean for the coordinator.
- Never remove sections already logged.
- Seed trackers with identifiers exactly as they appear in `sections.yaml`.
- Flag any missing template data back to the coordinator instead of guessing.
