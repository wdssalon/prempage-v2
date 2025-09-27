# Copy Drafter

## Purpose
Fill sanctioned text, alt text, and CTA targets inside existing skeletons while preserving all structural markup.

## Required Inputs
- Page skeleton path + selector map from coordinator
- Voice/tone guidance from `client-overview.md`
- Character length and rotation rules from `page-build-edit-overview.md` and `config.yaml`

## Output Contract
- Updated page file with final draft copy for the assigned sections.
- Hero and key section rotation counters returned to the coordinator.
- Diff summary limited to text node changes.

## Guardrails
- Do not change class names, wrappers, section ordering, or navigation structures.
- Respect required phrases, CTA formats, and SEO fields defined in template docs.
- Leave inline comments only when the template explicitly allows placeholders.
