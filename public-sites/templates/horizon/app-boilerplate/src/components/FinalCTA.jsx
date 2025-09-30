"use client";

import { Calendar, MapPin, MessageSquare, Phone } from "lucide-react";
import { getAssetUrl } from "@/lib/site-assets";

const communityImage = getAssetUrl("community-support.jpg");

export default function FinalCTA({ sectionId }) {
  return (
    <section data-section-id={sectionId} className="py-20 bg-gradient-hero relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={communityImage}
          alt="Diverse community supporting each other"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-50" />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-fade-in-up">
            <h2 className="heading is-section is-on-dark text-inverse md:text-5xl mb-6">
              Ready to Start Your
              <span className="block text-accent">Healing Journey?</span>
            </h2>

            <p className="text is-lead is-on-dark text-xl mb-8 max-w-2xl mx-auto">
              Take the first step toward authentic healing. Your free consultation is completely confidential and
              pressure-free.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="bg-surface/20 backdrop-blur-sm rounded-md p-6 border border-border/20">
              <Phone className="w-8 h-8 text-accent mx-auto mb-4" />
              <h3 className="font-serif text-lg text-inverse mb-2">Free Consultation</h3>
              <p className="text-inverse/80 text-sm mb-4">15-minute phone call to see if we're a good fit</p>
              <button type="button" className="btn-primary is-on-dark is-fluid">
                Book Now
              </button>
            </div>

            <div className="bg-surface/20 backdrop-blur-sm rounded-md p-6 border border-border/20">
              <MessageSquare className="w-8 h-8 text-accent mx-auto mb-4" />
              <h3 className="font-serif text-lg text-inverse mb-2">Send a Message</h3>
              <p className="text-inverse/80 text-sm mb-4">Share your story and questions securely</p>
              <button type="button" className="btn-secondary is-fluid">
                Contact Form
              </button>
            </div>

            <div className="bg-surface/20 backdrop-blur-sm rounded-md p-6 border border-border/20">
              <Calendar className="w-8 h-8 text-accent mx-auto mb-4" />
              <h3 className="font-serif text-lg text-inverse mb-2">Direct Scheduling</h3>
              <p className="text-inverse/80 text-sm mb-4">Book your first session online</p>
              <button type="button" className="btn-secondary is-fluid">
                View Calendar
              </button>
            </div>
          </div>

          <div className="bg-surface/10 backdrop-blur-sm rounded-md p-8 border border-border/20 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <div className="flex items-center justify-center mb-4">
              <MapPin className="w-5 h-5 text-accent mr-2" />
              <span className="text-inverse font-medium">Serving All of Texas via Telehealth</span>
            </div>

            <div className="grid md:grid-cols-2 gap-8 text-inverse/80">
              <div>
                <h4 className="font-serif text-inverse mb-3">Available Hours</h4>
                <div className="space-y-1 text-sm">
                  <p>Monday - Thursday: 9am - 7pm</p>
                  <p>Friday: 9am - 5pm</p>
                  <p>Weekend: Limited availability</p>
                </div>
              </div>

              <div>
                <h4 className="font-serif text-inverse mb-3">What to Expect</h4>
                <div className="space-y-1 text-sm">
                  <p>✓ Completely confidential space</p>
                  <p>✓ No judgment, just compassion</p>
                  <p>✓ Evidence-based treatment</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
            <p className="text-inverse/70 text-sm">
              If you're experiencing a mental health emergency, please call 988 (Suicide & Crisis Lifeline) or go to your
              nearest emergency room.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
