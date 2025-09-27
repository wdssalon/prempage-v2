# Clarity Template Supplement

Use this guidance alongside `public-sites/agents/guardrails.md`, the coordinator brief, and the role guides. Clarity ships static HTML exports; these notes capture the template-specific rules that layer on top of the global process.

## Coordinator Hooks
- Confirm the static workspace exists under `sites/<slug>/`. Each page must start from the shell declared at `config.yaml > scaffolding.page_shell` (currently `page-shell.html`). It carries canonical `<head>` content, navigation/footer placeholders, and global scripts.
- During planning, highlight required duplicates listed in `config.yaml > page_generation.duplicate_examples` (contact, blog index, blog detail). These must be copied directly from `templates/clarity/page-examples/` before editing.
- Track approvals for navigation parents: items that only group child links stay navigation-only triggers unless a human explicitly asks for a standalone page.

## Skeleton Builder Guidance
- Copy sections verbatim from the component catalog at `config.yaml > scaffolding.component_catalog` (currently `template.html`). Preserve wrapper divs, IDs, data attributes, nested icons, and visually hidden nodes—never rebuild markup by hand.
- Only use sections listed in `templates/clarity/sections.yaml`. Update the `Section Usage Tracker` and `Sections Remaining To Use` immediately after each page to preserve rotation rules.
- Insert shared navigation immediately after `<body>` and footers before `</body>` once the page skeleton is ready. Keep placeholders intact until assembly but ensure the slots exist in every file.
- When a layout reference is needed, consult `templates/clarity/page-examples/` for inspiration only. Do not duplicate examples beyond the pages explicitly required above.

## Copy Guidance
- Maintain character counts and cadence close to the template to protect layout balance and built-in animations.
- Circle portrait sections (`wds-circle-images-section-1`, etc.) expect the stock WebP placeholders. Leave `src` attributes untouched; rely on TODO comments if new assets are pending.
- Update alt text, CTA labels, and internal links when information exists. Duplicate list or card elements instead of restructuring markup when additional content is required.

## Assembly Notes
- When wiring navigation, ensure desktop and mobile variants stay synchronized. Update link targets to the approved route map and keep parent items that act as triggers unlinked.
- Populate page-level metadata inside the copied shell: `<title>`, description, canonical URL, OG/Twitter tags, and social share image must be unique per page.
- Treat global CSS/JS references as immutable. Any overrides belong in the template-defined `overrides/` directories or other sanctioned extension points.

## Imagery & Assets
- Follow `public-sites/images/images-overview.md` once copy is locked. Store working assets under `sites/<slug>/images/` and replace placeholders only after optimization.
- Leave every `src` unchanged during skeleton and copy stages, including icons and decorative elements.

## QA Highlights
- Verify the `Section Usage Tracker` reflects every shipped layout and that hero rotations meet the template guardrails.
- Confirm navigation and footer blocks render identically across pages and that metadata fields align with their routes.
- Run link checks and HTML validation (per workflow tools) to ensure no references broke during copy or assembly.

Adhering to these Clarity-specific notes keeps the static exports consistent with the template’s structure and ready for release.
