"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.25),_transparent_55%)]" aria-hidden="true" />
      <div className="section-wrapper relative text-center">
        <p className="text uppercase tracking-widest text-foreground/60">Powered by Horizon</p>
        <h1 className="heading is-display mt-4 max-w-3xl mx-auto">
          Launch a polished Next.js marketing site in record time
        </h1>
        <p className="text is-lead mt-6 max-w-2xl mx-auto">
          Use this boilerplate as the starting point for therapist, coaching, or SaaS experiences. Swap sections, update
          tokens, and ship without wrestling with setup.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="lg">
            Start editing
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="lg" asChild>
            <a href="#services">View section catalog</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
