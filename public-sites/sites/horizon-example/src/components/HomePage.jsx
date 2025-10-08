"use client";

import { useEffect } from "react";

import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
// prempage:imports
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

const SECTION_IDS = {
  hero: "home--liberation-hero",
  services: "home--services-overview",
  whyChooseUs: "home--why-choose",
  testimonials: "home--stories",
  finalCta: "home--closing-invite",
};

export default function HomePage({ variant = "default" }) {
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 },
    );

    const elements = document.querySelectorAll(".fade-in-up");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  return (
    <div className={`min-h-screen ${variant === "ada" ? "bg-surface" : "bg-base"}`}>
      <Navigation variant={variant} />
      <main id="main-content" aria-label="Main content">
        {/* prempage:slot:start */}
        {/* prempage:slot:before-home-liberation-hero */}
        <Hero sectionId={SECTION_IDS.hero} variant={variant} />
        {/* prempage:slot:after-home-liberation-hero */}
        {/* prempage:slot:before-home-services-overview */}
        <Services sectionId={SECTION_IDS.services} variant={variant} />
        {/* prempage:slot:after-home-services-overview */}
        {/* prempage:slot:before-home-why-choose */}
        <WhyChooseUs sectionId={SECTION_IDS.whyChooseUs} variant={variant} />
        {/* prempage:slot:after-home-why-choose */}
        {/* prempage:slot:before-home-stories */}
        <Testimonials sectionId={SECTION_IDS.testimonials} variant={variant} />
        {/* prempage:slot:after-home-stories */}
        {/* prempage:slot:before-home-closing-invite */}
        <FinalCTA sectionId={SECTION_IDS.finalCta} variant={variant} />
        {/* prempage:slot:after-home-closing-invite */}
        {/* prempage:slot:end */}
      </main>
      <Footer variant={variant} />
    </div>
  );
}
