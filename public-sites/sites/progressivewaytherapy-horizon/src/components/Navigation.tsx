"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileNavigation from "@/components/MobileNavigation";
import { getAssetUrl } from "@/lib/site-assets";

const logoSrc = getAssetUrl("logo.webp");

const Navigation = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const toggleDropdown = (menu: string) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  if (isMobile) {
    return <MobileNavigation />;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 nav-warm border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-40">
        <div className="flex items-center">
          <Link href="/" aria-label="Go to home" className="flex items-center focus:outline-none">
            <img
              src={logoSrc}
              alt="Progressive Way Therapy Logo"
              className="w-48 h-36 sm:w-56 sm:h-[10.5rem] md:w-64 md:h-48 object-contain"
            />
          </Link>
        </div>

          <nav className="hidden xl:flex items-center space-x-6" aria-label="Primary">
            <ul className="flex items-center space-x-6">
              <li>
                <Link href="/" className="text-earth-brown hover:text-soft-purple transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-earth-brown hover:text-soft-purple transition-colors">
                  About
                </Link>
              </li>

              <li className="relative">
                <button
                  onClick={() => toggleDropdown("services")}
                  className="flex items-center text-earth-brown hover:text-soft-purple transition-colors"
                >
                  Services <ChevronDown className="ml-1 w-4 h-4" />
                </button>
                {activeDropdown === "services" && (
                  <div className="absolute top-full left-0 mt-2 w-80 bg-card rounded-md shadow-warm border border-border p-4">
                    <div className="grid gap-4">
                      <div>
                        <h3 className="font-serif font-semibold text-sage-green mb-2">Individual Therapy</h3>
                        <ul className="space-y-1 text-sm">
                          <li>
                            <Link
                              href="/services/individual-therapy/general"
                              className="text-muted-foreground hover:text-soft-purple transition-colors"
                            >
                              General Individual Therapy
                            </Link>
                          </li>
                          <li>
                            <a href="/#services" className="text-muted-foreground hover:text-soft-purple transition-colors">
                              Counseling for Anxiety
                            </a>
                          </li>
                          <li>
                            <a href="/#services" className="text-muted-foreground hover:text-soft-purple transition-colors">
                              Therapy for Depression
                            </a>
                          </li>
                          <li>
                            <a href="/#services" className="text-muted-foreground hover:text-soft-purple transition-colors">
                              Counseling for Trauma
                            </a>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-serif font-semibold text-sage-green mb-2">Specialized Support</h3>
                        <ul className="space-y-1 text-sm">
                          <li>
                            <a href="/#services" className="text-muted-foreground hover:text-soft-purple transition-colors">
                              LGBTQIA+ Individual Therapy
                            </a>
                          </li>
                          <li>
                            <a href="/#services" className="text-muted-foreground hover:text-soft-purple transition-colors">
                              Women's Issues
                            </a>
                          </li>
                          <li>
                            <a href="/#services" className="text-muted-foreground hover:text-soft-purple transition-colors">
                              Pregnancy Complications / Miscarriage
                            </a>
                          </li>
                          <li>
                            <a href="/#services" className="text-muted-foreground hover:text-soft-purple transition-colors">
                              Abortion
                            </a>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-serif font-semibold text-sage-green mb-2">Trauma & Recovery</h3>
                        <ul className="space-y-1 text-sm">
                          <li>
                            <a href="/#services" className="text-muted-foreground hover:text-soft-purple transition-colors">
                              Sexual Assault / Sexual Abuse
                            </a>
                          </li>
                          <li>
                            <a href="/#services" className="text-muted-foreground hover:text-soft-purple transition-colors">
                              Domestic Violence & Toxic Relationships
                            </a>
                          </li>
                          <li>
                            <a href="/#services" className="text-muted-foreground hover:text-soft-purple transition-colors">
                              Grief & Bereavement Counseling
                            </a>
                          </li>
                          <li>
                            <a href="/#services" className="text-muted-foreground hover:text-soft-purple transition-colors">
                              Immigrant / Refugee Counseling
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </li>

              <li className="relative">
                <button
                  onClick={() => toggleDropdown("started")}
                  className="flex items-center text-earth-brown hover:text-soft-purple transition-colors"
                >
                  Get Started <ChevronDown className="ml-1 w-4 h-4" />
                </button>
                {activeDropdown === "started" && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-card rounded-md shadow-warm border border-border p-4">
                    <ul className="space-y-2">
                      <li>
                        <a href="/#appointment" className="block text-earth-brown hover:text-soft-purple transition-colors">
                          Appointment Request
                        </a>
                      </li>
                      <li>
                        <a href="/#privacy" className="block text-earth-brown hover:text-soft-purple transition-colors">
                          Privacy Practices
                        </a>
                      </li>
                      <li>
                        <a href="/#faq" className="block text-earth-brown hover:text-soft-purple transition-colors">
                          FAQs
                        </a>
                      </li>
                      <li>
                        <a href="/#rates" className="block text-earth-brown hover:text-soft-purple transition-colors">
                          Rates & Insurance
                        </a>
                      </li>
                    </ul>
                  </div>
                )}
              </li>

              <li>
                <a href="/#portal" className="text-earth-brown hover:text-soft-purple transition-colors">
                  Client Portal
                </a>
              </li>
              <li>
                <a href="/#contact" className="text-earth-brown hover:text-soft-purple transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </nav>

          <div className="hidden xl:flex items-center">
            <Button variant="unstyled" className="btn-consultation is-compact">
              <Phone />
              Book Free Consultation
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
