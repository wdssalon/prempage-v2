"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, Phone } from "lucide-react";
import MobileNavigation from "@/components/MobileNavigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { getAssetUrl } from "@/lib/site-assets";

const logoSrc = getAssetUrl("logo.webp");

const SERVICES_MENU_ID = "navigation-services-menu";
const STARTED_MENU_ID = "navigation-get-started-menu";

export default function Navigation({ variant = "default" }) {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const isMobile = useIsMobile();
  const dropdownRefs = useRef({
    services: null,
    started: null,
  });

  const focusFirstMenuItem = useCallback((menuKey) => {
    const menuId = menuKey === "services" ? SERVICES_MENU_ID : STARTED_MENU_ID;
    const menuElement = typeof document !== "undefined" ? document.getElementById(menuId) : null;
    const focusable = menuElement?.querySelector('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
    focusable?.focus();
  }, []);

  const toggleDropdown = useCallback(
    (menu) => {
      setActiveDropdown((prev) => {
        const nextValue = prev === menu ? null : menu;
        if (nextValue) {
          requestAnimationFrame(() => focusFirstMenuItem(menu));
        }
        return nextValue;
      });
    },
    [focusFirstMenuItem],
  );

  const closeDropdowns = useCallback(() => {
    setActiveDropdown(null);
  }, []);

  const handleDropdownBlur = useCallback((event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      closeDropdowns();
    }
  }, [closeDropdowns]);

  const handleDropdownKeyDown = useCallback(
    (menuKey, event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeDropdowns();
        event.currentTarget.blur();
        return;
      }

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleDropdown(menuKey);
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        if (activeDropdown !== menuKey) {
          toggleDropdown(menuKey);
        } else {
          focusFirstMenuItem(menuKey);
        }
      }
    },
    [activeDropdown, closeDropdowns, focusFirstMenuItem, toggleDropdown],
  );

  useEffect(() => {
    const handleDocumentClick = (event) => {
      const target = event.target;
      if (
        dropdownRefs.current.services?.contains(target) ||
        dropdownRefs.current.started?.contains(target)
      ) {
        return;
      }
      closeDropdowns();
    };

    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
  }, [closeDropdowns]);

  if (isMobile) {
    return <MobileNavigation sectionId="global--navigation-mobile" variant={variant} />;
  }

  const headerClasses =
    variant === "ada"
      ? "fixed top-0 left-0 right-0 z-50 bg-base border-b border-border shadow-sm"
      : "fixed top-0 left-0 right-0 z-50 nav-warm border-b border-border/50";

  return (
    <header
      data-section-id="global--navigation"
      className={headerClasses}
      role="banner"
    >
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

          <nav className="hidden xl:flex items-center space-x-6" aria-label="Primary navigation">
            <ul className="flex items-center space-x-6">
              <li>
                <Link href="/" className="text-copy hover:text-brand-soft transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-copy hover:text-brand-soft transition-colors">
                  About
                </Link>
              </li>

              <li
                className="relative"
                onBlur={handleDropdownBlur}
                ref={(node) => {
                  dropdownRefs.current.services = node;
                }}
              >
                <button
                  type="button"
                  onClick={() => toggleDropdown("services")}
                  onKeyDown={(event) => handleDropdownKeyDown("services", event)}
                  className="flex items-center text-copy hover:text-brand-soft transition-colors"
                  aria-haspopup="true"
                  aria-expanded={activeDropdown === "services"}
                  aria-controls={SERVICES_MENU_ID}
                >
                  Services <ChevronDown className="ml-1 w-4 h-4" />
                </button>
                {activeDropdown === "services" && (
                  <div
                    id={SERVICES_MENU_ID}
                    className="absolute top-full left-0 mt-2 w-80 bg-surface rounded-md shadow-warm border border-border p-4"
                    role="menu"
                    aria-label="Services"
                  >
                    <div className="grid gap-4">
                      <div>
                        <h3 className="font-serif font-semibold text-brand mb-2">Individual Therapy</h3>
                        <ul className="space-y-1 text-sm">
                          <li>
                            <Link
                              href="/services/individual-therapy"
                              className="text-muted hover:text-brand-soft transition-colors"
                              role="menuitem"
                            >
                              Individual Counseling
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/services/individual-therapy/anxiety"
                              className="text-muted hover:text-brand-soft transition-colors"
                              role="menuitem"
                            >
                              Counseling for Anxiety
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/services/individual-therapy/depression"
                              className="text-muted hover:text-brand-soft transition-colors"
                              role="menuitem"
                            >
                              Therapy for Depression
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/services/individual-therapy/trauma"
                              className="text-muted hover:text-brand-soft transition-colors"
                              role="menuitem"
                            >
                              Counseling for Trauma
                            </Link>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-serif font-semibold text-brand mb-2">Specialized Support</h3>
                        <ul className="space-y-1 text-sm">
                          <li>
                            <Link
                              href="/services/specialized-support/lgbtq"
                              className="text-muted hover:text-brand-soft transition-colors"
                              role="menuitem"
                            >
                              LGBTQIA+
                            </Link>
                          </li>
                          <li>
                            <a
                              href="/#services"
                              className="text-muted hover:text-brand-soft transition-colors"
                              role="menuitem"
                            >
                              Women's Issues
                            </a>
                          </li>
                          <li>
                            <a
                              href="/#services"
                              className="text-muted hover:text-brand-soft transition-colors"
                              role="menuitem"
                            >
                              Pregnancy Complications / Miscarriage
                            </a>
                          </li>
                          <li>
                            <a
                              href="/#services"
                              className="text-muted hover:text-brand-soft transition-colors"
                              role="menuitem"
                            >
                              Abortion
                            </a>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-serif font-semibold text-brand mb-2">Trauma & Recovery</h3>
                        <ul className="space-y-1 text-sm">
                          <li>
                            <a
                              href="/#services"
                              className="text-muted hover:text-brand-soft transition-colors"
                              role="menuitem"
                            >
                              Sexual Assault / Sexual Abuse
                            </a>
                          </li>
                          <li>
                            <a href="/#services" className="text-muted hover:text-brand-soft transition-colors">
                              Domestic Violence & Toxic Relationships
                            </a>
                          </li>
                          <li>
                            <a href="/#services" className="text-muted hover:text-brand-soft transition-colors">
                              Grief & Bereavement Counseling
                            </a>
                          </li>
                          <li>
                            <a href="/#services" className="text-muted hover:text-brand-soft transition-colors">
                              Immigrant / Refugee Counseling
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </li>

              <li
                className="relative"
                onBlur={handleDropdownBlur}
                ref={(node) => {
                  dropdownRefs.current.started = node;
                }}
              >
                <button
                  type="button"
                  onClick={() => toggleDropdown("started")}
                  onKeyDown={(event) => handleDropdownKeyDown("started", event)}
                  className="flex items-center text-copy hover:text-brand-soft transition-colors"
                  aria-haspopup="true"
                  aria-expanded={activeDropdown === "started"}
                  aria-controls={STARTED_MENU_ID}
                >
                  Get Started <ChevronDown className="ml-1 w-4 h-4" />
                </button>
                {activeDropdown === "started" && (
                  <div
                    id={STARTED_MENU_ID}
                    className="absolute top-full left-0 mt-2 w-56 bg-surface rounded-md shadow-warm border border-border p-4"
                    role="menu"
                    aria-label="Get started"
                  >
                    <ul className="space-y-2">
                      <li>
                        <a
                          href="/#appointment"
                          className="block text-copy hover:text-brand-soft transition-colors"
                          role="menuitem"
                        >
                          Appointment Request
                        </a>
                      </li>
                      <li>
                        <a
                          href="/#privacy"
                          className="block text-copy hover:text-brand-soft transition-colors"
                          role="menuitem"
                        >
                          Privacy Practices
                        </a>
                      </li>
                      <li>
                        <a
                          href="/#faq"
                          className="block text-copy hover:text-brand-soft transition-colors"
                          role="menuitem"
                        >
                          FAQs
                        </a>
                      </li>
                      <li>
                        <a
                          href="/#rates"
                          className="block text-copy hover:text-brand-soft transition-colors"
                          role="menuitem"
                        >
                          Rates & Insurance
                        </a>
                      </li>
                    </ul>
                  </div>
                )}
              </li>

              <li>
                <a href="/#portal" className="text-copy hover:text-brand-soft transition-colors">
                  Client Portal
                </a>
              </li>
              <li>
                <a href="/#contact" className="text-copy hover:text-brand-soft transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </nav>

          <div className="hidden xl:flex items-center">
            <Link href="/#book-consultation" className="btn-primary is-compact" prefetch={false}>
              <Phone className="w-4 h-4" />
              Book Free Consultation
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
