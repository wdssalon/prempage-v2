import { ExternalLink, Lock, Mail, MapPin, Phone } from "lucide-react";

export default function Footer({ variant = "default" }) {
  const headingId = "global--footer__heading";
  const footerClasses = variant === "ada" ? "bg-surface text-copy py-16" : "bg-base text-copy py-16";

  return (
    <footer
      data-section-id="global--footer"
      className={footerClasses}
      role="contentinfo"
      aria-labelledby={headingId}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div>
                  <h3 id={headingId} className="text-brand font-serif font-semibold text-xl">
                    Progressive Way Therapy
                  </h3>
                  <p className="text-copy/70 text-sm">Inclusive Mental Health Care</p>
                </div>
              </div>

              <p className="text-copy/85 leading-relaxed mb-6 max-w-md">
                Creating safe, progressive spaces for healing in Texas. LGBTQIA+ affirming, trauma-informed therapy that
                honors your authentic self.
              </p>

              <div className="space-y-2 text-sm text-copy/80">
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
              <h4 className="text-brand font-serif font-semibold mb-4 text-lg">Quick Links</h4>
              <ul className="space-y-2 text-sm text-copy/80">
                <li><a href="/about" className="transition-colors hover:text-brand">About Blanca</a></li>
                <li><a href="/#services" className="transition-colors hover:text-brand">Our Services</a></li>
                <li><a href="/#emdr" className="transition-colors hover:text-brand">EMDR Therapy</a></li>
                <li><a href="/#ketamine" className="transition-colors hover:text-brand">Ketamine Treatment</a></li>
                <li><a href="/#rates" className="hover:text-brand-soft transition-colors">Rates &amp; Insurance</a></li>
                <li><a href="/#faq" className="hover:text-brand-soft transition-colors">FAQs</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-brand font-serif font-semibold mb-4 text-lg">Resources</h4>
              <ul className="space-y-2 text-sm text-copy/80">
                <li><a href="/#blog" className="hover:text-brand-soft transition-colors">Mental Health Blog</a></li>
                <li><a href="/#crisis" className="hover:text-brand-soft transition-colors">Crisis Resources</a></li>
                <li><a href="/#support" className="hover:text-brand-soft transition-colors">Support Groups</a></li>
                <li><a href="/#privacy" className="hover:text-brand-soft transition-colors">Privacy Practices</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border/30 pt-8 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div id="portal" className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
                <a href="#portal" className="btn-secondary is-on-light is-fluid">
                  <Lock className="w-4 h-4" />
                  Client Portal
                  <ExternalLink data-icon-trail="true" className="w-4 h-4" />
                </a>

                <a href="#contact" className="btn-secondary is-on-light is-fluid">
                  <Phone className="w-4 h-4" />
                  Get Started
                </a>
              </div>

              <div className="text-sm text-copy/85">
                <p>Licensed in Texas | License #: LPC-12345</p>
              </div>
            </div>
          </div>

          <div className="border-t border-border/30 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-sm text-copy/80">
              <div>
                <p>&copy; 2024 Progressive Way Therapy. All rights reserved.</p>
              </div>

              <div className="flex space-x-6">
                <a href="#terms" className="hover:text-brand-soft transition-colors">Terms of Service</a>
                <a href="#privacy" className="hover:text-brand-soft transition-colors">Privacy Policy</a>
                <a href="#accessibility" className="hover:text-brand-soft transition-colors">Accessibility</a>
              </div>
            </div>

            <div className="sr-only">
              <p id="terms">Terms of Service: Detailed engagement policies available upon request.</p>
              <p id="privacy">Privacy Policy: We protect your personal information and only use it to deliver requested services.</p>
              <p id="accessibility">Accessibility Statement: We strive to make PremPage experiences usable for everyone and welcome feedback.</p>
            </div>

            <div className="mt-6 p-4 bg-brand-soft/20 rounded-lg border">
              <p className="text-sm text-center text-copy">
                <strong>Crisis Support:</strong> If you're experiencing a mental health emergency, call 988 (Suicide &amp;
                Crisis Lifeline) or go to your nearest emergency room.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
