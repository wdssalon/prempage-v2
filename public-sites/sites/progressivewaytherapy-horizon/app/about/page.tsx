"use client";

import AboutSection from "@/components/About";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  Compass,
  GraduationCap,
  HeartHandshake,
  Leaf,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const philosophyHighlights = [
  {
    title: "Radically Inclusive Care",
    description:
      "Queer-affirming, body-liberation, anti-racist therapy where you never have to translate your lived experience.",
    icon: HeartHandshake,
    iconBg: "bg-soft-purple/15",
    iconColor: "text-soft-purple",
  },
  {
    title: "Trauma-Informed Foundations",
    description:
      "Sessions paced with consent, nervous-system awareness, and grounding practices so healing stays rooted in safety.",
    icon: ShieldCheck,
    iconBg: "bg-sage-green/15",
    iconColor: "text-sage-green",
  },
  {
    title: "Evidence-Based & Adaptive",
    description:
      "EMDR, parts work, and somatic resourcing blended with psychoeducation to meet your evolving goals.",
    icon: Sparkles,
    iconBg: "bg-warm-tan/20",
    iconColor: "text-earth-brown",
  },
];

const milestones = [
  {
    year: "2012",
    title: "M.Ed. in Counseling",
    location: "University of North Texas",
    description:
      "Focused on trauma recovery, multicultural counseling, and advocacy for marginalized communities.",
    dotColor: "bg-soft-purple",
  },
  {
    year: "2014 - 2018",
    title: "Community Mental Health Clinician",
    location: "Dallas-Fort Worth, TX",
    description:
      "Supported survivors of violence, immigrants, and LGBTQIA+ adults navigating hostile environments.",
    dotColor: "bg-sage-green",
  },
  {
    year: "2019",
    title: "EMDR Intensive Training",
    location: "EMDRIA Accredited Program",
    description:
      "Specialized in trauma processing and resourcing for complex PTSD and identity-based trauma.",
    dotColor: "bg-warm-tan",
  },
  {
    year: "2021 - Present",
    title: "Progressive Way Therapy Founder",
    location: "Telehealth Across Texas",
    description:
      "Created a practice centered on brave spaces, liberation-based healing, and community care partnerships.",
    dotColor: "bg-soft-purple",
  },
];

const carePillars = [
  {
    title: "Collaborative Roadmaps",
    description:
      "We co-create goals and adjust together, checking in frequently so therapy stays aligned with what matters most to you.",
    icon: Compass,
    iconBg: "bg-sage-green/15",
    iconColor: "text-sage-green",
  },
  {
    title: "Whole-Person Healing",
    description:
      "Blending somatic practices, identity exploration, and nervous system support to honor the mind-body connection.",
    icon: Leaf,
    iconBg: "bg-soft-purple/15",
    iconColor: "text-soft-purple",
  },
  {
    title: "Liberation-Centered Lens",
    description:
      "Centering social justice, intersectionality, and community resilience so healing extends beyond the session.",
    icon: Users,
    iconBg: "bg-warm-tan/20",
    iconColor: "text-earth-brown",
  },
];

const sessionRhythm = [
  {
    step: "01",
    title: "Begin with Connection",
    description:
      "Our first sessions focus on relationship building and understanding what safety and support look like for you.",
    icon: MessageCircle,
  },
  {
    step: "02",
    title: "Map Your Healing",
    description:
      "Together we select the modalities and pacing—EMDR, parts work, or skill building—that align with your goals.",
    icon: CalendarDays,
  },
  {
    step: "03",
    title: "Integrate & Thrive",
    description:
      "We celebrate growth, integrate insights, and create rituals that help your nervous system hold the progress.",
    icon: GraduationCap,
  },
];

