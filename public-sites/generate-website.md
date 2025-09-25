# Website Generation Overview

This guide summarizes the end-to-end flow for producing a website build inside this repository. Use it as the high-level map; refer to the more detailed docs (noted below) when you need step-by-step execution instructions.

## Phase 0: Repo + Tooling Context
- Run through `new-website-repo-checklist.md` to create a fresh repository (or confirm the current repo was already cloned from the starter) before beginning any Phase 1 work.
- Review `AGENTS.md` for the authoritative guardrails on directory layout, overrides, fonts, colors, and deployment.
- Open `sites/<slug>/client-overview.md` to confirm the active project brief and note the `Template` value (e.g., `clarity`, `horizon`). That selector determines which tooling set to use.
- Ensure your working copy inside the target `sites/<slug>/` directory matches the current export; rely on the assets in `tooling/<template-slug>/` (`template.html`, `sections.yaml`, `page-shell.html`, `page-build-edit-overview.md`, `page-examples/`) during later phases.

## Phase 1: Intake & Discovery
1. **Receive the brief**
   - The user supplies a content packet describing the client, their services, audience, tone, and any must-have messaging or assets. This is likely a url to their existing (old) website or the html source code dump of the home page of their existing (old) website.
2. **Synthesize the brief into `client-overview.md`**
   - Begin from the canonical template stored at `tooling/<template-slug>/client-overview.md`; reference it before creating the site-specific `client-overview.md` under `sites/<slug>/`.
   - Capture the core facts about the client, the project goals, audience, and positioning.
   - Unless stated otherwise by the user, use the content provided to asertain the writing voice, tonal guardrails, and key phrases as the foundation for the copy/content/style which the LLM will use across the new website. 
3. **Create the page list**
   - Identify every page the site requires (home, about, services, blog landing, detail pages, etc.), referencing the brief and any legacy URLs.
   - When outlining navigation, default to treating any parent item with child pages as a navigation-only trigger. Do not plan a standalone HTML page for that parent unless the user explicitly requests one.
   - Unless stated otherwise by the user, use the existing page structure for the first draft.
   - Share the proposed list (with a short purpose note for each page) so the user can confirm scope before builds begin.
4. **Get sign off by user**
   - Present both `client-overview.md` and the draft page list for approval.
   - Share the summary and outline directly in chat without waiting for a follow-up request—include file path references and format the page list as a nested hierarchy so structure is obvious.
   - If the navigation starts to feel crowded, suggest concise label options or grouping ideas in the same update so the user can respond quickly. But never remove items in the navigation until you are told to do so by the user.
   - Capture any revisions from the user and hold further work until both artifacts are confirmed.
   - Once approved, append a new `## Approved Page Scope` section to `client-overview.md` that captures the final list, priorities, and sequencing notes so the build plan lives alongside the brand guidance.


## Phase 2: Plan the Page Set
1. **Record the approved scope**
   - Populate the `## Approved Page Scope` section in `client-overview.md` with the confirmed page list, priorities, and sequencing guidance from the user so the build order is clear for future steps.
   - Add a `## Section Usage Tracker` matrix beneath the approved scope. Include a `Hero Used` column and one column for each high-priority section family so you can mark a `1` whenever that block appears on a page and surface repetition in real time.
   - Create a `## Sections Remaining To Use` list right after the tracker. Seed it with every content-section `element_id` from `tooling/<template-slug>/sections.yaml` (exclude navigation and footer components). When the list empties, immediately repopulate it with any sections that have fewer than two uses recorded in the tracker so second-pass builds still promote variety.
2. **Create working copies**
   - Duplicate `tooling/<template-slug>/page-shell.html` into the relevant site folder (e.g., `sites/<slug>/about.html`) for each approved page before starting copy. Skip navigation-only parents; they do not receive their own HTML file unless the user asks for one. The shell preloads global styles, scripts, and placeholders for actual pages.
   - Consult the frozen layouts in `tooling/<template-slug>/page-examples/` for inspiration, but remember the live build should generate fresh HTML under `sites/<slug>/`. **Exception**: When building `contact.html`, `blog.html`, or any blog detail page, copy the canonical markup directly from their counterparts in the same template family (e.g., `tooling/clarity/page-examples/contact.html`) and treat those files as the master versions. Update only the content, metadata, and links required for the live export.

