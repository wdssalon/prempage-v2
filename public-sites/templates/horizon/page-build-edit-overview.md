# Horizon Template Supplement

Use this document alongside `public-sites/agents/guardrails.md`, the coordinator brief, and the role guides. It captures Horizon-specific nuances for the Next.js App Router workspace.

## Coordinator Hooks
- Horizon projects rely on the bundled Next.js workspace. During repo prep, run `python public-sites/scripts/bootstrap_horizon_site.py <site_slug>` if the site directory does not already contain the project scaffold.
- The horizon plugin requires the visual-system stage. Expect to generate three `/style-guide/<variant>` explorations and record the outcomes in `client-overview.md > ## Visual System` and `automation-state.json` before allowing skeleton work to begin.
- Style-guide tokens live in `app/style-guide/data.ts`; each exploration must include palette, typography, layout notes, and hero copy with CTA labels that map cleanly to draft pages.

## Skeleton Builder Guidance
- Every page-level component must start with `'use client'` to stay inside the App Router boundary.
- Compose pages from the shared library: import sections from `src/components/` and primitives from `src/components/ui/`. Avoid hand-written HTML—copy existing components verbatim or create new reusable components under the same directories when fresh layouts are required.
- Stick to the Tailwind token system defined in `app/globals.css` and `tailwind.config.ts`. Introduce new tokens in the config before referencing them, and reuse combo helpers such as `heading`, `text`, `is-display`, `is-section`, and button/surface classes.
- Variety is mandatory. Track recent layouts and alternate rhythms (staggered columns, split layouts, textured surfaces) so the site never repeats the same hero + three-card combo consecutively. Log new layout patterns in `client-overview.md > ## Visual System` so future passes know what already shipped.
- For navigation, wrap page content with the shared `<Navigation />` and `<Footer />` components and keep everything inside `<main>` aligned with the approved outline. Ensure new custom components render inside a `div` that applies the correct page-level background classes (for example `bg-background`).

## Visual System Workflow
- Populate three `STYLE_VARIANTS` entries in `app/style-guide/data.ts`. Each variant needs a slug prefixed with `style-guide-`, palette + gradient tokens, typography guidance, voice notes, and hero copy with CTA labels.
- The dynamic route at `/style-guide/[variant]` renders explorations automatically. Confirm `/style-guide` lists every variant with a descriptive summary and create a companion sample homepage under `/style-guide/<slug>/home` for each option.
- Skip the deprecated `/style-guide/options` deck. Direct reviewers to the generated variant URLs for feedback.
- After saving explorations, run `python agents/runner.py --site <slug> --template horizon style-guide --summary "<variant-notes>" --options "See /style-guide for variant list"` so the workflow state and client overview remain in sync.

## Design Tokens & Styling
- Default curvature is 0.75rem (`rounded-md`). Reserve pill shapes for explicit requests and apply `.is-on-dark` / `.is-on-light` modifiers when components leave their default backgrounds.
- Organic image frames live in `app/globals.css` (`organic-border`, `organic-border-soft`, `organic-border-wave`, `organic-border-tilt`). Pair them with `overflow-hidden` and `shadow-*` classes for varied silhouettes.
- Horizon ships with `lucide-react` icons. When swapping icons, stick to that package and log decisions in the client overview so later pages reuse the set.

## Copy & Assembly Notes
- Keep imagery placeholders intact until the imagery workflow in `images/images-overview.md` is requested. Do not touch `src` attributes during skeleton or copy passes.
- When navigation changes, update both `Navigation.tsx` and `MobileNavigation.tsx` so menus stay aligned across breakpoints.
- Register additional fonts or providers through `app/layout.tsx` or `app/providers.tsx` rather than modifying compiled output.
- Metadata defaults live in `app/layout.tsx`. Export `const metadata` from individual pages when custom titles or descriptions are required.

## QA Highlights
- Before handoff, run `pnpm lint` and `pnpm build` inside the site workspace. Address any static export issues uncovered by the checks.
- Review the `Section Usage Tracker` for hero rotation compliance and confirm navigation + footer components render identically on every route.
- During QA, click through pages locally (`pnpm dev`) to verify metadata, navigation links, and tracker notes match the shipped layouts.

Following these Horizon-specific notes in tandem with the global guardrails keeps the Next.js workspace consistent, accessible, and ready for release.
