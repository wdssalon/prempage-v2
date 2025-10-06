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
            <Link
              href="/"
              aria-label="Go to home"
              className="flex items-center focus:outline-none"
              data-ppid="code:public-sites/sites/horizon-example/src/components/Navigation.jsx#Navigation.link.1">
              <img
                src={logoSrc}
                alt="Progressive Way Therapy Logo"
                className="w-48 h-36 sm:w-56 sm:h-[10.5rem] md:w-64 md:h-48 object-contain"
                data-ppid="code:public-sites/sites/horizon-example/src/components/Navigation.jsx#Navigation.image.1" />
            </Link>
          </div>

          <nav className="hidden xl:flex items-center space-x-6" aria-label="Primary navigation">
            <ul
              className="flex items-center space-x-6"
              data-ppid="code:public-sites/sites/horizon-example/src/components/Navigation.jsx#Navigation.list.1">
              <li
                data-ppid="code:public-sites/sites/horizon-example/src/components/Navigation.jsx#Navigation.listItem.1">
                <Link
                  href="/about"
                  className="text-copy hover:text-brand-soft transition-colors"
                  data-ppid="code:public-sites/sites/horizon-example/src/components/Navigation.jsx#Navigation.link.2">
                  About
                </Link>
              </li>

              <li
                className="relative"
                onBlur={handleDropdownBlur}
                ref={(node) => {
                  dropdownRefs.current.services = node;
                }}
                data-ppid="code:public-sites/sites/horizon-example/src/components/Navigation.jsx#Navigation.listItem.2">
                <button
                  type="button"
                  onClick={() => toggleDropdown("services")}
                  onKeyDown={(event) => handleDropdownKeyDown("services", event)}
                  className="flex items-center text-copy hover:text-brand-soft transition-colors"
                  aria-haspopup="true"
                  aria-expanded={activeDropdown === "services"}
                  aria-controls={SERVICES_MENU_ID}
                  data-ppid="code:public-sites/sites/horizon-example/src/components/Navigation.jsx#Navigation.cta.1">
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
                        <h3
                          className="font-serif font-semibold text-brand mb-2"
                          data-ppid="code:public-sites/sites/horizon-example/src/components/Navigation.jsx#Navigation.heading.1">Individual Therapy</h3>
                        <ul
                          className="space-y-1 text-sm"
                          data-ppid="code:public-sites/sites/horizon-example/src/components/Navigation.jsx#Navigation.list.2">
                          <li
                            data-ppid="code:public-sites/sites/horizon-example/src/components/Navigation.jsx#Navigation.listItem.3">
                            <Link
                              href="/services/individual-therapy"
                              className="text-muted hover:text-brand-soft transition-colors"
                              role="menuitem"
                              data-ppid="code:public-sites/sites/horizon-example/src/components/Navigation.jsx#Navigation.link.3">
                              Individual Counseling
                            </Link>
                          </li>
                          <li
                            data-ppid="code:public-sites/sites/horizon-example/src/components/Navigation.jsx#Navigation.listItem.4">
                            <Link
                              href="/services/individual-therapy/anxiety"
                              className="text-muted hover:text-brand-soft transition-colors"
                              role="menuitem"
                              data-ppid="code:public-sites/sites/horizon-example/src/components/Navigation.jsx#Navigation.link.4">
                              Counseling for Anxiety
                            </Link>
                          </li>
                          <li
                            data-ppid="code:public-sites/sites/horizon-example/src/components/Navigation.jsx#Navigation.listItem.5">
                            <Link
                              href="/services/individual-therapy/depression"
                              className="text-muted hover:text-brand-soft transition-colors"
                              role="menuitem"
                              data-ppid="code:public-sites/sites/horizon-example/src/components/Navigation.jsx#Navigation.link.5">
                              Therapy for Depression
                            </Link>
                          </li>
                          <li
                            data-ppid="code:public-sites/sites/horizon-example/src/components/Navigation.jsx#Navigation.listItem.6">
                            <Link
                              href="/services/individual-therapy/trauma"
                              className="text-muted hover:text-brand-soft transition-colors"
                              role="menuitem"
                              data-ppid="code:public-sites/sites/horizon-example/src/components/Navigation.jsx#Navigation.link.6">
                              Counseling for Trauma
                            </Link>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h3
                          className="font-serif font-semibold text-brand mb-2"
                          data-ppid="code:public-sites/sites/horizon-example/src/components/Navigation.jsx#Navigation.heading.2">Specialized Support</h3>
                        <ul
                          className="space-y-1 text-sm"
                          data-ppid="code:public-sites/sites/horizon-example/src/components/Navigation.jsx#Navigation.list.3">
                          <li
                            data-ppid="code:public-sites/sites/horizon-example/src/components/Navigation.jsx#Navigation.listItem.7">
                            <Link
                              href="/services/specialized-support/lgbtq"
                              className="text-muted hover:text-brand-soft transition-colors"
                              role="menuitem"
                              data-ppid="code:public-sites/sites/horizon-example/src/components/Navigation.jsx#Navigation.link.7">
                              LGBTQIA+
                            </Link>
                          </li>
                          <li
                            data-ppid="code:public-sites/sites/horizon-example/src/components/Navigation.jsx#Navigation.listItem.8">
                            <a
                              href="/#services"
                              className="text-muted hover:text-brand-soft transition-colors"
                              role="menuitem"
                              data-ppid="code:public-sites/sites/horizon-example/src/components/Navigation.jsx#Navigation.link.8">
                              Women's Issues
                            </a>
                          </li>
                          <li
                            data-ppid="code:public-sites/sites/horizon-example/src/components/Navigation.jsx#Navigation.listItem.9">
                            <a
                              href="/#services"
                              className="text-muted hover:text-brand-soft transition-colors"
                              role="menuitem"
                              data-ppid="code:public-sites/sites/horizon-example/src/components/Navigation.jsx#Navigation.link.9">
                              Pregnancy Complications / Miscarriage
                            </a>
                          </li>
                          <li
                            data-ppid="code:public-sites/sites/horizon-example/src/components/Navigation.jsx#Navigation.listItem.10">
                            <a
                              href="/#services"
                              className="text-muted hover:text-brand-soft transition-colors"
                              role="menuitem"
                              data-ppid="code:public-sites/sites/horizon-example/src/components/Navigation.jsx#Navigation.link.10">
                              Abortion
                            </a>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h3
                          className="font-serif font-semibold text-brand mb-2"
                          data-ppid="code:public-sites/sites/horizon-example/src/components/Navigation.jsx#Navigation.heading.3">Trauma & Recovery</h3>
                        <ul
                          className="space-y-1 text-sm"
                          data-ppid="code:public-sites/sites/horizon-example/src/components/Navigation.jsx#Navigation.list.4">
                          <li
                            data-ppid="code:public-sites/sites/horizon-example/src/components/Navigation.jsx#Navigation.listItem.11">
                            <a
                              href="/#services"
                              className="text-muted hover:text-brand-soft transition-colors"
                              role="menuitem"
                              data-ppid="code:public-sites/sites/horizon-example/src/components/Navigation.jsx#Navigation.link.11">
                              Sexual Assault / Sexual Abuse
                            </a>
                          </li>
                          <li
                            data-ppid="code:public-sites/sites/horizon-example/src/components/Navigation.jsx#Navigation.listItem.12">
                            <a
                              href="/#services"
                              className="text-muted hover:text-brand-soft transition-colors"
                              data-ppid="code:public-sites/sites/horizon-example/src/components/Navigation.jsx#Navigation.link.12">
                              Domestic Violence & Toxic Relationships
                            </a>
                          </li>
                          <li
                            data-ppid="code:public-sites/sites/horizon-example/src/components/Navigation.jsx#Navigation.listItem.13">
                            <a
                              href="/#services"
                              className="text-muted hover:text-brand-soft transition-colors"
                              data-ppid="code:public-sites/sites/horizon-example/src/components/Navigation.jsx#Navigation.link.13">
                              Grief & Bereavement Counseling
                            </a>
                          </li>
                          <li
                            data-ppid="code:public-sites/sites/horizon-example/src/components/Navigation.jsx#Navigation.listItem.14">
                            <a
                              href="/#services"
                              className="text-muted hover:text-brand-soft transition-colors"
                              data-ppid="code:public-sites/sites/horizon-example/src/components/Navigation.jsx#Navigation.link.14">
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
                data-ppid="code:public-sites/sites/horizon-example/src/components/Navigation.jsx#Navigation.listItem.15">
                <button
                  type="button"
                  onClick={() => toggleDropdown("started")}
                  onKeyDown={(event) => handleDropdownKeyDown("started", event)}
                  className="flex items-center text-copy hover:text-brand-soft transition-colors"
                  aria-haspopup="true"
                  aria-expanded={activeDropdown === "started"}
                  aria-controls={STARTED_MENU_ID}
                  data-ppid="code:public-sites/sites/horizon-example/src/components/Navigation.jsx#Navigation.cta.2">
                  Get Started <ChevronDown className="ml-1 w-4 h-4" />
                </button>
                {activeDropdown === "started" && (
                  <div
                    id={STARTED_MENU_ID}
                    className="absolute top-full left-0 mt-2 w-56 bg-surface rounded-md shadow-warm border border-border p-4"
                    role="menu"
                    aria-label="Get started"
                  >
                    <ul
                      className="space-y-2"
                      data-ppid="code:public-sites/sites/horizon-example/src/components/Navigation.jsx#Navigation.list.5">
                      <li
                        data-ppid="code:public-sites/sites/horizon-example/src/components/Navigation.jsx#Navigation.listItem.16">
                        <a
                          href="/#appointment"
                          className="block text-copy hover:text-brand-soft transition-colors"
                          role="menuitem"
                          data-ppid="code:public-sites/sites/horizon-example/src/components/Navigation.jsx#Navigation.link.15">
                          Appointment Request
                        </a>
                      </li>
                      <li
                        data-ppid="code:public-sites/sites/horizon-example/src/components/Navigation.jsx#Navigation.listItem.17">
                        <a
                          href="/#privacy"
                          className="block text-copy hover:text-brand-soft transition-colors"
                          role="menuitem"
                          data-ppid="code:public-sites/sites/horizon-example/src/components/Navigation.jsx#Navigation.link.16">
                          Privacy Practices
                        </a>
                      </li>
                      <li
                        data-ppid="code:public-sites/sites/horizon-example/src/components/Navigation.jsx#Navigation.listItem.18">
                        <a
                          href="/#faq"
                          className="block text-copy hover:text-brand-soft transition-colors"
                          role="menuitem"
                          data-ppid="code:public-sites/sites/horizon-example/src/components/Navigation.jsx#Navigation.link.17">
                          FAQs
                        </a>
                      </li>
                      <li
                        data-ppid="code:public-sites/sites/horizon-example/src/components/Navigation.jsx#Navigation.listItem.19">
                        <a
                          href="/#rates"
                          className="block text-copy hover:text-brand-soft transition-colors"
                          role="menuitem"
                          data-ppid="code:public-sites/sites/horizon-example/src/components/Navigation.jsx#Navigation.link.18">
                          Rates & Insurance
                        </a>
                      </li>
                    </ul>
                  </div>
                )}
              </li>

              <li
                data-ppid="code:public-sites/sites/horizon-example/src/components/Navigation.jsx#Navigation.listItem.20">
                <a
                  href="/#portal"
                  className="text-copy hover:text-brand-soft transition-colors"
                  data-ppid="code:public-sites/sites/horizon-example/src/components/Navigation.jsx#Navigation.link.19">
                  Client Portal
                </a>
              </li>
              <li
                data-ppid="code:public-sites/sites/horizon-example/src/components/Navigation.jsx#Navigation.listItem.21">
                <a
                  href="/#contact"
                  className="text-copy hover:text-brand-soft transition-colors"
                  data-ppid="code:public-sites/sites/horizon-example/src/components/Navigation.jsx#Navigation.link.20">
                  Contact
                </a>
              </li>
            </ul>
          </nav>

          <div className="hidden xl:flex items-center">
            <Link
              href="/?intent=nav-consultation#book-consultation"
              className="btn-primary is-compact"
              prefetch={false}
              data-ppid="code:public-sites/sites/horizon-example/src/components/Navigation.jsx#Navigation.link.21">
              <Phone className="w-4 h-4" />
              Book Free Consultation
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
