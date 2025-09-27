import Link from "next/link";
import type { Metadata } from "next";
import { getVariantBySlug } from "./data";

type VariantSlug = string;

export function createVariantMetadata(slug: VariantSlug): Metadata {
  const variant = getVariantBySlug(slug);
  return {
    title: `${variant.title} · Horizon Style Guide`,
    description: variant.summary,
    robots: {
      index: false,
      follow: false,
      nocache: true,
    },
  };
}

export function VariantPageContent({ slug }: { slug: VariantSlug }) {
  const variant = getVariantBySlug(slug);

  return (
    <main className="min-h-screen bg-background py-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4">
        <header data-section-id="style-guide-variant--header" className="space-y-4">
          <Link href="/style-guide" className="text-xs uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground/80">
            ← Back to all variants
          </Link>
          <h1 className="heading is-display">{variant.title}</h1>
          <p className="text is-lead max-w-3xl text-muted-foreground">{variant.subtitle}</p>
          <p className="text max-w-3xl">{variant.summary}</p>
        </header>

        <section data-section-id="style-guide-variant--palette-and-gradients" className="grid gap-8 lg:grid-cols-[2fr,3fr]">
          <article className="card space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Palette</p>
            <div className="space-y-3">
              {variant.palette.map((swatch) => (
                <div key={swatch.token} className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span
                      className="h-12 w-12 rounded-full border border-foreground/10 shadow-inner"
                      style={{ backgroundColor: `hsl(var(${swatch.token}))` }}
                      aria-hidden
                    />
                    <div>
                      <p className="heading text-lg">{swatch.name}</p>
                      <p className="text text-sm text-muted-foreground">{swatch.usage}</p>
                    </div>
                  </div>
                  <code className="text-xs text-muted-foreground">{swatch.token}</code>
                </div>
              ))}
            </div>
          </article>
          <article className="card space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Gradients</p>
            <div className="space-y-3">
              {variant.gradients.map((gradient) => (
                <div key={gradient.token} className="grid gap-2 md:grid-cols-[160px,1fr] md:items-center">
                  <div className={`h-16 rounded-full border border-foreground/10 shadow-inner ${gradient.className}`} aria-hidden />
                  <div>
                    <p className="heading text-lg">{gradient.name}</p>
                    <p className="text text-sm text-muted-foreground">{gradient.usage}</p>
                    <code className="text-xs text-muted-foreground">{gradient.token}</code>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section data-section-id="style-guide-variant--typography" className="grid gap-6 md:grid-cols-3">
          {variant.typography.map((entry) => (
            <article key={entry.label} className="card space-y-3">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Typography</p>
              <h2 className="heading text-lg">{entry.label}</h2>
              <p className="text text-sm text-muted-foreground">Class list: {entry.classes.join(" ")}</p>
              <p className="heading text-xl">{entry.sample}</p>
              <p className="text text-sm text-muted-foreground">{entry.guidance}</p>
            </article>
          ))}
        </section>

        <section data-section-id="style-guide-variant--voice" className="grid gap-6 md:grid-cols-2">
          <article className="card space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Hero copy sample</p>
            <p className="text text-xs uppercase tracking-wide text-muted-foreground">{variant.hero.eyebrow}</p>
            <h2 className="heading is-display">{variant.hero.heading}</h2>
            <p className="text is-lead text-muted-foreground">{variant.hero.body}</p>
            <div className="flex flex-wrap gap-3 pt-3">
              <span className="btn-primary">{variant.hero.ctaPrimary}</span>
              <span className="btn-secondary">{variant.hero.ctaSecondary}</span>
            </div>
          </article>
          <article className="card space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Voice & tone</p>
            <div className="space-y-3">
              {variant.voice.map((item) => (
                <div key={item.title}>
                  <p className="heading text-base">{item.title}</p>
                  <p className="text text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Layout notes</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {variant.layoutNotes.map((note) => (
                <li key={note} className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-foreground/40" aria-hidden />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="section-wrapper text-center space-y-4">
          <h2 className="heading text-3xl">Want to see it in action?</h2>
          <p className="text mx-auto max-w-2xl">
            Open the sample homepage crafted for this exploration to preview how the palette, typography, and voice come
            together in a full page layout.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href={`/style-guide/${slug}/home`} className="btn-primary">
              View sample homepage
            </Link>
            <Link href="/style-guide" className="btn-ghost-link">
              Back to all variants
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
