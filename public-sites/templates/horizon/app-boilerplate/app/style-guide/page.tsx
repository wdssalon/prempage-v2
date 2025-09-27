import { fontOptions, colorOptions, writingStyleOptions } from "./data";

function OptionList({ title, options }: { title: string; options: typeof fontOptions }) {
  return (
    <section className="section-wrapper">
      <h2 className="heading text-2xl mb-6">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {options.map((option) => (
          <article
            key={option.id}
            className={`card ${option.isSelected ? "ring-2 ring-primary" : ""}`}
          >
            <h3 className="heading text-xl mb-2">{option.name}</h3>
            <p className="text">{option.description}</p>
            {option.isSelected && <p className="mt-4 text-sm text-primary">Selected</p>}
          </article>
        ))}
      </div>
    </section>
  );
}

export default function StyleGuidePage() {
  return (
    <main className="space-y-12 pb-16">
      <section className="section-wrapper text-center">
        <h1 className="heading is-display mb-4">Visual System Overview</h1>
        <p className="text max-w-3xl mx-auto">
          This page captures the approved visual system for your Horizon build. Update the selections after human
          approval so downstream agents can reference the source of truth.
        </p>
      </section>
      <OptionList title="Typography" options={fontOptions} />
      <OptionList title="Color Palettes" options={colorOptions} />
      <OptionList title="Writing Style" options={writingStyleOptions} />
    </main>
  );
}
