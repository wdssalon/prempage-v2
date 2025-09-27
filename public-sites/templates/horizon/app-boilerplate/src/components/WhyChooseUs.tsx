const differentiators = [
  {
    title: "LLM-ready structure",
    description: "All sections live in discrete components with clear naming so automated agents can swap or duplicate confidently.",
  },
  {
    title: "Overlay-friendly",
    description: "Navigation, footer, and content regions use data attributes and semantic markup to support in-page editors.",
  },
  {
    title: "Production parity",
    description: "Matches the same component stack used in shipped Horizon sites, reducing drift between preview and launch.",
  },
];

export default function WhyChooseUs() {
  return (
    <section id="why-us" className="section-wrapper">
      <div className="grid gap-8 lg:grid-cols-[2fr,3fr] lg:items-center">
        <div>
          <h2 className="heading text-3xl">Why Horizon?</h2>
          <p className="text mt-4">
            Horizon is our Next.js 15 + Tailwind template designed for richer product or therapy experiences. The starter
            kit keeps the same structure as live deployments so your iterations stay deployable.
          </p>
        </div>
        <div className="grid gap-4">
          {differentiators.map((item) => (
            <article key={item.title} className="card">
              <h3 className="heading text-xl mb-1">{item.title}</h3>
              <p className="text">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
