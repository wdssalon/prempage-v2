export const palette = [
  {
    name: "Sage Green",
    token: "--sage-green",
    usage: "Primary calls-to-action, high-trust highlights, hero gradients",
  },
  {
    name: "Nature Green",
    token: "--nature-green",
    usage: "Gradient depth, on-scroll accents, supportive CTAs",
  },
  {
    name: "Deep Forest",
    token: "--deep-forest",
    usage: "High-contrast headings, overlays on photography, dark sections",
  },
  {
    name: "Warm Tan",
    token: "--warm-tan",
    usage: "Section backgrounds, gentle cards, hover states",
  },
  {
    name: "Sunrise Peach",
    token: "--sunrise-peach",
    usage: "Accent ribbons, stats backgrounds, easing dense layouts",
  },
  {
    name: "Soft Cream",
    token: "--soft-cream",
    usage: "Copy on gradients, contrast text when backgrounds darken",
  },
  {
    name: "Soft Purple",
    token: "--soft-purple",
    usage: "Headlines, highlights, supportive accents",
  },
  {
    name: "Plum Mauve",
    token: "--plum-mauve",
    usage: "Contrast hover states, gradient anchors, callout borders",
  },
  {
    name: "Earth Brown",
    token: "--earth-brown",
    usage: "Body copy, muted icons, subtle borders",
  },
  {
    name: "River Stone",
    token: "--river-stone",
    usage: "Neutral type on warm surfaces, icon strokes, divider lines",
  },
  {
    name: "Cream",
    token: "--cream",
    usage: "Hero overlays, light gradients, typography contrast",
  },
];

export const gradientTokens = [
  {
    name: "Hero Mist",
    token: "--gradient-hero",
    usage: "Full-bleed hero backgrounds or over photography for legibility",
    className: "bg-gradient-hero motion-gradient-pan",
  },
  {
    name: "Warm Glow",
    token: "--gradient-warm",
    usage: "Section transitions, testimonials, gentle background panels",
    className: "bg-gradient-warm",
  },
  {
    name: "Forest Arc",
    token: "--gradient-nature",
    usage: "Primary CTA backplates, stats bands, navigation highlights",
    className: "bg-gradient-nature motion-gradient-pan",
  },
  {
    name: "Sunrise Wash",
    token: "--gradient-dawn",
    usage: "Warm overlays on portraits, onboarding strips, hero ribbons",
    className: "bg-gradient-dawn",
  },
  {
    name: "Evening Dusk",
    token: "--gradient-dusk",
    usage: "Contrast panels, footers, newsletter sign-ups with white copy",
    className: "bg-gradient-dusk motion-gradient-pan",
  },
];

export const fontOptions = [
  {
    name: "Playfair Display + Inter",
    headingClassName: "font-serif",
    bodyClassName: "font-sans",
    usage: "Warm editorial voice with modern support copy.",
    sampleHeading: "Grounded Healing Starts Here",
    sampleBody: "We pair poetic serif headlines with approachable sans-serif paragraphs.",
    isSelected: true,
  },
  {
    name: "Cormorant + Source Sans",
    headingClassName: "font-serif",
    bodyClassName: "font-sans",
    usage: "Softer serif with neutral sans body for academic tone.",
    sampleHeading: "Stories Worth Sharing",
    sampleBody: "This pairing leans into calm authority with generous letter spacing.",
  },
  {
    name: "Fraunces + Work Sans",
    headingClassName: "font-serif",
    bodyClassName: "font-sans",
    usage: "Rounded contrast for brands wanting playful elegance.",
    sampleHeading: "Care That Adapts",
    sampleBody: "Rounded serif strokes keep warmth while Work Sans maintains clarity.",
  },
];

export const colorOptions = [
  {
    name: "Sage & Sunrise",
    swatches: ["--sage-green", "--warm-tan", "--sunrise-peach"],
    usage: "High-trust primary treatment balancing warmth and calm.",
    description: "Blend sage gradients with sunrise accents for CTAs.",
    isSelected: true,
  },
  {
    name: "Forest & Cream",
    swatches: ["--deep-forest", "--soft-cream", "--river-stone"],
    usage: "Contrast-rich option for accessibility-first layouts.",
    description: "Lean on deep forest backgrounds with cream typography.",
  },
  {
    name: "Plum & Dawn",
    swatches: ["--soft-purple", "--plum-mauve", "--gradient-dawn"],
    usage: "Expressive palette for coaching or workshop highlights.",
    description: "Use plum gradients for features and dawn hues for testimonials.",
  },
];

export const writingStyleOptions = [
  {
    name: "Affirming & Direct",
    description: "Warm, strengths-based messaging with clear next steps.",
    sample:
      "You deserve support that sees every part of you. Together we name what hurts, practice what heals, and move forward at your pace.",
    isSelected: true,
  },
  {
    name: "Reflective & Narrative",
    description: "Story-driven copy inviting the reader into shared experiences.",
    sample:
      "Every session becomes a space to unpack the stories you’ve carried alone and craft new chapters with care and witness.",
  },
  {
    name: "Research-informed & Encouraging",
    description: "Light clinical framing paired with uplifting reassurance.",
    sample:
      "Rooted in evidenced approaches like EMDR and somatic grounding, our work keeps you anchored in the possibility of change.",
  },
];

export const toneVoice = {
  adjectives: ["Warm", "Affirming", "Grounded", "Direct"],
  sentenceLength: "2–3 clauses max; prefer active voice.",
  pov: "Second person with community-inclusive framing",
  tense: "Present-oriented with occasional future-facing support statements",
  vocabulary: ["liberation-based", "affirming care", "community", "healing", "grounded"],
  phrasesToAvoid: ["patients", "clinical intervention", "disorder"],
};

