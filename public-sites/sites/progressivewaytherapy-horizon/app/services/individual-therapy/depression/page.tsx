"use client";

import { useEffect } from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";
import {
  HeartPulse,
  LampDesk,
  Leaf,
  MoonStar,
  Sparkles,
  Sunrise,
  Waves,
} from "lucide-react";

const heroHighlights: Array<{ title: string; description: string; icon: LucideIcon }> = [
  {
    title: "Telehealth evenings",
    description: "Late-day openings so you can rest without reshuffling everything else you hold.",
    icon: MoonStar,
  },
  {
    title: "Liberation-centered",
    description: "We name capitalism, oppression, and grief—not just symptoms—so your body feels believed.",
    icon: Sparkles,
  },
  {
    title: "Gentle pacing",
    description: "You choose the tempo, the silence, and the breath work—we follow your nervous system cues.",
    icon: Waves,
  },
];

const burnoutStages: Array<{ label: string; copy: string }> = [
  {
    label: "Morning fatigue",
    copy: "Waking already exhausted with a to-do list that never shrinks. Therapy becomes a place to set it down before the day begins.",
  },
  {
    label: "Midday collapse",
    copy: "You push through meetings and caregiving on autopilot. Sessions create pockets of validation and skill-building that don’t ask you to hustle.",
  },
  {
    label: "Nighttime numbness",
    copy: "When it's finally quiet, the ache hits. We honor grief and joy, then design rituals that help you feel something other than depletion.",
  },
];

const restorativeAnchors: Array<{ title: string; description: string; icon: LucideIcon; accent: string }> = [
  {
    title: "Body listening",
    description: "Somatic check-ins invite warmth back into shoulders, chest, and jaw without forcing stillness.",
    icon: HeartPulse,
    accent: "bg-soft-purple/15 text-soft-purple",
  },
  {
    title: "Liberatory narratives",
    description: "We reframe productivity myths, explore identity stories, and center community care.",
    icon: LampDesk,
    accent: "bg-sage-green/15 text-sage-green",
  },
  {
    title: "Sustainable practices",
    description: "Tiny acts of rest, boundary rituals, and joy reclamation that fit the life you actually live.",
    icon: Leaf,
    accent: "bg-warm-tan/20 text-earth-brown",
  },
];

const restorationPlan: Array<{ step: string; title: string; description: string }> = [
  {
    step: "01",
    title: "Arrive as you are",
    description: "We start with a debrief, nervous-system check, and consent-based agenda setting each visit.",
  },
  {
    step: "02",
    title: "Name what hurts",
    description: "Together we map the pressures draining you—work, identity, family, systemic harm—and choose an anchor to explore.",
  },
  {
    step: "03",
    title: "Rebuild capacity",
    description: "Sessions close with grounded next steps, rest practices, or joyful homework so healing continues gently between calls.",
  },
];

