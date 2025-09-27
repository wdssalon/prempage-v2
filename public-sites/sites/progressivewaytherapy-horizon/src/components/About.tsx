"use client";

import { CheckCircle, Heart, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

import { getAssetUrl } from "@/lib/site-assets";

const therapistPortrait = getAssetUrl("blanca-2.webp");

type AboutProps = {
  sectionId: string;
};

const About = ({ sectionId }: AboutProps) => {
  return (
    <section id="about" data-section-id={sectionId} className="py-20 safe-space">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="heading is-section mb-6">Meet Blanca Kleinfall, M.Ed., LPC</h2>
            <p className="text is-lead max-w-2xl mx-auto">
              An openly progressive therapist creating safe spaces for authentic healing in Texas
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in-left">
              <div className="relative">
                <div className="organic-border overflow-hidden shadow-warm">
                  <img
                    src={therapistPortrait}
                    alt="Blanca Kleinfall, Licensed Professional Counselor"
                    className="w-full h-[500px] object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 bg-sage-green/10 rounded-full">
                  <Shield className="w-4 h-4 mr-2 text-sage-green" />
                  <span className="text-sage-green font-medium">Licensed Professional Counselor</span>
                </div>

                <h3 className="heading is-subsection italic text-soft-purple mb-4">
                  "Keeping it real with my clients in this conservative AF state."
                </h3>

                <p className="text text-muted-foreground leading-relaxed">
                  Hi! I'm Blanca Kleinfall, an openly progressive-minded therapist who believes in creating authentic
                  spaces for healing. I offer a safe environment for LGBTQ+IA, minorities/BIPOC, women, and non-faith-based
                  adults who need someone who truly gets it.
                </p>

                <p className="text text-muted-foreground leading-relaxed">
                  With 10 years of experience, I believe in keeping it real with my clients. You just worry about
                  bringing your authentic self to our sessions, and we'll work on the rest together. I specialize in
                  evidence-based treatments including EMDR, trauma-informed care, and psychoeducation.
                </p>

                <div className="grid sm:grid-cols-2 gap-4 pt-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-sage-green mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-soft-purple">10+ Years Experience</p>
                      <p className="text text-sm text-muted-foreground">Trauma & relationship therapy</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-sage-green mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-soft-purple">EMDR Trained</p>
                      <p className="text text-sm text-muted-foreground">Trauma processing specialist</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-sage-green mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-soft-purple">LGBTQIA+ Affirming</p>
                      <p className="text text-sm text-muted-foreground">Identity-supportive care</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-sage-green mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-soft-purple">Progressive Values</p>
                      <p className="text text-sm text-muted-foreground">Social justice focused</p>
                    </div>
                  </div>
                </div>

                <div className="bg-warm-tan/20 rounded-md p-6 border border-warm-tan/30">
                  <div className="flex items-start space-x-3">
                    <Users className="w-6 h-6 text-sage-green mt-1 shrink-0" />
                    <div>
                      <p className="font-medium text-soft-purple mb-2">My Commitment to You</p>
                      <p className="text text-sm text-muted-foreground leading-relaxed">
                        Whether you're dealing with trauma, anxiety, relationship issues, or navigating your identity in
                        an unwelcoming environment, I'm here to provide the compassionate, non-judgmental support you
                        deserve. Your story matters, and you deserve to be heard.
                      </p>
                    </div>
                  </div>
                </div>

                <Button variant="unstyled" className="btn-primary">
                  Schedule Your Free Consultation
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
