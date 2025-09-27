# Progressive Way Therapy — Client Overview

## Brand Snapshot
- **Owner**: Blanca (Bianca) Kleinfall, progressive-minded therapist based in Texas.
- **Practice**: Progressive Way Therapy — virtual-first individual therapy for adults statewide.
- **Mission**: Offer a safe, affirming space where marginalized adults can breathe, be themselves, and do the healing work that leaves them seen, heard, and empowered.
- **Approach**: Allyship-centered, trauma-informed sessions that combine validation, nervous system safety, and practical coping tools.

## Audience & Needs
- **Primary**: LGBTQIA+ adults in Texas who want non-faith-based therapy from a therapist who shares their progressive values.
- **Secondary**: BIPOC, immigrants, and first-generation clients balancing cultural expectations with personal wellbeing.
- **Tertiary**: Progressive-minded women navigating burnout, identity shifts, fertility journeys, miscarriage, or abortion care.
- **Shared Needs**: Immediate psychological safety, explicit inclusion, relief from carrying everything alone, and a therapist who understands the weight of systemic pressure.

## Positioning & Promise
- Blanca stands beside clients as a guide and ally, not above them as an expert.
- Sessions prioritize belonging, validation, and collaborative skill-building so clients leave grounded, understood, and resourced.
- Language is direct yet compassionate, acknowledging exhaustion without pathologizing identities or experiences.

## Voice & Tone Guidelines
- Warm, welcoming, and identity-forward; call audiences in by name (LGBTQ+, BIPOC, immigrants, non-faith-based adults).
- Empathetic and validating—recognize overwhelm and isolation before offering the path forward.
- Progressive and inclusive; avoid religious framing or clinical jargon.
- Empowering without urgency; CTAs invite at-your-pace engagement ("Book a free consultation," "Reach out when you're ready").

## Brand Pillars
1. **Safe Space** — Non-judgmental, trauma-informed care that honors lived experience and identities.
2. **Progressive Values** — Proudly inclusive, affirming, and non-religious therapy for adults statewide.
3. **Liberatory Healing** — Therapy as a way to reclaim identity, agency, and rest from systemic pressures.

## Visual & UX Direction
- Keep the current Horizon build aesthetic: soft purples, sage greens, and earthy neutrals with serif/sans-serif pairing.
- Preserve rounded cards, gentle gradients, and lucide-react iconography already in use.
- Maintain accessible contrast, generous whitespace, and calming motion cues that invite users to slow down.
- Photography should feel authentic and diverse, featuring LGBTQ+, BIPOC, immigrant, and multicultural stories.

## Navigation & Page Intent (Draft)
- **Home**: Immediate safe-space affirmation, core audience callouts, high-visibility consultation and inquiry CTAs.
- **About**: Blanca's story, lived experience, credentials, and progressive practice philosophy.
- **Services**: Individual therapy overview plus specialty focuses (anxiety, depression, trauma, LGBTQIA+, reproductive journeys, immigrant support).
- **Get Started**: Intake guidance, what to expect, appointment request flow, rates & insurance, privacy practices, FAQs.
- **Client Portal**: Direct access for existing clients with reminders of available resources (scheduling, paperwork, secure messaging).
- **Contact**: Invitation to reach out, Texas telehealth availability, preferred contact methods, hours, and alternative access accommodations.

## Approved Website Structure
- Home (`/`)
  - Purpose: Welcome progressive-minded adults with a calming hero, highlight core audiences, and surface the consultation CTA.
- About (`/about`)
  - Purpose: Introduce Blanca's story, values, credentials, and affirming approach so visitors feel an immediate connection.
