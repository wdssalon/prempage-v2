import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const palette = [
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

const gradientTokens = [
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

type TypographyToken = {
  category: "Headings" | "Body & Support" | "Specialty";
  label: string;
  classes: string[];
  sample: string;
  guidance: string;
  previewClassName?: string;
};

const typography: TypographyToken[] = [
  {
    category: "Headings",
    label: "Heading · Hero",
    classes: ["heading", "is-hero"],
    sample: "Grounded Healing Starts Here",
    guidance: "Hero statements on bold backgrounds. Pair with `.heading.is-on-dark` over gradients or photography.",
  },
  {
    category: "Headings",
    label: "Heading · Display",
    classes: ["heading", "is-display"],
    sample: "A Safe Space for Your Authentic Self",
    guidance: "Use once per page for hero moments. Add `motion-fade-soft` for on-load animation.",
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
    guidance: "Use inside cards or secondary columns. Override color with Tailwind utilities when the context demands it.",
  },
  {
    category: "Headings",
    label: "Heading · Feature",
    classes: ["heading", "is-feature"],
    sample: "Stories of Affirmation",
    guidance: "Anchor key sections or testimonial highlights. Works well inside `surface-highlight` or `surface-textured`.",
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
    guidance: "Intro paragraphs that sit right under a heading. Combine with width utilities like `max-w-3xl`.",
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
    guidance: "Use for supporting paragraphs inside cards or columns where body copy would feel heavy.",
  },
  {
    category: "Body & Support",
    label: "Text · Caption",
    classes: ["text", "is-caption"],
    sample: "Serving all of Texas via telehealth",
    guidance: "Supportive details, disclaimers, and labels. Pair with uppercase utilities only when necessary.",
  },
  {
    category: "Body & Support",
    label: "Text · Emphasis",
    classes: ["text", "is-emphasis"],
    sample: "Liberation-based therapy for every identity you hold.",
    guidance: "Drop-in emphasis line within bulleted lists or key statements. Use sparingly to keep hierarchy clear.",
  },
  {
    category: "Body & Support",
    label: "Text · Highlight",
    classes: ["text", "is-highlight"],
    sample: "Reflective, compassionate storytelling that invites trust.",
    guidance: "Use when body copy needs to pick up accent color within surfaces or testimonials.",
  },
  {
    category: "Body & Support",
    label: "Text · Serif",
    classes: ["text", "is-serif"],
    sample: "Grounded wisdom passed along with care and clarity.",
    guidance: "Bridge body copy with hero statements for narrative moments. Ideal for quotes within copy blocks.",
  },
  {
    category: "Specialty",
    label: "Text · Micro",
    classes: ["text", "is-micro"],
    sample: "Updated weekly",
    guidance: "Label content such as newsletter cadence, office hours, or supporting metadata.",
  },
  {
    category: "Specialty",
    label: "Text · Numeric",
    classes: ["text", "is-numeric"],
    sample: "12+ years facilitating community healing",
    guidance: "Use inside stats clusters or timelines. Pair with `heading.is-eyebrow` for compact data callouts.",
  },
  {
    category: "Specialty",
    label: "Text · Contrast",
    classes: ["text", "is-contrast"],
    sample: "Optimized for low-light overlays",
    guidance: "Use when copy sits on dark gradients or photography. Combine with `.heading.is-on-dark` or `.btn-contrast`.",
    previewClassName: "bg-gradient-dusk text-soft-cream",
  },
];

const typographyCategories: TypographyToken["category"][] = ["Headings", "Body & Support", "Specialty"];

const typographyCategoryNotes: Record<TypographyToken["category"], string> = {
  Headings: "Establish hierarchy with one hero treatment and consistent section/subsection pairings per screen.",
  "Body & Support": "Blend one lead paragraph with supporting body copy. Mix in small or emphasis tokens to create rhythm.",
  Specialty: "Accent tokens reserved for stats, overlays, or microcopy. Use sparingly so primary typography stays dominant.",
};

type ButtonStyle = {
  name: string;
  description: string;
  className: string;
  label: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  previewClassName?: string;
  helper?: string;
};

const buttonStyles: ButtonStyle[] = [
  {
    name: "Primary CTA",
    description: "Default booking or high-intent actions. Apply `.btn-consultation` on `<Button size=\"lg\">`.",
    className: "btn-consultation",
    label: "Book Free Consultation",
    previewClassName: "bg-gradient-nature motion-gradient-pan border-none shadow-contrast",
    helper: "Reserve for the single primary action per viewport.",
  },
  {
    name: "Secondary CTA",
    description: "Lower-intent actions such as learn-more links. Use outline variant with warm hover state.",
    className: "btn-secondary",
    variant: "outline",
    label: "Explore Services",
    helper: "Add `.is-on-dark` when placing on gradients or photography for contrast.",
  },
  {
    name: "Gentle CTA",
    description: "Supportive prompts within cards. Reinforces warmth without competing with the primary CTA.",
    className: "btn-gentle",
    label: "Request Info",
    previewClassName: "bg-soft-cream/70",
  },
  {
    name: "Contrast CTA",
    description: "Use `.btn-contrast` on dark sections or imagery overlays while keeping copy legible.",
    className: "btn-contrast",
    label: "See Evening Availability",
    previewClassName: "bg-gradient-dusk text-soft-cream border-none shadow-contrast",
  },
  {
    name: "Muted CTA",
    description: "Low-emphasis prompts inside cards or inline forms. Ideal for tertiary actions.",
    className: "btn-muted",
    label: "Download Intake Packet",
    previewClassName: "bg-warm-tan/40",
  },
  {
    name: "Ghost Link",
    description: "Inline navigation inside cards or lists. Keep copy concise so the underline stays crisp.",
    className: "btn-ghost-link",
    variant: "ghost",
    size: "default",
    label: "Learn More",
  },
];

type SurfaceToken = {
  name: string;
  className: string;
  usage: string;
  content?: ReactNode;
};

const surfaceTokens: SurfaceToken[] = [
  {
    name: "Inclusive Card",
    className: "inclusive-card gentle-hover",
    usage: "Default card shell for service highlights, testimonials, and feature lists.",
    content: (
      <div className="space-y-1">
        <p className="heading is-subsection text-sage-green">Affirming Care</p>
        <p className="text is-small">Use within 2–3 column grids to keep rhythm consistent.</p>
      </div>
    ),
  },
  {
    name: "Highlight Panel",
    className: "surface-highlight has-noise motion-fade-soft",
    usage: "Seasonal launches, workshop promos, or content needing extra attention.",
    content: (
      <div className="space-y-2">
        <p className="heading is-eyebrow">IN FOCUS</p>
        <p className="heading is-feature">Community Workshops</p>
        <p className="text is-small">Layer over darker sections for a sunlit break in pacing.</p>
      </div>
    ),
  },
  {
    name: "Contrast Panel",
    className: "surface-contrast motion-scale-in",
    usage: "Newsletter sign-ups, footers, or any block where white copy is needed.",
    content: (
      <div className="space-y-2">
        <p className="heading is-eyebrow text-soft-cream/80">STAY CONNECTED</p>
        <p className="heading is-quote text-soft-cream">“We heal in community.”</p>
        <p className="text is-contrast">Pair with `.btn-contrast` or outline buttons using `.is-on-dark` modifier.</p>
      </div>
    ),
  },
  {
    name: "Muted Canvas",
    className: "surface-muted",
    usage: "Content-dense sections, FAQs, or when you need a calm neutral backdrop.",
    content: (
      <div className="space-y-2">
        <p className="heading is-subsection text-deep-forest">Grounded Support</p>
        <p className="text is-small">Great for stacking accordions or secondary storytelling.</p>
      </div>
    ),
  },
  {
    name: "Textured Overlay",
    className: "surface-textured motion-float-slow",
    usage: "Hero overlays on photography or stats bands that benefit from depth.",
    content: (
      <div className="space-y-2">
        <p className="heading is-eyebrow text-earth-brown/80">BY THE NUMBERS</p>
        <p className="text is-numeric">12+ years facilitating affirming care across Texas.</p>
      </div>
    ),
  },
  {
    name: "Safe Space Section",
    className: "safe-space has-noise motion-fade-soft",
    usage: "Use sparingly for full-width sections that need warmth and contrast without harsh edges.",
    content: (
      <div className="space-y-2">
        <p className="heading is-feature">Safe Space Promise</p>
        <p className="text is-small">Add generous padding (`py-20`) and anchor with a primary CTA.</p>
      </div>
    ),
  },
];

type LayoutToken = {
  name: string;
  className: string;
  usage: string;
  content: ReactNode;
};

const layoutTokens: LayoutToken[] = [
  {
    name: "Split Columns",
    className: "layout-split-columns",
    usage: "Balance hero copy with imagery or staggered service descriptions.",
    content: (
      <div className="layout-split-columns gap-4">
        <div className="rounded-2xl bg-soft-cream/80 p-4 shadow-soft">
          <p className="text is-small font-semibold text-deep-forest">Primary column</p>
          <p className="text is-small">Use for copy, forms, or longform storytelling.</p>
        </div>
        <div className="rounded-2xl bg-warm-tan/70 p-4 shadow-gentle">
          <p className="text is-small font-semibold text-earth-brown">Secondary column</p>
          <p className="text is-small">House imagery, lists, or supportive stats.</p>
        </div>
      </div>
    ),
  },
  {
    name: "Feature Strip",
    className: "layout-feature-strip",
    usage: "Horizontal band combining iconography, copy, and CTA without feeling dense.",
    content: (
      <div className="layout-feature-strip">
        <div className="rounded-2xl bg-soft-cream/80 p-4 shadow-soft">
          <p className="heading is-eyebrow">APPROACH</p>
          <p className="text is-small">Trauma-informed &amp; liberation-based.</p>
        </div>
        <div className="rounded-2xl bg-warm-tan/60 p-4 shadow-gentle">
          <p className="text is-small">Add a `.btn-gentle` CTA on the right to close the strip.</p>
        </div>
      </div>
    ),
  },
  {
    name: "Pill Cluster",
    className: "layout-pill-cluster",
    usage: "Lists of modalities, communities served, or quick-hit values.",
    content: (
      <div className="layout-pill-cluster">
        <span>Somatic Therapy</span>
        <span>EMDR</span>
        <span>Telehealth</span>
        <span>Group Circles</span>
      </div>
    ),
  },
];

type MotionToken = {
  name: string;
  className: string;
  usage: string;
};

const motionTokens: MotionToken[] = [
  {
    name: "gentle-hover",
    className: "gentle-hover",
    usage: "Baseline hover shift for cards, nav, and soft interaction elements.",
  },
  {
    name: "lift-hover",
    className: "lift-hover",
    usage: "Higher contrast hover for CTAs or featured cards needing extra focus.",
  },
  {
    name: "motion-fade-soft",
    className: "motion-fade-soft",
    usage: "Use on hero headlines or section intros to ease content into view.",
  },
  {
    name: "motion-scale-in",
    className: "motion-scale-in",
    usage: "Apply to stats, badges, or modal shells for subtle emphasis.",
  },
  {
    name: "motion-gradient-pan",
    className: "motion-gradient-pan",
    usage: "Creates a slow parallax effect on gradients without distracting flicker.",
  },
  {
    name: "motion-float-slow",
    className: "motion-float-slow",
    usage: "Assign to organic shapes or textures to add gentle ambient motion.",
  },
  {
    name: "motion-delay-200 / 400",
    className: "motion-delay-200",
    usage: "Stagger load-in animations. Pair `motion-delay-200` and `motion-delay-400` for cascading reveals.",
  },
];

export const metadata = {
  title: "Internal Style Guide | Progressive Way Therapy",
  description: "Design tokens and component guardrails for Progressive Way Therapy pages.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
} satisfies Metadata;

const StyleGuide = () => {
  return (
    <main className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl space-y-16">
          <section className="rounded-3xl border border-border/60 bg-card/70 p-10 shadow-gentle backdrop-blur-sm">
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Internal Only</p>
            <h1 className="mt-6 text-4xl md:text-5xl font-serif text-soft-purple">Progressive Way Therapy Style Guide</h1>
            <p className="mt-6 text is-lead">
              This reference keeps future page builds aligned with the refreshed visual language. Use these tokens and
              component rules verbatim unless the brand brief changes. Do not introduce new colors, shadows, or button
              treatments without review.
            </p>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-border/40 bg-background/80 p-6">
                <h2 className="font-serif text-xl text-soft-purple">Tone</h2>
                <p className="mt-3 text-sm text-muted-foreground">Warm, affirming, strengths-based.</p>
              </div>
              <div className="rounded-2xl border border-border/40 bg-background/80 p-6">
                <h2 className="font-serif text-xl text-soft-purple">Voice</h2>
                <p className="mt-3 text-sm text-muted-foreground">Direct but compassionate. Avoid clinical jargon.</p>
              </div>
              <div className="rounded-2xl border border-border/40 bg-background/80 p-6">
                <h2 className="font-serif text-xl text-soft-purple">Patterns</h2>
                <p className="mt-3 text-sm text-muted-foreground">Organic shapes, soft gradients, subtle motion.</p>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-border/40 bg-background/80 p-6">
              <p className="text is-lead">
                Core approach: apply the base class (`heading` or `text`) first, then stack modifier classes (`is-display`,
                `is-section`, `is-lead`, `is-on-dark`) the same way Webflow combos work. This keeps typography tokens
                centralized so a single update cascades everywhere.
              </p>
            </div>
          </section>

          <section>
            <div className="mb-8">
              <h2 className="heading is-section mb-2">Color System</h2>
              <p className="text-muted-foreground max-w-3xl">
                All colors originate from CSS variables in `app/globals.css`. Reference tokens by name instead of hard
                coding values. Gradients derive from `--gradient-hero`, `--gradient-warm`, `--gradient-nature`,
                `--gradient-dawn`, and `--gradient-dusk`.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {palette.map((color) => (
                <div key={color.token} className="rounded-2xl border border-border/50 bg-card/80 p-6 shadow-gentle">
                  <div
                    className="h-24 w-full rounded-xl border border-border/30 shadow-inner"
                    style={{ backgroundColor: `hsl(var(${color.token}))` }}
                  />
                  <div className="mt-4 space-y-2">
                    <p className="font-serif text-lg text-soft-purple">{color.name}</p>
                    <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">token: {color.token}</p>
                    <p className="text-sm text-muted-foreground">{color.usage}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-12 space-y-6">
              <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
                <h3 className="heading is-subsection text-soft-purple">Gradient Library</h3>
                <p className="text is-small text-muted-foreground md:max-w-2xl">
                  Apply gradients as section backplates or overlays. Pair with `has-noise` for texture and use `.text.is-contrast`
                  or `.heading.is-on-dark` for copy on darker blends.
                </p>
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                {gradientTokens.map((gradient) => (
                  <div key={gradient.token} className="rounded-2xl border border-border/40 bg-card/70 p-6 shadow-gentle">
                    <div className={cn("h-28 w-full rounded-xl border border-border/40", gradient.className)} />
                    <div className="mt-4 space-y-2">
                      <p className="font-serif text-lg text-soft-purple">{gradient.name}</p>
                      <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">token: {gradient.token}</p>
                      <p className="text-sm text-muted-foreground">{gradient.usage}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section>
            <div className="mb-8">
              <h2 className="heading is-section mb-2">Typography Scale</h2>
              <p className="text is-muted max-w-3xl">
                Fonts load via Playfair Display (`--font-serif`) and Inter (`--font-body`). Use the shared classes from
                `app/globals.css` (`.heading`, `.text`, and modifiers like `.is-display`, `.is-section`, `.is-lead`) to
                maintain size and spacing.
              </p>
              <p className="mt-4 text is-caption text-muted-foreground">
                Need a new treatment? Add the helper under `@layer components` in `app/globals.css`, document it here, and
                rely on the combo («base class + modifiers») instead of writing bespoke utility strings in page files.
              </p>
            </div>
            <div className="space-y-12">
              {typographyCategories.map((category) => {
                const tokens = typography.filter((token) => token.category === category);
                return (
                  <div key={category} className="space-y-6">
                    <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
                      <h3 className="heading is-subsection text-soft-purple">{category}</h3>
                      <p className="text is-small text-muted-foreground md:max-w-2xl">
                        {typographyCategoryNotes[category]}
                      </p>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                      {tokens.map((type) => (
                        <div key={type.label} className="rounded-2xl border border-border/40 bg-card/70 p-6 shadow-gentle">
                          <div className="flex flex-col gap-3">
                            <div>
                              <p className="font-serif text-soft-purple">{type.label}</p>
                              <p className="text-xs font-mono uppercase tracking-wide text-muted-foreground">
                                classes: {type.classes.join(" ")}
                              </p>
                            </div>
                            <p className="text-sm text-muted-foreground">{type.guidance}</p>
                          </div>
                          <div
                            className={cn(
                              "mt-4 rounded-xl border border-border/30 bg-background/80 p-6",
                              type.previewClassName,
                            )}
                          >
                            <p className={type.classes.join(" ")}>{type.sample}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section>
            <div className="mb-8">
              <h2 className="heading is-section mb-2">Button Treatments</h2>
              <p className="text-muted-foreground max-w-3xl">
                Always use the shared <code>&lt;Button&gt;</code> component for accessibility and focus states. Layer brand-specific
                classes on top. Limit pages to one primary `.btn-consultation` CTA per viewport.
              </p>
            </div>
              <div className="grid gap-6 md:grid-cols-2">
                {buttonStyles.map((button) => (
                  <div key={button.name} className="rounded-2xl border border-border/40 bg-card/70 p-6 shadow-gentle">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-serif text-lg text-soft-purple">{button.name}</p>
                        <p className="mt-2 text-sm text-muted-foreground">{button.description}</p>
                      </div>
                      <p className="text-xs font-mono uppercase tracking-wide text-muted-foreground">{button.className}</p>
                    </div>
                    <div
                      className={cn(
                        "mt-6 flex items-center justify-center rounded-xl border border-border/30 bg-background/80 p-6 shadow-inner",
                        button.previewClassName,
                      )}
                    >
                      <Button
                        variant={button.variant}
                        size={button.size ?? "lg"}
                        className={button.className}
                      >
                        {button.label}
                      </Button>
                    </div>
                    {button.helper ? (
                      <p className="mt-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        {button.helper}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>

          <section>
            <div className="mb-8">
              <h2 className="heading is-section mb-2">Surfaces &amp; Layout</h2>
              <p className="text-muted-foreground max-w-3xl">
                Mix organic edges with generous padding. Maintain `py-20` for major sections and `gap-8` grids for
                multi-column layouts. When in doubt, wrap content in an `inclusive-card` to keep softness consistent.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {surfaceTokens.map((surface) => (
                <div key={surface.name} className="rounded-2xl border border-border/40 bg-card/70 p-6 shadow-gentle">
                  <div className={cn("relative overflow-hidden rounded-3xl border border-border/20 p-6", surface.className)}>
                    {surface.content ?? <p className="text is-small text-muted-foreground">Apply this surface class to preview content.</p>}
                  </div>
                  <div className="mt-4 space-y-2">
                    <p className="font-serif text-lg text-soft-purple">{surface.name}</p>
                    <p className="text-xs font-mono uppercase tracking-wide text-muted-foreground">class: {surface.className}</p>
                    <p className="text-sm text-muted-foreground">{surface.usage}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-12 space-y-6">
              <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
                <h3 className="heading is-subsection text-soft-purple">Layout Patterns</h3>
                <p className="text is-small text-muted-foreground md:max-w-2xl">
                  Combine these helpers with `container` + spacing utilities. Keep breathing room by maintaining `gap-8`
                  on desktop and stepping down to `gap-6` on tablet.
                </p>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {layoutTokens.map((layout) => (
                  <div key={layout.name} className="rounded-2xl border border-border/40 bg-card/70 p-6 shadow-gentle">
                    <div className={cn("rounded-3xl border border-border/20 bg-background/80 p-6", layout.className)}>
                      {layout.content}
                    </div>
                    <div className="mt-4 space-y-2">
                      <p className="font-serif text-lg text-soft-purple">{layout.name}</p>
                      <p className="text-xs font-mono uppercase tracking-wide text-muted-foreground">class: {layout.className}</p>
                      <p className="text-sm text-muted-foreground">{layout.usage}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-12 rounded-3xl border border-border/50 bg-gradient-warm p-8 shadow-gentle">
              <h3 className="heading is-subsection mb-2">Spacing Rules</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Section padding: `py-20` on desktop, `py-16` on mobile.</li>
                <li>• Grid gutters: `gap-8` for two-plus columns, `gap-6` for card stacks.</li>
                <li>• Card padding: `p-6` minimum, increase to `p-8` for feature blocks.</li>
                <li>• Border radius: use root radius (`var(--radius)`) unless the layout calls for fully rounded pills.</li>
                <li>• Pill clusters: wrap tokens with `.layout-pill-cluster` and limit to 4–6 items per row.</li>
              </ul>
            </div>
          </section>

          <section>
            <div className="mb-8">
              <h2 className="heading is-section mb-2">Imagery, Motion &amp; Iconography</h2>
              <p className="text-muted-foreground max-w-3xl">
                Favor photography featuring real people, soft natural light, and community connection. Overlay imagery
                with `bg-gradient-hero` or neutral scrims for legibility. Motion should be subtle and purposeful.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl border border-border/40 bg-card/70 p-6 shadow-gentle">
                <h3 className="heading is-subsection mb-4">Imagery</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li>• Use existing assets in `public/assets`. New imagery must share the same warm, inclusive tone.</li>
                  <li>• Apply overlays via `bg-gradient-hero`, `bg-gradient-dawn`, or `surface-textured` to lock 4.5:1 contrast.</li>
                  <li>• On darker imagery, switch copy to `.heading.is-on-dark` + `.text.is-contrast`.</li>
                  <li>• Favor organic crops and rounded corners using `.organic-border` utilities where applicable.</li>
                </ul>
              </div>
              <div className="rounded-3xl border border-border/40 bg-card/70 p-6 shadow-gentle">
                <h3 className="heading is-subsection mb-4">Motion &amp; Icons</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li>• Entry animations: `motion-fade-soft` for headers, `motion-scale-in` for stats.</li>
                  <li>• Hover states: `gentle-hover` for cards, `lift-hover` for CTAs, keep movement under 6px.</li>
                  <li>• Gradient motion: add `motion-gradient-pan` sparingly on hero or CTA backgrounds.</li>
                  <li>• Icon set stays `lucide-react`; tint with `text-sage-green`, `text-soft-purple`, or `text-river-stone`.</li>
                </ul>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {motionTokens.map((motion) => (
                    <div
                      key={motion.name}
                      className={cn(
                        "rounded-xl border border-border/30 bg-background/75 p-3 shadow-inner",
                        motion.name.includes("delay") ? undefined : motion.className,
                      )}
                    >
                      <p className="font-mono text-xs uppercase tracking-wide text-sage-green">{motion.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{motion.usage}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="mb-20">
            <div className="mb-8">
              <h2 className="heading is-section mb-2">Content Guardrails for LLM Builds</h2>
              <p className="text-muted-foreground max-w-3xl">
                Apply these defaults before composing any new page section. If content requirements conflict with these
                rules, flag for human review instead of improvising new styling.
              </p>
            </div>
            <div className="rounded-3xl border border-border/50 bg-card/80 p-8 shadow-gentle space-y-4">
              <div>
                <h3 className="heading is-subsection mb-2">Layout &amp; Structure</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Start sections with `heading is-section` followed by one `text is-lead` paragraph (`max-w-3xl`).</li>
                  <li>• Use `inclusive-card` for feature lists; avoid creating bespoke card classes.</li>
                  <li>• Maintain three-column grids for service highlights on desktop (`md:grid-cols-3`).</li>
                </ul>
              </div>
              <div>
                <h3 className="heading is-subsection mb-2">Calls-to-Action</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Reserve `.btn-consultation` for booking/consult prompts only.</li>
                  <li>• Use outline buttons for secondary actions and ensure contrast on dark imagery.</li>
                  <li>• Avoid stacking more than two CTAs together; prefer one primary and one secondary.</li>
                </ul>
              </div>
              <div>
                <h3 className="heading is-subsection mb-2">Copy Hygiene</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Lead with inclusive language: “you” over “clients”.</li>
                  <li>• Reinforce credentials with concrete proof points (years of experience, modalities).</li>
                  <li>• Keep bullet lists to 4–5 items to preserve breathing room.</li>
                </ul>
              </div>
              <div>
                <h3 className="heading is-subsection mb-2">Accessibility</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Ensure text on imagery meets 4.5:1 contrast using overlays as needed.</li>
                  <li>• Provide descriptive alt text focusing on emotion + context.</li>
                  <li>• Keep animations subtle and respect `prefers-reduced-motion` utilities already defined.</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default StyleGuide;
