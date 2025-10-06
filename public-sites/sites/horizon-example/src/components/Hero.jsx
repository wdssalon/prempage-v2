"use client";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { getAssetUrl } from "@/lib/site-assets";
import { cn } from "@/lib/utils";
import { Heart, MapPin, Phone } from "lucide-react";
import Link from "next/link";

export default function Hero({ sectionId, variant = "default" }) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isAda = variant === "ada";
  const heroImage = isAda ? null : getAssetUrl("hero-therapy.jpg");
  const headingId = `${sectionId}__heading`;
  const descriptionId = `${sectionId}__description`;
  const sectionClasses = isAda
    ? "relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-surface via-base to-surface pt-40"
    : "relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero pt-40";
  const shouldRenderVideo = !prefersReducedMotion && !isAda;

  const eyebrowClasses = cn(
    "inline-flex items-center px-4 py-2 rounded-full mb-6 border",
    isAda
      ? "bg-brand/10 border-brand/30 text-brand"
      : "bg-base/20 backdrop-blur-sm border-border/30 text-inverse",
  );
  const eyebrowIconClasses = cn("w-4 h-4 mr-2", isAda ? "text-brand" : "text-inverse");
  const eyebrowTextClasses = cn("font-medium", isAda ? "text-brand" : "text-inverse");
  const headingClasses = cn("heading is-display mb-6", isAda ? "text-brand" : "is-on-dark", "drop-shadow-lg");
  const descriptionClasses = cn(
    "text is-lead text-xl md:text-2xl mb-8 max-w-3xl mx-auto",
    isAda ? "text-copy" : "is-on-dark",
  );
  const valueRowClasses = cn(
    "flex flex-wrap justify-center gap-6 mb-10",
    isAda ? "text-muted" : "text-inverse/80",
  );
  const metaLabelClasses = cn("text-sm mb-2", isAda ? "text-muted" : "text-inverse/70");
  const metaDetailClasses = cn(
    "flex justify-center items-center space-x-4 text-xs",
    isAda ? "text-muted" : "text-inverse/60",
  );

  return (
    <section
      id={sectionId}
      data-section-id={sectionId}
      className={sectionClasses}
      aria-labelledby={headingId}
      aria-describedby={descriptionId}
    >
      {!isAda && (
        <div className="absolute inset-0" aria-hidden="true">
          {shouldRenderVideo ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
              data-ppid="code:public-sites/sites/horizon-example/src/components/Hero.jsx#Hero.video.1">
              <source
                src="https://wds-prod-public.s3.us-west-1.amazonaws.com/videos/ocean.mp4"
                type="video/mp4"
                data-ppid="code:public-sites/sites/horizon-example/src/components/Hero.jsx#Hero.imageSource.1" />
              {heroImage ? (
                <img
                  src={heroImage}
                  alt="Peaceful ocean scene as video fallback"
                  className="w-full h-full object-cover"
                  data-ppid="code:public-sites/sites/horizon-example/src/components/Hero.jsx#Hero.image.1" />
              ) : null}
            </video>
          ) : (
            heroImage && <img
              src={heroImage}
              alt="Calming ocean scene"
              className="w-full h-full object-cover"
              data-ppid="code:public-sites/sites/horizon-example/src/components/Hero.jsx#Hero.image.2" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/70 to-black/75" />
        </div>
      )}
      <div className="relative z-10 w-full lg:max-w-4xl mx-auto px-4 md:px-6 text-center">
        <div className="animate-fade-in-up">
          <div className={eyebrowClasses}>
            <MapPin className={eyebrowIconClasses} aria-hidden="true" />
            <span
              className={eyebrowTextClasses}
              data-ppid="code:public-sites/sites/horizon-example/src/components/Hero.jsx#Hero.inline.1">Telehealthy Services Across Texas</span>
          </div>

          <h1 id={headingId} className={headingClasses}>
            <span data-ppid="code:public-sites/sites/horizon-example/src/components/Hero.jsx#Hero.inline.2">Therapyy is just for you</span>
            <span className="block text-accent" data-ppid="code:public-sites/sites/horizon-example/src/components/Hero.jsx#Hero.inline.3">Authentic Self</span>
          </h1>

          <p
            id={descriptionId}
            className={descriptionClasses}
            data-ppid="code:public-sites/sites/horizon-example/src/components/Hero.jsx#Hero.body.1">
            Progressive, inclusive therapy for LGBTQIA+, BIPOC, and marginalized communities. You deserve compassionate
            care that honors your whole story.
          </p>

          <div className={valueRowClasses}>
            <div className="flex items-center">
              <Heart className="w-5 h-5 mr-2 text-accent" aria-hidden="true" />
              <span
                data-ppid="code:public-sites/sites/horizon-example/src/components/Hero.jsx#Hero.inline.4">Trauma-Informed Care</span>
            </div>
            <div className="flex items-center">
              <Heart className="w-5 h-5 mr-2 text-accent" aria-hidden="true" />
              <span
                data-ppid="code:public-sites/sites/horizon-example/src/components/Hero.jsx#Hero.inline.5">LGBTQIA+ Affirming</span>
            </div>
            <div className="flex items-center">
              <Heart className="w-5 h-5 mr-2 text-accent" aria-hidden="true" />
              <span
                data-ppid="code:public-sites/sites/horizon-example/src/components/Hero.jsx#Hero.inline.6">Evidence-Based Treatment</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/?intent=hero-consultation#book-consultation"
              className={isAda ? "btn-primary" : "btn-primary is-on-dark"}
              prefetch={false}
              data-ppid="code:public-sites/sites/horizon-example/src/components/Hero.jsx#Hero.link.1">
              <Phone className="w-5 h-5" aria-hidden="true" />
              Book Free 15-Minute Consultation
            </Link>
            <Link
              href="/#services"
              className="btn-secondary"
              prefetch={false}
              data-ppid="code:public-sites/sites/horizon-example/src/components/Hero.jsx#Hero.link.2">
              Learn About Our Services
            </Link>
          </div>

          <div className="mt-12 text-center">
            <p
              className={metaLabelClasses}
              data-ppid="code:public-sites/sites/horizon-example/src/components/Hero.jsx#Hero.body.2">Licensed Professional Counselor</p>
            <div className={metaDetailClasses}>
              <span
                data-ppid="code:public-sites/sites/horizon-example/src/components/Hero.jsx#Hero.inline.7">M.Ed., LPC</span>
              <span
                data-ppid="code:public-sites/sites/horizon-example/src/components/Hero.jsx#Hero.inline.8">•</span>
              <span
                data-ppid="code:public-sites/sites/horizon-example/src/components/Hero.jsx#Hero.inline.9">10+ Years Experience</span>
              <span
                data-ppid="code:public-sites/sites/horizon-example/src/components/Hero.jsx#Hero.inline.10">•</span>
              <span
                data-ppid="code:public-sites/sites/horizon-example/src/components/Hero.jsx#Hero.inline.11">EMDR Trained</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
