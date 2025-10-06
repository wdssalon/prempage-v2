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
                  <h3
                    id={headingId}
                    className="text-brand font-serif font-semibold text-xl"
                    data-ppid="code:public-sites/sites/horizon-example/src/components/Footer.jsx#Footer.heading.1">
                    Progressive Way Therapy
                  </h3>
                  <p
                    className="text-copy/70 text-sm"
                    data-ppid="code:public-sites/sites/horizon-example/src/components/Footer.jsx#Footer.body.1">Inclusive Mental Health Care</p>
                </div>
              </div>

              <p
                className="text-copy/85 leading-relaxed mb-6 max-w-md"
                data-ppid="code:public-sites/sites/horizon-example/src/components/Footer.jsx#Footer.body.2">
                Creating safe, progressive spaces for healing in Texas. LGBTQIA+ affirming, trauma-informed therapy that
                honors your authentic self.
              </p>

              <div className="space-y-2 text-sm text-copy/80">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span
                    data-ppid="code:public-sites/sites/horizon-example/src/components/Footer.jsx#Footer.inline.1">Telehealth Services Across Texas</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span
                    data-ppid="code:public-sites/sites/horizon-example/src/components/Footer.jsx#Footer.inline.2">(555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span
                    data-ppid="code:public-sites/sites/horizon-example/src/components/Footer.jsx#Footer.inline.3">hello@progressivewaytherapy.com</span>
                </div>
              </div>
            </div>

            <div>
              <h4
                className="text-brand font-serif font-semibold mb-4 text-lg"
                data-ppid="code:public-sites/sites/horizon-example/src/components/Footer.jsx#Footer.heading.2">Quick Links</h4>
              <ul
                className="space-y-2 text-sm text-copy/80"
                data-ppid="code:public-sites/sites/horizon-example/src/components/Footer.jsx#Footer.list.1">
                <li
                  data-ppid="code:public-sites/sites/horizon-example/src/components/Footer.jsx#Footer.listItem.1"><a
                  href="/about"
                  className="transition-colors hover:text-brand"
                  data-ppid="code:public-sites/sites/horizon-example/src/components/Footer.jsx#Footer.link.1">About Blanca</a></li>
                <li
                  data-ppid="code:public-sites/sites/horizon-example/src/components/Footer.jsx#Footer.listItem.2"><a
                  href="/#services"
                  className="transition-colors hover:text-brand"
                  data-ppid="code:public-sites/sites/horizon-example/src/components/Footer.jsx#Footer.link.2">Our Services</a></li>
                <li
                  data-ppid="code:public-sites/sites/horizon-example/src/components/Footer.jsx#Footer.listItem.3"><a
                  href="/#emdr"
                  className="transition-colors hover:text-brand"
                  data-ppid="code:public-sites/sites/horizon-example/src/components/Footer.jsx#Footer.link.3">EMDR Therapy</a></li>
                <li
                  data-ppid="code:public-sites/sites/horizon-example/src/components/Footer.jsx#Footer.listItem.4"><a
                  href="/#ketamine"
                  className="transition-colors hover:text-brand"
                  data-ppid="code:public-sites/sites/horizon-example/src/components/Footer.jsx#Footer.link.4">Ketamine Treatment</a></li>
                <li
                  data-ppid="code:public-sites/sites/horizon-example/src/components/Footer.jsx#Footer.listItem.5"><a
                  href="/#rates"
                  className="hover:text-brand-soft transition-colors"
                  data-ppid="code:public-sites/sites/horizon-example/src/components/Footer.jsx#Footer.link.5">Rates &amp; Insurance</a></li>
                <li
                  data-ppid="code:public-sites/sites/horizon-example/src/components/Footer.jsx#Footer.listItem.6"><a
                  href="/#faq"
                  className="hover:text-brand-soft transition-colors"
                  data-ppid="code:public-sites/sites/horizon-example/src/components/Footer.jsx#Footer.link.6">FAQs</a></li>
              </ul>
            </div>

            <div>
              <h4
                className="text-brand font-serif font-semibold mb-4 text-lg"
                data-ppid="code:public-sites/sites/horizon-example/src/components/Footer.jsx#Footer.heading.3">Resources</h4>
              <ul
                className="space-y-2 text-sm text-copy/80"
                data-ppid="code:public-sites/sites/horizon-example/src/components/Footer.jsx#Footer.list.2">
                <li
                  data-ppid="code:public-sites/sites/horizon-example/src/components/Footer.jsx#Footer.listItem.7"><a
                  href="/#blog"
                  className="hover:text-brand-soft transition-colors"
                  data-ppid="code:public-sites/sites/horizon-example/src/components/Footer.jsx#Footer.link.7">Mental Health Blog</a></li>
                <li
                  data-ppid="code:public-sites/sites/horizon-example/src/components/Footer.jsx#Footer.listItem.8"><a
                  href="/#crisis"
                  className="hover:text-brand-soft transition-colors"
                  data-ppid="code:public-sites/sites/horizon-example/src/components/Footer.jsx#Footer.link.8">Crisis Resources</a></li>
                <li
                  data-ppid="code:public-sites/sites/horizon-example/src/components/Footer.jsx#Footer.listItem.9"><a
                  href="/#support"
                  className="hover:text-brand-soft transition-colors"
                  data-ppid="code:public-sites/sites/horizon-example/src/components/Footer.jsx#Footer.link.9">Support Groups</a></li>
                <li
                  data-ppid="code:public-sites/sites/horizon-example/src/components/Footer.jsx#Footer.listItem.10"><a
                  href="/#privacy"
                  className="hover:text-brand-soft transition-colors"
                  data-ppid="code:public-sites/sites/horizon-example/src/components/Footer.jsx#Footer.link.10">Privacy Practices</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border/30 pt-8 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div id="portal" className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
                <a
                  href="#portal"
                  className="btn-secondary is-on-light is-fluid"
                  data-ppid="code:public-sites/sites/horizon-example/src/components/Footer.jsx#Footer.link.11">
                  <Lock className="w-4 h-4" />
                  Client Portal
                  <ExternalLink data-icon-trail="true" className="w-4 h-4" />
                </a>

                <a
                  href="#contact"
                  className="btn-secondary is-on-light is-fluid"
                  data-ppid="code:public-sites/sites/horizon-example/src/components/Footer.jsx#Footer.link.12">
                  <Phone className="w-4 h-4" />
                  Get Started
                </a>
              </div>

              <div className="text-sm text-copy/85">
                <p
                  data-ppid="code:public-sites/sites/horizon-example/src/components/Footer.jsx#Footer.body.3">Licensed in Texas | License #: LPC-12345</p>
              </div>
            </div>
          </div>

          <div className="border-t border-border/30 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-sm text-copy/80">
              <div>
                <p
                  data-ppid="code:public-sites/sites/horizon-example/src/components/Footer.jsx#Footer.body.4">&copy; 2024 Progressive Way Therapy. All rights reserved.</p>
              </div>

              <div className="flex space-x-6">
                <a
                  href="#terms"
                  className="hover:text-brand-soft transition-colors"
                  data-ppid="code:public-sites/sites/horizon-example/src/components/Footer.jsx#Footer.link.13">Terms of Service</a>
                <a
                  href="#privacy"
                  className="hover:text-brand-soft transition-colors"
                  data-ppid="code:public-sites/sites/horizon-example/src/components/Footer.jsx#Footer.link.14">Privacy Policy</a>
                <a
                  href="#accessibility"
                  className="hover:text-brand-soft transition-colors"
                  data-ppid="code:public-sites/sites/horizon-example/src/components/Footer.jsx#Footer.link.15">Accessibility</a>
              </div>
            </div>

            <div className="sr-only">
              <p
                id="terms"
                data-ppid="code:public-sites/sites/horizon-example/src/components/Footer.jsx#Footer.body.5">Terms of Service: Detailed engagement policies available upon request.</p>
              <p
                id="privacy"
                data-ppid="code:public-sites/sites/horizon-example/src/components/Footer.jsx#Footer.body.6">Privacy Policy: We protect your personal information and only use it to deliver requested services.</p>
              <p
                id="accessibility"
                data-ppid="code:public-sites/sites/horizon-example/src/components/Footer.jsx#Footer.body.7">Accessibility Statement: We strive to make PremPage experiences usable for everyone and welcome feedback.</p>
            </div>

            <div className="mt-6 p-4 bg-brand-soft/20 rounded-lg border">
              <p
                className="text-sm text-center text-copy"
                data-ppid="code:public-sites/sites/horizon-example/src/components/Footer.jsx#Footer.body.8">
                <strong
                  data-ppid="code:public-sites/sites/horizon-example/src/components/Footer.jsx#Footer.inline.4">Crisis Support:</strong> If you're experiencing a mental health emergency, call 988 (Suicide &amp;
                Crisis Lifeline) or go to your nearest emergency room.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