export const designPatterns = ["Organic shapes", "Soft gradients", "Subtle motion"];

export const typography = [
  {
    category: "Headings",
    label: "Heading · Hero",
    classes: ["heading", "is-hero"],
    sample: "Grounded Healing Starts Here",
    guidance:
      "Hero statements on bold backgrounds. Pair with `.heading.is-on-dark` over gradients or photography. Add `.is-condensed` when you need the same treatment at a smaller scale.",
  },
  {
    category: "Headings",
    label: "Heading · Display",
    classes: ["heading", "is-display"],
    sample: "A Safe Space for Your Authentic Self",
    guidance:
      "Use once per page for hero moments. Add `motion-fade-soft` for on-load animation. Apply `.is-condensed` to drop the size for denser layouts.",
  },
  {
    category: "Headings",
    label: "Heading · Section",
    classes: ["heading", "is-section"],
    sample: "Specialized Therapy Services",
    guidance: "Default for section intros. Combine with layout helpers such as `mb-6` or `max-w-3xl mx-auto`.",
  },
  {
    category: "Headings",
    label: "Heading · Subsection",
    classes: ["heading", "is-subsection"],
    sample: "Liberation-Based Healing",
    guidance:
      "Use inside cards or secondary columns. Override color with Tailwind utilities when the context demands it.",
  },
  {
    category: "Headings",
    label: "Heading · Feature",
    classes: ["heading", "is-feature"],
    sample: "Stories of Affirmation",
    guidance:
      "Anchor key sections or testimonial highlights. Works well inside `surface-highlight` or `surface-textured`.",
  },
  {
    category: "Specialty",
    label: "Heading · Eyebrow",
    classes: ["heading", "is-eyebrow"],
    sample: "TRAUMA-INFORMED",
    guidance: "Pre-head accent for stats, hero strips, or landing page sections. Use once per block before a larger heading.",
  },
  {
    category: "Specialty",
    label: "Heading · Quote",
    classes: ["heading", "is-quote"],
    sample: "“We heal in community.”",
    guidance: "Use within testimonials or pull quotes. Pair with `.text.is-caption` for attribution lines.",
  },
  {
    category: "Body & Support",
    label: "Text · Lead",
    classes: ["text", "is-lead"],
    sample: "Evidence-based, trauma-informed care tailored to your lived experience.",
    guidance:
      "Intro paragraphs that sit right under a heading. Combine with width utilities like `max-w-3xl`.",
  },
  {
    category: "Body & Support",
    label: "Text · Body",
    classes: ["text"],
    sample: "Inclusive, trauma-informed care for LGBTQIA+ and BIPOC communities.",
    guidance: "Default body copy. Add `text-muted-foreground` when you need gentle emphasis.",
  },
  {
    category: "Body & Support",
    label: "Text · Small",
    classes: ["text", "is-small"],
    sample: "Liberation-centered counseling rooted in justice.",
    guidance:
      "Use for supporting paragraphs inside cards or columns where body copy would feel heavy.",
  },
  {
    category: "Body & Support",
    label: "Text · Caption",
    classes: ["text", "is-caption"],
    sample: "Serving all of Texas via telehealth",
    guidance:
      "Supportive details, disclaimers, and labels. Pair with uppercase utilities only when necessary.",
  },
  {
    category: "Body & Support",
    label: "Text · Emphasis",
    classes: ["text", "is-emphasis"],
    sample: "Liberation-based therapy for every identity you hold.",
    guidance:
      "Drop-in emphasis line within bulleted lists or key statements. Use sparingly to keep hierarchy clear.",
  },
  {
    category: "Body & Support",
    label: "Text · Highlight",
    classes: ["text", "is-highlight"],
    sample: "Reflective, compassionate storytelling that invites trust.",
    guidance:
      "Use when body copy needs to pick up accent color within surfaces or testimonials.",
  },
  {
    category: "Body & Support",
    label: "Text · Serif",
    classes: ["text", "is-serif"],
    sample: "Grounded wisdom passed along with care and clarity.",
    guidance:
      "Bridge body copy with hero statements for narrative moments. Ideal for quotes within copy blocks.",
  },
  {
    category: "Specialty",
    label: "Text · Micro",
    classes: ["text", "is-micro"],
    sample: "Updated weekly",
    guidance:
      "Label content such as newsletter cadence, office hours, or supporting metadata.",
  },
  {
    category: "Specialty",
    label: "Text · Numeric",
    classes: ["text", "is-numeric"],
    sample: "12+ years facilitating community healing",
    guidance:
      "Use inside stats clusters or timelines. Pair with `heading.is-eyebrow` for compact data callouts.",
  },
  {
    category: "Specialty",
    label: "Text · Contrast",
    classes: ["text", "is-contrast"],
    sample: "Optimized for low-light overlays",
    guidance:
      "Use when copy sits on dark gradients or photography. Combine with `.heading.is-on-dark` or `.btn-contrast`.",
    previewClassName: "bg-deep-forest",
  },
];

const bySelection = <T extends { isSelected?: boolean }>(items: T[]): T | undefined =>
  items.find((item) => item.isSelected);

export const selectedFontOption = bySelection(fontOptions) ?? fontOptions[0];
export const selectedColorOption = bySelection(colorOptions) ?? colorOptions[0];
export const selectedWritingStyleOption =
  bySelection(writingStyleOptions) ?? writingStyleOptions[0];
