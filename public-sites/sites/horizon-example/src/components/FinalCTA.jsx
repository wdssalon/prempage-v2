"use client";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { getAssetUrl } from "@/lib/site-assets";
import { cn } from "@/lib/utils";
import { Calendar, MapPin, MessageSquare, Phone } from "lucide-react";
import Link from "next/link";

const communityImage = getAssetUrl("community-support.jpg");

export default function FinalCTA({ sectionId, variant = "default" }) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const headingId = `${sectionId}__heading`;
  const descriptionId = `${sectionId}__description`;
  const sectionClasses =
    variant === "ada"
      ? "py-20 bg-gradient-to-br from-surface via-base to-surface relative overflow-hidden"
      : "py-20 bg-gradient-hero relative overflow-hidden";
  const overlayClass = variant === "ada" ? "hidden" : "absolute inset-0 bg-gradient-hero opacity-50";
  const shouldShowImage = !prefersReducedMotion && variant !== "ada";
  const headingClasses = cn(
    "heading is-section md:text-5xl mb-6",
    variant === "ada" ? "text-brand" : "is-on-dark text-inverse",
  );
  const descriptionClasses = cn(
    "text is-lead text-xl mb-8 max-w-2xl mx-auto",
    variant === "ada" ? "text-copy" : "is-on-dark text-inverse",
  );
  const cardTitleClasses = cn(
    "font-serif text-lg mb-2",
    variant === "ada" ? "text-brand" : "text-inverse",
  );
  const cardBodyClasses = cn(
    "text-sm mb-4",
    variant === "ada" ? "text-muted" : "text-inverse/80",
  );
  const inlineIconClasses = cn("w-5 h-5 mr-2", variant === "ada" ? "text-brand" : "text-accent");
  const supportingLabelClasses = cn(
    "font-serif mb-3",
    variant === "ada" ? "text-brand" : "text-inverse",
  );
  const supportingTextClasses = cn(
    "space-y-1 text-sm",
    variant === "ada" ? "text-muted" : "text-inverse/80",
  );
  const callToActionClasses = variant === "ada" ? "btn-primary is-fluid" : "btn-primary is-on-dark is-fluid";

  return (
    <section
      id={sectionId}
      data-section-id={sectionId}
      className={sectionClasses}
      aria-labelledby={headingId}
      aria-describedby={descriptionId}
    >
      <div id="contact" className="sr-only" />
      <div id="book-consultation" className="sr-only" />
      {variant !== "ada" && (
        <div className="absolute inset-0" aria-hidden="true">
          {shouldShowImage ? (
            <img
              src={communityImage}
              alt="Diverse community supporting each other"
              className="w-full h-full object-cover opacity-20"
              data-ppid="code:public-sites/sites/horizon-example/src/components/FinalCTA.jsx#FinalCTA.image.1" />
          ) : (
            <div className="w-full h-full bg-brand/20" />
          )}
          <div className={overlayClass} />
        </div>
      )}
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-fade-in-up">
            <h2
              id={headingId}
              className={headingClasses}
              data-ppid="code:public-sites/sites/horizon-example/src/components/FinalCTA.jsx#FinalCTA.heading.1">
              Ready to Start Your
              <span
                className="block text-accent"
                data-ppid="code:public-sites/sites/horizon-example/src/components/FinalCTA.jsx#FinalCTA.inline.1">Healing Journey?</span>
            </h2>

            <p
              id={descriptionId}
              className={descriptionClasses}
              data-ppid="code:public-sites/sites/horizon-example/src/components/FinalCTA.jsx#FinalCTA.body.1">
              Take the first step toward authentic healing. Your free consultation is completely confidential and
              pressure-free.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="bg-surface/70 rounded-md p-6 border border-border/30 shadow-gentle">
              <Phone className={cn("w-8 h-8 mx-auto mb-4", variant === "ada" ? "text-brand" : "text-accent")} aria-hidden="true" />
              <h3
                className={cardTitleClasses}
                data-ppid="code:public-sites/sites/horizon-example/src/components/FinalCTA.jsx#FinalCTA.heading.2">Free Consultation</h3>
              <p
                className={cardBodyClasses}
                data-ppid="code:public-sites/sites/horizon-example/src/components/FinalCTA.jsx#FinalCTA.body.2">15-minute phone call to see if we're a good fit</p>
              <Link
                href="/?intent=cta-consultation#book-consultation"
                className={callToActionClasses}
                prefetch={false}
                data-ppid="code:public-sites/sites/horizon-example/src/components/FinalCTA.jsx#FinalCTA.link.1">
                Book Now
              </Link>
            </div>

            <div className="bg-surface/70 rounded-md p-6 border border-border/30 shadow-gentle">
              <MessageSquare className={cn("w-8 h-8 mx-auto mb-4", variant === "ada" ? "text-brand" : "text-accent")} aria-hidden="true" />
              <h3
                className={cardTitleClasses}
                data-ppid="code:public-sites/sites/horizon-example/src/components/FinalCTA.jsx#FinalCTA.heading.3">Send a Message</h3>
              <p
                className={cardBodyClasses}
                data-ppid="code:public-sites/sites/horizon-example/src/components/FinalCTA.jsx#FinalCTA.body.3">Share your story and questions securely</p>
              <Link
                href="/?intent=cta-message#contact"
                className={callToActionClasses}
                prefetch={false}
                data-ppid="code:public-sites/sites/horizon-example/src/components/FinalCTA.jsx#FinalCTA.link.2">
                Contact Form
              </Link>
            </div>

            <div id="calendar" className="bg-surface/70 rounded-md p-6 border border-border/30 shadow-gentle">
              <Calendar className={cn("w-8 h-8 mx-auto mb-4", variant === "ada" ? "text-brand" : "text-accent")} aria-hidden="true" />
              <h3
                className={cardTitleClasses}
                data-ppid="code:public-sites/sites/horizon-example/src/components/FinalCTA.jsx#FinalCTA.heading.4">Direct Scheduling</h3>
              <p
                className={cardBodyClasses}
                data-ppid="code:public-sites/sites/horizon-example/src/components/FinalCTA.jsx#FinalCTA.body.4">Book your first session online to get started.</p>
              <Link
                href="/?intent=cta-calendar#calendar"
                className={callToActionClasses}
                prefetch={false}
                data-ppid="code:public-sites/sites/horizon-example/src/components/FinalCTA.jsx#FinalCTA.link.3">
                View Calendar
              </Link>
            </div>
          </div>

          <div className="bg-surface/60 rounded-md p-8 border border-border/30 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <div className="flex items-center justify-center mb-4">
              <MapPin className={inlineIconClasses} aria-hidden="true" />
              <span
                className={cn("font-medium", variant === "ada" ? "text-brand" : "text-inverse")}
                data-ppid="code:public-sites/sites/horizon-example/src/components/FinalCTA.jsx#FinalCTA.inline.2">Serving All of Texas via Telehealth</span>
            </div>

            <div className={cn("grid md:grid-cols-2 gap-8", variant === "ada" ? "text-muted" : "text-inverse/80")}
            >
              <div>
                <h4
                  className={supportingLabelClasses}
                  data-ppid="code:public-sites/sites/horizon-example/src/components/FinalCTA.jsx#FinalCTA.heading.5">Available Hours</h4>
                <div className={supportingTextClasses}>
                  <p
                    data-ppid="code:public-sites/sites/horizon-example/src/components/FinalCTA.jsx#FinalCTA.body.5">Monday - Thursday: 9am - 7pm</p>
                  <p
                    data-ppid="code:public-sites/sites/horizon-example/src/components/FinalCTA.jsx#FinalCTA.body.6">Friday: 9am - 5pm</p>
                  <p
                    data-ppid="code:public-sites/sites/horizon-example/src/components/FinalCTA.jsx#FinalCTA.body.7">Weekend: Limited availability</p>
                </div>
              </div>

              <div>
                <h4
                  className={supportingLabelClasses}
                  data-ppid="code:public-sites/sites/horizon-example/src/components/FinalCTA.jsx#FinalCTA.heading.6">What to Expect</h4>
                <div className={supportingTextClasses}>
                  <p
                    data-ppid="code:public-sites/sites/horizon-example/src/components/FinalCTA.jsx#FinalCTA.body.8">✓ Completely confidential space</p>
                  <p
                    data-ppid="code:public-sites/sites/horizon-example/src/components/FinalCTA.jsx#FinalCTA.body.9">✓ No judgment, just compassion</p>
                  <p
                    data-ppid="code:public-sites/sites/horizon-example/src/components/FinalCTA.jsx#FinalCTA.body.10">✓ Evidence-based treatment</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
            <p
              className={cn("text-sm", variant === "ada" ? "text-muted" : "text-inverse/70") }
              data-ppid="code:public-sites/sites/horizon-example/src/components/FinalCTA.jsx#FinalCTA.body.11">
              If you're experiencing a mental health emergency, please call 988 (Suicide & Crisis Lifeline) or go to your
              nearest emergency room.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
