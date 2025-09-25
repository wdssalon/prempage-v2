# Page Build & Edit Overview

This guide covers the end-to-end workflow for building net-new pages or editing existing ones while staying faithful to the Clarity template static export. Use it alongside `templates/clarity/config.yaml` (canonical metadata + selectors), `templates/clarity/sections.yaml` (section catalog), and the client-specific configs (`client-overview.md` if created yet, sampled located at `templates/clarity/client-overview.md`).

## Global Rules
- **Follow the canonical guardrails**: `AGENTS.md` and `config.yaml` capture the authoritative rules for structure, rotation, and required duplicates. The notes below call out Clarity-specific nuances.
- **Confirm approvals first**: do not begin page work until both `client-overview.md` and the page list have been approved per `generate-website.md` Phase 1.
- **Follow the scope log**: use the `## Approved Page Scope` section inside `client-overview.md` as the authoritative source for page order, priorities, and any sequencing instructions.
- **Start from the shell**: copy the file referenced at `config.yaml > scaffolding.page_shell` (currently `page-shell.html`) before you begin. It carries the full `<head>` setup, navigation/footer placeholders, and global scripts so each page stays consistent. Update the `<title>` and all SEO meta tags (description, canonical URL, OG/Twitter data, social image) as you go.
- **Shared blocks**: every page must include the navigation and footer components listed under `config.yaml > page_generation` (navigation block selector + footer block selectors). Place the navigation immediately after `<body>` and the footer wrappers before `</body>`.
- **Head + scripts**: keep all stylesheet/script references. Update `<title>`, meta description, canonical URL, OG/Twitter tags, and social share image so each page has unique, accurate SEO coverage.
- **Navigation parents**: when a navigation item simply groups child pages, leave it as a trigger without producing a standalone HTML page. Build that parent as its own page only if the user explicitly requests it.
- **Images**: keep the template-provided image references untouched while drafting copy. Do not change any `src` values (even to existing icons or assets). Image sourcing and optimization instructions live in `images/images-overview.md` and happen once copy is approved or stakeholders explicitly request updates.
- **Circle image sections**: `wds-circle-images-section-1` and similar blocks expect the template’s circular WebP portraits. Keep those image references intact until the dedicated image workflow provides replacements.
- **Section usage**: only use predefined sections listed in `templates/clarity/sections.yaml`. Always copy HTML sections from the component catalog referenced at `config.yaml > scaffolding.component_catalog` (currently `template.html`) exactly—never hand-type or partially rebuild them. This includes nested icons, slider/nav wrappers, visually hidden nodes, and `data-*` attributes. DO NOT create new structural elements. Treat the catalog file as read-only.
- **Section coverage log**: maintain the `## Section Usage Tracker` table in `client-overview.md`. Review it before outlining or selecting sections, and update the table immediately after each page is finalized so every layout is accounted for during the build.
- **Reference layouts**: the starter repo includes frozen examples under `templates/clarity/page-examples/`. Use them to understand baseline composition, not as drop-in replacements for the pages you generate in `sites/<slug>/`.
- **Special-case pages**: duplicate every page listed under `config.yaml > page_generation.duplicate_examples` (currently contact, blog, and blog detail pages) directly from `templates/clarity/page-examples/` before editing copy, links, and metadata. DO NOT EVER duplicate any other pages from that directory.
- **Content slots**: populate all required headings, CTAs, lists, and copy. If a slot isn’t needed, remove that element instead of leaving it blank.
- **Class/structure integrity**: never modify class names, wrapper divs, or data attributes. Change inner text and attributes (like `href`/`src`/`alt`) only.
- **Copy discipline**: keep character counts and sentence cadence close to the original to preserve layout and animations. Maintain the same number of bullets, testimonials, and CTAs unless intentionally redesigning.
- **Accessibility refresh**: update alt text and aria copy alongside imagery changes, keeping wording similar in length while accurately describing new visuals.
- **Editing existing pages**: audit the current markup before making changes, map each block to a known section, and follow the same outline/section/copy flow below—adjust content without altering the underlying structure.

## Page Creation Workflow (per page)
1. **Outline the page**
   - Draft (or review) a high-level outline of the content. Note where navigation/footers will sit (they’ll be inserted later).
   - Reference the site-specific `sites/<slug>/client-overview.md` (voice, priorities) alongside the template sample at `templates/clarity/client-overview.md` if you need a baseline.
   - When you circulate outlines for review, present them in a nested list so hierarchy and grouping are immediately clear.

