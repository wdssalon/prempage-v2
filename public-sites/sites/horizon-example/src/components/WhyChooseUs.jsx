import { Calendar, Heart, Shield, Video } from "lucide-react";

const reasons = [
  {
    id: "progressive-values",
    icon: Heart,
    title: "Progressive Values",
    titlePpid:
      "code:public-sites/sites/horizon-example/src/components/WhyChooseUs.jsx#WhyChooseUs.reasons.progressive-values.title",
    description:
      "Openly progressive, LGBTQIA+ affirming therapy that honors your authentic self and challenges systemic oppression.",
    descriptionPpid:
      "code:public-sites/sites/horizon-example/src/components/WhyChooseUs.jsx#WhyChooseUs.reasons.progressive-values.description",
  },
  {
    id: "inclusive-safe",
    icon: Shield,
    title: "Inclusive & Safe",
    titlePpid:
      "code:public-sites/sites/horizon-example/src/components/WhyChooseUs.jsx#WhyChooseUs.reasons.inclusive-safe.title",
    description:
      "A judgment-free space for BIPOC, LGBTQIA+, women, and non-faith-based individuals in conservative Texas.",
    descriptionPpid:
      "code:public-sites/sites/horizon-example/src/components/WhyChooseUs.jsx#WhyChooseUs.reasons.inclusive-safe.description",
  },
  {
    id: "secure-telehealth",
    icon: Video,
    title: "Secure Telehealth",
    titlePpid:
      "code:public-sites/sites/horizon-example/src/components/WhyChooseUs.jsx#WhyChooseUs.reasons.secure-telehealth.title",
    description:
      "Convenient, HIPAA-compliant online sessions from the comfort and privacy of your own space across Texas.",
    descriptionPpid:
      "code:public-sites/sites/horizon-example/src/components/WhyChooseUs.jsx#WhyChooseUs.reasons.secure-telehealth.description",
  },
  {
    id: "easy-scheduling",
    icon: Calendar,
    title: "Easy Scheduling",
    titlePpid:
      "code:public-sites/sites/horizon-example/src/components/WhyChooseUs.jsx#WhyChooseUs.reasons.easy-scheduling.title",
    description:
      "Start with a free 15-minute consultation to see if we're a good fit - no pressure, just connection.",
    descriptionPpid:
      "code:public-sites/sites/horizon-example/src/components/WhyChooseUs.jsx#WhyChooseUs.reasons.easy-scheduling.description",
  },
];

export default function WhyChooseUs({ sectionId, variant = "default" }) {
  const headingId = `${sectionId}__heading`;
  const descriptionId = `${sectionId}__description`;
  const sectionClasses = variant === "ada" ? "py-20 bg-surface" : "py-20 bg-gradient-warm";

  return (
    <section
      id={sectionId}
      data-section-id={sectionId}
      className={sectionClasses}
      aria-labelledby={headingId}
      aria-describedby={descriptionId}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2
              id={headingId}
              className="heading is-section mb-6"
              data-ppid="code:public-sites/sites/horizon-example/src/components/WhyChooseUs.jsx#WhyChooseUs.heading.1">
              Why Choose Progressive Way Therapy
            </h2>
            <p
              id={descriptionId}
              className="text is-lead max-w-3xl mx-auto"
              data-ppid="code:public-sites/sites/horizon-example/src/components/WhyChooseUs.jsx#WhyChooseUs.body.1">
              More than therapy - it's a movement toward authentic healing and social justice
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {reasons.map((reason, index) => {
              const IconComponent = reason.icon;
              return (
                <div
                  key={reason.id}
                  className="text-center animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-nature rounded-full flex items-center justify-center shadow-soft">
                    <IconComponent className="w-10 h-10 text-inverse" aria-hidden="true" />
                  </div>

                  <h3
                    className="heading is-subsection font-semibold mb-4"
                    data-ppid={reason.titlePpid}
                  >
                    {reason.title}
                  </h3>

                  <p className="text text-muted leading-relaxed" data-ppid={reason.descriptionPpid}>
                    {reason.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-16 text-center animate-fade-in-up">
            <div className="inline-flex items-center justify-center space-x-8 px-8 py-4 bg-surface/50 backdrop-blur-sm rounded-md border border-border/50">
              <div className="text-center">
                <p
                  className="text-2xl font-serif font-bold text-brand"
                  data-ppid="code:public-sites/sites/horizon-example/src/components/WhyChooseUs.jsx#WhyChooseUs.body.2">10+</p>
                <p
                  className="text text-sm text-muted"
                  data-ppid="code:public-sites/sites/horizon-example/src/components/WhyChooseUs.jsx#WhyChooseUs.body.3">Years Experience</p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <p
                  className="text-2xl font-serif font-bold text-brand"
                  data-ppid="code:public-sites/sites/horizon-example/src/components/WhyChooseUs.jsx#WhyChooseUs.body.4">EMDR</p>
                <p
                  className="text text-sm text-muted"
                  data-ppid="code:public-sites/sites/horizon-example/src/components/WhyChooseUs.jsx#WhyChooseUs.body.5">Certified</p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <p
                  className="text-2xl font-serif font-bold text-brand"
                  data-ppid="code:public-sites/sites/horizon-example/src/components/WhyChooseUs.jsx#WhyChooseUs.body.6">100%</p>
                <p
                  className="text text-sm text-muted"
                  data-ppid="code:public-sites/sites/horizon-example/src/components/WhyChooseUs.jsx#WhyChooseUs.body.7">Confidential</p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <p
                  className="text-2xl font-serif font-bold text-brand"
                  data-ppid="code:public-sites/sites/horizon-example/src/components/WhyChooseUs.jsx#WhyChooseUs.body.8">TX</p>
                <p
                  className="text text-sm text-muted"
                  data-ppid="code:public-sites/sites/horizon-example/src/components/WhyChooseUs.jsx#WhyChooseUs.body.9">Licensed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
