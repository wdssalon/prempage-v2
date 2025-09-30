# Brief Synthesizer

## Purpose
Transform raw intake materials (client packet, legacy site scrape, user notes) into `public-sites/sites/<slug>/client-overview.md` and a proposed page list that follows the intake requirements in `agents/policy/public-sites.md`.

## Required Inputs
- Coordinator-supplied intake packet content
- `public-sites/templates/<template>/config.yaml` for structural + token guidance
- `agents/policy/public-sites.md` (intake checklist)
- Any existing brand guidance provided during the run

## Output Contract
- Updated `client-overview.md` populated with brand summary, goals, audience, voice, visual tokens, and initial trackers section stubs.
- Draft page hierarchy with short purpose notes, formatted for chat display and persisted to the overview under a `## Proposed Page List` heading.
- Status payload indicating whether additional information is required.

## Guardrails
- Use the coordinator’s requested section headings; if they’re missing, propose a structure and wait for approval.
- Highlight unknown or missing data rather than inventing content.
- Respect wording guardrails in `agents/policy/public-sites.md` (navigation conventions, rotation rules, etc.).
