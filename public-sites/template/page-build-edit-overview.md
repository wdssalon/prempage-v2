# Page Build & Edit Overview

This guide covers the end-to-end workflow for building net-new pages or editing existing ones while staying faithful to the Progressive Way Therapy static export. Use it alongside `template/sections.yaml` (section catalog) and the client-specific configs (`client-overview.md` if created yet, sampled located at `template/client-overview.md`).

## Global Rules
- **Confirm approvals first**: do not begin page work until both `client-overview.md` and the page list have been approved per `generate-website.md` Phase 1.
- **Follow the scope log**: use the `## Approved Page Scope` section inside `client-overview.md` as the authoritative source for page order, priorities, and any sequencing instructions.
- **Start from the shell**: copy `template/page-shell.html` before you begin. It carries the full `<head>` setup, navigation/footer placeholders, and global scripts so each page stays consistent. Update the `<title>` and all SEO meta tags (description, canonical URL, OG/Twitter data, social image) as you go.
- **Shared blocks**: every page must include the navigation (`navigation_primary`) immediately after `<body>` and the two footer sections (`footer_primary`, `footer_secondary`) before `</body>`.
- **Head + scripts**: keep all stylesheet/script references. Update `<title>`, meta description, canonical URL, OG/Twitter tags, and social share image so each page has unique, accurate SEO coverage.
- **Navigation parents**: when a navigation item simply groups child pages, leave it as a trigger without producing a standalone HTML page. Build that parent as its own page only if the user explicitly requests it.
- **Images**: leave placeholders during the build-and-copy phase. Image sourcing and optimization instructions live in `images/images-overview.md` and happen once copy is approved.
- **Section usage**: only use predefined sections listed in `template/sections.yaml`. Always copy html sections from `template/template.html` EXACTLY, DO NOT MAKE MISTAKES DURING THE COPY/PASTE. DO NOT create new structural elements. Treat the `template/template.html` file as read-only, NEVER update this file. 
- **Section coverage log**: maintain the `## Section Usage Tracker` table in `client-overview.md`. Review it before outlining or selecting sections, and update the table immediately after each page is finalized so every layout is accounted for during the build.
- **Reference layouts**: the starter repo includes frozen examples under `template/page-examples/`. Use them to understand baseline composition, not as drop-in replacements for the pages you generate in `public/`.
- **Special-case pages**: `contact.html`, `blog.html`, and all blog detail pages (inside `template/page-examples/blog/`) must be duplicated directly from their counterparts inside `template/page-examples/` before editing copy, links, and metadata. DO NOT EVER duplicate any other pages from `template/page-examples/`.
- **Content slots**: populate all required headings, CTAs, lists, and copy. If a slot isn’t needed, remove that element instead of leaving it blank.
- **Class/structure integrity**: never modify class names, wrapper divs, or data attributes. Change inner text and attributes (like `href`/`src`/`alt`) only.
- **Copy discipline**: keep character counts and sentence cadence close to the original to preserve layout and animations. Maintain the same number of bullets, testimonials, and CTAs unless intentionally redesigning.
- **Accessibility refresh**: update alt text and aria copy alongside imagery changes, keeping wording similar in length while accurately describing new visuals.
- **Editing existing pages**: audit the current markup before making changes, map each block to a known section, and follow the same outline/section/copy flow below—adjust content without altering the underlying structure.

## Page Creation Workflow
1. **Outline the page**
   - Draft (or review) a high-level outline of the content. Note where navigation/footers will sit (they’ll be inserted later).
   - Reference `client-overview.md` / `client-overview.md` for brand voice, tone, and key messages.
   - When you circulate outlines for review, present them in a nested list so hierarchy and grouping are immediately clear.

2. **Select sections**
   - Map each outline item to a section ID from `template/sections.yaml`.
   - For new builds, rotate the hero variants (`wds-hero-section-1`, `wds-hero-section-2`, `wds-hero-section-3`, `wds-parallax-section`). Record the hero used for each page in the tracker, review the last three hero entries before outlining the next page, and pick an unused variant before repeating one. If rotation cannot be satisfied (e.g., page requirements demand a specific hero), note the exception in the tracker. Ensure `wds-parallax-section` appears as the primary hero at least once in every four-page cycle; using it mid-page does not count toward this requirement.
   - Consult the `## Section Usage Tracker` to prioritize sections that have not yet been used. During the very first site build, cycle through the full catalog so every section style appears at least once—variety across pages keeps the launch set feeling bespoke.
   - Cross-check the `## Sections Remaining To Use` list in `client-overview.md` and intentionally target outstanding IDs when it supports the outline.
   - When editing, confirm the existing markup still aligns with approved sections; if not, swap it for the correct block from `template/template.html`.
   - Ensure each chosen section suits the content (services, testimonials, FAQ, etc.).

3. **Build (or confirm) the skeleton**
   - For new pages: make a copy of `template/page-shell.html` and paste the relevant sections from `template/template.html` between the `<!-- PAGE CONTENT START -->` and `<!-- PAGE CONTENT END -->` markers in order.
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

5. **Navigation + footer**
   - After the last page’s copy is locked, define the site navigation structure (with nesting where relevant) using the approved page list.
   - Replace the navigation placeholder in the shell with the `#wds-navigation` block copied from `template/template.html`; the HTML comments mark the start/end of the component so you can grab it cleanly before updating labels and links.
   - Swap the footer placeholder with the full `#wds-footer-section-1` wrapper (which includes the nested `.footer-section-2` block) and tailor its content.
   - Apply the finalized navigation and both footers across every page in the same pass so the markup remains identical site-wide.

6. **Finalize SEO metadata**
   - Fill in the `<title>`, `meta name="description"`, canonical URL, and robots directive in the `<head>` once navigation/footer links are final.
   - Match OG/Twitter title, description, and image fields to the page content. Leave the image fields on placeholders unless provided—specs live in `public/images/README.md`.
   - Confirm metadata stays unique per page, fits character limits, and references live URLs.

7. **Validation**
   - Check that all required content slots are filled.
   - Confirm links and CTA targets are correct.
   - Ensure images load and alt text makes sense.
   - Verify tone aligns with `client-overview.md` and copy lengths suit the design.
   - Review the hero rotation log in `client-overview.md`. If `wds-parallax-section` has not headlined one of the last four completed pages, adjust the build sequence before progressing.
   - Document outstanding TODOs or open questions so they can be resolved before handoff.

Following this process ensures each page remains faithful to the template while giving the LLM room to be creative with content, imagery, and layout choices.
