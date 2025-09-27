const services = [
  {
    title: "Foundational page shells",
    description: "Home, About, Services, and Contact routes wired to use client components and shared layout primitives.",
  },
  {
    title: "Tailwind token defaults",
    description: "Variables for brand colors, typography, spacing, and motion so you can adapt the look quickly.",
  },
  {
    title: "Accessible UI primitives",
    description: "Button, tooltip, and toast patterns based on Radix UI and Sonner for consistent interaction feedback.",
  },
];

export default function Services() {
  return (
    <section id="services" className="section-wrapper">
      <h2 className="heading text-3xl text-center">What’s included</h2>
      <p className="text mt-4 max-w-2xl mx-auto text-center">
        These starter sections mirror the production Horizon template. Replace copy, rearrange sections, or drop in new
        components as needed.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {services.map((service) => (
          <article key={service.title} className="card h-full">
            <h3 className="heading text-xl mb-2">{service.title}</h3>
            <p className="text">{service.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
