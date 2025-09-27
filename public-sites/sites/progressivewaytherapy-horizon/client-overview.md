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
    - General Individual Therapy (`/services/individual-therapy/general`)
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
| General Individual Therapy | Gradient hero (custom) |  |  |  |  |  | Live page – extended experience overview, identity badges, FAQs, closing CTA. |
| Counseling for Anxiety | Gradient hero (Counseling focus) |  |  |  |  | 1 | Live page – 5 sections (hero, lived-experience cards, support pillars, session practices, FinalCTA). |
| Therapy for Depression | Gradient hero (rest-focused) |  |  |  |  |  | Live page – hero mosaic, daily rhythm timeline, restorative anchors, session rhythm, gentle CTA (no shared FinalCTA). |
| Counseling for Trauma | Planned dusk overlay hero |  |  |  |  |  | Planned: 5 unique sections (trauma-informed hero, grounding commitments, safety lattice, repair pathways, invitation CTA). |
| Specialized Support |  |  |  |  |  |  | Pending outline |
| LGBTQIA+ Individual Therapy |  |  |  |  |  |  | Pending outline |
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
  Selected on 2025-09-27 after Phase 2.5 review:
  - Font pairing: Playfair Display (headings) + Inter (body) for a warm editorial tone with approachable supporting copy.
  - Color system: Sage & Sunrise palette (Sage Green, Warm Tan, Sunrise Peach) to balance trust, warmth, and conversion accents.
  - Writing style: Affirming & Direct voice emphasising inclusive language, clear next steps, and compassionate reassurance.
- Presented Options:
  Font Pairings
  1. Playfair Display + Inter (Selected)
     - Usage: Warm editorial hero statements with modern supporting paragraphs.
     - Heading sample: "Grounded Healing Starts Here"
     - Body sample: "We pair poetic serif headlines with approachable sans-serif paragraphs."
  2. Cormorant + Source Sans
     - Usage: Softer serif with neutral sans body for an academic, reflective tone.
     - Heading sample: "Stories Worth Sharing"
     - Body sample: "This pairing leans into calm authority with generous letter spacing."
  3. Fraunces + Work Sans
     - Usage: Rounded contrast suited for playful elegance and coaching content.
     - Heading sample: "Care That Adapts"
     - Body sample: "Rounded serif strokes keep warmth while Work Sans maintains clarity."
  Color Palettes
  1. Sage & Sunrise (Selected)
     - Swatches: --sage-green / --warm-tan / --sunrise-peach
     - Usage: High-trust primary treatment balancing warmth and calm; ideal for CTAs and hero gradients.
  2. Forest & Cream
     - Swatches: --deep-forest / --soft-cream / --river-stone
     - Usage: Contrast-rich system for accessibility-first layouts and longform content.
  3. Plum & Dawn
     - Swatches: --soft-purple / --plum-mauve / --gradient-dawn
     - Usage: Expressive palette for workshops, testimonials, and seasonal highlights.
  Writing Style Samples
  1. Affirming & Direct (Selected)
     - Description: Warm, strengths-based messaging with clear next steps.
     - Sample: "You deserve support that sees every part of you. Together we name what hurts, practice what heals, and move forward at your pace."
  2. Reflective & Narrative
     - Description: Story-driven copy inviting the reader into shared experiences.
     - Sample: "Every session becomes a space to unpack the stories you’ve carried alone and craft new chapters with care and witness."
  3. Research-informed & Encouraging
     - Description: Light clinical framing paired with uplifting reassurance.
     - Sample: "Rooted in evidenced approaches like EMDR and somatic grounding, our work keeps you anchored in the possibility of change."