## Phase 3: Build Each Page
For every page, repeat the following sequence:
For Contact and Blog pages, skip the outline/section selection steps below and instead duplicate the corresponding example file before tailoring copy, links, and metadata. Acceptable sources are the matching template family’s references (e.g., `tooling/clarity/page-examples/contact.html`, `tooling/clarity/page-examples/blog.html`, and the detail-page HTML inside that directory). DO NOT EVER apply this shortcut to any other page type.
1. **Outline the page**
   - Draft a section-by-section outline that meets the brief and leaves space for the global navigation/footer placeholders.
2. **Select template sections**
   - Map outline items to IDs listed in `tooling/<template-slug>/sections.yaml` and gather the matching markup from `tooling/<template-slug>/template.html`.
   - Never edit `tooling/<template-slug>/template.html`; copy the sections you need and leave the source file unchanged.
   - Never introduce new structural elements—always rely on the predefined template sections.
   - Review the `## Section Usage Tracker` before locking selections so under-used layouts get priority. On an initial full-site build, rotate through the available section styles so every unique layout ships at least once; the launch set should showcase the whole system.
   - Follow the `## Layout Rotation Checklist` in `client-overview.md` while outlining so you hit the hero rotation rules and introduce at least one section not present in the last two pages.
3. **Assemble the skeleton**
   - Paste the chosen sections between the `<!-- PAGE CONTENT START -->` markers inside the page shell.
   - Copy the entire section exactly as it appears in `tooling/<template-slug>/template.html` (or the approved source page). Do not hand-recreate markup—this includes SVG icons, slider arrows/dots, visually hidden helpers, and `data-*` attributes.
   - Maintain original class names, wrappers, and data attributes. After pasting, compare against the source block to confirm the structure matches 1:1 before moving on.
4. **Populate copy**
   - Rewrite every text element using the tone and voice codified in `client-overview.md`.
   - Keep character counts close to the original template to preserve layout balance and interaction timing.
   - Update CTA targets, internal links, and alt text placeholders as needed—only adjust literal text/attribute values. If you need extra list items or cards, duplicate the template element instead of altering surrounding markup.
   - Update the `## Section Usage Tracker` entry for this page with the final section IDs, the hero selection, and `1`s in each relevant section column before moving to the next build.
   - Immediately remove those IDs from the `## Sections Remaining To Use` list so the outstanding inventory stays accurate. If the list empties, restock it with any sections that still show fewer than two uses in the tracker. Navigation and footer components are managed during the global assembly phase and are not part of this list.
5. **Stash imagery placeholders**
   - Leave image references as-is. Do not update any image references at this stage—this includes avoiding swaps to alternate assets already in the repo (icons, logos, etc.). There is a dedicated workflow for updating images, which lives in `images/images-overview.md`, and this will be done at a later stage.

## Phase 4: Site-Wide Assembly
1. **Finalize navigation**
   - Once all pages exist, design the site navigation structure (top-level items plus nesting where appropriate).
   - Treat top-level items with child pages as navigation-only triggers unless the user has approved a standalone page for that label.
   - Replace the shell placeholders on every page with the `navigation_primary` block (`#wds-navigation`) from `tooling/<template-slug>/template.html`, using the comment markers to copy the full component and updating links to the correct `.html` files.
2. **Add shared components**
   - Insert both approved footer sections—`footer_primary` (`#wds-footer-section-1`) and the nested `footer_secondary` block (`.footer-section-2`)—from `tooling/<template-slug>/template.html` into each page, customizing contact details and links as required. The comment markers in the template show the exact start and end points.
   - Apply navigation and footer updates only after copy is locked so the same structure appears on every page.
3. **Lock in page metadata**
   - Update the `<title>`, meta description, canonical URL, robots directive, and OG/Twitter tags, and anything else inside each page’s `<head>` that has the `UPDATE` placeholder. Use the placeholders in the selected `tooling/<template-slug>/page-shell.html` as a checklist.
   - Double-check that metadata reflects the final navigation labels and destinations.

## Phase 5: QA Check-in
- Verify that every page references only the allowed sections, and that navigation + footers are identical across the site.
- Review the `## Section Usage Tracker` to confirm the hero rotation and layout rotation rules have been met (including `wds-parallax-section` serving as a hero in the last four-page cycle).
- Run through the relevant `tooling/<template-slug>/page-build-edit-overview.md` for the deeper validation checklist (links, alt text, SEO metadata, etc.).
- Summarize QA findings (including outstanding TODOs) for the user before handoff.

Keep this document updated as new steps (imagery, QA, deployment) are formalized so it remains the authoritative starting point for any new build.
