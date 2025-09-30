import { Calendar, Heart, Shield, Video } from "lucide-react";

const reasons = [
  {
    icon: Heart,
    title: "Progressive Values",
    description:
      "Openly progressive, LGBTQIA+ affirming therapy that honors your authentic self and challenges systemic oppression.",
  },
  {
    icon: Shield,
    title: "Inclusive & Safe",
    description:
      "A judgment-free space for BIPOC, LGBTQIA+, women, and non-faith-based individuals in conservative Texas.",
  },
  {
    icon: Video,
    title: "Secure Telehealth",
    description:
      "Convenient, HIPAA-compliant online sessions from the comfort and privacy of your own space across Texas.",
  },
  {
    icon: Calendar,
    title: "Easy Scheduling",
    description:
      "Start with a free 15-minute consultation to see if we're a good fit - no pressure, just connection.",
  },
];

export default function WhyChooseUs({ sectionId }) {
  return (
    <section data-section-id={sectionId} className="py-20 bg-gradient-warm">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="heading is-section mb-6">Why Choose Progressive Way Therapy</h2>
            <p className="text is-lead max-w-3xl mx-auto">
              More than therapy - it's a movement toward authentic healing and social justice
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {reasons.map((reason, index) => {
              const IconComponent = reason.icon;
              return (
                <div
                  key={reason.title}
                  className="text-center animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-nature rounded-full flex items-center justify-center shadow-soft">
                    <IconComponent className="w-10 h-10 text-inverse" />
                  </div>

                  <h3 className="heading is-subsection text-brand-soft font-semibold mb-4">{reason.title}</h3>

                  <p className="text text-muted leading-relaxed">{reason.description}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-16 text-center animate-fade-in-up">
            <div className="inline-flex items-center justify-center space-x-8 px-8 py-4 bg-surface/50 backdrop-blur-sm rounded-md border border-border/50">
              <div className="text-center">
                <p className="text-2xl font-serif font-bold text-brand">10+</p>
                <p className="text text-sm text-muted">Years Experience</p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <p className="text-2xl font-serif font-bold text-brand">EMDR</p>
                <p className="text text-sm text-muted">Certified</p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <p className="text-2xl font-serif font-bold text-brand">100%</p>
                <p className="text text-sm text-muted">Confidential</p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <p className="text-2xl font-serif font-bold text-brand">TX</p>
                <p className="text text-sm text-muted">Licensed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
