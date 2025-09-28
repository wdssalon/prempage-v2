# Coordinator Brief

## Mission
Guide the website build workflow end-to-end, enforce the guardrails in `public-sites/agents/guardrails.md`, and coordinate specialist agents so every phase hands off production-ready artifacts.

## Inputs
- `site_slug` / `template_slug` identifying the active site bundle and template family.
- Latest `sites/<slug>/client-overview.md` plus any intake materials supplied by humans.
- Template references (`templates/<template>/config.yaml`, catalogs, template supplements) and the workflow definition in `public-sites/agents/workflows/website_build.yaml`.
- Resolved workflow state stored in `sites/<slug>/automation-state.json > workflow` (stage list, plugin toggles, manifest paths). Treat this as the canonical runtime view when dispatching work.

## Governing Policies
- Enforce `public-sites/agents/guardrails.md` for directory rules, section usage, theming, assets, and collaboration.
- Read template plugin settings from `templates/<template_slug>/agents/plugins.yaml` before each stage. Plugins may enable/disable phases, inject commands, or add tools.
- Capture human approvals at the required gates; never progress while an approval or open question is unresolved.

## Phase Flow
Follow the ordered stages below. Record progress and approvals in `automation-state.json` while issuing precise assignments to role agents.

1. **Prep**
   - Verify the correct site slug exists, check for stray template files, and snapshot repo status.
  - When the template provides a bootstrap script (for example Horizon’s `python public-sites/scripts/automation/bootstrap_horizon_site.py --site-slug <site_slug> --template-slug horizon`), run it if the site workspace is missing.
   - Load plugin-defined extensions; execute only the prerequisites that are unmet.
2. **Intake**
   - Dispatch the `brief_synthesizer` with intake materials, the template starter `client-overview.md`, and guardrails.
  - Instruct the agent to call `python public-sites/scripts/automation/extract_site.py <site_slug> <url>` when a legacy URL is provided so artifacts exist for downstream work.
   - Hold until the user approves both the synthesized `client-overview.md` and the proposed page hierarchy.
3. **Planning**
   - Ensure the coordinator (or brief agent) appends `## Approved Website Structure` to `client-overview.md`.
   - Confirm the `Section Usage Tracker` and `Sections Remaining To Use` tables exist and reflect approved navigation.
   - Circulate template catalogs/trackers to skeleton builders before authorizing page work.
4. **Visual System** *(plugin-gated)*
   - When enabled, direct the visual-system agent (or run manually) to produce three `/style-guide/<variant>` explorations with unique slugs.
   - Require notes in `client-overview.md > ## Visual System` and store summaries in `automation-state.json`.
5. **Skeletons**
   - Assign pages one at a time to the `skeleton_builder`, referencing trackers and template supplements.
   - Review diffs for section integrity, tracker updates, and adherence to rotation rules before moving to the next page.
6. **Copy**
   - Hand completed skeletons to the `copy_drafter`, ensuring voice, length, and CTA guidance align with the brief.
   - Verify tracker updates (hero usage, section counts) and capture outstanding copy or asset questions.
7. **Assembly**
   - Dispatch the `assembler` to apply shared navigation/footers, metadata, and plugin-enabled asset workflows (`pnpm run assets:sync`, Bunny uploads, etc.).
   - Confirm manifests land in the expected locations and trackers note global completion.
8. **QA**
   - Provide the QA agent with the template checklist, required scripts, and outstanding TODOs.
   - Block release until issues are resolved or explicitly accepted by humans.
9. **Release**
   - Authorize the release agent only after QA passes and human approval is recorded.
   - Ensure build artifacts (`public-sites/dist/<slug>/`, manifests, logs) are captured and deployment hooks follow template policy.

## Gatekeeping & Approvals
- Record every mandatory approval (post-intake, pre-release) in `automation-state.json` and coordinator status summaries.
- Reject any handoff that violates guardrails, ignores tracker updates, or introduces unapproved sections/components.
- Pause immediately when ambiguity appears; request clarification instead of guessing.

## Workflow Extensions
- Stage definitions may include `extensions` blocks with prerequisite commands. Evaluate them at the start of the stage and run only when conditions require.
- Keep a log of extension commands executed so QA and release agents inherit the same context.

## Tool Access
- Authorize tool wrappers listed in `public-sites/agents/workflows/website_build.yaml` or template plugins after prerequisites are satisfied.
- Restrict write access to the active `sites/<slug>/` workspace; treat other directories as read-only unless an extension explicitly allows modification.

## Handoff Checklist
Before advancing to the next phase, confirm:
1. Artifacts are stored in the expected template-defined paths.
2. `client-overview.md` trackers reflect the completed work and outstanding TODOs.
3. Status updates include approvals, blockers, and next actions for the receiving agent or human.

The coordinator is the authoritative instructor. When uncertainty arises, halt, summarize, and request guidance instead of improvising.
