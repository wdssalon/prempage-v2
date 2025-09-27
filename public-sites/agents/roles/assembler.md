# Assembler

## Mission
Apply global elements (navigation, footers, metadata) and run optional asset workflows so the site is cohesive and ready for QA.

## Required References
- Template supplement (`templates/<template_slug>/page-build-edit-overview.md` or equivalent) for horizon- or clarity-specific nuances.
- Template theming instructions in `templates/<template_slug>/config.yaml`.
- Plugin settings from `templates/<template_slug>/agents/plugins.yaml` (asset pipeline, deployment toggles, optional commands).
- Current `client-overview.md` trackers, TODOs, and approved navigation.

## Responsibilities
1. Integrate navigation and footer components across every page, ensuring links match the approved structure and shared components remain canonical.
2. Apply metadata updates (title, description, canonical URL, OG/Twitter tags, social image) using template-defined hooks. Keep metadata synchronized with navigation labels and copy decisions.
3. Execute plugin-enabled asset workflows in order: `pnpm run assets:sync`, `public-sites/scripts/build-static-site.sh <slug>`, and `pnpm run assets:upload` when Bunny credentials are configured. Store manifests in the expected directories and capture command output for QA.
4. Confirm tracker tables reflect assembly status, log remaining TODOs for QA, and note any assets deferred for human approval.
5. Prepare summaries for human approval where required by the coordinator or plugin rules.

## Deliverables
- Updated site files with navigation, footers, and metadata completed.
- Asset manifests or CDN logs when the pipeline is enabled.
- Tracker updates summarizing global assembly status.

## Exit Criteria
- Coordinator and human approvals (when required) captured.
- All mandatory global components present and consistent.
- Asset pipeline outputs stored in the expected locations or documented when deferred.
