import { Metadata } from "next";

import { cn } from "@/lib/utils";

import {
  colorOptions,
  fontOptions,
  writingStyleOptions,
} from "../data";

const optionCardClass = (selected: boolean) =>
  cn(
    "rounded-md border bg-card/80 p-6 shadow-gentle transition-colors",
    selected ? "border-soft-purple ring-2 ring-soft-purple/70" : "border-border/50",
  );

const OptionBadge = ({ selected }: { selected: boolean }) => (
  <span
    className={cn(
      "inline-flex items-center gap-1 rounded-full px-3 py-0.5 text-xs font-medium",
      selected ? "bg-soft-purple/10 text-soft-purple" : "bg-border/60 text-muted-foreground",
    )}
  >
    {selected ? "Selected" : "Option"}
  </span>
);

const ReviewOptionsPage = () => {
  return (
    <main className="min-h-screen bg-background py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl space-y-12">
          <header className="space-y-4 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Phase 2.5</p>
            <h1 className="text-4xl font-serif text-soft-purple md:text-5xl">
              Select Your Visual System Options
            </h1>
            <p className="text is-lead text-muted-foreground">
              Review the three explorations for font pairing, color system, and writing style. Approve one from each row
              before moving on to the full style guide.
            </p>
          </header>

          <section className="space-y-6">
            <header className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
              <h2 className="heading is-section text-soft-purple">Font Pairings</h2>
              <p className="text is-small text-muted-foreground md:max-w-2xl">
                Each option previews hero and supporting copy. Select the pairing that matches the brand’s voice.
              </p>
            </header>
            <div className="grid gap-6 md:grid-cols-3">
              {fontOptions.map((option) => (
                <article key={option.name} className={optionCardClass(Boolean(option.isSelected))}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-serif text-lg text-soft-purple">{option.name}</p>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">{option.usage}</p>
                    </div>
                    <OptionBadge selected={Boolean(option.isSelected)} />
                  </div>
                  <div className="mt-6 space-y-3">
                    <p className={cn("heading is-section", option.headingClassName)}>{option.sampleHeading}</p>
                    <p className={cn("text", option.bodyClassName)}>{option.sampleBody}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <header className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
              <h2 className="heading is-section text-soft-purple">Color Systems</h2>
              <p className="text is-small text-muted-foreground md:max-w-2xl">
                Swatches represent the primary tokens promoted to gradients and surfaces. Choose the palette that feels on
                brand.
              </p>
            </header>
            <div className="grid gap-6 md:grid-cols-3">
              {colorOptions.map((option) => (
                <article key={option.name} className={optionCardClass(Boolean(option.isSelected))}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-serif text-lg text-soft-purple">{option.name}</p>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">{option.usage}</p>
                    </div>
                    <OptionBadge selected={Boolean(option.isSelected)} />
                  </div>
                  <div className="mt-6 flex gap-3">
                    {option.swatches.map((token) => (
                      <div
                        key={token}
                        className="h-12 w-12 rounded-full border border-border/40 shadow-inner"
                        style={{ backgroundColor: `hsl(var(${token}))` }}
                        aria-label={`token ${token}`}
                      />
                    ))}
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">{option.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <header className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
              <h2 className="heading is-section text-soft-purple">Writing Style Samples</h2>
              <p className="text is-small text-muted-foreground md:max-w-2xl">
                Paragraph-length drafts demonstrate tone, sentence cadence, and CTA posture. Approve the sample that
                reflects your desired voice.
              </p>
            </header>
            <div className="grid gap-6 md:grid-cols-3">
              {writingStyleOptions.map((option) => (
                <article key={option.name} className={optionCardClass(Boolean(option.isSelected))}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-serif text-lg text-soft-purple">{option.name}</p>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">{option.description}</p>
                    </div>
                    <OptionBadge selected={Boolean(option.isSelected)} />
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">{option.sample}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export const metadata: Metadata = {
  title: "Review Visual System Options",
  description:
    "Compare the three font, color, and writing style explorations before finalizing the Horizon style guide.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default ReviewOptionsPage;
