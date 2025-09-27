export type PaletteSwatch = {
  name: string;
  token: string;
  usage: string;
};

export type GradientToken = {
  name: string;
  token: string;
  className: string;
  usage: string;
};

export type TypographicToken = {
  label: string;
  classes: string[];
  sample: string;
  guidance: string;
};

export type VoiceCallout = {
  title: string;
  description: string;
};

export type HeroSample = {
  eyebrow: string;
  heading: string;
  body: string;
  ctaPrimary: string;
  ctaSecondary: string;
};

export type StyleVariant = {
  slug: string;
  title: string;
  subtitle: string;
  summary: string;
  palette: PaletteSwatch[];
  gradients: GradientToken[];
  typography: TypographicToken[];
  voice: VoiceCallout[];
  layoutNotes: string[];
  hero: HeroSample;
};

export const STYLE_VARIANTS: StyleVariant[] = [
  {
    slug: "style-guide-sunrise-haven",
    title: "Sunrise Haven",
    subtitle: "Warm, affirming gradients with grounded serif storytelling",
    summary:
      "Balances sage greens with sunrise peach accents for a compassionate, high-trust feel. Ideal for inclusive therapy practices seeking a soft glow without losing clarity.",
    palette: [
      { name: "Sage Green", token: "--sage-green", usage: "Primary buttons, hero gradients, trust badges" },
      { name: "Warm Tan", token: "--warm-tan", usage: "Section backdrops, card surfaces, feature highlights" },
      { name: "Sunrise Peach", token: "--sunrise-peach", usage: "Accent pills, stats ribbons, gentle overlays" },
      { name: "Soft Cream", token: "--soft-cream", usage: "Body copy on gradients, muted icons, subtle borders" },
    ],
    gradients: [
      { name: "Hero Mist", token: "--gradient-hero", className: "bg-gradient-hero motion-gradient-pan", usage: "Primary hero canvas and large CTA strips" },
      { name: "Warm Glow", token: "--gradient-warm", className: "bg-gradient-warm", usage: "Testimonials, pull quotes, calming callouts" },
      { name: "Dawn Horizon", token: "--gradient-dawn", className: "bg-gradient-dawn", usage: "Navigation hover states and subtle dividers" },
    ],
    typography: [
      {
        label: "Heading · Display",
        classes: ["heading", "is-display"],
        sample: "Grounded healing starts here",
        guidance: "Use for hero headlines on gradients. Pair with `.is-on-dark` when overlaying photography.",
      },
      {
        label: "Heading · Section",
        classes: ["heading", "is-section"],
        sample: "Therapy tailored to every story",
        guidance: "Default section intro. Keep max width at 32rem for comfortable scan.",
      },
      {
        label: "Text · Lead",
        classes: ["text", "is-lead"],
        sample: "We create a soft landing space with compassionate structure and practical tools.",
        guidance: "Use for intros and hero supporting copy. Limit to two sentences for rhythm.",
      },
      {
        label: "Button · Primary",
        classes: ["btn-primary", "is-on-dark"],
        sample: "Book a free consultation",
        guidance: "Lives on gradients or photography. Add `.w-full` on mobile for edge-to-edge presence.",
      },
    ],
    voice: [
      { title: "Tone", description: "Warm, affirming, and direct. Lead with encouragement before outlining next steps." },
      { title: "Vocabulary", description: "Use words like community, grounded, liberation-based, healing." },
      { title: "Avoid", description: "Clinical distance (patient, disorder) or jargon-heavy phrasing." },
    ],
    layoutNotes: [
      "Introduce organic blob shapes behind photography for depth.",
      "Balance warm sections with cream breathing room to prevent color fatigue.",
      "Pair gradients with subtle grain or noise for texture when needed.",
    ],
    hero: {
      eyebrow: "Telehealth therapy across Texas",
      heading: "A safe space for your authentic self",
      body: "We combine evidence-based care with inclusive community support so every session feels like a grounded exhale.",
      ctaPrimary: "Book a free consultation",
      ctaSecondary: "Explore services",
    },
  },
  {
    slug: "style-guide-evergreen-balance",
    title: "Evergreen Balance",
    subtitle: "Calming neutrals with forest depth and editorial refinement",
    summary:
      "Pairs deep forest greens with soft cream typography for a confident, contemporary feel suited to premium practices or boutique wellness brands.",
    palette: [
      { name: "Deep Forest", token: "--deep-forest", usage: "Hero backgrounds, navigation, footer anchors" },
      { name: "River Stone", token: "--river-stone", usage: "Secondary buttons, icon strokes, subtle dividers" },
      { name: "Soft Cream", token: "--soft-cream", usage: "Body copy, cards, backgrounds for longform content" },
      { name: "Plum Mauve", token: "--plum-mauve", usage: "Accent lines, form focus states, on-scroll indicators" },
    ],
    gradients: [
      { name: "Forest Arc", token: "--gradient-nature", className: "bg-gradient-nature motion-gradient-pan", usage: "CTA bands, plan comparison, pricing overlays" },
      { name: "Evening Dusk", token: "--gradient-dusk", className: "bg-gradient-dusk motion-gradient-pan", usage: "Event highlights, footer and newsletter opt-ins" },
      { name: "Warm Glow", token: "--gradient-warm", className: "bg-gradient-warm", usage: "Testimonials and success stories" },
    ],
    typography: [
      {
        label: "Heading · Display Condensed",
        classes: ["heading", "is-display", "is-condensed"],
        sample: "Care that grows with you",
        guidance: "Use on deep backgrounds with `.text-soft-cream` for high contrast.",
      },
      {
        label: "Heading · Subsection",
        classes: ["heading", "is-subsection"],
        sample: "Signature programs",
        guidance: "Great for program cards and collapsible details. Pair with `.tracking-tight`.",
      },
      {
        label: "Text · Body",
        classes: ["text"],
        sample: "Our collaborative approach blends somatic, narrative, and CBT tools for lasting change.",
        guidance: "Default body style. Increase `leading-relaxed` for dense paragraphs.",
      },
      {
        label: "Pill · Navigation",
        classes: ["rounded-full", "border", "border-soft-cream/20", "px-4", "py-1", "text-xs", "uppercase", "tracking-wide"],
        sample: "Featured",
        guidance: "Use for badges and filter chips. Transition to `.bg-soft-cream/10` on hover.",
      },
    ],
    voice: [
      { title: "Tone", description: "Steady, confident, and knowledgeable without feeling clinical." },
      { title: "Pacing", description: "Blend short invitations with supporting sentences for authority." },
      { title: "Signature phrases", description: "Evergreen support, grounded partnership, evidence-backed growth." },
    ],
    layoutNotes: [
      "Alternate forest and cream bands to maintain contrast and energy.",
      "Introduce split layouts with photography to showcase depth.",
      "Use thin border lines to echo the editorial aesthetic in cards and quotes.",
    ],
    hero: {
      eyebrow: "Premium telehealth practice",
      heading: "Strategic therapy for sustainable growth",
      body: "Pair long-term goals with weekly breakthroughs inside a collaborative, judgment-free container.",
      ctaPrimary: "Schedule a discovery call",
      ctaSecondary: "Download welcome kit",
    },
  },
  {
    slug: "style-guide-nocturne-focus",
    title: "Nocturne Focus",
    subtitle: "High-contrast night mode with focused CTA energy",
    summary:
      "Built for bold practices that thrive on late-night inspiration. Electric accents energize a charcoal base without sacrificing readability.",
    palette: [
      { name: "Ink Charcoal", token: "--deep-forest", usage: "Primary backgrounds, navigation, hero canvas" },
      { name: "Luminous Teal", token: "--sage-green", usage: "Primary CTAs, icon strokes, interactive states" },
      { name: "Neon Ember", token: "--sunrise-peach", usage: "Progress bars, accent dividers, stat highlights" },
      { name: "Mist Slate", token: "--river-stone", usage: "Body copy and supporting text on dark surfaces" },
    ],
    gradients: [
      { name: "Orbit Glow", token: "--gradient-hero", className: "bg-gradient-hero motion-gradient-pan", usage: "Hero and key CTA sections with animated backdrop" },
      { name: "Pulse Wave", token: "--gradient-dawn", className: "bg-gradient-dawn", usage: "Feature comparisons, timeline highlights" },
      { name: "Nightfall", token: "--gradient-dusk", className: "bg-gradient-dusk", usage: "Footer and newsletter prompts to keep depth" },
    ],
    typography: [
      {
        label: "Heading · Display Upper",
        classes: ["heading", "is-display", "uppercase"],
        sample: "Unlock night-time breakthroughs",
        guidance: "All-caps hero moment. Tighten letter spacing by -0.02em for compact energy.",
      },
      {
        label: "Text · Lead On Dark",
        classes: ["text", "is-lead", "is-on-dark"],
        sample: "A boldly-lit path for creatives and founders tackling complex challenges after hours.",
        guidance: "Pair with neon accent lines or icons for rhythm.",
      },
      {
        label: "Stat · Highlight",
        classes: ["text", "text-4xl", "font-semibold", "text-sunrise-peach"],
        sample: "94%",
        guidance: "Use for hero stats or proof points. Add `.drop-shadow` for glow.",
      },
      {
        label: "Button · Ghost",
        classes: ["btn-secondary", "bg-transparent", "border-sage-green/40", "text-soft-cream"],
        sample: "View success stories",
        guidance: "Place beside bright primary CTA to provide contrast with refined tone.",
      },
    ],
    voice: [
      { title: "Tone", description: "Motivational, precise, and future-focused." },
      { title: "Cadence", description: "Short, punchy sentences mixed with energizing imperatives." },
      { title: "CTA posture", description: "Lean into verbs like unlock, ignite, build, launch." },
    ],
    layoutNotes: [
      "Use generous padding and drop shadows to keep depth on dark backgrounds.",
      "Add animated underline or border accents on hover for CTA emphasis.",
      "Introduce blurred gradient orbs behind cards to create motion.",
    ],
    hero: {
      eyebrow: "Elite night-schedule coaching",
      heading: "Ignite breakthroughs after dark",
      body: "We partner with founders and creatives who do their best thinking when the world slows down.",
      ctaPrimary: "Book an evening session",
      ctaSecondary: "See founder stories",
    },
  },
];

export const DEFAULT_VARIANT_SLUG = STYLE_VARIANTS[0].slug;

export function getVariantBySlug(slug: string): StyleVariant {
  const variant = STYLE_VARIANTS.find((entry) => entry.slug === slug);
  if (!variant) {
    throw new Error(`Style guide variant not found for slug: ${slug}`);
  }
  return variant;
}
