# Website Generation Overview

This guide summarizes the end-to-end flow for producing a website build inside this repository. Use it as the high-level map; refer to the more detailed docs (noted below) when you need step-by-step execution instructions.

## Visual Process Flow
```
Phase 0: Repo & Tooling Prep
  - Run repo checklist
  - Review AGENTS guardrails
  - Confirm template + assets
      |
      v
Phase 1: Intake & Discovery
  - Capture client overview
  - Draft & confirm page list
      |
      v
Phase 2: Plan the Page Set
  - Log approved scope + trackers
  - Prep section inventory
      |
      v
Phase 2.5: Define Visual System
  - Generate or update style guide tokens
  - Lock voice, tone, and asset decisions
      |
      v
Phase 3: Build Page Skeletons
  - Create page scaffolds with the template
  - Outline pages & slot sections
      |
      v
Phase 4: Draft Page Copy
  - Rewrite on-page content
  - Update usage trackers
      |
      v
Phase 5: Site-Wide Assembly
  - Apply navigation + footers globally
  - Finalize metadata hooks
      |
      v
Phase 6: QA Check-in
  - Run template QA checklist
  - Report findings + TODOs
```

## Phase 0: Repo + Tooling Context
- Review `AGENTS.md` for the authoritative guardrails on directory layout, overrides, fonts, colors, and deployment.
- Open `sites/<slug>/client-overview.md` to confirm the active project brief. Use the site slug suffix (for example `*-clarity`, `*-horizon`) or the companion `render.yaml` file to identify which template kit is in play before pulling references from `templates/<template-slug>/`.
- Ensure your working copy inside the target `sites/<slug>/` directory matches the current export; gather the template resources in `templates/<template-slug>/` (`config.yaml` for structured metadata plus the catalog, scaffolds, checklists, and example pages) for reference during later phases.

## Phase 1: Intake & Discovery
1. **Receive the brief**
   - The user supplies a content packet describing the client, their services, audience, tone, and any must-have messaging or assets. This is likely a url to their existing (old) website or the html source code dump of the home page of their existing (old) website.
2. **Synthesize the brief into `client-overview.md`**
   - Begin from the canonical template stored at `templates/<template-slug>/client-overview.md`; reference it before creating the site-specific `client-overview.md` under `sites/<slug>/`.
   - Capture the core facts about the client, the project goals, audience, and positioning.
   - Log the brand’s visual tokens: note the approved palette, typography stack, and any icon style guidance supplied by the user. This becomes the reference for later theming decisions.
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
   - Once approved, append a new `## Approved Website Structure` section to `client-overview.md` that captures the final list, priorities, and sequencing notes so the build plan lives alongside the brand guidance.


## Phase 2: Plan the Page Set
1. **Record the approved scope**
   - Populate the `## Approved Website Structure` section in `client-overview.md` with the confirmed page list, priorities, and sequencing guidance from the user so the build order is clear for future steps.
   - Add a `## Section Usage Tracker` matrix beneath the approved scope. Include a `Hero Used` column and one column for each high-priority section family so you can mark a `1` whenever that block appears on a page and surface repetition in real time.
2. **Prep the section inventory**
   - Build a `## Sections Remaining To Use` list immediately after the tracker. Seed it with every content-section identifier from the template’s catalog (for example, the entries in `templates/<template-slug>/sections.yaml`).
   - Note any rotation rules or must-use sections in the tracker notes column before moving on so you can target them as skeletons are created.

3. **Confirm theming entry points**
   - Review `templates/<template-slug>/config.yaml > theming` to locate the override files for colors, fonts, and optional scripts.
   - Translate the approved palette and typography from `client-overview.md` into those override hooks (for example, seed CSS variables in `overrides/custom.css` or extend Tailwind tokens). Do not commit changes yet—record the plan in `client-overview.md > TODOs` so it guides implementation during skeleton builds.
   - If `theming.icon_library.type` is not `none`, select the icon family and primary glyphs that match the brand direction. Document the choice alongside the palette/typography notes. Skip icon selection entirely when the template reports `type: none` (Clarity behaves this way); treat in-section icons as imagery instead.

