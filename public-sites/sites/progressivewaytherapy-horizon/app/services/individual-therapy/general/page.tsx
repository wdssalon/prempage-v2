"use client";

import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BookOpen,
  Brain,
  CalendarHeart,
  Compass,
  Flower2,
  HandHeart,
  HeartHandshake,
  LampDesk,
  Leaf,
  MessageCircleHeart,
  Rainbow,
  ShieldCheck,
  Sparkles,
  Waves,
} from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

type TrustBadge = {
  label: string;
  icon: LucideIcon;
};

type SafetyHighlight = {
  title: string;
  description: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
};

type SessionExperience = {
  step: string;
  description: string;
  icon: LucideIcon;
};

type ModalityVariant = "highlight" | "card" | "stretch";

type Modality = {
  title: string;
  description: string;
  icon: LucideIcon;
  variant: ModalityVariant;
};

type IdentityChip = {
  label: string;
  icon: LucideIcon;
};

type MicroTestimonial = {
  quote: string;
  name: string;
};

type Resource = {
  title: string;
  description: string;
  cta: string;
};

type FAQ = {
  question: string;
  answer: string;
};

const trustBadges: TrustBadge[] = [
  {
    label: "Telehealth across Texas",
    icon: Waves,
  },
  {
    label: "Progressive, LGBTQIA+ affirming",
    icon: Rainbow,
  },
  {
    label: "Sliding scale conversations welcome",
    icon: HandHeart,
  },
];

const safetyHighlights: SafetyHighlight[] = [
  {
    title: "Statewide Safe Space",
    description:
      "Access therapy from wherever you are in Texas with a therapist who names and honors your identities from the very first session.",
    icon: ShieldCheck,
    iconBg: "bg-soft-purple/15",
    iconColor: "text-soft-purple",
  },
  {
    title: "Collaborative Pace",
    description:
      "We co-create a rhythm that respects your nervous system so healing never feels rushed, minimized, or clinical.",
    icon: Compass,
    iconBg: "bg-sage-green/15",
    iconColor: "text-sage-green",
  },
  {
    title: "Liberation-Focused Lens",
    description:
      "Sessions hold space for systemic pressures, body liberation, cultural nuance, and the intersections that shape your story.",
    icon: Sparkles,
    iconBg: "bg-warm-tan/20",
    iconColor: "text-earth-brown",
  },
];

const sessionExperience: SessionExperience[] = [
  {
    step: "Arrive as You Are",
    description:
      "We start with grounding, pronouns, and what feeling safe means to you today—no need to rehearse or perform.",
    icon: HeartHandshake,
  },
  {
    step: "Co-Create the Focus",
    description:
      "Together we map the care your present and future self need. You set the pace; Blanca offers tools and gentle structure.",
    icon: CalendarHeart,
  },
  {
    step: "Integrate & Reclaim",
    description:
      "Sessions close with ritual and integration so you leave resourced, regulated, and affirmed in your whole self.",
    icon: Leaf,
  },
];

const modalities: Modality[] = [
  {
    title: "Somatic & Nervous System Support",
    description:
      "Learn grounding practices, body-based check-ins, and regulation tools that honor trauma responses without judgment.",
    icon: Waves,
    variant: "highlight",
  },
  {
    title: "EMDR & Parts Work",
    description:
      "Gentle reprocessing meets compassionate inner-part dialogues to untangle the stories that still carry charge.",
    icon: Brain,
    variant: "card",
  },
  {
    title: "Liberatory Skill Building",
    description:
      "Boundaries, communication, and rest practices anchored in progressive values—not productivity quotas.",
    icon: BookOpen,
    variant: "card",
  },
  {
    title: "Community Resources",
    description:
      "Referrals to LGBTQIA+, BIPOC, and reproductive justice partners across Texas so you stay held between sessions.",
    icon: MessageCircleHeart,
    variant: "stretch",
  },
];

const identities: IdentityChip[] = [
  {
    label: "LGBTQIA+",
    icon: Rainbow,
  },
  {
    label: "BIPOC",
    icon: Flower2,
  },
  {
    label: "Immigrant & First-Gen",
    icon: Compass,
  },
  {
    label: "Neurodivergent",
    icon: Brain,
  },
  {
    label: "Progressive women",
    icon: LampDesk,
  },
];

