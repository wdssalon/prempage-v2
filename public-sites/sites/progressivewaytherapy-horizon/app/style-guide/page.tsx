import type { Metadata } from "next";
import { Button } from "@/components/ui/button";

const palette = [
  {
    name: "Sage Green",
    token: "--sage-green",
    usage: "Primary calls-to-action, links, emphasis backgrounds",
  },
  {
    name: "Warm Tan",
    token: "--warm-tan",
    usage: "Section backgrounds, gentle cards, hover states",
  },
  {
    name: "Soft Purple",
    token: "--soft-purple",
    usage: "Headlines, highlights, supportive accents",
  },
  {
    name: "Earth Brown",
    token: "--earth-brown",
    usage: "Body copy, muted icons, subtle borders",
  },
  {
    name: "Cream",
    token: "--cream",
    usage: "Hero overlays, light gradients, typography contrast",
  },
  {
    name: "Nature Green",
    token: "--nature-green",
    usage: "Gradient depth, badges, supportive CTAs",
  },
];

const typography = [
  {
    label: "Heading · Display",
    classes: ["heading", "is-display"],
    sample: "A Safe Space for Your Authentic Self",
    guidance: "Use once per page for hero moments. Layer color utilities like `is-on-dark` when the background is rich.",
  },
  {
    label: "Heading · Section",
    classes: ["heading", "is-section"],
    sample: "Specialized Therapy Services",
    guidance: "Default for section intros. Add layout helpers such as `mb-6` or `max-w-3xl mx-auto` as needed.",
  },
  {
    label: "Heading · Subsection",
    classes: ["heading", "is-subsection"],
    sample: "Liberation-Based Healing",
    guidance: "Use inside cards or secondary columns. Override color with Tailwind utilities when the context demands it.",
  },
  {
    label: "Text · Lead",
    classes: ["text", "is-lead"],
    sample: "Evidence-based, trauma-informed care tailored to your lived experience.",
    guidance: "Intro paragraphs that sit right under a heading. Combine with width utilities like `max-w-3xl`.",
  },
  {
    label: "Text · Body",
    classes: ["text"],
    sample: "Inclusive, trauma-informed care for LGBTQIA+ and BIPOC communities.",
    guidance: "Default body copy. Add `text-muted-foreground` when you need gentle emphasis.",
  },
  {
    label: "Text · Caption",
    classes: ["text", "is-caption"],
    sample: "Serving all of Texas via telehealth",
    guidance: "Supportive details, disclaimers, and labels. Pair with uppercase utilities only when necessary.",
  },
];

const buttonStyles = [
  {
    name: "Primary CTA",
    description: "Default booking or high-intent actions. Combine `.btn-consultation` with `<Button size=\"lg\">`.",
    className: "btn-consultation",
    label: "Book Free Consultation",
  },
  {
    name: "Secondary CTA",
    description: "Lower-intent actions such as learn-more links. Use outline variant with warm hover state.",
    className: "btn-secondary",
    variant: "outline" as const,
    label: "Explore Services",
  },
  {
    name: "Gentle CTA",
    description: "Supportive prompts within cards. Apply `.btn-gentle` to reinforce warmth without competing with primary CTA.",
    className: "btn-gentle",
    label: "Request Info",
  },
  {
    name: "Ghost Link",
    description: "Inline navigation inside cards or lists. Pair with `variant=\"ghost\"` and accent hover.",
    className: "btn-ghost-link",
    variant: "ghost" as const,
    label: "Learn More",
  },
];

const surfaceTokens = [
  {
    name: "Inclusive Card",
    className: "inclusive-card",
    usage: "Default card style for service highlights and testimonials.",
  },
  {
    name: "Service Card",
    className: "service-card",
    usage: "Interactive grid cards with gentle hover animation.",
  },
  {
    name: "Safe Space Section",
    className: "safe-space",
    usage: "Use sparingly for sections that need warmth and visual break.",
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
                coding values. Gradients derive from `--gradient-hero`, `--gradient-warm`, and `--gradient-nature`.
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
            <div className="space-y-8">
              {typography.map((type) => (
                <div key={type.label} className="rounded-2xl border border-border/40 bg-card/70 p-6 shadow-gentle">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-serif text-soft-purple">{type.label}</p>
                      <p className="text-xs font-mono uppercase tracking-wide text-muted-foreground">
                        classes: {type.classes.join(" ")}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground md:max-w-sm">{type.guidance}</p>
                  </div>
                  <div className="mt-4 rounded-xl border border-border/30 bg-background/80 p-6">
                    <p className={type.classes.join(" ")}>{type.sample}</p>
                  </div>
                </div>
              ))}
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
                  <div className="mt-6">
                    <Button
                      variant={button.variant}
                      size="lg"
                      className={button.className}
                    >
                      {button.label}
                    </Button>
                  </div>
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
            <div className="grid gap-6 md:grid-cols-3">
              {surfaceTokens.map((surface) => (
                <div key={surface.name} className="rounded-2xl border border-border/40 bg-card/70 p-6 shadow-gentle">
                  <div className={`${surface.className} rounded-xl border border-border/20 p-6`}>Example surface</div>
                  <div className="mt-4 space-y-2">
                    <p className="font-serif text-lg text-soft-purple">{surface.name}</p>
                    <p className="text-xs font-mono uppercase tracking-wide text-muted-foreground">class: {surface.className}</p>
                    <p className="text-sm text-muted-foreground">{surface.usage}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-3xl border border-border/50 bg-gradient-warm p-8 shadow-gentle">
              <h3 className="heading is-subsection mb-2">Spacing Rules</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Section padding: `py-20` on desktop, `py-16` on mobile.</li>
                <li>• Grid gutters: `gap-8` for two-plus columns, `gap-6` for card stacks.</li>
                <li>• Card padding: `p-6` minimum, increase to `p-8` for feature blocks.</li>
                <li>• Border radius: use root radius (`var(--radius)`) unless the layout calls for fully rounded pills.</li>
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
                  <li>• Always apply a gradient overlay (`bg-gradient-hero` or `bg-gradient-warm`) for text legibility.</li>
                  <li>• Favor organic crops and rounded corners using `.organic-border` utilities where applicable.</li>
                </ul>
              </div>
              <div className="rounded-3xl border border-border/40 bg-card/70 p-6 shadow-gentle">
                <h3 className="heading is-subsection mb-4">Motion &amp; Icons</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li>• Use existing animations (`animate-fade-in-up`, `gentle-hover`) only.</li>
                  <li>• Icon set: `lucide-react`. Pair icons with accent colors (`text-warm-tan`, `text-soft-purple`).</li>
                  <li>• Keep hover shifts to `-translate-y-1` max to maintain calm, grounded feel.</li>
                </ul>
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
