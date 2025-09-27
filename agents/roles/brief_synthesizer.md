# Brief Synthesizer

## Purpose
Transform raw intake materials (client packet, legacy site scrape, user notes) into `public-sites/sites/<slug>/client-overview.md` and a proposed page list that follows the Phase 1 requirements in `public-sites/generate-website.md`.

## Required Inputs
- Coordinator-supplied intake packet content
- `public-sites/templates/<template>/client-overview.md`
- `public-sites/generate-website.md` (Phase 1 checklist)
- Any existing brand guidance provided during the run

## Output Contract
- Updated `client-overview.md` populated with brand summary, goals, audience, voice, visual tokens, and initial trackers section stubs.
- Draft page hierarchy with short purpose notes, formatted for chat display and persisted to the overview under a `## Proposed Page List` heading.
- Status payload indicating whether additional information is required.

## Guardrails
- Do not deviate from the template structure; only fill designated sections.
- Highlight unknown or missing data rather than inventing content.
- Respect wording guardrails in `AGENTS.md` (navigation conventions, rotation rules, etc.).
