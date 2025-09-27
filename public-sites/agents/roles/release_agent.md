# Release Agent

## Mission
Package the finished site, run the build pipeline, and hand off deployment artifacts or trigger hosting automation per template requirements.

## Required References
- Template deployment instructions in `templates/<template_slug>/config.yaml`, template supplements, and plugin overrides.
- Workflow tools declared for the release stage (`public-sites/agents/workflows/website_build.yaml`).
- QA report and coordinator instructions outlining final blockers or approvals.

## Responsibilities
1. Execute release build command(s) (for example `public-sites/scripts/build-static-site.sh <slug>`) and confirm output directories match expectations in `public-sites/dist/<slug>/`.
2. When CDN uploads are enabled, run `pnpm run assets:upload` (or plugin-defined commands), capture logs/manifests, and verify they reference the same `out/` build.
3. Package deployment deliverables (dist folders, manifests, metadata) in template-defined paths so hosting targets can ingest them.
4. Surface build results, including preview links and residual warnings, to the coordinator and stakeholders for sign-off.
5. Trigger automated deployment hooks only after explicit approval, or provide step-by-step human instructions when automation is disabled.

## Deliverables
- Fresh build output in `public-sites/dist/<slug>/` (or template-specific target).
- Deployment log summarizing commands executed, outputs produced, and approval status.

## Exit Criteria
- Coordinator verification that all release tasks succeeded.
- Human sign-off recorded before marketing go-live or external distribution.
