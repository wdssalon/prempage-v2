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
      data-section-id={sectionId}
      className={sectionClasses}
      aria-labelledby={headingId}
      aria-describedby={descriptionId}
    >
      {variant !== "ada" && (
        <div className="absolute inset-0" aria-hidden="true">
          {shouldShowImage ? (
            <img
              src={communityImage}
              alt="Diverse community supporting each other"
              className="w-full h-full object-cover opacity-20"
            />
          ) : (
            <div className="w-full h-full bg-brand/20" />
          )}
          <div className={overlayClass} />
        </div>
      )}

      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-fade-in-up">
            <h2 id={headingId} className={headingClasses}>
              Ready to Start Your
              <span className="block text-accent">Healing Journey?</span>
            </h2>

            <p id={descriptionId} className={descriptionClasses}>
              Take the first step toward authentic healing. Your free consultation is completely confidential and
              pressure-free.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="bg-surface/70 rounded-md p-6 border border-border/30 shadow-gentle">
              <Phone className={cn("w-8 h-8 mx-auto mb-4", variant === "ada" ? "text-brand" : "text-accent")} aria-hidden="true" />
              <h3 className={cardTitleClasses}>Free Consultation</h3>
              <p className={cardBodyClasses}>15-minute phone call to see if we're a good fit</p>
              <Link
                href="/#book-consultation"
                className={callToActionClasses}
                prefetch={false}
              >
                Book Now
              </Link>
            </div>

            <div className="bg-surface/70 rounded-md p-6 border border-border/30 shadow-gentle">
              <MessageSquare className={cn("w-8 h-8 mx-auto mb-4", variant === "ada" ? "text-brand" : "text-accent")} aria-hidden="true" />
              <h3 className={cardTitleClasses}>Send a Message</h3>
              <p className={cardBodyClasses}>Share your story and questions securely</p>
              <Link href="/#contact" className={callToActionClasses} prefetch={false}>
                Contact Form
              </Link>
            </div>

            <div className="bg-surface/70 rounded-md p-6 border border-border/30 shadow-gentle">
              <Calendar className={cn("w-8 h-8 mx-auto mb-4", variant === "ada" ? "text-brand" : "text-accent")} aria-hidden="true" />
              <h3 className={cardTitleClasses}>Direct Scheduling</h3>
              <p className={cardBodyClasses}>Book your first session online to get started.</p>
              <Link href="/#calendar" className={callToActionClasses} prefetch={false}>
                View Calendar
              </Link>
            </div>
          </div>

          <div className="bg-surface/60 rounded-md p-8 border border-border/30 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <div className="flex items-center justify-center mb-4">
              <MapPin className={inlineIconClasses} aria-hidden="true" />
              <span className={cn("font-medium", variant === "ada" ? "text-brand" : "text-inverse")}>Serving All of Texas via Telehealth</span>
            </div>

            <div className={cn("grid md:grid-cols-2 gap-8", variant === "ada" ? "text-muted" : "text-inverse/80")}
            >
              <div>
                <h4 className={supportingLabelClasses}>Available Hours</h4>
                <div className={supportingTextClasses}>
                  <p>Monday - Thursday: 9am - 7pm</p>
                  <p>Friday: 9am - 5pm</p>
                  <p>Weekend: Limited availability</p>
                </div>
              </div>

              <div>
                <h4 className={supportingLabelClasses}>What to Expect</h4>
                <div className={supportingTextClasses}>
                  <p>✓ Completely confidential space</p>
                  <p>✓ No judgment, just compassion</p>
                  <p>✓ Evidence-based treatment</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
            <p className={cn("text-sm", variant === "ada" ? "text-muted" : "text-inverse/70") }>
              If you're experiencing a mental health emergency, please call 988 (Suicide & Crisis Lifeline) or go to your
              nearest emergency room.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
