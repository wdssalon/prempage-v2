# Public Sites Automation Policy

This policy is the single source of truth for any automation touching `public-sites/`. Every runtime (humans or agents) must load it before running scripts, editing files, or queuing work.

## Scope & Layout
- `public-sites/sites/<slug>/` – live site workspaces. Only edit inside the active slug.
- `public-sites/templates/<template>/` – read-only template assets: configs, catalogs, starter briefs.
- `agents/templates/<template>/` – template-specific automation manifests (hooks + plugins).
- Scripts live under `public-sites/scripts/`; only run the commands listed here or surfaced by template manifests.

## Workflow Skeleton
Execute phases in order and record state in `public-sites/sites/<slug>/automation-state.json`:
1. **Prep** – verify workspace exists, snapshot git status, load template metadata.
2. **Intake** – draft `client-overview.md` + proposed navigation; require human approval.
3. **Planning** – confirm `Approved Website Structure`, `Section Usage Tracker`, `Sections Remaining To Use`.
4. **Visual System** *(template gated)* – produce/refresh style guide artifacts; require approval when enabled.
5. **Skeletons** – build section skeletons page by page.
6. **Copy** – supply on-brand copy without touching structure.
7. **Assembly** – apply global navigation/footer/metadata and optional asset pipeline.
8. **QA** – run scripted checks and capture TODOs.
9. **Release** – only after QA passes and human approval is recorded.

## Non-Negotiable Rules
- Keep `client-overview.md` ASCII; update trackers after every page-level change.
- Stay inside template-approved sections/components; copy canonical markup when reusing sections.
- Treat navigation, footers, and shared components as global changes.
- Leave imagery `src` values in place until the imagery phase exists.
- Escalate missing info instead of inventing copy, assets, or structure.

## Approvals & Reporting
- Human approval is mandatory after Intake and before Release. Record approvals in `automation-state.json`.
- Log outstanding TODOs, open questions, and phase summaries for every handoff.
- Halt immediately on guardrail violations; ask for direction before retrying.

## Tooling Contract
- Preferred commands: `python agents/runner.py ...`, `public-sites/scripts/horizon/build-static-site.sh <slug>`, `pnpm --dir sites/<slug> <task>` when authorized.
- Capture command output and diff summaries per phase. Never run ad hoc scripts outside this policy without human approval.

## Template Extensions
- Template manifests live at `agents/templates/<template>/plugins.yaml` and `agents/templates/<template>/hooks.yaml`.
- Plugins may enable/disable phases, add tools, or set approval requirements. Hooks inject pre/post-stage scripts.
- Load the manifest for the active template before dispatching work so optional gates are respected.

## When Uncertain
Stop, summarize the ambiguity, and request guidance. Guardrail breaches must be corrected before continuing.