- Services *(navigation trigger only; no standalone route)*
  - Individual Therapy *(section only; no standalone route)*
    - Purpose: Overview section affirming one-on-one care, outlining Blanca's progressive therapeutic lens and what to expect.
    - Individual Counseling (`/services/individual-therapy`)
      - Purpose: Speak to adults carrying everything alone, emphasizing validation, nervous system safety, and sustainable coping tools.
    - Counseling for Anxiety (`/services/individual-therapy/anxiety`)
      - Purpose: Address relentless anxiety and overthinking with grounding, boundary-setting, and progressive coping strategies.
    - Therapy for Depression (`/services/individual-therapy/depression`)
      - Purpose: Support exhausted adults moving through burnout, numbness, and low mood with compassionate structure.
    - Counseling for Trauma (`/services/individual-therapy/trauma`)
      - Purpose: Outline trauma-informed care that centers consent, pacing, and identity-affirming healing.
  - Specialized Support *(section only; no standalone route)*
    - Purpose: Frame progressive, identity-affirming specialties tailored to marginalized communities.
    - LGBTQIA+ Individual Therapy (`/services/specialized-support/lgbtq`)
      - Purpose: Celebrate queer and trans identities with affirming, liberation-focused care free from judgment.
    - Women's Issues (`/services/specialized-support/womens-issues`)
      - Purpose: Hold space for progressive women navigating identity shifts, caregiving pressure, and boundary repair.
    - Pregnancy Complications / Miscarriage (`/services/specialized-support/pregnancy-complications`)
      - Purpose: Validate complex reproductive journeys with grief-informed, choice-affirming support.
    - Abortion Support (`/services/specialized-support/abortion-support`)
      - Purpose: Provide non-judgmental, values-aligned counseling before and after abortion decisions.
  - Trauma & Recovery *(section only; no standalone route)*
    - Purpose: Describe Blanca's approach to deep healing after violence, loss, or systemic harm.
    - Sexual Assault / Sexual Abuse (`/services/trauma-recovery/sexual-assault-support`)
      - Purpose: Offer survivor-centered care focused on reclaiming autonomy and safety.
    - Domestic Violence & Toxic Relationships (`/services/trauma-recovery/domestic-violence-recovery`)
      - Purpose: Support clients disentangling from coercive dynamics while rebuilding self-trust.
    - Grief & Bereavement Counseling (`/services/trauma-recovery/grief-bereavement`)
      - Purpose: Companion clients through layered grief with ritual, remembrance, and progressive meaning-making.
    - Immigrant / Refugee Counseling (`/services/trauma-recovery/immigrant-refugee-support`)
      - Purpose: Center multicultural resilience and the realities of navigating life between cultures.
- Get Started *(navigation trigger only; no standalone route)*
  - Appointment Request (`/get-started/appointment-request`)
    - Purpose: Guide visitors through inquiry submission, scheduling expectations, and next steps.
  - Privacy Practices (`/get-started/privacy-practices`)
    - Purpose: Explain confidentiality, telehealth boundaries, and records handling in accessible language.
  - FAQs (`/get-started/faqs`)
    - Purpose: Answer common questions around therapy fit, session flow, and progressive values alignment.
  - Rates & Insurance (`/get-started/rates-insurance`)
    - Purpose: Outline investment, superbill guidance, sliding scale availability, and payment logistics.
- Client Portal (`/client-portal`)
  - Purpose: Give current clients quick access to scheduling tools, forms, and secure messaging reminders.
- Contact (`/contact`)
  - Purpose: Offer multiple ways to reach Blanca, clarify Texas telehealth availability, and note accessibility accommodations and response expectations.

