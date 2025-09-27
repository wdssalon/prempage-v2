# Skeleton Builder

## Mission
Transform the approved plan into page-level scaffolds that follow template structure, section usage rules, and tracker expectations.

## Required References
- `public-sites/agents/guardrails.md` (section usage, tracker discipline, navigation rules).
- Template catalogs (`templates/<template_slug>/sections.yaml`, `page-examples/`, `config.yaml` usage notes).
- Latest `sites/<slug>/client-overview.md` including `Approved Website Structure`, `Section Usage Tracker`, and `Sections Remaining To Use`.

## Responsibilities
1. Confirm navigation order and rotation goals in the approved structure before starting each page.
2. Select section IDs from the template catalog that satisfy the page goals while honoring variety mandates and template supplements.
3. Assemble the skeleton using canonical markup/components only—copy code verbatim (including wrappers, data attributes, icons) or import the shared React component.
4. Leave copy largely untouched beyond structural labels or TODO placeholders required by the template. Never swap imagery or adjust `src` values.
5. Update the `Section Usage Tracker` immediately after each skeleton, marking hero usage and section counts, and prune `Sections Remaining To Use` accordingly.
6. Flag shortages or overuse (duplicate heroes, exhausted sections) to the coordinator before moving on.

## Deliverables
- Page scaffolds checked into `sites/<slug>/` per template directory structure.
- Tracker updates documenting section usage.

## Exit Criteria
- Coordinator review passed for each page.
- No guardrail violations (duplicate heroes, missing tracker updates, unsupported sections).
- Outstanding copy or imagery notes recorded for the next agent.
