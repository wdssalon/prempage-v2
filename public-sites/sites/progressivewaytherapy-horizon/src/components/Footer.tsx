"use client";

import { Button } from "@/components/ui/button";
import { ExternalLink, Globe, Lock, Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-cream via-warm-tan/70 to-earth-brown/85 text-earth-brown py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div>
                  <h3 className="text-xl font-serif font-semibold text-soft-purple">Progressive Way Therapy</h3>
                  <p className="text-earth-brown/70 text-sm">Inclusive Mental Health Care</p>
                </div>
              </div>

              <p className="text-earth-brown/85 leading-relaxed mb-6 max-w-md">
                Creating safe, progressive spaces for healing in Texas. LGBTQIA+ affirming, trauma-informed therapy that
                honors your authentic self.
              </p>

              <div className="space-y-2 text-sm text-earth-brown/80">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Telehealth Services Across Texas</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>(555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>hello@progressivewaytherapy.com</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-serif font-semibold mb-4 text-soft-purple">Quick Links</h4>
              <ul className="space-y-2 text-sm text-earth-brown/80">
                <li><a href="/about" className="hover:text-soft-purple transition-colors">About Blanca</a></li>
                <li><a href="/#services" className="hover:text-soft-purple transition-colors">Our Services</a></li>
                <li><a href="/#emdr" className="hover:text-soft-purple transition-colors">EMDR Therapy</a></li>
                <li><a href="/#ketamine" className="hover:text-soft-purple transition-colors">Ketamine Treatment</a></li>
                <li><a href="/#rates" className="hover:text-soft-purple transition-colors">Rates &amp; Insurance</a></li>
                <li><a href="/#faq" className="hover:text-soft-purple transition-colors">FAQs</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-serif font-semibold mb-4 text-soft-purple">Resources</h4>
              <ul className="space-y-2 text-sm text-earth-brown/80">
                <li><a href="#blog" className="hover:text-soft-purple transition-colors">Mental Health Blog</a></li>
                <li><a href="#crisis" className="hover:text-soft-purple transition-colors">Crisis Resources</a></li>
                <li><a href="#support" className="hover:text-soft-purple transition-colors">Support Groups</a></li>
                <li><a href="#privacy" className="hover:text-soft-purple transition-colors">Privacy Practices</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-cream/30 pt-8 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <Button
                  variant="outline"
                  className="text-cream border-cream/40 hover:bg-cream/10 bg-transparent flex items-center"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Client Portal
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>

                <Button
                  variant="outline"
                  className="text-cream border-cream/40 hover:bg-cream/10 bg-transparent flex items-center"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Español
                </Button>
              </div>

              <div className="text-sm text-cream/85">
                <p>Licensed in Texas | License #: LPC-12345</p>
              </div>
            </div>
          </div>

          <div className="border-t border-cream/30 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-sm text-cream/80">
              <div>
                <p>&copy; 2024 Progressive Way Therapy. All rights reserved.</p>
              </div>

              <div className="flex space-x-6">
                <a href="#terms" className="hover:text-soft-purple transition-colors">Terms of Service</a>
                <a href="#privacy" className="hover:text-soft-purple transition-colors">Privacy Policy</a>
                <a href="#accessibility" className="hover:text-soft-purple transition-colors">Accessibility</a>
              </div>
            </div>

            <div className="mt-6 p-4 bg-soft-purple/20 rounded-lg border">
              <p className="text-sm text-center text-cream">
                <strong>Crisis Support:</strong> If you're experiencing a mental health emergency, call 988 (Suicide &amp;
                Crisis Lifeline) or go to your nearest emergency room.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