const microTestimonials: MicroTestimonial[] = [
  {
    quote:
      "Blanca never asked me to shrink. Even on the days I had no words, she sat with me until breathing felt possible again.",
    name: "Queer client in Dallas",
  },
  {
    quote:
      "Therapy finally feels like a collaboration—not a lecture. My identity and values are centered every single session.",
    name: "Latina client, Austin",
  },
  {
    quote:
      "I can name what I need without fear. Blanca reminds me liberation is a practice we build together.",
    name: "Non-faith-based client, Houston",
  },
];

const resources: Resource[] = [
  {
    title: "Grounding Audio Ritual",
    description: "A five-minute breath + body practice Blanca shares between sessions.",
    cta: "Request the recording",
  },
  {
    title: "Session Reflection Guide",
    description: "Prompts to help you process what surfaced and decide what support you need next.",
    cta: "Download the guide",
  },
  {
    title: "Liberation Check-In",
    description: "A worksheet to track boundaries, joy, anger, and rest without judgment.",
    cta: "Ask for a copy",
  },
];

const faqs: FAQ[] = [
  {
    question: "What happens during the first few sessions?",
    answer:
      "We focus on building a relationship, learning what safety looks like for you, and naming the pressures you are carrying. There is no intake script—just spacious conversation and grounding to help your nervous system settle.",
  },
  {
    question: "Do I have to choose a modality right away?",
    answer:
      "No. We explore options like EMDR, parts work, or skills together and ease in when you feel ready. Your agency and consent lead every decision.",
  },
  {
    question: "How often will we meet?",
    answer:
      "Most clients schedule weekly or biweekly telehealth sessions. We revisit cadence as your capacity shifts so therapy stays sustainable.",
  },
];

