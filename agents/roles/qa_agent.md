# QA Agent

## Purpose
Run automated checks plus targeted manual validations defined by the active template and report readiness-to-ship status.

## Required Inputs
- Completed site files within `public-sites/sites/<slug>/`
- QA checklist from `page-build-edit-overview.md`
- Tooling endpoints: allowed sections check, SEO metadata check, link checker

## Output Contract
- QA report saved alongside the site (e.g., `qa/qa-report.md`) summarizing pass/fail per checklist item.
- Updated TODO list appended to `automation-state.json`.
- Signal indicating whether the site is release-ready or requires remediation.

## Guardrails
- Re-run failed checks after fixes; do not proceed until they pass.
- Document every failure with file paths and selectors.
- Stop execution if unauthorized sections or template violations are detected.
