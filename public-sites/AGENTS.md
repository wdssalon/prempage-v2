# AGENTS NOTES

This document is the control center for LLM-driven work in the Progressive Way Therapy repo. It collects the rules, file locations, and references you must follow when automating site updates.

## Core References
- `generate-website.md`: top-level flow for producing or refreshing the site.
- `tooling/<template-slug>/client-overview.md` (e.g., `tooling/clarity/client-overview.md`): baseline client brief template to reference before drafting a new project's overview.
- `tooling/<template-slug>/page-build-edit-overview.md`: detailed page build/edit checklist (sections, copy swaps, QA) for the selected template family.
- `tooling/<template-slug>/sections.yaml`: IDs for every approved section in that template family; use these to map outlines to markup.
- `tooling/<template-slug>/page-shell.html`: base HTML head + structural scaffolding with SEO placeholders.
- `images/images-overview.md`: imagery sourcing, optimization, and social-share requirements.
- `tooling/<template-slug>/page-examples/`: snapshot copies of the starter HTML pages—review them for layout inspiration before generating fresh output.
- `sites/<slug>/client-overview.md`: the active project brief and build tracker for each live site (includes the `Template` value identifying which tooling set to use).

Keep these sources authoritative—do not duplicate instructions elsewhere.

## Repository Layout
- `sites/`: production-ready static exports organized by site slug (e.g., `sites/progressivewaytherapy-clarity/`). Each site folder mirrors the previous `public/` structure and contains:
  - `index.html` + supporting `.html` pages.
  - `client-overview.md`: canonical build brief for that site, including the `Template` selector and trackers.
  - `overrides/`: custom CSS (`custom.css`), JS (`custom.js`), and font loader (`fonts-loader.js`).
  - `images/`: WebP assets served on the site.
  - `css/`, `js/`, etc.: builder-generated bundles—avoid editing unless absolutely required.
- `tooling/`: reusable building blocks grouped by template family (currently `clarity/` and `horizon/`). Each family includes `template.html`, `sections.yaml`, `page-shell.html`, `page-build-edit-overview.md`, `client-overview.md` (sample), and reference `page-examples/`.
- Repo root: documentation (`README.md`, `generate-website.md`, this file) and any additional tooling you introduce.

## Editing Guardrails
- Enforce the structural rules in the relevant `tooling/<template-slug>/page-build-edit-overview.md`—that document governs section selection, copy swaps, and QA.
- When reusing markup, copy directly from `tooling/<template-slug>/template.html` (or an existing page) so original classes and data attributes remain intact.
- Never edit `tooling/<template-slug>/template.html`; treat it as a read-only source of canonical markup.
- During the first end-to-end site build, ensure each distinct section style from the catalog is used at least once to deliver a varied launch experience. Use the `## Section Usage Tracker` table in `client-overview.md` to log the sections added to every page as you build.
- Before outlining any new page, scan the tracker to avoid duplicating the same five-section skeleton on consecutive specialty pages. Rotate CTA blocks so `wds-getting-started-section` and the `wds-trust-section*` variants share time with other closing layouts once they have shipped.
- Keep the hero rotation log current—cycle through all four hero variants (`wds-hero-section-1/2/3` and `wds-parallax-section`) before repeating one, and make sure `wds-parallax-section` headlines at least one page in every four-page run. Document any exception in the tracker before moving forward.
- Maintain the `## Sections Remaining To Use` list in `client-overview.md`, removing section IDs once they have appeared on a page. This list only tracks content sections—navigation and footer components are handled separately during the global assembly pass.
- Use the frozen HTML in `tooling/<template-slug>/page-examples/` as reference material only; do not copy them back into a live `sites/<slug>/` directory once new pages are generated. **Exception**: Always duplicate the canonical Contact and Blog pages from the matching template family (e.g., `tooling/clarity/page-examples/contact.html`, `tooling/clarity/page-examples/blog.html`, and the Blog detail examples) when building those specific pages. DO NOT EVER reuse this shortcut for any other page.
- Treat navigation and footer updates as global operations: once finalized, propagate changes to every page via search/replace.
- Update SEO metadata in each page `<head>` using the placeholders defined in the selected `tooling/<template-slug>/page-shell.html`.
- Rely on the HTML comment markers in `tooling/<template-slug>/template.html` (mirrored across that template’s `page-examples/`) to grab complete navigation and footer blocks without trimming required wrappers.
- When a navigation item has child pages, treat the parent label as a navigation-only trigger. Do not generate a standalone HTML page for that parent unless the user explicitly requests one.

## Automation Workflow
Use the primary docs as the source of truth and walk through them in order:
- Start with `new-website-repo-checklist.md` whenever a fresh project repository is needed so naming and Git history are reset before Phase 1 work begins; do not move into Phase 1 until that checklist confirms the new repo is ready.
- `generate-website.md` Phase 1 → intake, `client-overview.md`, and page list approval before any builds.
- `generate-website.md` Phase 2 + 3 with `tooling/<template-slug>/page-build-edit-overview.md` → create shells, map sections, and draft copy page-by-page.
  - Maintain the `## Approved Page Scope` section in `client-overview.md` as the canonical build sequence while working through those pages.
- `generate-website.md` Phase 4 with `tooling/<template-slug>/page-build-edit-overview.md` steps 5-6 → roll in navigation, both footers, and finalize SEO metadata across the site.
- `generate-website.md` Phase 5 with `tooling/<template-slug>/page-build-edit-overview.md` step 7 → complete the QA checklist and report results.

## Overrides & Theming
- Manage visual tokens and overrides in `sites/<slug>/overrides/custom.css`; it loads after the core styles for that site.
- Define shared color and spacing tokens at the top of that file (inside the `:root` block) so updates cascade site-wide.
- A responsive scaffolding block is prepped in that file with min/max breakpoints (1280, 1440, 1920, 991, 767, 478) to keep breakpoint-specific tweaks centralized.
- Update custom scripts in `sites/<slug>/overrides/custom.js`; they execute after the default script bundle in the matching `sites/<slug>/js/` directory.
- Manage fonts via `sites/<slug>/overrides/fonts-loader.js`:
  - Edit `FONT_CONFIG` entries (Google families + fallback stacks).
  - Mirror fallback stacks in the primary `sites/<slug>/css/` bundle’s `:root` variables.
  - Request only the weights used in design to keep WebFont payloads lean.

- Initial page builds may leave placeholder images. The dedicated workflow in `images/images-overview.md` covers sourcing, WebP conversion, alt text, and social share specs.
- When converting assets, keep only the WebP file in `sites/<slug>/images/` and remove intermediate formats after optimization.

## Deployment & Ops
- Deployment settings live in `README.md`; automation must preserve each `sites/<slug>/` directory layout so Render continues to publish correctly.
- If additional tooling/scripts are required, keep sources in the repo root and emit final assets into the appropriate `sites/<slug>/` directory.

Always cross-check instructions here with `generate-website.md` and the linked docs before making changes. When you discover a new constraint, update this file (not the README) so automation stays aligned with human expectations.

## Collaboration Guidelines
- Keep the conversation proactive and transparent. Summaries of key deliverables and open questions should be surfaced without waiting for a prompt.
- For the walk-through on how to present Phase 1 artifacts (client overview, page hierarchy, scope assumptions), follow the detailed checklist in `generate-website.md`.