## Section Usage Tracker
| Page | Hero Used | About | Services | WhyChooseUs | Testimonials | FinalCTA | Notes |
|------|-----------|-------|----------|-------------|--------------|----------|-------|
| Home | Hero component |  | 1 | 1 | 1 | 1 | Live page – core marketing stack finalized (Hero → Services → WhyChooseUs → Testimonials → FinalCTA). |
| About | Gradient editorial hero | 1 |  |  |  |  | Live page – AboutSection plus philosophy, journey timeline, collaborative care CTA. |
| Individual Therapy | — |  |  |  |  |  | Not started – needs succinct overview route before specialty details. |
| Individual Counseling | Gradient hero (custom) |  |  |  |  |  | Live page – extended experience overview, identity badges, FAQs, closing CTA. |
| Counseling for Anxiety | Gradient hero (Counseling focus) |  |  |  |  | 1 | Live page – 5 sections (hero, lived-experience cards, support pillars, session practices, FinalCTA). |
| Therapy for Depression | Gradient hero (rest-focused) |  |  |  |  |  | Live page – hero mosaic, daily rhythm timeline, restorative anchors, session rhythm, gentle CTA (no shared FinalCTA). |
| Counseling for Trauma | Gradient hero (grounded) |  |  |  |  |  | Live page – hero, grounding commitments, safety lattice, repair pathways, invitation CTA. |
| Specialized Support | Gradient hero (identity mosaic) |  |  |  |  |  | Live page – hero mosaic, affirmation bands, specialty spotlights, care pathways, nurturing CTA. |
| LGBTQIA+ Individual Therapy | Gradient hero (identity mosaic) |  |  |  |  |  | Live page – hero, affirmation pledge, spectrum spotlights, liberation loops, nurturing CTA. |
| Women's Issues |  |  |  |  |  |  | Pending outline |
| Pregnancy Complications / Miscarriage |  |  |  |  |  |  | Pending outline |
| Abortion Support |  |  |  |  |  |  | Pending outline |
| Trauma & Recovery |  |  |  |  |  |  | Pending outline |
| Sexual Assault / Sexual Abuse |  |  |  |  |  |  | Pending outline |
| Domestic Violence & Toxic Relationships |  |  |  |  |  |  | Pending outline |
| Grief & Bereavement Counseling |  |  |  |  |  |  | Pending outline |
| Immigrant / Refugee Counseling |  |  |  |  |  |  | Pending outline |
| Appointment Request |  |  |  |  |  |  | Pending outline |
| Privacy Practices |  |  |  |  |  |  | Pending outline |
| FAQs |  |  |  |  |  |  | Pending outline |
| Rates & Insurance |  |  |  |  |  |  | Pending outline |
| Client Portal |  |  |  |  |  |  | Pending outline |
| Contact |  |  |  |  |  |  | Pending outline |

## Sections Remaining To Use
- Testimonials (needs second use)

