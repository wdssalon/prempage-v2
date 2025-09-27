"use client";

import { useEffect } from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";
import {
  Flower2,
  HandHeart,
  HeartHandshake,
  Rainbow,
  Sparkles,
  Star,
  Target,
  Users,
  Wand2,
} from "lucide-react";

const identityTiles: Array<{ label: string; description: string }> = [
  {
    label: "LGBTQIA+ & expansive",
    description: "Affirming language, pronouns honored, and joy-centered queer care.",
  },
  {
    label: "BIPOC & multicultural",
    description: "Space to name cultural nuance, code switching fatigue, and community strength.",
  },
  {
    label: "Neurodivergent",
    description: "Adaptive pacing, sensory-friendly rituals, and curiosity-first conversations.",
  },
  {
    label: "Progressive women",
    description: "Support for boundary repair, burnout, and dismantling gendered expectations.",
  },
];

const affirmationBands: Array<{ icon: LucideIcon; text: string; accent: string }> = [
  {
    icon: Rainbow,
    text: "Queer + trans ownership of narrative",
    accent: "from-soft-purple/10 to-soft-purple/30",
  },
  {
    icon: Flower2,
    text: "Body liberation and fat-positive care",
    accent: "from-sage-green/15 to-cream",
  },
  {
    icon: HandHeart,
    text: "Reproductive justice without apology",
    accent: "from-warm-tan/20 to-cream",
  },
];

const specialtySpotlights: Array<{
  title: string;
  description: string;
  icon: LucideIcon;
  surfaceClass: string;
}> = [
  {
    title: "LGBTQIA+ identity integration",
    description:
      "Explore gender, sexuality, and family dynamics with a therapist who celebrates the fullness of queer and trans life in Texas.",
    icon: Rainbow,
    surfaceClass: "bg-soft-purple/15 border-soft-purple/30",
  },
  {
    title: "Reproductive journeys",
    description:
      "Compassionate care before, during, and after pregnancy, fertility treatments, miscarriage, abortion, and postpartum shifts.",
    icon: HandHeart,
    surfaceClass: "bg-warm-tan/20 border-warm-tan/40",
  },
  {
    title: "Immigrant & first-gen resilience",
    description:
      "Hold language loss, bicultural identity, and migration grief while weaving community rituals and rest practices.",
    icon: Users,
    surfaceClass: "bg-sage-green/15 border-sage-green/30",
  },
  {
    title: "Faith transition support",
    description:
      "Untangle religious trauma, reclaim spirituality (or secular grounding), and rebuild trust in your inner authority.",
    icon: Wand2,
    surfaceClass: "bg-soft-purple/10 border-soft-purple/25",
  },
];

const carePathways: Array<{ step: string; title: string; detail: string }> = [
  {
    step: "Align",
    title: "Community audit",
    detail: "We map the systems, relationships, and narratives shaping your safety so therapy honors your lived reality.",
  },
  {
    step: "Design",
    title: "Liberation plan",
    detail: "Co-create practices that center consent—rituals, language shifts, and supports that fit your capacity.",
  },
  {
    step: "Sustain",
    title: "Collective care",
    detail: "We integrate joy, boundaries, and movement, weaving in community partners when shared care is desired.",
  },
];

const ctaHighlights: Array<{ icon: LucideIcon; label: string; copy: string }> = [
  {
    icon: HeartHandshake,
    label: "Collaborative consult",
    copy: "Bring questions, identities, and hopes—we'll map how support can feel honest and accessible.",
  },
  {
    icon: Star,
    label: "Resource bundle",
    copy: "Receive curated community resources, mutual aid links, and rest rituals after our first conversation.",
  },
  {
    icon: Target,
    label: "Care checkpoints",
    copy: "Expect regular consent checks and space to recalibrate goals so therapy keeps matching your energy.",
  },
];