export default function TherapyForDepressionPage() {
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
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-soft-purple/25 via-cream to-warm-tan/30" aria-hidden="true" />
          <div className="absolute -right-24 top-14 w-[320px] h-[320px] rounded-full bg-sage-green/25 blur-3xl animate-gentle-float" aria-hidden="true" />
          <div className="relative container mx-auto px-4 py-24 md:py-32 max-w-6xl grid gap-10 md:grid-cols-[1.1fr_1fr] items-start">
            <div className="space-y-6 fade-in-up">
              <Badge className="bg-soft-purple/20 text-soft-purple border-soft-purple/30">Therapy for Depression</Badge>
              <h1 className="heading is-display text-soft-purple">
                Healing that makes room for exhaustion, grief, and slowly returning light.
              </h1>
              <p className="text is-lead text-earth-brown/85">
                Blanca Kleinfall offers progressive, identity-affirming therapy for adults in Texas moving through
                depression, burnout, and numbness. Sessions become a sanctuary to breathe, be witnessed, and rebuild at
                your pace.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild variant="unstyled" className="btn-primary">
                  <Link href="/get-started/appointment-request">Start with a gentle consult</Link>
                </Button>
                <Button asChild variant="unstyled" className="btn-gentle">
                  <Link href="/#contact">Ask about availability</Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-4 fade-in-up" style={{ animationDelay: "0.1s" }}>
              {heroHighlights.map((highlight, index) => {
                const Icon = highlight.icon;
                return (
                  <div
                    key={highlight.title}
                    className="rounded-md border border-border/50 bg-card/80 backdrop-blur p-6 shadow-gentle gentle-hover"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex items-center gap-3 mb-3 text-soft-purple">
                      <Icon className="w-5 h-5" />
                      <span className="uppercase tracking-wide text-xs font-semibold text-earth-brown/70">
                        {highlight.title}
                      </span>
                    </div>
                    <p className="text text-sm text-muted-foreground leading-relaxed">{highlight.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-20 bg-cream/70">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center max-w-3xl mx-auto space-y-4 fade-in-up">
              <Badge className="bg-sage-green/20 text-sage-green border-sage-green/40">How heaviness shows up</Badge>
              <h2 className="heading is-section">Depression isn&apos;t laziness—it&apos;s a nervous system doing its best to protect you</h2>
              <p className="text text-muted-foreground">
                We map your day and honor the moments that feel impossible. The goal isn&apos;t productivity—it&apos;s easing the
                weight so life feels a little more breathable.
              </p>
            </div>

            <div className="mt-12 space-y-10 fade-in-up" style={{ animationDelay: "0.1s" }}>
              {burnoutStages.map((stage, index) => (
                <div key={stage.label} className="relative pl-8">
                  <div className="absolute left-0 top-1.5 w-1 h-full bg-soft-purple/30" aria-hidden="true" />
                  <div className="absolute left-0 -translate-x-1/2 w-6 h-6 rounded-full border-4 border-cream bg-soft-purple/80" />
                  <div className="bg-card rounded-md border border-border/50 p-6 shadow-gentle">
                    <span className="text-xs uppercase tracking-wide text-earth-brown/70">Phase {index + 1}</span>
                    <h3 className="heading is-subsection text-soft-purple mt-2 mb-3">{stage.label}</h3>
                    <p className="text text-sm text-muted-foreground leading-relaxed">{stage.copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="safe-space">
          <div className="container mx-auto px-4 py-20 max-w-6xl grid gap-8 md:grid-cols-3">
            {restorativeAnchors.map((anchor, index) => {
              const Icon = anchor.icon;
              return (
                <div
                  key={anchor.title}
                  className="rounded-md border border-border/50 bg-card p-8 shadow-gentle flex flex-col gap-4 gentle-hover"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className={`w-12 h-12 rounded-md flex items-center justify-center ${anchor.accent}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="heading is-subsection text-soft-purple">{anchor.title}</h3>
                  <p className="text text-sm text-muted-foreground leading-relaxed">{anchor.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 max-w-5xl grid gap-12 md:grid-cols-[1fr_1.1fr] items-start">
            <div className="space-y-6 fade-in-up">
              <Badge className="bg-soft-purple/15 text-soft-purple border-soft-purple/30">Restoration plan</Badge>
              <h2 className="heading is-section">A session rhythm that honors downtime</h2>
              <p className="text is-lead">
                Depression can make hope feel distant. Each step we take together centers consent, body wisdom, and your
                definition of relief.
              </p>
              <Button asChild variant="unstyled" className="btn-primary">
                <Link href="/get-started/appointment-request">Book a curiosity call</Link>
              </Button>
            </div>

            <div className="space-y-4 fade-in-up" style={{ animationDelay: "0.1s" }}>
              {restorationPlan.map((item, index) => (
                <div
                  key={item.title}
                  className="rounded-md border border-border/50 bg-card p-6 shadow-gentle flex gap-4"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="w-12 h-12 rounded-full bg-soft-purple/15 text-soft-purple font-semibold flex items-center justify-center">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="heading is-subsection mb-2">{item.title}</h3>
                    <p className="text text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-soft-purple/20 via-cream to-sage-green/15" aria-hidden="true" />
          <div className="relative container mx-auto px-4 max-w-4xl text-center space-y-6 fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cream/70 border border-soft-purple/30 rounded-full text-soft-purple">
              <Sunrise className="w-4 h-4" />
              <span className="text-sm font-medium">When you&apos;re ready, we&apos;ll meet you there</span>
            </div>
            <h2 className="heading is-section text-soft-purple">
              Rest is revolutionary. Therapy can help you reclaim it.
            </h2>
            <p className="text is-lead max-w-2xl mx-auto">
              Reach out for a low-pressure consult or send a note about what support could look like. We&apos;ll co-create a
              plan that matches your energy—not the other way around.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild variant="unstyled" className="btn-primary">
                <Link href="/get-started/appointment-request">Schedule a consult</Link>
              </Button>
              <Button asChild variant="unstyled" className="btn-gentle">
                <Link href="/#contact">Send a message</Link>
              </Button>
            </div>
            <p className="text-sm text-earth-brown/70">
              Prefer email first? Write to <span className="font-medium">hello@progressivewaytherapy.com</span> and share
              what feels important.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
