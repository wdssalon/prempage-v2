"use client";

import Link from "next/link";
import { ArrowRight, Brain, Heart, Shield, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { serviceGroups } from "@/data/services";

const serviceColorStyles = {
  brand: {
    iconBg: "bg-brand/20",
    iconColor: "text-brand",
    bullet: "bg-brand",
  },
  "brand-soft": {
    iconBg: "bg-brand-soft/20",
    iconColor: "text-brand-soft",
    bullet: "bg-brand-soft",
  },
  accent: {
    iconBg: "bg-accent/20",
    iconColor: "text-accent",
    bullet: "bg-accent",
  },
};

const iconComponents = {
  heart: Heart,
  brain: Brain,
  users: Users,
};

export default function Services({ sectionId, variant = "default" }) {
  const headingId = `${sectionId}__heading`;
  const descriptionId = `${sectionId}__description`;
  const sectionClasses = variant === "ada" ? "py-20 bg-surface" : "py-20 bg-base";
  const cardBaseClass =
    variant === "ada"
      ? "inclusive-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      : "service-card";
  const detailHeadingClasses = cn("font-semibold mb-2");

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
              data-ppid="code:public-sites/sites/horizon-example/src/components/Services.jsx#Services.heading.1"
            >
              Specialized Therapy Services
            </h2>
            <p
              id={descriptionId}
              className="text is-lead max-w-3xl mx-auto"
              data-ppid="code:public-sites/sites/horizon-example/src/components/Services.jsx#Services.body.1"
            >
              Evidence-based, trauma-informed care tailored to your unique journey. All services available via secure
              telehealth across Texas.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {serviceGroups.map((group, index) => {
              const IconComponent = iconComponents[group.iconKey] ?? Heart;
              const colorStyles = serviceColorStyles[group.color];
              return (
                <div
                  key={group.id}
                  className={cn(cardBaseClass, "animate-fade-in-up")}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={cn("w-16 h-16 rounded-md flex items-center justify-center mb-6", colorStyles.iconBg)}>
                    <IconComponent className={cn("w-8 h-8", colorStyles.iconColor)} aria-hidden="true" />
                  </div>
                  <h3 className="heading is-subsection mb-3" data-ppid={group.titlePpid}>
                    {group.title}
                  </h3>
                  <p className="text text-muted mb-6 leading-relaxed" data-ppid={group.descriptionPpid}>
                    {group.description}
                  </p>
                  <ul className="space-y-3 mb-6" data-ppid={group.listPpid}>
                    {group.services.map((service) => (
                      <li key={service.id} className="flex items-center space-x-3" data-ppid={service.itemPpid}>
                        <div className={cn("w-2 h-2 rounded-full", colorStyles.bullet)} />
                        <span className="text text-sm text-muted" data-ppid={service.labelPpid}>
                          {service.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={group.ctaHref}
                    className="btn-secondary is-on-light is-fluid"
                    aria-label={`Learn more about ${group.title}`}
                    prefetch={false}
                    data-ppid={group.ctaPpid}
                  >
                    <span data-ppid={group.ctaLabelPpid}>{group.ctaLabel}</span>
                    <ArrowRight data-icon-trail="true" className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="inclusive-card animate-fade-in-up">
            <div className="text-center mb-8">
              <h3
                className="heading is-subsection mb-3"
                data-ppid="code:public-sites/sites/horizon-example/src/components/Services.jsx#Services.heading.2"
              >
                Specialized Treatments
              </h3>
              <p
                className="text text-muted"
                data-ppid="code:public-sites/sites/horizon-example/src/components/Services.jsx#Services.body.2"
              >
                Advanced therapeutic modalities for comprehensive healing
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Shield className="w-6 h-6 mt-1 shrink-0 text-brand" aria-hidden="true" />
                  <div>
                    <h4
                      className={detailHeadingClasses}
                      data-ppid="code:public-sites/sites/horizon-example/src/components/Services.jsx#Services.heading.3"
                    >
                      EMDR Therapy
                    </h4>
                    <p
                      className="text text-sm text-muted leading-relaxed"
                      data-ppid="code:public-sites/sites/horizon-example/src/components/Services.jsx#Services.body.3"
                    >
                      Eye Movement Desensitization and Reprocessing for trauma recovery. This evidence-based approach
                      helps process difficult memories and reduce their emotional impact.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Heart className="w-6 h-6 mt-1 shrink-0 text-brand" aria-hidden="true" />
                  <div>
                    <h4
                      className={detailHeadingClasses}
                      data-ppid="code:public-sites/sites/horizon-example/src/components/Services.jsx#Services.heading.4"
                    >
                      Ketamine-Assisted Psychotherapy
                    </h4>
                    <p
                      className="text text-sm text-muted leading-relaxed"
                      data-ppid="code:public-sites/sites/horizon-example/src/components/Services.jsx#Services.body.4"
                    >
                      Collaborative care approach integrating ketamine treatments with therapeutic integration sessions
                      for lasting change.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Users className="w-6 h-6 mt-1 shrink-0 text-brand" aria-hidden="true" />
                  <div>
                    <h4
                      className={detailHeadingClasses}
                      data-ppid="code:public-sites/sites/horizon-example/src/components/Services.jsx#Services.heading.5"
                    >
                      Liberation-Based Healing
                    </h4>
                    <p
                      className="text text-sm text-muted leading-relaxed"
                      data-ppid="code:public-sites/sites/horizon-example/src/components/Services.jsx#Services.body.5"
                    >
                      Therapy that centers social justice, intersectionality, and community resilience for marginalized
                      identities.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Brain className="w-6 h-6 mt-1 shrink-0 text-brand" aria-hidden="true" />
                  <div>
                    <h4
                      className={detailHeadingClasses}
                      data-ppid="code:public-sites/sites/horizon-example/src/components/Services.jsx#Services.heading.6"
                    >
                      Somatic & Nervous System Work
                    </h4>
                    <p
                      className="text text-sm text-muted leading-relaxed"
                      data-ppid="code:public-sites/sites/horizon-example/src/components/Services.jsx#Services.body.6"
                    >
                      Gentle, body-based practices to build resilience, regulation, and a sense of safety within your
                      nervous system.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
