"use client";

import { Button } from "@/components/ui/button";
import { Heart, MapPin, Phone } from "lucide-react";

import { getAssetUrl } from "@/lib/site-assets";

const heroImage = getAssetUrl("hero-therapy.jpg");

type HeroProps = {
  sectionId: string;
};

const Hero = ({ sectionId }: HeroProps) => {
  return (
    <section
      data-section-id={sectionId}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero pt-40"
    >
      <div className="absolute inset-0">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover">
          <source src="https://wds-prod-public.s3.us-west-1.amazonaws.com/videos/ocean.mp4" type="video/mp4" />
          <img src={heroImage} alt="Peaceful ocean scene as video fallback" className="w-full h-full object-cover" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/70" />
      </div>

      <div className="relative z-10 w-full lg:max-w-4xl mx-auto px-4 md:px-6 text-center">
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center px-4 py-2 bg-cream/20 backdrop-blur-sm rounded-full mb-6 border border-cream/30">
            <MapPin className="w-4 h-4 mr-2 text-cream" />
            <span className="text-cream font-medium">Telehealth Services Across Texas</span>
          </div>

          <h1 className="heading is-display is-on-dark mb-6 drop-shadow-lg">
            A Safe Space for Your
            <span className="block text-warm-tan">Authentic Self</span>
          </h1>

          <p className="text is-lead is-on-dark text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Progressive, inclusive therapy for LGBTQIA+, BIPOC, and marginalized communities. You deserve compassionate
            care that honors your whole story.
          </p>

          <div className="flex flex-wrap justify-center gap-6 mb-10 text-cream/80">
            <div className="flex items-center">
              <Heart className="w-5 h-5 mr-2 text-warm-tan" />
              <span>Trauma-Informed Care</span>
            </div>
            <div className="flex items-center">
              <Heart className="w-5 h-5 mr-2 text-warm-tan" />
              <span>LGBTQIA+ Affirming</span>
            </div>
            <div className="flex items-center">
              <Heart className="w-5 h-5 mr-2 text-warm-tan" />
              <span>Evidence-Based Treatment</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="unstyled" className="btn-primary is-on-dark">
              <Phone />
              Book Free 15-Minute Consultation
            </Button>
            <Button variant="unstyled" className="btn-secondary">
              Learn About Our Services
            </Button>
          </div>

          <div className="mt-12 text-center">
            <p className="text-cream/70 text-sm mb-2">Licensed Professional Counselor</p>
            <div className="flex justify-center items-center space-x-4 text-cream/60 text-xs">
              <span>M.Ed., LPC</span>
              <span>•</span>
              <span>10+ Years Experience</span>
              <span>•</span>
              <span>EMDR Trained</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