## Phase 2.5: Define the Visual System
1. **Confirm template support**
   - Check `templates/<template-slug>/config.yaml > style_guide`. If `enabled: true`, the coordinator must schedule a style-guide build before skeletons.
   - Locate the canonical style guide example (for Horizon: `app/style-guide/page.tsx`).
2. **Synthesize brand voice & tone**
   - Extract voice, tone, and writing patterns from `client-overview.md`. Document them under a `## Voice & Tone` block inside the style guide or the brief as instructed.
   - Capture approved vocabulary, tense preferences, and CTA guardrails so copy drafters mirror the same language.
3. **Define visual tokens**
   - Select palette tokens, typography stacks, spacing, button treatments, surfaces, and motion helpers using the template examples as references.
   - If imagery direction is provided, include sourcing rules (subjects, framing, color temperature) and list any required assets to locate during imagery workflow.
4. **Present options for approval**
   - Generate three candidate font pairings, three color palette treatments, and three writing style samples. Each option must render a visual preview (fonts/colors) or a paragraph-length copy sample (writing style).
   - Share the options with the human reviewer and record feedback. Do not finalize the style guide until a selection is confirmed.
5. **Persist the style guide**
   - Update the template style guide route (e.g., `app/style-guide/page.tsx`) with client-specific tokens, annotating the selected option.
   - Record the artifact path and decision summary in `automation-state.json` and link it from `client-overview.md > ## Visual System`.
6. **Approval gate**
   - Pause until the human reviewer approves the selected font, color, and writing style options before moving to page skeletons.


## Phase 3: Build Page Skeletons
For every approved page, repeat the following sequence. Follow any template-specific exceptions (for example, duplicating canonical pages) documented in the relevant `templates/<template-slug>/page-build-edit-overview.md`, and honor the canonical editing guardrails in `AGENTS.md` (copy sections/components exactly, no structural rewrites).
1. **Create working copies**
   - Use the scaffold provided by the active template to spin up a working file for each approved page (e.g., copy the static `page-shell.html`, generate a new route file, etc.). Skip navigation-only parents when the scope treats them as menu triggers—only create them if the user explicitly asks for a standalone page.
   - Consult the frozen layouts in `templates/<template-slug>/page-examples/` for inspiration, but generate fresh output in the target site workspace unless the template-specific guide explicitly instructs you to duplicate a canonical page.
2. **Outline the page**
   - Draft a section-by-section outline that meets the brief and leaves space for the global navigation/footer placeholders.
3. **Select template sections**
   - Map outline items to the canonical sections/components defined by the active template (e.g., entries in a `sections.yaml`, exported React components, CMS blocks).
   - Source the implementation directly from the template’s catalog rather than recreating it from scratch, and leave the canonical source files untouched.
   - Never introduce new structural elements—stick to the predefined building blocks for consistency.
   - Review the `## Section Usage Tracker` before locking selections so under-used layouts get priority. On an initial full-site build, rotate through the available section styles so every unique layout ships at least once; the launch set should showcase the whole system.
   - Follow the `## Layout Rotation Checklist` in `client-overview.md` while outlining so you hit the hero rotation rules and introduce at least one section not present in the last two pages.
4. **Assemble the skeleton**
   - Integrate the chosen sections into the page scaffold using the method the template expects (pasting markup between region markers, importing components, wiring CMS slots, etc.).
   - Preserve every wrapper, class name, and data attribute supplied by the template. After integration, compare against the source block to confirm the structure matches 1:1 before moving on.
   - Do not edit any copy yet; keep template placeholder text in place until Phase 4.
5. **Log structure choices**
   - Record the selected hero and section IDs in the `## Section Usage Tracker` with a note that copy is pending. This keeps rotation planning accurate even before content is drafted.
   - Leave the `## Sections Remaining To Use` list untouched until copy is finalized in Phase 4.

6. **Apply global theming**
   - Implement the palette and typography decisions using the override hooks captured in Phase 2 once the first skeleton is stable. Keep the changes scoped to the files listed under `config.yaml > theming`.
   - If the template exposes an icon library, swap component-level icon props at this point so that later copy passes reference the correct glyphs. Skip this step entirely when the template reports `theming.icon_library.type: none`.