2. **Select sections**
   - Map each outline item to a section ID from `templates/clarity/sections.yaml`.
   - Follow the hero rotation guidance documented in `config.yaml > rotation_rules.hero`. Record the hero used for each page in the tracker, review the last three hero entries before outlining the next page, and pick an unused variant before repeating one. If rotation cannot be satisfied (e.g., page requirements demand a specific hero), note the exception in the tracker.
   - Rotate closing CTA coverage per `config.yaml > rotation_rules.closing_cta`. Use the `## Section Usage Tracker` notes column to capture any intentional repeats.
   - Consult the `## Section Usage Tracker` to prioritize sections that have not yet been used. During the very first site build, cycle through the full catalog so every section style appears at least once—variety across pages keeps the launch set feeling bespoke.
   - Cross-check the `## Sections Remaining To Use` list in `client-overview.md` and intentionally target outstanding IDs when it supports the outline.
   - When editing, confirm the existing markup still aligns with approved sections; if not, swap it for the correct block from the component catalog noted in `config.yaml`.
   - Ensure each chosen section suits the content (services, testimonials, FAQ, etc.).

3. **Build (or confirm) the skeleton**
   - For new pages: make a copy of the shell referenced in `config.yaml > scaffolding.page_shell` and paste the relevant sections from the component catalog (`config.yaml > scaffolding.component_catalog`) between the markers defined at `config.yaml > page_generation.content_markers`.
   - After pasting each section, compare it to the source markup (diff tool or side-by-side) to ensure every node—from SVGs to hidden slider dots—matches exactly before editing copy.
   - For existing pages: verify the current structure matches the approved sections. If discrepancies exist, replace the block with the correct template markup.
   - Do not alter the underlying structure of each section; simply include or retain the required blocks in sequence.
   - Skip this step for navigation-only parent items—they remain label triggers unless the user signs off on building a full page.

4. **Populate copy**
   - Replace text inside each section according to the outline and brand voice.
   - Keep copy length close to the original to preserve layout.
   - Update CTA labels and URLs as needed.
   - Preserve inline spans, `<br>` tags, animation data attributes, and other structural helpers while swapping the text content.
   - Draft the headline + blurb that will feed the meta description and OG/Twitter snippets (aim for ~60-char titles and ~150-char descriptions).
   - Log the final section IDs for the page in the `## Section Usage Tracker`, update the `Hero Used` column, and mark `1`s in every section column that appears before advancing to navigation/footer work. Remove those IDs from the `## Sections Remaining To Use` list right away; navigation and footer components are handled during the global assembly pass and stay off this list.
   - When every page has reached this point, proceed to the Global Assembly steps below to wire nav/footers, metadata, and QA.

## Global Assembly
1. **Navigation + footer**
   - After the last page’s copy is locked, define the site navigation structure (with nesting where relevant) using the approved page list.
   - Replace the navigation placeholder in the shell with the block referenced by `config.yaml > page_generation.navigation_block_selector` (currently `#wds-navigation`) copied from the component catalog; the HTML comments mark the start/end of the component so you can grab it cleanly before updating labels and links.
   - Swap the footer placeholder with the block(s) listed under `config.yaml > page_generation.footer_block_selectors` (currently `#wds-footer-section-1` with nested `.footer-section-2`) and tailor their content.
   - Apply the finalized navigation and both footers across every page in the same pass so the markup remains identical site-wide.

2. **Finalize SEO metadata**
   - Fill in the `<title>`, `meta name="description"`, canonical URL, and robots directive in the `<head>` once navigation/footer links are final.
   - Match OG/Twitter title, description, and image fields to the page content. Leave the image fields on placeholders unless provided—specs live in `images/images-overview.md` (and `sites/<slug>/images/README.md` if present).
   - Confirm metadata stays unique per page, fits character limits, and references live URLs.

## Final QA
- Check that all required content slots are filled.
- Confirm links and CTA targets are correct.
- Ensure images load and alt text makes sense.
- Verify tone aligns with `client-overview.md` and copy lengths suit the design.
- Review the hero rotation log in `client-overview.md`. If `wds-parallax-section` has not headlined one of the last four completed pages, adjust the build sequence before progressing.
- Document outstanding TODOs or open questions so they can be resolved before handoff.

Following this process ensures each page remains faithful to the template while giving the LLM room to be creative with content, imagery, and layout choices.