export default function SpecializedSupportPage() {
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
      <main className="pt-28 md:pt-40 pb-24 space-y-24">
        <section
          data-section-id="specialized-support--hero"
          className="relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-soft-purple/25 via-cream to-sage-green/20" aria-hidden="true" />
          <div className="absolute -left-28 top-12 h-[320px] w-[320px] rounded-full bg-soft-purple/25 blur-3xl animate-gentle-float" aria-hidden />
          <div className="absolute -right-32 bottom-0 h-[360px] w-[360px] rounded-full bg-warm-tan/30 blur-3xl animate-gentle-float" aria-hidden />

          <div className="relative container mx-auto max-w-6xl px-4 py-28 md:py-32 grid gap-10 lg:grid-cols-[1.1fr_1fr] items-start">
            <div className="space-y-6 fade-in-up">
              <Badge className="bg-soft-purple/20 text-soft-purple border-soft-purple/30">Specialized Support</Badge>
              <h1 className="heading is-display text-soft-purple">
                Care that celebrates every intersection of who you are.
              </h1>
              <p className="text is-lead text-earth-brown/85">
                From queer joy to reproductive justice, we hold the nuances of your story with consent, imagination, and a justice-forward lens. Therapy becomes a place to breathe, dream, and reclaim belonging.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild variant="unstyled" className="btn-primary">
                  <Link href="/get-started/appointment-request">Start a conversation</Link>
                </Button>
                <Button asChild variant="unstyled" className="btn-gentle">
                  <Link href="/#contact">Share what you need</Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-4 fade-in-up" style={{ animationDelay: "0.1s" }}>
              {identityTiles.map((tile, index) => (
                <div
                  key={tile.label}
                  className="rounded-md border border-border/50 bg-card/80 backdrop-blur p-6 shadow-gentle"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <p className="text-sm font-semibold uppercase tracking-wide text-soft-purple/80">{tile.label}</p>
                  <p className="mt-2 text text-sm text-muted-foreground leading-relaxed">{tile.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          data-section-id="specialized-support--affirmations"
          className="px-4"
        >
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col gap-4">
              {affirmationBands.map((band, index) => {
                const Icon = band.icon;
                return (
                  <div
                    key={band.text}
                    className={`fade-in-up flex items-center gap-4 rounded-md border border-border/50 bg-gradient-to-r ${band.accent} px-6 py-4 shadow-gentle`}
                    style={{ animationDelay: `${index * 0.07}s` }}
                  >
                    <Icon className="h-5 w-5 text-soft-purple" />
                    <span className="text text-sm text-earth-brown/85">{band.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section
          data-section-id="specialized-support--spotlights"
          className="safe-space"
        >
          <div className="container mx-auto max-w-6xl px-4 space-y-10">
            <div className="max-w-3xl space-y-4 text-center mx-auto fade-in-up">
              <Badge className="bg-soft-purple/15 text-soft-purple border-soft-purple/30">Focused specialties</Badge>
              <h2 className="heading is-section">Tailored care for the communities you hold</h2>
              <p className="text is-lead">
                Each spotlight honors lived experience with tools that marry evidence-based practice and liberation-rooted wisdom.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 fade-in-up" style={{ animationDelay: "0.1s" }}>
              {specialtySpotlights.map((spotlight, index) => {
                const Icon = spotlight.icon;
                return (
                  <div
                    key={spotlight.title}
                    className={`rounded-md border ${spotlight.surfaceClass} p-8 shadow-gentle flex flex-col gap-4 gentle-hover`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex items-center gap-3 text-soft-purple">
                      <Icon className="h-5 w-5" />
                      <span className="text-sm font-semibold uppercase tracking-wide">{spotlight.title}</span>
                    </div>
                    <p className="text text-sm text-muted-foreground leading-relaxed">{spotlight.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section
          data-section-id="specialized-support--care-pathways"
          className="py-20 bg-cream/70"
        >
          <div className="container mx-auto max-w-5xl px-4 grid gap-10 lg:grid-cols-[1fr_1.1fr] items-start">
            <div className="space-y-6 fade-in-up">
              <Badge className="bg-soft-purple/15 text-soft-purple border-soft-purple/30">Care pathways</Badge>
              <h2 className="heading is-section">How we move together</h2>
              <p className="text is-lead">
                Your pace guides every step. We weave in imagery, body work, and community connection so the process feels nourishing—not depleting.
              </p>
            </div>

            <div className="space-y-4 fade-in-up" style={{ animationDelay: "0.1s" }}>
              {carePathways.map((pathway, index) => (
                <div
                  key={pathway.title}
                  className="rounded-md border border-border/50 bg-card p-6 shadow-gentle flex gap-4"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="w-16 h-16 rounded-full bg-soft-purple/15 text-soft-purple font-semibold flex items-center justify-center uppercase tracking-wide">
                    {pathway.step}
                  </div>
                  <div className="space-y-1">
                    <h3 className="heading is-subsection">{pathway.title}</h3>
                    <p className="text text-sm text-muted-foreground leading-relaxed">{pathway.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          data-section-id="specialized-support--cta"
          className="relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-soft-purple/20 via-cream to-sage-green/15" aria-hidden />
          <div className="relative container mx-auto max-w-5xl px-4 py-24 grid gap-10 lg:grid-cols-[1.1fr_1fr]">
            <div className="space-y-6 fade-in-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-soft-purple/30 bg-cream/80 px-4 py-2 text-soft-purple">
                Specialized Support
              </div>
              <h2 className="heading is-section text-soft-purple">
                Ready when you are to build a braver, kinder care plan.
              </h2>
              <p className="text is-lead text-earth-brown/85">
                Share as much or as little as you&apos;d like. We&apos;ll respond with thoughtful questions, next steps, and grounding rituals so reaching out feels supported.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild variant="unstyled" className="btn-primary">
                  <Link href="/get-started/appointment-request">Book a specialized consult</Link>
                </Button>
                <Button asChild variant="unstyled" className="btn-gentle">
                  <Link href="/#contact">Send a message</Link>
                </Button>
              </div>
            </div>

            <div className="space-y-4 fade-in-up" style={{ animationDelay: "0.1s" }}>
              {ctaHighlights.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="rounded-md border border-border/50 bg-card/80 backdrop-blur p-6 shadow-gentle"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex items-center gap-3 text-soft-purple">
                      <Icon className="h-5 w-5" />
                      <span className="text-sm font-semibold uppercase tracking-wide">{item.label}</span>
                    </div>
                    <p className="mt-2 text text-sm text-muted-foreground leading-relaxed">{item.copy}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
