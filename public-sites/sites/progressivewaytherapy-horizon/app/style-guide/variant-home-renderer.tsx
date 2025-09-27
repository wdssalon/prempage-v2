import Link from "next/link";
import type { Metadata } from "next";
import { getVariantBySlug } from "./data";

type VariantSlug = string;

export function createVariantHomeMetadata(slug: VariantSlug): Metadata {
  const variant = getVariantBySlug(slug);
  return {
    title: `${variant.title} · Sample Home`,
    description: variant.summary,
    robots: {
      index: false,
      follow: false,
      nocache: true,
    },
  };
}

export function VariantHomePage({ slug }: { slug: VariantSlug }) {
  const variant = getVariantBySlug(slug);
  const primaryGradient = variant.gradients[0]?.className ?? "bg-gradient-hero";
  const secondaryGradient = variant.gradients[1]?.className ?? "bg-gradient-warm";
  const accentGradient = variant.gradients[2]?.className ?? "bg-gradient-dawn";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className={`relative overflow-hidden py-24 text-center text-soft-cream ${primaryGradient}`}>
        <div className="absolute inset-0 bg-black/20" aria-hidden />
        <div className="relative mx-auto flex max-w-4xl flex-col gap-6 px-6">
          <p className="text-xs uppercase tracking-[0.4em] text-soft-cream/80">{variant.hero.eyebrow}</p>
          <h1 className="heading is-display text-4xl md:text-5xl">{variant.hero.heading}</h1>
          <p className="text is-lead text-soft-cream/90">{variant.hero.body}</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="#services" className="btn-primary">
              {variant.hero.ctaPrimary}
            </Link>
            <Link href="#approach" className="btn-secondary">
              {variant.hero.ctaSecondary}
            </Link>
          </div>
        </div>
      </section>

      <section id="services" className="section-wrapper grid gap-6 lg:grid-cols-2">
        <article className="card space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Palette in practice</p>
          <h2 className="heading text-3xl">Visual anchors</h2>
          <p className="text">
            These swatches drive the primary surfaces, CTAs, and accents used across the layout. Blend them according to the
            guidance in the style guide to keep the experience cohesive.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {variant.palette.map((swatch) => (
              <div key={swatch.token} className="flex items-center gap-3 rounded-lg border border-foreground/10 bg-foreground/5 p-3">
                <span
                  className="h-10 w-10 flex-shrink-0 rounded-full border border-foreground/10 shadow-inner"
                  style={{ backgroundColor: `hsl(var(${swatch.token}))` }}
                  aria-hidden
                />
                <div>
                  <p className="heading text-base">{swatch.name}</p>
                  <p className="text text-xs text-muted-foreground">{swatch.usage}</p>
                </div>
              </div>
            ))}
          </div>
        </article>
        <article className={`card space-y-4 text-soft-cream ${secondaryGradient}`}>
          <p className="text-xs uppercase tracking-[0.3em] text-soft-cream/80">Experience highlights</p>
          <h2 className="heading text-3xl">What clients can expect</h2>
          <ul className="space-y-3 text-left text-soft-cream">
            {variant.layoutNotes.map((note) => (
              <li key={note} className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-soft-cream" aria-hidden />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section id="approach" className={`section-wrapper rounded-3xl ${accentGradient} text-soft-cream`}>
        <div className="grid gap-6 lg:grid-cols-[2fr,3fr] lg:items-center">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-soft-cream/80">Voice & tone</p>
            <h2 className="heading text-3xl">How we speak</h2>
            <p className="text text-soft-cream/90">
              Reference these bullet points while drafting copy so the homepage mirrors the approved style guide decisions.
            </p>
          </div>
          <div className="grid gap-4">
            {variant.voice.map((item) => (
              <article key={item.title} className="rounded-lg border border-soft-cream/20 bg-soft-cream/10 p-4">
                <p className="heading text-lg text-soft-cream">{item.title}</p>
                <p className="text text-sm text-soft-cream/90">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-wrapper text-center">
        <h2 className="heading text-3xl">Next steps</h2>
        <p className="text mx-auto max-w-2xl">
          Use this sample homepage as a blueprint when tailoring copy and imagery for the live site. Need to iterate?
          Jump back to the variant overview or the root explorations page.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link href={`/style-guide/${slug}`} className="btn-secondary">
            View style guide details
          </Link>
          <Link href="/style-guide" className="btn-ghost-link">
            Back to all variants
          </Link>
        </div>
      </section>
    </main>
  );
}
