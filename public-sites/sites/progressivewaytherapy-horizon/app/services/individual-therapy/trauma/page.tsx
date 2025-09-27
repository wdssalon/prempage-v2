"use client";

import { useEffect } from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";
import {
  Anchor,
  Circle,
  Flame,
  ShieldCheck,
  Sparkles,
  Sunrise,
  Trees,
  Waves,
} from "lucide-react";

const heroHighlights: Array<{ label: string; description: string }> = [
  {
    label: "Consent-led every session",
    description: "You choose the pacing, language, and whether we revisit a memory at all. Safety stays collaborative.",
  },
  {
    label: "Liberation-based lens",
    description: "We name systemic harm, cultural narratives, and intergenerational trauma so you feel believed.",
  },
  {
    label: "Grounded resourcing",
    description: "Somatic practices, ritual, and joyful anchors help your body learn steadiness again.",
  },
];

const groundingCommitments: Array<{ icon: LucideIcon; title: string; copy: string }> = [
  {
    icon: ShieldCheck,
    title: "Safety Before Story",
    copy: "We confirm regulation cues first, offering grounding options before we name anything painful.",
  },
  {
    icon: Waves,
    title: "Body-Oriented Support",
    copy: "Expect consent-based breath, tapping, and movement so release never feels forced or clinical.",
  },
  {
    icon: Sparkles,
    title: "Liberatory Narrative",
    copy: "We reframe experiences through a justice lens to release shame that never belonged to you.",
  },
];

const safetyLattice: Array<{ anchor: string; description: string; icon: LucideIcon }> = [
  {
    anchor: "Stabilize",
    description: "Create rituals that signal safety—a weighted blanket, music, or a word we return to before going deeper.",
    icon: Anchor,
  },
  {
    anchor: "Tend",
    description: "Notice how emotions move through the body and offer warmth, movement, or stillness as it requests.",
    icon: Circle,
  },
  {
    anchor: "Transform",
    description: "When ready, we process memories with EMDR, parts work, or narrative repair while staying co-regulated.",
    icon: Flame,
  },
  {
    anchor: "Integrate",
    description: "We close with grounding, joyful imagination, and future anchors so you leave resourced.",
    icon: Trees,
  },
];

const repairPathways: Array<{ step: string; title: string; detail: string }> = [
  {
    step: "01",
    title: "Mapping the landscape",
    detail: "Together we chart triggers, identities, and support systems so therapy respects your context.",
  },
  {
    step: "02",
    title: "Choosing a modality",
    detail: "We pick from EMDR, somatic resourcing, or narrative reconstruction depending on what your body welcomes.",
  },
  {
    step: "03",
    title: "Practicing repair",
    detail: "Sessions layer slow exposure, boundary practice, and self-compassion homework anchored in liberation.",
  },
];