export default function GeneralIndividualTherapyPage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.15 }
    );

    const elements = document.querySelectorAll(".fade-in-up");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-28 md:pt-40 space-y-24 pb-24">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-hero" aria-hidden="true" />
          <div
            className="absolute -top-32 -right-40 w-[420px] h-[420px] bg-soft-purple/30 blur-3xl rounded-full animate-gentle-float"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-24 -left-32 w-[360px] h-[360px] bg-sage-green/25 blur-3xl rounded-full animate-gentle-float"
            aria-hidden="true"
          />

          <div className="relative container mx-auto px-4 py-28 md:py-32 max-w-6xl text-cream">
            <div className="max-w-3xl space-y-6 fade-in-up">
              <Badge className="bg-soft-purple/30 text-cream border border-cream/30">General Individual Therapy</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light drop-shadow-xl text-white">
                Therapy that meets you where you are—and moves with the life you deserve.
              </h1>
              <p className="text-lg md:text-xl text-cream/90">
                Blanca Kleinfall offers progressive, identity-affirming therapy for adults who are done holding it all
                together alone. Every session is a brave space to exhale, feel seen, and build liberation in real time.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="btn-consultation text-base">
                  <Link href="/#contact">Book a free consultation</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="btn-secondary backdrop-blur-sm px-8 py-4">
                  <Link href="/services/specialized-support">Explore specialized support</Link>
                </Button>
              </div>
            </div>

            <div className="mt-14 grid gap-4 sm:grid-cols-3 fade-in-up" style={{ animationDelay: "0.1s" }}>
              {trustBadges.map((badge) => {
                const Icon = badge.icon;
                return (
                  <div
                    key={badge.label}
                    className="flex items-center gap-3 bg-cream/10 border border-cream/20 rounded-2xl px-4 py-3 backdrop-blur"
                  >
                    <Icon className="w-5 h-5 text-cream" />
                    <p className="text-sm font-medium text-cream/90">{badge.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="safe-space">
          <div className="container mx-auto px-4 py-20 max-w-6xl grid gap-12 md:grid-cols-2 items-start">
            <div className="space-y-6 fade-in-up">
              <Badge className="bg-sage-green/10 text-sage-green border-sage-green/40">Belonging comes first</Badge>
              <h2 className="heading is-section mb-4">Come as the whole person you are</h2>
              <p className="text is-lead">
                Your story deserves a therapist who sees the intersections, honors the culture you bring with you, and
                never asks you to tone down your truth. Blanca sits beside you as an ally, making sure therapy feels like
                a shared breath—not a checklist.
              </p>
              <p className="text text-muted-foreground">
                We name systemic pressure, celebrate identity, and practice rest so you can move through life with more
                steadiness and support.
              </p>
            </div>
            <div className="grid gap-6 fade-in-up" style={{ animationDelay: "0.1s" }}>
              {safetyHighlights.map((highlight, index) => {
                const Icon = highlight.icon;
                return (
                  <div
                    key={highlight.title}
                    className="inclusive-card gentle-hover h-full"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${highlight.iconBg}`}>
                      <Icon className={`w-6 h-6 ${highlight.iconColor}`} />
                    </div>
                    <h3 className="heading is-subsection mb-2">{highlight.title}</h3>
                    <p className="text text-sm text-muted-foreground leading-relaxed">{highlight.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="relative py-20 bg-cream/60">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center max-w-3xl mx-auto mb-14 fade-in-up">
              <Badge className="bg-soft-purple/10 text-soft-purple border-soft-purple/30">Session rhythm</Badge>
              <h2 className="heading is-section mb-4">Each session is co-authored</h2>
              <p className="text is-lead">
                Therapy isn&apos;t performance. We move gently, return to safety whenever you need, and celebrate every
                moment of self-trust along the way.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3 fade-in-up">
              {sessionExperience.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.step}
                    className="relative bg-card rounded-3xl border border-border/60 p-8 shadow-gentle overflow-hidden"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-12 h-12 rounded-full bg-soft-purple/15 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-soft-purple" />
                      </div>
                      <span className="text-sm uppercase tracking-wide text-earth-brown/80">{item.step}</span>
                    </div>
                    <p className="text text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                    {/* decorative connector removed per design tweak */}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid gap-10 md:grid-cols-[1.25fr_1fr] items-start">
              <div className="space-y-6 fade-in-up">
                <Badge className="bg-warm-tan/50 text-earth-brown border-earth-brown/30">Modalities in practice</Badge>
                <h2 className="heading is-section mb-4">Blending science, intuition, and liberation</h2>
                <p className="text is-lead">
                  Blanca draws from evidence-based approaches while centering your lived experience. We adapt in real
                  time so every tool feels like it belongs in your life, not someone else&apos;s workbook.
                </p>
              </div>

              <div className="fade-in-up" style={{ animationDelay: "0.1s" }}>
                <div className="p-6 rounded-3xl bg-gradient-to-br from-soft-purple/15 via-cream/60 to-warm-tan/40 shadow-gentle border border-border/50">
                  <p className="text-earth-brown text-sm leading-relaxed">
                    “Progressive Way Therapy is a safe place for progressive-minded individuals seeking therapy in Texas.
                    If you are here, you may feel exhausted from trying to keep it all together. With Blanca&apos;s
                    understanding, you&apos;ll feel seen, heard, and empowered.”
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-12 fade-in-up" style={{ animationDelay: "0.15s" }}>
              {modalities.map((modality) => {
                const Icon = modality.icon;
                const baseClasses =
                  "rounded-3xl border border-border bg-card p-8 shadow-gentle h-full gentle-hover flex flex-col gap-4";

                const variantClasses = {
                  highlight:
                    "md:col-span-6 lg:col-span-7 bg-gradient-to-br from-sage-green/20 via-cream to-soft-purple/10",
                  card: "md:col-span-6 lg:col-span-5",
                  // ensure stretch occupies half on large to sit inline with a card
                  stretch: "md:col-span-12 lg:col-span-7",
                } as const;

                return (
                  <div key={modality.title} className={`${baseClasses} ${variantClasses[modality.variant]}`}>
                    <div className="w-12 h-12 rounded-2xl bg-soft-purple/15 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-soft-purple" />
                    </div>
                    <h3 className="heading is-subsection mb-1">{modality.title}</h3>
                    <p className="text text-sm text-muted-foreground leading-relaxed flex-1">{modality.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-24 safe-space">
          <div className="container mx-auto px-4 max-w-6xl grid gap-12 md:grid-cols-[1.2fr_1fr] items-center">
            <div className="space-y-6 fade-in-up">
              <Badge className="bg-soft-purple/20 text-soft-purple border-soft-purple/30">Identity-centered care</Badge>
              <h2 className="heading is-section mb-4">Your identities deserve celebration, not explanation</h2>
              <p className="text is-lead">
                Bring your full self—your joy, exhaustion, righteous anger, culture, spirituality (or lack of it), and
                boundaries. Blanca honors every part without assigning pathology or pushing assimilation.
              </p>
              <p className="text is-muted">
                Together we untangle systems of harm, rebuild self-trust, and practice rest so you can keep showing up in
                the world on your terms.
              </p>
            </div>
            <div className="fade-in-up" style={{ animationDelay: "0.1s" }}>
              <div className="flex flex-wrap gap-3">
                {identities.map((identity) => {
                  const Icon = identity.icon;
                  return (
                    <Badge
                      key={identity.label}
                      variant="outline"
                      className="px-4 py-2 rounded-full border-earth-brown/40 text-earth-brown bg-cream/80 backdrop-blur"
                    >
                      <span className="flex items-center gap-2 text-sm">
                        <Icon className="w-4 h-4" />
                        {identity.label}
                      </span>
                    </Badge>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 fade-in-up">
              <div>
                <Badge className="bg-sage-green/15 text-sage-green border-sage-green/30">Client reflections</Badge>
                <h2 className="heading is-section mt-4">Short notes from Blanca&apos;s clients</h2>
              </div>
              <p className="text is-lead md:max-w-md">
                These anonymous reflections share how therapy shifts when you don&apos;t have to translate yourself to be
                understood.
              </p>
            </div>

            <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory fade-in-up" style={{ animationDelay: "0.1s" }}>
              {microTestimonials.map((testimonial, index) => (
                <div
                  key={testimonial.quote}
                  className="min-w-[260px] md:min-w-[320px] snap-center bg-cream border border-border/60 rounded-3xl p-6 shadow-gentle"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <p className="text-sm text-earth-brown leading-relaxed mb-4">“{testimonial.quote}”</p>
                  <span className="text-xs uppercase tracking-widest text-soft-purple/70">{testimonial.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 bg-gradient-to-br from-cream via-warm-tan/60 to-soft-purple/10">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center max-w-3xl mx-auto mb-12 fade-in-up">
              <Badge className="bg-earth-brown/10 text-earth-brown border-earth-brown/30">Stay supported between sessions</Badge>
              <h2 className="heading is-section mb-4">Resources Blanca shares often</h2>
              <p className="text is-lead">
                These tools extend the care you receive in session so you can check in with your body, voice, and
                community between appointments.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3 fade-in-up">
              {resources.map((resource, index) => (
                <div
                  key={resource.title}
                  className="inclusive-card h-full flex flex-col"
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  <h3 className="heading is-subsection mb-3">{resource.title}</h3>
                  <p className="text text-sm text-muted-foreground leading-relaxed flex-1">{resource.description}</p>
                  <Button variant="ghost" className="btn-ghost-link justify-start px-0">
                    {resource.cta}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 bg-cream/70">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-12 fade-in-up">
              <Badge className="bg-soft-purple/10 text-soft-purple border-soft-purple/30">FAQs</Badge>
              <h2 className="heading is-section mb-4">What folks ask before we begin</h2>
              <p className="text is-lead">
                Still wondering if therapy with Blanca is the right fit? Explore a few common questions below, or head
                to the full FAQ for even more detail.
              </p>
            </div>
            <Accordion type="single" collapsible className="w-full fade-in-up" style={{ animationDelay: "0.1s" }}>
              {faqs.map((faq) => (
                <AccordionItem key={faq.question} value={faq.question} className="border-border">
                  <AccordionTrigger className="text-left text-earth-brown">
                    <span className="text-base font-medium">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <div className="text-center mt-8 fade-in-up" style={{ animationDelay: "0.15s" }}>
              <Button asChild variant="link" className="text-soft-purple">
                <Link href="/get-started/faqs">See the full FAQ</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="relative py-24">
          <div className="absolute inset-0 bg-gradient-to-br from-soft-purple/15 via-cream to-sage-green/20" aria-hidden="true" />
          <div className="relative container mx-auto px-4 max-w-5xl text-center space-y-6 fade-in-up">
            <h2 className="heading is-section mb-4">Let&apos;s build a brave, steady space together</h2>
            <p className="text is-lead max-w-2xl mx-auto">
              When you&apos;re ready, we&apos;ll schedule a consultation, talk through what support looks like right now, and set
              a pace that feels doable. You never have to do this alone.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button asChild size="lg" className="btn-consultation text-base">
                <Link href="/#contact">Start with a free consultation</Link>
              </Button>
              <Button asChild size="lg" className="btn-gentle px-8">
                <Link href="/get-started/appointment-request">See how getting started works</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