export default function AboutPage() {
  const router = useRouter();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(".fade-in-up");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-32 md:pt-40 pb-24 space-y-24">
        {/* Core Bio Section */}
        <AboutSection />

        {/* Therapeutic Philosophy */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-12 fade-in-up">
              <h2 className="heading is-section mb-6">Therapeutic Philosophy</h2>
              <p className="text is-lead max-w-3xl mx-auto">
                Therapy is a collaborative, liberation-informed space. Every session is designed to honor your story,
                identities, and nervous system.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {philosophyHighlights.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="inclusive-card fade-in-up h-full"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${item.iconBg}`}>
                      <Icon className={`w-6 h-6 ${item.iconColor}`} />
                    </div>
                    <h3 className="heading is-subsection mb-3">{item.title}</h3>
                    <p className="text text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Professional Journey */}
        <section className="py-20 safe-space">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center mb-16 fade-in-up">
              <h2 className="heading is-section mb-6">Professional Journey</h2>
              <p className="text is-lead max-w-2xl mx-auto">
                A decade of walking alongside clients through grief, identity exploration, and trauma recovery with
                compassion and integrity.
              </p>
            </div>
            <div className="relative border-l-2 border-warm-tan/50 pl-8">
              {milestones.map((milestone, index) => (
                <div
                  key={milestone.title}
                  className="relative mb-12 fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`absolute -left-4 top-2 w-6 h-6 rounded-full border-4 border-background ${milestone.dotColor}`} />
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-cream text-earth-brown text-xs font-semibold uppercase tracking-wide">
                    {milestone.year}
                  </span>
                  <h3 className="heading is-subsection text-soft-purple mt-4 mb-2">{milestone.title}</h3>
                  <p className="mt-1 text-sm text-sage-green font-medium">{milestone.location}</p>
                  <p className="text text-muted-foreground leading-relaxed mt-3">{milestone.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How We'll Work Together */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="fade-in-up">
                <h2 className="heading is-section mb-6">How We&apos;ll Work Together</h2>
                <p className="text is-lead">
                  Therapy is a living, breathing relationship. We move at your pace, weaving evidence-based modalities
                  with radical empathy and honest feedback.
                </p>
                <div className="mt-10 space-y-6">
                  {carePillars.map((pillar, index) => {
                    const Icon = pillar.icon;
                    return (
                      <div
                        key={pillar.title}
                        className="inclusive-card fade-in-up"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex items-start space-x-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${pillar.iconBg}`}>
                            <Icon className={`w-6 h-6 ${pillar.iconColor}`} />
                          </div>
                          <div>
                            <h3 className="heading is-subsection text-soft-purple mb-2">{pillar.title}</h3>
                            <p className="text text-sm text-muted-foreground leading-relaxed">{pillar.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-gradient-to-br from-cream to-warm-tan/60 rounded-3xl p-10 border border-warm-tan/40 shadow-gentle fade-in-up">
                <h3 className="heading is-subsection text-soft-purple mb-6">Session Rhythm</h3>
                <div className="space-y-6">
                  {sessionRhythm.map((step, index) => {
                    const Icon = step.icon;
                    return (
                      <div
                        key={step.title}
                        className="flex items-start space-x-4 fade-in-up"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="shrink-0">
                          <div className="w-12 h-12 rounded-full bg-soft-purple/15 text-soft-purple font-semibold flex items-center justify-center">
                            {step.step}
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-1 text-sage-green text-sm font-medium">
                            <Icon className="w-4 h-4" />
                            <span>Step {index + 1}</span>
                          </div>
                          <h4 className="text-lg font-serif text-earth-brown">{step.title}</h4>
                          <p className="text-sm text-earth-brown/80 leading-relaxed mt-1">{step.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="inclusive-card safe-space text-center fade-in-up p-12 md:p-14">
              <h2 className="heading is-section text-soft-purple mb-4">Ready to create space for your healing?</h2>
              <p className="text is-lead max-w-3xl mx-auto text-earth-brown/85">
                Let&apos;s connect for a free 15-minute consultation to explore if we&apos;re the right fit. Bring your real self—
                your story is welcome here.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                <Button size="lg" className="btn-consultation">
                  Schedule Your Free Consultation
                </Button>
                <Button size="lg" className="btn-gentle px-8" onClick={() => router.push("/#contact")}>
                  Contact Blanca
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