export default function CounselingForTraumaPage() {
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
        <section data-section-id="individual-trauma--hero" className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-soft-purple/30 via-cream to-sage-green/20" aria-hidden="true" />
          <div className="absolute -left-24 top-10 w-[320px] h-[320px] rounded-full bg-soft-purple/25 blur-3xl animate-gentle-float" aria-hidden="true" />
          <div className="absolute -right-32 bottom-0 w-[360px] h-[360px] rounded-full bg-warm-tan/30 blur-3xl animate-gentle-float" aria-hidden="true" />

          <div className="relative container mx-auto px-4 py-28 md:py-32 max-w-6xl grid gap-12 md:grid-cols-[1.1fr_1fr] items-start">
            <div className="space-y-6 fade-in-up">
              <Badge className="bg-soft-purple/25 text-soft-purple border-soft-purple/40">Counseling for Trauma</Badge>
              <h1 className="heading is-display text-soft-purple">
                Healing that believes you, moves at your pace, and holds every part of your story.
              </h1>
              <p className="text is-lead text-earth-brown/85">
                Blanca Kleinfall offers trauma-informed, liberation-centered therapy for adults across Texas. We build
                brave containers where your nervous system can thaw, reclaim power, and trust the process.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild variant="unstyled" className="btn-primary">
                  <Link href="/get-started/appointment-request">Request a grounding consult</Link>
                </Button>
                <Button asChild variant="unstyled" className="btn-gentle">
                  <Link href="/#contact">Reach out when you&apos;re ready</Link>
                </Button>
              </div>
            </div>

            <div className="space-y-4 fade-in-up" style={{ animationDelay: "0.1s" }}>
              {heroHighlights.map((highlight, index) => (
                <div
                  key={highlight.label}
                  className="rounded-md border border-border/50 bg-card/80 backdrop-blur p-6 shadow-gentle"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <p className="text-xs uppercase tracking-wide text-earth-brown/70 mb-2">{highlight.label}</p>
                  <p className="text text-sm text-muted-foreground leading-relaxed">{highlight.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section data-section-id="individual-trauma--grounding-commitments" className="safe-space">
          <div className="container mx-auto px-4 py-20 max-w-6xl grid gap-12 md:grid-cols-[1fr_1.1fr] items-start">
            <div className="space-y-6 fade-in-up">
              <Badge className="bg-warm-tan/40 text-earth-brown border-earth-brown/30">Grounding commitments</Badge>
              <h2 className="heading is-section">Every session is built around consent, body wisdom, and justice</h2>
              <p className="text text-muted-foreground">
                We never rush disclosure. Instead, we check in with your nervous system, offer pacing choices, and hold space for
                grief, rage, and relief.
              </p>
            </div>
            <div className="space-y-4 fade-in-up" style={{ animationDelay: "0.1s" }}>
              {groundingCommitments.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-md border border-border/50 bg-card p-6 shadow-gentle flex gap-4 gentle-hover"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="w-12 h-12 rounded-md bg-soft-purple/15 flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6 text-soft-purple" />
                    </div>
                    <div>
                      <h3 className="heading is-subsection mb-2">{item.title}</h3>
                      <p className="text text-sm text-muted-foreground leading-relaxed">{item.copy}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section data-section-id="individual-trauma--safety-lattice" className="py-20 bg-cream/70">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center max-w-3xl mx-auto space-y-4 fade-in-up">
              <Badge className="bg-soft-purple/15 text-soft-purple border-soft-purple/30">Safety lattice</Badge>
              <h2 className="heading is-section">A four-part framework to steady your nervous system</h2>
              <p className="text text-muted-foreground">
                We build scaffolding around your journey so processing becomes doable. Each anchor layers on another level of
                support without overwhelming.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 fade-in-up" style={{ animationDelay: "0.1s" }}>
              {safetyLattice.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.anchor}
                    className="rounded-md border border-border/50 bg-card p-8 shadow-gentle flex flex-col gap-4 gentle-hover"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex items-center gap-3 text-soft-purple">
                      <Icon className="w-6 h-6" />
                      <span className="text-sm font-semibold uppercase tracking-wide">{item.anchor}</span>
                    </div>
                    <p className="text text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section data-section-id="individual-trauma--repair-pathways" className="py-20">
          <div className="container mx-auto px-4 max-w-5xl grid gap-10 md:grid-cols-[1fr_1.1fr] items-start">
            <div className="space-y-6 fade-in-up">
              <Badge className="bg-soft-purple/15 text-soft-purple border-soft-purple/30">Repair pathways</Badge>
              <h2 className="heading is-section">We co-design healing steps that feel possible</h2>
              <p className="text is-lead">
                Sessions alternate between resourcing and reprocessing, always honoring your yes, no, or not yet.
              </p>
            </div>
            <div className="space-y-4 fade-in-up" style={{ animationDelay: "0.1s" }}>
              {repairPathways.map((pathway, index) => (
                <div
                  key={pathway.title}
                  className="rounded-md border border-border/50 bg-card p-6 shadow-gentle flex gap-4"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="w-12 h-12 rounded-full bg-soft-purple/15 text-soft-purple font-semibold flex items-center justify-center">
                    {pathway.step}
                  </div>
                  <div>
                    <h3 className="heading is-subsection mb-2">{pathway.title}</h3>
                    <p className="text text-sm text-muted-foreground leading-relaxed">{pathway.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section data-section-id="individual-trauma--invitation" className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-soft-purple/20 via-cream to-sage-green/15" aria-hidden="true" />
          <div className="relative container mx-auto px-4 max-w-4xl text-center space-y-6 fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cream/80 border border-soft-purple/30 rounded-full text-soft-purple">
              <Sunrise className="w-4 h-4" />
              <span className="text-sm font-medium">You deserve a space where trauma isn&apos;t minimized</span>
            </div>
            <h2 className="heading is-section text-soft-purple">Reach out when it feels right—we&apos;ll meet you with care</h2>
            <p className="text is-lead max-w-2xl mx-auto">
              Share as much or as little as you want in your first note. Blanca will respond with next steps, availability,
              and ways to ground before we meet.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild variant="unstyled" className="btn-primary">
                <Link href="/get-started/appointment-request">Schedule a consult</Link>
              </Button>
              <Button asChild variant="unstyled" className="btn-gentle">
                <Link href="/#contact">Send a message</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
