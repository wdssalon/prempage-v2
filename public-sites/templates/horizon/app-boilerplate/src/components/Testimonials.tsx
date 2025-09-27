const testimonials = [
  {
    quote: "Setup used to take me half a day. With the boilerplate, I’m drafting copy in minutes.",
    author: "Avery, content strategist",
  },
  {
    quote: "Navigation, metadata, and assets were already wired up. I only swapped sections and tone.",
    author: "Jordan, product marketer",
  },
  {
    quote: "The style-guide pipeline keeps humans in the loop while the agent system handles repetition.",
    author: "Riley, creative director",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="section-wrapper bg-foreground/5 rounded-3xl">
      <div className="text-center mb-10">
        <h2 className="heading text-3xl">Feedback from internal teams</h2>
        <p className="text mt-3">Each quote comes from a teammate who piloted the Horizon workflow.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {testimonials.map((testimonial) => (
          <article key={testimonial.author} className="card h-full">
            <p className="text italic">“{testimonial.quote}”</p>
            <p className="text mt-4 text-sm uppercase tracking-wide text-foreground/60">{testimonial.author}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