## Section Catalog
| Section ID | Page / Scope | Description |
|------------|--------------|-------------|
| global--navigation | Global | Desktop navigation bar with dropdown menus. |
| global--navigation-mobile | Global (mobile) | Mobile toolbar navigation trigger. |
| global--navigation-mobile-overlay | Global (mobile) | Full-screen mobile navigation overlay and panels. |
| global--footer | Global | Shared footer with contact details, links, and crisis note. |
| home--liberation-hero | Home | Landing hero highlighting liberation-focused care. |
| home--services-overview | Home | Services grid outlining core practice areas. |
| home--why-choose | Home | Reasons-to-choose carousel with trust metrics. |
| home--stories | Home | Rotating testimonial slider. |
| home--closing-invite | Home | Final consultation invitation with multi-step CTA cards. |
| about--core-bio | About | Primary bio block introducing Blanca. |
| about--philosophy | About | Therapeutic philosophy cards. |
| about--journey | About | Professional journey timeline. |
| about--collaboration | About | Collaborative care + session rhythm section. |
| about--cta | About | Contact CTA inviting consultations. |
| individual-general--arrival-hero | Individual Counseling | Gradient hero with trust badges. |
| individual-general--belonging | Individual Counseling | Belonging-focused intro and safety highlights. |
| individual-general--session-rhythm | Individual Counseling | Co-authored session rhythm steps. |
| individual-general--modalities | Individual Counseling | Modalities grid with supportive quote. |
| individual-general--identity | Individual Counseling | Identity-centered care badges. |
| individual-general--micro-testimonials | Individual Counseling | Micro-testimonial carousel strip. |
| individual-general--resources | Individual Counseling | Between-session resource cards. |
| individual-general--faqs | Individual Counseling | FAQ accordion with link to full list. |
| individual-general--closing-cta | Individual Counseling | Closing CTA encouraging consultations. |
| individual-anxiety--hero | Counseling for Anxiety | Consent-focused anxiety hero. |
| individual-anxiety--how-it-feels | Counseling for Anxiety | Cards reframing lived anxiety signals. |
| individual-anxiety--support-pillars | Counseling for Anxiety | Support pillars trio. |
| individual-anxiety--session-practices | Counseling for Anxiety | Session practice cards and CTA. |
| individual-anxiety--closing-cta | Counseling for Anxiety | Shared final CTA component tailored for anxiety. |
| individual-depression--hero | Therapy for Depression | Rest-focused hero and highlights. |
| individual-depression--daily-rhythm | Therapy for Depression | Day-in-the-life burnout timeline. |
| individual-depression--restorative-anchors | Therapy for Depression | Restorative anchors trio. |
| individual-depression--session-plan | Therapy for Depression | Session rhythm with numbered steps. |
| individual-depression--invitation | Therapy for Depression | Gentle invitation CTA. |
| individual-trauma--hero | Counseling for Trauma | Trauma-believing hero with highlights. |
| individual-trauma--grounding-commitments | Counseling for Trauma | Grounding commitments stack. |
| individual-trauma--safety-lattice | Counseling for Trauma | Four-part safety lattice framework. |
| individual-trauma--repair-pathways | Counseling for Trauma | Repair pathway step cards. |
| individual-trauma--invitation | Counseling for Trauma | Closing invitation CTA for trauma support. |
| specialized-support--hero | Specialized Support | Identity mosaic hero with overlapping gradients and tile stack. |
| specialized-support--affirmations | Specialized Support | Gradient affirmation bands highlighting justice commitments. |
| specialized-support--spotlights | Specialized Support | Specialty spotlight grid covering core community focuses. |
| specialized-support--care-pathways | Specialized Support | Three-step care pathway stack (Align, Design, Sustain). |
| specialized-support--cta | Specialized Support | Nurturing closing CTA with highlights column. |
| individual-lgbtq--hero | LGBTQIA+ Individual Therapy | Identity mosaic hero with pronoun chips and gradients. |
| individual-lgbtq--affirmation-pledge | LGBTQIA+ Individual Therapy | Liberation affirmation pledge split layout. |
| individual-lgbtq--spectrum-spotlights | LGBTQIA+ Individual Therapy | Specialty spotlights grid covering core community focuses. |
| individual-lgbtq--liberation-loops | LGBTQIA+ Individual Therapy | Three-phase liberation loop cards. |
| individual-lgbtq--cta | LGBTQIA+ Individual Therapy | Closing CTA with resource highlights column. |






## TODOs
- [x] Move structure details from "Approved Website Structure" into the Horizon template starter so future projects inherit the expanded hierarchy.
- [x] Confirm Tailwind tokens in `app/globals.css` still reflect the soft purple, sage green, and earth brown palette before extending for new sections.
- [x] Verify `app/layout.tsx` is loading the Playfair Display + Inter pairing; add weight variants if future sections need additional emphasis.
- [x] Maintain `lucide-react` icons (Heart, Shield, Video, Calendar) as the core set and select complementary inclusive icons for new sections as they are outlined.
- [ ] Draft Phase 3 section outlines for Home and About to confirm hero/section rotation before coding.
- [ ] Capture any new section IDs we introduce in `templates/horizon/config.yaml` if we expand beyond the current catalog.

## Content Guardrails
- Lead every page with belonging and psychological safety before logistics or CTAs.
- Name identities explicitly; never imply inclusion.
- Emphasize collaborative phrasing: "we'll explore," "together we'll," "with Blanca's support."
- Keep copy free of religious framing and overt sales pressure.
- Limit repetition—each section should feel unique, novel, and grounded in Blanca's voice.

## Success Markers
- Visitors feel recognized and calmer within the hero content on every page.
- Navigation flows naturally toward consultation booking without feeling pushy.
- Copy, visuals, and CTAs consistently echo Blanca's progressive, affirming ethos.

## Visual System
- Style guide route: `app/style-guide/page.tsx`
- Selected System Summary:
  variant summary
- Presented Options:
  variant options