## Phase 4: Draft Page Copy
1. **Populate copy**
   - Rewrite every text element using the tone and voice codified in `client-overview.md`.
   - Keep character counts close to the original template to preserve layout balance and interaction timing.
   - Update CTA targets, internal links, and alt text placeholders as needed—only adjust literal text/attribute values. If you need extra list items or cards, duplicate the template element instead of altering surrounding markup.
2. **Update trackers**
   - Update the `## Section Usage Tracker` entry for this page with any copy-related notes, confirm the hero selection, and mark `1`s in each relevant section column once the page is drafted.
   - Immediately remove those IDs from the `## Sections Remaining To Use` list so the outstanding inventory stays accurate. If the list empties, restock it with any sections that still show fewer than two uses in the tracker. Navigation and footer components are managed during the global assembly phase and are not part of this list.
3. **Hold imagery updates**
   - Leave image references as-is. Do not update any `src` values at this stage—this includes avoiding swaps to alternate assets already in the repo (icons, logos, etc.).
   - When stakeholders supply new assets or explicitly request imagery work, run the documented workflow in `images/images-overview.md` after copy is approved.

## Asset Pipeline (Before Phase 5)
- Drop imagery for a site under `sites/<slug>/images/`. Subfolders are supported; filenames should stay human-readable because the build script uses them as lookup keys. The folder remains gitignored, so keep originals in your working tree or external storage rather than committing them.
- Run `pnpm run assets:sync` inside `sites/<slug>/` whenever images change. The command runs automatically before `pnpm dev`, `pnpm build`, and `pnpm check`, but keep it handy for manual refreshes.
- The sync step generates hashed files in `public/assets/` (ignored by git) and emits `src/data/asset-manifest.json`. Components call `getAssetUrl("<filename>")` to pull the hashed path, which keeps React output, hydration, and static exports aligned.
- `public-sites/scripts/build-static-site.sh <slug>` now copies the Next.js `out/` folder into `public-sites/dist/<slug>/`, drops the manifest beside it as `assets-manifest.json`, and auto-sets `NEXT_PUBLIC_ASSET_BASE` to `${BUNNY_PULL_ZONE_BASE_URL}/${slug}` when a Bunny base URL is configured in `.env`/`.env.defaults` so the exported HTML points at the CDN.
- After the dist bundle exists, set the Bunny credentials (`BUNNY_STORAGE_ZONE`, `BUNNY_STORAGE_HOST`, `BUNNY_STORAGE_PASSWORD`, `BUNNY_PULL_ZONE_BASE_URL`, optional `BUNNY_API_KEY`) and run `pnpm run assets:upload` from the site directory. The helper uploads hashed assets to `${slug}/assets/` in storage, writes `assets-manifest.cdn.json` with CDN URLs, and purges cache when the API key is available.

## Phase 5: Site-Wide Assembly
1. **Finalize navigation**
   - Once all pages exist, design the site navigation structure (top-level items plus nesting where appropriate).
   - Treat top-level items with child pages as navigation-only triggers unless the user has approved a standalone page for that label.
   - Swap the scaffold placeholder for the template’s shared navigation implementation (copy/paste the static block, import the shared component, update a CMS partial, etc.) so every page pulls from the same source of truth. Update links to the correct routes/files.
2. **Add shared components**
   - Integrate the template’s global footer(s) or other shared blocks across every page, customizing contact details and links as required.
   - Apply navigation and footer updates only after copy is locked so the same structure appears on every page.
3. **Lock in page metadata**
   - Update page-level metadata (title, description, canonical URL, robots directive, OG/Twitter tags, social image) using the hooks/placeholders defined by the template scaffold.
   - Double-check that metadata reflects the final navigation labels and destinations.

## Phase 6: QA Check-in
- Verify that every page references only the allowed sections, and that navigation + footers are identical across the site.
- Review the `## Section Usage Tracker` to confirm the hero rotation and layout rotation rules have been met.
- Run through the relevant `templates/<template-slug>/page-build-edit-overview.md` for the deeper validation checklist (links, alt text, SEO metadata, etc.).
- Prepare the QA artifacts for handoff: updated `client-overview.md` tracker status, outstanding TODO list, and a brief QA summary covering blockers, follow-ups, and ready-to-ship pages.

Keep this document updated as new steps (imagery, QA, deployment) are formalized so it remains the authoritative starting point for any new build.
