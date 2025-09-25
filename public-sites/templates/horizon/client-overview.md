# Horizon Template — Client Overview (Sample)

## Template
horizon

## Brand Snapshot
- **Organization**: Progressive Way Therapy (Horizon implementation)
- **Modality**: Next.js 14 static export built with Tailwind and shadcn/ui
- **Mission**: Provide progressive, inclusive therapy resources across Texas with a modern interactive experience.
- **Approach**: Warm, welcoming design paired with accessible animations and responsive layouts.

## Audience & Needs
- Clients seeking therapy services in Texas (telehealth-focused).
- Individuals who value inclusive language, trauma-informed care, and identity-affirming support.
- Users browsing on mobile devices who expect fast, responsive interactions.

## Voice & Tone Guidelines
- Gentle, empathetic, and affirming; celebrate authenticity.
- Use inclusive language that acknowledges diverse identities and experiences.
- Balance warmth with clarity—provide actionable next steps after each section.

## Service Pillars
- Trauma & Recovery care (EMDR, sexual assault support, grief counseling).
- Anxiety, mood, and stress management.
- Identity and relationship support (LGBTQIA+ affirming, women’s issues).
- Community-focused, liberation-centered therapy practices.

## Differentiators
- Uses a modern component-driven UI with subtle motion and interactivity.
- Maintains the Vite/React design language while leveraging Next.js features (static export, metadata API).
- Warm earth-tone palette and typography establish trust and comfort.

## Operational Notes
- Primary contact CTA: “Book Free 15-Minute Consultation”.
- Navigation and footer content live in `src/components/Navigation.tsx` and `src/components/Footer.tsx`—update once, propagate everywhere.
- Static assets served from `public/assets`; reference via `/assets/...`.
- Run `npm run lint` and `npm run build` before shipping.

## Approved Page Scope *(example)*
- Home (`app/page.tsx`)
- About (`app/about/page.tsx`)
- Additional pages TBD based on client scope (create new route directories under `app/`).

## Section Usage Tracker *(example)*
| Page  | Hero | Services | WhyChooseUs | Testimonials | FinalCTA | Notes |
|-------|------|----------|-------------|--------------|----------|-------|
| Home  | Hero | Services | WhyChooseUs | Testimonials  | FinalCTA |      |
| About | Hero | —        | —           | —            | FinalCTA | Bio page uses About section |

## Sections Remaining To Use *(example)*
- New sections can be added to `src/components/` and registered in `config.yaml > page_generation.section_components` as needed.
