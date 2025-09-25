# Page Build & Edit Overview (Horizon)

This guide explains how to build or update pages for the Horizon template—the Next.js App Router implementation of Progressive Way Therapy. Use it alongside `templates/horizon/config.yaml` (canonical metadata + selectors), the section components under `src/components/`, and the site-specific `sites/<slug>/client-overview.md`.

## Global Rules
- **Canonical guardrails**: Follow the rules in `AGENTS.md` and values in `config.yaml` before making any edits.
- **Client components required**: All page-level files and interactive sections must start with `'use client'` to stay within the App Router boundary.
- **Use existing components**: Import sections from `src/components/` and UI primitives from `src/components/ui/`. Avoid re-creating HTML by hand—compose pages from the existing React components.
- **Tailwind tokens**: Reference the design tokens defined in `app/globals.css`. Add new tokens by extending `tailwind.config.ts` before using them in components.
- **Assets**: Reference imagery from `public/assets` using absolute paths (e.g., `/assets/hero-therapy.jpg`). Leave existing `src` attributes untouched while drafting copy; run `images/images-overview.md` workflow only after copy approval or explicit request.
- **Navigation & footer**: Use the shared components declared in `config.yaml > page_generation` (`Navigation.tsx`, `Footer.tsx`). Update them once per site, then reuse across pages.
- **Metadata**: Global defaults live in `app/layout.tsx`. Add page-specific metadata by exporting `const metadata` from the page file when needed.
- **Testing**: Validate builds with `npm run lint` and `npm run build` before handoff.

## Page Creation Workflow (per page)
1. **Plan the route**
   - Confirm the page appears in `client-overview.md > Approved Page Scope`.
   - Create a new directory under `app/` matching the route (e.g., `app/services/page.tsx`).

2. **Scaffold the page file**
   - Start the file with `'use client'`.
   - Import the required sections from `src/components/` (see `config.yaml > page_generation.section_components`).
   - If the page needs additional hooks or UI primitives, import them from `src/hooks/` or `src/components/ui/` as appropriate.

3. **Compose the layout**
   - Wrap the page content in the shared `<Navigation />` and `<Footer />` components, mirroring the structure in existing example pages.
   - Inside `<main>`, order the imported sections to match the approved outline. Use the Section Usage Tracker to balance layout variety.
   - When adding new components, ensure they render inside a `div` with page-level background classes consistent with our design tokens (e.g., `bg-background`).

4. **Populate copy & props**
   - Update section copy, CTA labels, and props to match the site brief in `client-overview.md`. Keep voice and length aligned with existing sections.
   - Rotate hero/CTA choices according to the `Sections Remaining To Use` tracker and any notes in `config.yaml`.
   - Do not modify `src` attributes for images at this stage.

5. **Optional metadata**
   - If the page requires unique metadata, export `const metadata: Metadata = { ... }` at the top of the file.
   - Reuse the voice and keywords from `client-overview.md` and confirm canonical URLs point to the correct route.

## Global Assembly
1. **Navigation updates**
   - Modify `src/components/Navigation.tsx` (and `MobileNavigation.tsx` if needed) to include new routes. Keep menu items synced between desktop and mobile variants.
   - Ensure nav links point to the Next.js routes (`/<slug>`), not `.html` paths.

2. **Footer adjustments**
   - Update `src/components/Footer.tsx` once, then verify the changes appear across all pages.

3. **Providers & layout**
   - If a page introduces new context providers or fonts, register them in `app/providers.tsx` or `app/layout.tsx` respectively.

4. **Imagery workflow**
   - When assets are ready, follow `images/images-overview.md` to replace placeholders. Keep filenames in `public/assets` consistent.

## Overrides & Theming
- Update shared colors and spacing tokens through the Tailwind layers in `app/globals.css`. When a new token is needed, extend `tailwind.config.ts` first so utility classes stay type-safe and consistent.
- Manage typography with `next/font` inside `app/layout.tsx`, mirroring the brand-approved pairings logged in `client-overview.md`. Register additional weights before referencing them in components.
- Horizon ships with the `lucide-react` icon library. When a section requires icon swaps, select from that package only after the brand voice and theming direction are approved. Treat icon choices as a visual token distinct from imagery—log decisions in `client-overview.md` so subsequent pages reuse the same set.
- For bespoke interactions or analytics, add lightweight scripts to `app/providers.tsx` or component-level effects rather than mutating the compiled output under `.next/` or `out/`.

## Final QA
- Run `npm run lint` and `npm run build` to catch type or static-export errors.
- Review the `## Section Usage Tracker` in `client-overview.md` to ensure layout rotation is satisfied.
- Click through all routes locally (`npm run dev`) and confirm navigation, footers, and metadata render as expected.
- Summarize QA findings, outstanding TODOs, and tracker status before handoff.

Following this process keeps Horizon pages consistent, accessible, and aligned with the Next.js static export constraints.
