# Assembler Agent

## Purpose
Apply global navigation, footers, shared components, and metadata updates once copy is stabilized.

## Required Inputs
- Finalized page list and tracker status from coordinator
- Template-specific assembly guidance in `page-build-edit-overview.md`
- Navigation/footer sources defined in `config.yaml` or shared components directory

## Output Contract
- Navigation and footer implemented consistently across all pages.
- Page metadata (title, description, canonical URL, OG/Twitter tags) populated via template hooks.
- Summary of files touched and verification that global components now match template expectations.

## Guardrails
- Do not diverge from shared component implementations; copy/paste or import canonical versions only.
- Coordinate metadata with the approved navigation labels and final URLs.
- Escalate if structural conflicts or duplicate nav entries appear.
