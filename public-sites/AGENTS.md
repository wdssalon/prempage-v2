# AGENTS NOTES

This document is the control center for LLM-driven work in the `public-sites` workspace. It collects the rules, file locations, and references you must follow when automating site updates.

## Core References
- `generate-website.md`: top-level flow for producing or refreshing the site.
- `templates/<template-slug>/config.yaml`: structured metadata for the template family (tech stack, scaffolds, canonical components, rotation rules). Treat this as the machine-readable source of truth for automation.
- `templates/<template-slug>/client-overview.md` (e.g., `templates/clarity/client-overview.md`): baseline client brief template to reference before drafting a new project's overview.
- `templates/<template-slug>/page-build-edit-overview.md`: narrative build/edit checklist; defer to the config for exact identifiers and assets.
- `templates/<template-slug>/sections.yaml`: IDs for every approved section in that template family; use these to map outlines to markup when applicable.
- `templates/<template-slug>/page-shell.html`: base HTML head + structural scaffolding with SEO placeholders (for static templates).
- `images/images-overview.md`: imagery sourcing, optimization, and social-share requirements.
- `templates/<template-slug>/page-examples/`: snapshot copies of the starter HTML pages—review them for layout inspiration before generating fresh output.
- `sites/<slug>/client-overview.md`: the active project brief and build tracker for each live site (includes the `Template` value identifying which template kit to use).

Keep these sources authoritative—do not duplicate instructions elsewhere.

## Repository Layout
- `sites/`: production-ready static exports organized by site slug (e.g., `sites/<client-slug>-<template>/`). Each site folder mirrors the previous `public/` structure and contains:
  - `index.html` + supporting `.html` pages.
  - `client-overview.md`: canonical build brief for that site, including the `Template` selector and trackers.
  - `overrides/`: custom CSS (`custom.css`), JS (`custom.js`), and font loader (`fonts-loader.js`).
  - `images/`: WebP assets served on the site.
  - `css/`, `js/`, etc.: builder-generated bundles—avoid editing unless absolutely required.
- `templates/`: reusable building blocks grouped by template family (currently `clarity/`, with more to come). Each family includes `template.html`, `sections.yaml`, `page-shell.html`, `page-build-edit-overview.md`, `client-overview.md` (sample), and reference `page-examples/`.
- Repo root: documentation (`README.md`, `generate-website.md`, this file) and any additional utilities you introduce.

## Editing Guardrails
- Enforce the structural rules in the relevant `templates/<template-slug>/page-build-edit-overview.md`—that document governs section selection, copy swaps, and QA.
- When you need canonical identifiers (hero variants, nav selectors, required duplicates), read them from `templates/<template-slug>/config.yaml` and avoid hard-coding values elsewhere.
- When reusing markup, **copy the entire section verbatim** from `templates/<template-slug>/template.html` (or a vetted live page). Never retype or rebuild portions by hand. This includes nested SVGs, slider/nav wrappers, hidden accessibility helpers, and `data-*` attributes—if it exists in the template, it must exist in the page.
- After pasting a section, only edit literal copy, alt text, or link targets. If copy changes require adding/removing list items or cards, duplicate the template element and adjust the text rather than altering surrounding structure.
- Never edit `templates/<template-slug>/template.html`; treat it as a read-only source of canonical markup.
- During the first end-to-end site build, ensure each distinct section style from the catalog is used at least once to deliver a varied launch experience. Use the `## Section Usage Tracker` table in `client-overview.md` to log the sections added to every page as you build.
- Before outlining any new page, scan the tracker to avoid duplicating the same five-section skeleton on consecutive specialty pages. Follow the CTA rotation rules documented in the template’s `page-build-edit-overview.md` so closing layouts stay varied once they ship.
- Keep the hero rotation log current by applying the template-specific guidance in `templates/<template-slug>/page-build-edit-overview.md`. Document any exception in the tracker before moving forward.
- Maintain the `## Sections Remaining To Use` list in `client-overview.md`, removing section IDs once they have appeared on a page. This list only tracks content sections—navigation and footer components are handled separately during the global assembly pass.
- Use the frozen HTML in `templates/<template-slug>/page-examples/` as reference material only; do not copy them back into a live `sites/<slug>/` directory once new pages are generated. **Exception**: Always duplicate the canonical Contact and Blog pages from the matching template family (e.g., `templates/clarity/page-examples/contact.html`, `templates/clarity/page-examples/blog.html`, and the Blog detail examples) when building those specific pages. DO NOT EVER reuse this shortcut for any other page.
- Treat navigation and footer updates as global operations: once finalized, propagate changes to every page via search/replace.
- Update SEO metadata in each page `<head>` using the placeholders defined in the selected `templates/<template-slug>/page-shell.html`.
- Rely on the HTML comment markers in `templates/<template-slug>/template.html` (mirrored across that template’s `page-examples/`) to grab complete navigation and footer blocks without trimming required wrappers.
- When a navigation item has child pages, treat the parent label as a navigation-only trigger. Do not generate a standalone HTML page for that parent unless the user explicitly requests one.

