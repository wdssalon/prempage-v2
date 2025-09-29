"use client";

import { ArrowRight, Brain, Heart, Shield, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const serviceColorStyles = {
  "sage-green": {
    iconBg: "bg-sage-green/20",
    iconColor: "text-sage-green",
    bullet: "bg-sage-green",
  },
  "soft-purple": {
    iconBg: "bg-soft-purple/20",
    iconColor: "text-soft-purple",
    bullet: "bg-soft-purple",
  },
  "warm-tan": {
    iconBg: "bg-warm-tan/20",
    iconColor: "text-warm-tan",
    bullet: "bg-warm-tan",
  },
};

const serviceGroups = [
  {
    icon: Heart,
    title: "Trauma & Recovery",
    description: "Healing from life's deepest wounds with compassion and evidence-based care",
    services: [
      "EMDR Therapy",
      "Sexual Assault Recovery",
      "Domestic Violence Support",
      "Grief & Bereavement",
      "Immigrant/Refugee Counseling",
    ],
    color: "sage-green",
  },
  {
    icon: Brain,
    title: "Anxiety & Depression",
    description: "Finding balance and reclaiming joy in your daily life",
    services: [
      "Anxiety Management",
      "Depression Treatment",
      "Stress & Overwhelm",
      "Panic Disorder",
      "Mood Regulation",
    ],
    color: "soft-purple",
  },
  {
    icon: Users,
    title: "Identity & Relationships",
    description: "Embracing your authentic self and building healthy connections",
    services: [
      "LGBTQIA+ Affirming Therapy",
      "Women's Issues",
      "Relationship Counseling",
      "Family Dynamics",
      "Identity Exploration",
    ],
    color: "warm-tan",
  },
];

export default function Services({ sectionId }) {
  return (
    <section id="services" data-section-id={sectionId} className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="heading is-section mb-6">Specialized Therapy Services</h2>
            <p className="text is-lead max-w-3xl mx-auto">
              Evidence-based, trauma-informed care tailored to your unique journey. All services available via secure
              telehealth across Texas.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {serviceGroups.map((group, index) => {
              const IconComponent = group.icon;
              const colorStyles = serviceColorStyles[group.color];
              return (
                <div
                  key={group.title}
                  className="service-card animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={cn("w-16 h-16 rounded-md flex items-center justify-center mb-6", colorStyles.iconBg)}>
                    <IconComponent className={cn("w-8 h-8", colorStyles.iconColor)} />
                  </div>

                  <h3 className="heading is-subsection mb-3">{group.title}</h3>
                  <p className="text text-muted-foreground mb-6 leading-relaxed">{group.description}</p>

                  <ul className="space-y-3 mb-6">
                    {group.services.map((service) => (
                      <li key={service} className="flex items-center space-x-3">
                        <div className={cn("w-2 h-2 rounded-full", colorStyles.bullet)} />
                        <span className="text text-sm text-muted-foreground">{service}</span>
                      </li>
                    ))}
                  </ul>

                  <button type="button" className="btn-secondary is-on-light is-fluid">
                    <span>Learn More</span>
                    <ArrowRight data-icon-trail="true" className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="inclusive-card animate-fade-in-up">
            <div className="text-center mb-8">
              <h3 className="heading is-subsection mb-3">Specialized Treatments</h3>
              <p className="text text-muted-foreground">Advanced therapeutic modalities for comprehensive healing</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Shield className="w-6 h-6 text-sage-green mt-1 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-soft-purple mb-2">EMDR Therapy</h4>
                    <p className="text text-sm text-muted-foreground leading-relaxed">
                      Eye Movement Desensitization and Reprocessing for trauma recovery. This evidence-based approach
                      helps process difficult memories and reduce their emotional impact.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Heart className="w-6 h-6 text-soft-purple mt-1 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-soft-purple mb-2">Ketamine-Assisted Psychotherapy</h4>
                    <p className="text text-sm text-muted-foreground leading-relaxed">
                      Collaborative care approach integrating ketamine treatments with therapeutic integration sessions
                      for lasting change.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Users className="w-6 h-6 text-soft-purple mt-1 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-soft-purple mb-2">Liberation-Based Healing</h4>
                    <p className="text text-sm text-muted-foreground leading-relaxed">
                      Therapy that centers social justice, intersectionality, and community resilience for marginalized
                      identities.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Brain className="w-6 h-6 text-soft-purple mt-1 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-soft-purple mb-2">Somatic & Nervous System Work</h4>
                    <p className="text text-sm text-muted-foreground leading-relaxed">
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
