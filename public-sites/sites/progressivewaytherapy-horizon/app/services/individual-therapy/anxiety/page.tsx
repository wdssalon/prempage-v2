"use client";

import { useEffect } from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FinalCTA from "@/components/FinalCTA";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  AlarmClock,
  Brain,
  Compass,
  Feather,
  MessageCircleHeart,
  Sparkles,
  Waves,
} from "lucide-react";

type ExperienceSignal = {
  title: string;
  description: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
};

type CarePillar = {
  title: string;
  description: string;
  icon: LucideIcon;
};

type Practice = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const experienceSignals: ExperienceSignal[] = [
  {
    title: "Mind on constant spin",
    description:
      "Thoughts loop, worst-case scenarios stack, and silence only makes the spiral louder. You deserve tools that calm without shaming you for caring so deeply.",
    icon: Brain,
    iconBg: "bg-soft-purple/15",
    iconColor: "text-soft-purple",
  },
  {
    title: "Body stuck on high alert",
    description:
      "Jaw clenched, chest tight, shoulders burning—your nervous system has been overfunctioning for a long time. Together we'll honor the message and invite regulation back in.",
    icon: Activity,
    iconBg: "bg-sage-green/15",
    iconColor: "text-sage-green",
  },
  {
    title: "Clock always ticking",
    description:
      "Deadlines, politics, caregiving, expectations—it feels like there is never enough time to breathe. We create rituals that slow urgency and return you to your pace.",
    icon: AlarmClock,
    iconBg: "bg-warm-tan/20",
    iconColor: "text-earth-brown",
  },
];

const carePillars: CarePillar[] = [
  {
    title: "Liberation-first lens",
    description:
      "We name systemic pressure, identity-based stress, and cultural narratives so anxiety isn't gaslit into a ‘personal problem.’",
    icon: Sparkles,
  },
  {
    title: "Somatic regulation",
    description:
      "Expect grounding, breath, and body-based practices that help your nervous system learn safety without forcing stillness.",
    icon: Waves,
  },
  {
    title: "Collaborative experiments",
    description:
      "We co-create small, values-aligned experiments so change feels doable and consent-driven—not another obligation.",
    icon: Compass,
  },
];

const practices: Practice[] = [
  {
    title: "Session-opening grounding",
    description:
      "We begin with breath, movement, or sensory rituals you choose so your body understands we're in a safe container.",
    icon: Feather,
  },
  {
    title: "Liberating the inner critic",
    description:
      "Parts work + compassionate reframes help the loudest voices inside shift from policing you to protecting you.",
    icon: MessageCircleHeart,
  },
  {
    title: "Between-session support",
    description:
      "You leave with practices and community resources that keep care moving between appointments without overwhelming you.",
    icon: Waves,
  },
];

export default function CounselingForAnxietyPage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.12 }
    );

    const elements = document.querySelectorAll(".fade-in-up");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-28 md:pt-40 pb-24 space-y-24">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-hero" aria-hidden="true" />
          <div className="absolute -right-32 top-12 w-[360px] h-[360px] bg-soft-purple/30 blur-3xl rounded-full animate-gentle-float" aria-hidden="true" />
          <div className="absolute -left-24 bottom-0 w-[300px] h-[300px] bg-sage-green/25 blur-3xl rounded-full animate-gentle-float" aria-hidden="true" />

          <div className="relative container mx-auto px-4 py-28 md:py-32 max-w-5xl text-cream space-y-8 fade-in-up">
            <Badge className="bg-soft-purple/25 text-cream border border-cream/30">Counseling for Anxiety</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light leading-tight">
              Let&apos;s quiet the whirlwind without dimming who you are.
            </h1>
            <p className="text-lg md:text-xl text-cream/90 max-w-3xl">
              Anxiety shows up for a reason. In therapy with Blanca, we listen to what it&apos;s protecting, soothe your
              nervous system, and build practices rooted in liberation—not perfection.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild variant="unstyled" className="btn-primary is-on-dark is-medium">
                <Link href="/get-started/appointment-request">Request a consultation</Link>
              </Button>
              <Button asChild variant="unstyled" className="btn-secondary is-on-dark">
                <Link href="/#services">See all therapy focuses</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="safe-space">
          <div className="container mx-auto px-4 py-20 max-w-6xl space-y-14">
            <div className="max-w-3xl space-y-4 fade-in-up">
              <Badge className="bg-warm-tan/40 text-earth-brown border-earth-brown/30">How anxiety can feel</Badge>
              <h2 className="heading is-section">You&apos;re not overreacting—you&apos;re alert to what matters</h2>
              <p className="text is-lead">
                Therapy names the very real conditions that keep your body in survival mode. Together we trade blame for
                curiosity and create room to breathe again.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3 fade-in-up" style={{ animationDelay: "0.1s" }}>
              {experienceSignals.map((signal, index) => {
                const Icon = signal.icon;
                return (
                  <div
                    key={signal.title}
                    className="inclusive-card h-full"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className={`w-12 h-12 rounded-md flex items-center justify-center mb-5 ${signal.iconBg}`}>
                      <Icon className={`w-6 h-6 ${signal.iconColor}`} />
                    </div>
                    <h3 className="heading is-subsection mb-3">{signal.title}</h3>
                    <p className="text text-sm text-muted-foreground leading-relaxed">{signal.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-20 bg-cream/70">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center max-w-3xl mx-auto space-y-4 fade-in-up">
              <Badge className="bg-soft-purple/15 text-soft-purple border-soft-purple/30">How Blanca supports you</Badge>
              <h2 className="heading is-section">Liberation-based care that steadies your nervous system</h2>
              <p className="text is-lead">
                Each session blends validation, body awareness, and progressive strategy so easing anxiety never means
                shrinking your values.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3 fade-in-up" style={{ animationDelay: "0.1s" }}>
              {carePillars.map((pillar, index) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={pillar.title}
                    className="rounded-md border border-border/60 bg-card p-8 shadow-gentle h-full gentle-hover"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="w-12 h-12 rounded-md bg-soft-purple/15 flex items-center justify-center mb-5">
                      <Icon className="w-6 h-6 text-soft-purple" />
                    </div>
                    <h3 className="heading is-subsection mb-3">{pillar.title}</h3>
                    <p className="text text-sm text-muted-foreground leading-relaxed">{pillar.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 max-w-6xl grid gap-12 md:grid-cols-[1.1fr_1fr] items-start">
            <div className="space-y-6 fade-in-up">
              <Badge className="bg-sage-green/20 text-sage-green border-sage-green/40">Inside each session</Badge>
              <h2 className="heading is-section">We co-create calm you can feel in your body</h2>
              <p className="text is-lead">
                You set the pace. Blanca checks in often, offers choices, and leaves room for laughter, anger, and rest so
                the pressure to perform melts away.
              </p>
              <Button asChild variant="unstyled" className="btn-gentle">
                <Link href="/#contact">Ask about session availability</Link>
              </Button>
            </div>

            <div className="space-y-4 fade-in-up" style={{ animationDelay: "0.1s" }}>
              {practices.map((practice, index) => {
                const Icon = practice.icon;
                return (
                  <div
                    key={practice.title}
                    className="rounded-md border border-border/60 bg-card p-6 shadow-gentle flex items-start gap-4"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="w-12 h-12 rounded-md bg-soft-purple/15 flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6 text-soft-purple" />
                    </div>
                    <div>
                      <h3 className="heading is-subsection text-soft-purple mb-2">{practice.title}</h3>
                      <p className="text text-sm text-muted-foreground leading-relaxed">{practice.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
