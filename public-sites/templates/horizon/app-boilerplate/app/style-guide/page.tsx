import Link from "next/link";
import { Metadata } from "next";
import { STYLE_VARIANTS } from "./data";

export const metadata: Metadata = {
  title: "Style Guide Explorations",
  description: "Browse the Horizon visual system variants generated for this project.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function StyleGuideIndexPage() {
  return (
    <main className="min-h-screen bg-background py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4">
        <section className="space-y-4 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Visual Explorations</p>
          <h1 className="heading is-display">Preview style guide variants</h1>
          <p className="text is-lead mx-auto max-w-2xl">
            Each variant below ships with a fully themed exploration. Open a variant to review the palette, typography,
            copy tone, and layout guidance applied to that direction. Slugs are prefixed with `style-guide-` so they remain
            easy to locate in git history and automation logs.
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {STYLE_VARIANTS.map((variant) => (
            <article key={variant.slug} className="card h-full">
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Variant</p>
                  <h2 className="heading text-2xl">{variant.title}</h2>
                  <p className="text text-sm text-muted-foreground">{variant.subtitle}</p>
                </div>
                <p className="text text-sm">{variant.summary}</p>
                <div className="flex flex-wrap gap-2">
                  {variant.palette.map((swatch) => (
                    <span
                      key={swatch.token}
                      className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/5 px-3 py-1 text-xs uppercase tracking-wide"
                    >
                      <span
                        className="h-4 w-4 rounded-full border border-foreground/10"
                        style={{ backgroundColor: `hsl(var(${swatch.token}))` }}
                        aria-hidden
                      />
                      {swatch.name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <Link href={`/style-guide/${variant.slug}`} className="btn-secondary text-sm">
                  View variant
                </Link>
                <span className="text-xs uppercase tracking-wide text-muted-foreground">Slug: {variant.slug}</span>
              </div>
          </article>
          ))}
        </section>
      </div>
    </main>
  );
}