## Automation Workflow
Use the primary docs as the source of truth and walk through them in order:
- `generate-website.md` Phase 1 → intake, `client-overview.md`, and page list approval before any builds.
- `generate-website.md` Phases 2-4 with `templates/<template-slug>/page-build-edit-overview.md` → prep trackers, build skeletons, and draft copy page-by-page.
  - Maintain the `## Approved Page Scope` section in `client-overview.md` as the canonical build sequence while working through those pages.
- `generate-website.md` Phase 5 with `templates/<template-slug>/page-build-edit-overview.md` steps 5-6 → roll in navigation, both footers, and finalize SEO metadata across the site.
- `generate-website.md` Phase 6 with `templates/<template-slug>/page-build-edit-overview.md` step 7 → complete the QA checklist and report results.

## Overrides & Theming
- Manage visual tokens and overrides in `sites/<slug>/overrides/custom.css`; it loads after the core styles for that site.
- Define shared color and spacing tokens at the top of that file (inside the `:root` block) so updates cascade site-wide.
- A responsive scaffolding block is prepped in that file with min/max breakpoints (1280, 1440, 1920, 991, 767, 478) to keep breakpoint-specific tweaks centralized.
- Update custom scripts in `sites/<slug>/overrides/custom.js`; they execute after the default script bundle in the matching `sites/<slug>/js/` directory.
- Manage fonts via `sites/<slug>/overrides/fonts-loader.js`:
  - Edit `FONT_CONFIG` entries (Google families + fallback stacks).
  - Mirror fallback stacks in the primary `sites/<slug>/css/` bundle’s `:root` variables.
  - Request only the weights used in design to keep WebFont payloads lean.

- Initial page builds may leave placeholder images. The dedicated workflow in `images/images-overview.md` covers sourcing, WebP conversion, alt text, and social share specs. During copy passes, leave every `<img>` `src` exactly as provided in the template—do not swap in icons or alternate assets even if they already exist in the repo.
- When converting assets, keep only the WebP file in `sites/<slug>/images/` and remove intermediate formats after optimization.

## Deployment & Ops
- Deployment settings live in `README.md`; automation must preserve each `sites/<slug>/` directory layout so Render continues to publish correctly.
- If additional utilities or scripts are required, keep sources in the repo root and emit final assets into the appropriate `sites/<slug>/` directory.

Always cross-check instructions here with `generate-website.md` and the linked docs before making changes. When you discover a new constraint, update this file (not the README) so automation stays aligned with human expectations.

## Collaboration Guidelines
- Keep the conversation proactive and transparent. Summaries of key deliverables and open questions should be surfaced without waiting for a prompt.
- For the walk-through on how to present Phase 1 artifacts (client overview, page hierarchy, scope assumptions), follow the detailed checklist in `generate-website.md`.
