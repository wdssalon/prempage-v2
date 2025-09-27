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
- `sites/<slug>/client-overview.md`: the active project brief and build tracker for each live site. Derive the template kit from the site slug suffix (e.g., `*-clarity`, `*-horizon`) or the co-located configuration files when you need to pull assets from `templates/<template-slug>/`.
- `public-sites/scripts/bootstrap_horizon_site.py`: utility that copies the Horizon Next.js boilerplate into a site directory and runs `pnpm install`. Use it during repo prep whenever the Horizon workspace is missing.
- `public-sites/scripts/extract_site.py`: helper that posts to the `static-site-extractor` service and stores the structured JSON response under `sites/<slug>/artifacts/`. Run it during Intake when a legacy site URL is provided.

Keep these sources authoritative—do not duplicate instructions elsewhere.

## Repository Layout
- `sites/`: production-ready exports organized by site slug (e.g., `sites/<client-slug>-<template>/`). Directory structure depends on the template family—static kits like Clarity ship HTML bundles with an `overrides/` folder, while app-driven kits like Horizon include the full Next.js project (`app/`, `.next/`, `out/`, etc.). Every site folder contains the canonical `client-overview.md` for that build plus any template-specific override entry points detailed in the template’s build guide.
- `templates/`: reusable building blocks grouped by template family (currently `clarity/` and `horizon/`, with more to come). Each family includes structured config (`config.yaml`), build guide, sample client overview, component/catalog references, and page examples.
- Repo root: documentation (`README.md`, `generate-website.md`, this file) and any additional utilities you introduce.

## Editing Guardrails
*This section is the canonical rule set for all template families. Other docs may reference these guardrails, but new or updated requirements must land here first.*
- Enforce the structural rules in the relevant `templates/<template-slug>/page-build-edit-overview.md`—that document governs section selection, copy swaps, and QA cadence.
- When you need canonical identifiers (hero variants, nav selectors, required duplicates), read them from `templates/<template-slug>/config.yaml` and avoid hard-coding values elsewhere.
- When reusing markup/components, use the canonical implementation the template provides (copy the static block, import the shared component, hook up the CMS partial). Never retype or rebuild portions by hand. This includes nested SVGs, slider/nav wrappers, hidden accessibility helpers, and `data-*` attributes—if it exists in the template, it must exist in the page.
- After integrating a section, only edit literal copy, alt text, or link targets. If copy changes require additional list items or cards, duplicate the template element and adjust the text rather than altering surrounding structure.
- Treat the template catalogs as read-only assets (`template.html`, component exports, etc.). Do not edit them directly.
- During the first end-to-end site build, ensure each distinct section style from the catalog is used at least once to deliver a varied launch experience. Use the `## Section Usage Tracker` table in `client-overview.md` to log the sections added to every page as you build.
- Before outlining any new page, scan the tracker to avoid duplicating the same five-section skeleton on consecutive specialty pages. Apply hero/CTA rotation rules from `config.yaml` + the template build guide so closing layouts stay varied once they ship.
- Maintain the `## Sections Remaining To Use` list in `client-overview.md`, removing section IDs once they have appeared on a page. This list only tracks content sections—navigation and footer components are handled separately during the global assembly pass.
- Keep `client-overview.md` strictly ASCII so automation tools and downstream scripts avoid encoding drift. Replace smart quotes, en/em dashes, or other Unicode characters with ASCII equivalents before saving updates.
- Use the frozen layouts in `templates/<template-slug>/page-examples/` as reference material only. If `config.yaml > page_generation.duplicate_examples` lists canonical pages (e.g., contact/blog for Clarity), duplicate only those examples when instructed.
- Treat navigation and footer updates as global operations: once finalized, propagate changes to every page via the appropriate shared component or static block.
- Populate page-level SEO metadata using the hooks defined by the selected template scaffold (`page-shell.html`, layout component, etc.).
- When a navigation item has child pages, treat the parent label as a navigation-only trigger. Do not generate a standalone HTML page for that parent unless the user explicitly requests one.

## Automation Workflow
Use the primary docs as the source of truth and walk through them in order:
- `generate-website.md` Intake & Discovery → intake, `client-overview.md`, and page list approval before any builds.
- `generate-website.md` Plan the Page Set → prep trackers and section inventory.
- `generate-website.md` Define the Visual System → generate three fully rendered style-guide variants (`/style-guide/<slug>`), log them in `client-overview.md`, and persist the decision via the runner before moving on.
- `generate-website.md` Build Page Skeletons and Draft Page Copy with `templates/<template-slug>/page-build-edit-overview.md` → build skeletons and draft copy page-by-page. For Horizon specifically, push for creative composition (no repeated layouts) while staying inside the approved style system.
  - Maintain the `## Approved Website Structure` section in `client-overview.md` as the canonical build sequence while working through those pages.
- `generate-website.md` Site-Wide Assembly with `templates/<template-slug>/page-build-edit-overview.md` steps 5-6 → roll in navigation, both footers, and finalize SEO metadata across the site.
- `generate-website.md` QA Check-in with `templates/<template-slug>/page-build-edit-overview.md` step 7 → complete the QA checklist and report results.
- Run `python agents/runner.py --site <slug> --template <template> init` whenever a new site slug is created or the workflow definition changes; the resulting `automation-state.json > workflow` block is the coordinator’s canonical execution map (stage toggles, plugin tools, hook extensions).

## Overrides & Theming
- Use the override entry points defined by the active template’s build guide (`templates/<template-slug>/page-build-edit-overview.md`). Static exports (Clarity) rely on the `overrides/` directory documented there, while app-based templates (Horizon) push changes through Tailwind tokens, shared components, or Next.js configuration.
- Keep visual tokens and global styles centralized—update the template-defined variable files or CSS/JS override hooks instead of editing compiled bundles (`css/`, `js/`, `.next/`, etc.).
- When additional scripts or fonts are required, follow the process in the relevant template guide so assets load after the core bundles without duplicating imports.

- Initial page builds may leave placeholder images. The dedicated workflow in `images/images-overview.md` covers sourcing, WebP conversion, alt text, and social share specs. During copy passes, leave every `<img>` `src` exactly as provided in the template—do not swap in icons or alternate assets even if they already exist in the repo.
- When converting assets, keep only the WebP file in `sites/<slug>/images/` and remove intermediate formats after optimization.

## Deployment & Ops
- Deployment settings live in `README.md`; automation must preserve each `sites/<slug>/` directory layout so Render continues to publish correctly.
- If additional utilities or scripts are required, keep sources in the repo root and emit final assets into the appropriate `sites/<slug>/` directory.

Always cross-check instructions here with `generate-website.md` and the linked docs before making changes. When you discover a new constraint, update this file (not the README) so automation stays aligned with human expectations.

## Collaboration Guidelines
- Keep the conversation proactive and transparent. Summaries of key deliverables and open questions should be surfaced without waiting for a prompt.
- For the walk-through on how to present Intake & Discovery artifacts (client overview, page hierarchy, scope assumptions), follow the detailed checklist in `generate-website.md`.
