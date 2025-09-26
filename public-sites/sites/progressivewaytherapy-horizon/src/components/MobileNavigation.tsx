"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, ChevronLeft, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface MenuItem {
  id: string;
  label: string;
  href?: string;
  children?: MenuItem[];
}

interface MenuPanel {
  id: string;
  title: string;
  items: MenuItem[];
  parentId?: string;
}

const logoSrc = "/assets/logo.webp";

const MobileNavigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPanelId, setCurrentPanelId] = useState("main");
  const [panelStack, setPanelStack] = useState<string[]>(["main"]);
  const isMobile = useIsMobile();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef(0);

  const menuData: MenuPanel[] = [
    {
      id: "main",
      title: "Menu",
      items: [
        { id: "home", label: "Home", href: "/" },
        { id: "about", label: "About", href: "/about" },
        {
          id: "services",
          label: "Services",
          children: [
            { id: "individual", label: "Individual Therapy", children: [] },
            { id: "specialized", label: "Specialized Support", children: [] },
            { id: "trauma", label: "Trauma & Recovery", children: [] },
          ],
        },
        {
          id: "get-started",
          label: "Get Started",
          children: [
            { id: "appointment", label: "Appointment Request", href: "/#appointment" },
            { id: "privacy", label: "Privacy Practices", href: "/#privacy" },
            { id: "faq", label: "FAQs", href: "/#faq" },
            { id: "rates", label: "Rates & Insurance", href: "/#rates" },
          ],
        },
        { id: "portal", label: "Client Portal", href: "/#portal" },
        { id: "contact", label: "Contact", href: "/#contact" },
      ],
    },
    {
      id: "services",
      title: "Services",
      parentId: "main",
      items: [
        {
          id: "individual",
          label: "Individual Therapy",
          children: [
            { id: "general", label: "General Individual Therapy", href: "/services/individual-therapy/general" },
            { id: "anxiety", label: "Counseling for Anxiety", href: "#" },
            { id: "depression", label: "Therapy for Depression", href: "#" },
            { id: "trauma-counseling", label: "Counseling for Trauma", href: "#" },
          ],
        },
        {
          id: "specialized",
          label: "Specialized Support",
          children: [
            { id: "lgbtq", label: "LGBTQIA+ Individual Therapy", href: "#" },
            { id: "womens", label: "Women's Issues", href: "#" },
            { id: "pregnancy", label: "Pregnancy Complications / Miscarriage", href: "#" },
            { id: "abortion", label: "Abortion", href: "#" },
          ],
        },
        {
          id: "trauma",
          label: "Trauma & Recovery",
          children: [
            { id: "sexual-assault", label: "Sexual Assault / Sexual Abuse", href: "#" },
            { id: "domestic-violence", label: "Domestic Violence & Toxic Relationships", href: "#" },
            { id: "grief", label: "Grief & Bereavement Counseling", href: "#" },
            { id: "immigrant", label: "Immigrant / Refugee Counseling", href: "#" },
          ],
        },
      ],
    },
    {
      id: "get-started",
      title: "Get Started",
      parentId: "main",
      items: [
        { id: "appointment", label: "Appointment Request", href: "/#appointment" },
        { id: "privacy", label: "Privacy Practices", href: "/#privacy" },
        { id: "faq", label: "FAQs", href: "/#faq" },
        { id: "rates", label: "Rates & Insurance", href: "/#rates" },
      ],
    },
    {
      id: "individual",
      title: "Individual Therapy",
      parentId: "services",
      items: [
        { id: "general", label: "General Individual Therapy", href: "/services/individual-therapy/general" },
        { id: "anxiety", label: "Counseling for Anxiety", href: "#" },
        { id: "depression", label: "Therapy for Depression", href: "#" },
        { id: "trauma-counseling", label: "Counseling for Trauma", href: "#" },
      ],
    },
    {
      id: "specialized",
      title: "Specialized Support",
      parentId: "services",
      items: [
        { id: "lgbtq", label: "LGBTQIA+ Individual Therapy", href: "#" },
        { id: "womens", label: "Women's Issues", href: "#" },
        { id: "pregnancy", label: "Pregnancy Complications / Miscarriage", href: "#" },
        { id: "abortion", label: "Abortion", href: "#" },
      ],
    },
    {
      id: "trauma",
      title: "Trauma & Recovery",
      parentId: "services",
      items: [
        { id: "sexual-assault", label: "Sexual Assault / Sexual Abuse", href: "#" },
        { id: "domestic-violence", label: "Domestic Violence & Toxic Relationships", href: "#" },
        { id: "grief", label: "Grief & Bereavement Counseling", href: "#" },
        { id: "immigrant", label: "Immigrant / Refugee Counseling", href: "#" },
      ],
    },
  ];

  const getCurrentPanel = () => menuData.find((panel) => panel.id === currentPanelId);

  const openMenu = useCallback(() => {
    scrollPositionRef.current = window.scrollY;
    setIsMenuOpen(true);
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.top = `-${scrollPositionRef.current}px`;

    setTimeout(() => {
      const firstFocusable = menuRef.current?.querySelector(
        'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement;
      firstFocusable?.focus();
    }, 200);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.width = "";
    document.body.style.left = "";
    document.body.style.right = "";
    const scrollY = scrollPositionRef.current;
    document.body.style.top = "";
    window.scrollTo(0, scrollY);
    setCurrentPanelId("main");
    setPanelStack(["main"]);
    hamburgerRef.current?.focus();
  }, []);

  const focusFirstInteractive = useCallback(() => {
    setTimeout(() => {
      const firstFocusable = menuRef.current?.querySelector(
        ".menu-panel button:not([disabled]), .menu-panel a[href]"
      ) as HTMLElement;
      firstFocusable?.focus();
    }, 0);
  }, []);

  const navigateToPanel = useCallback(
    (panelId: string) => {
      setCurrentPanelId(panelId);
      setPanelStack((prev) => [...prev, panelId]);
      focusFirstInteractive();
    },
    [focusFirstInteractive]
  );

  const navigateBack = useCallback(() => {
    setPanelStack((prev) => {
      if (prev.length <= 1) return prev;

      const newStack = prev.slice(0, -1);
      const newCurrent = newStack[newStack.length - 1];
      setCurrentPanelId(newCurrent);

      setTimeout(() => {
        const backButton = menuRef.current?.querySelector(".back-button") as HTMLElement;
        backButton?.focus();
      }, 0);

      return newStack;
    });
  }, []);

  const handleItemClick = useCallback(
    (item: MenuItem) => {
      if (item.children && item.children.length > 0) {
        navigateToPanel(item.id);
        return;
      }

      if (!item.href || item.href === "#") return;

      closeMenu();

      if (item.href.startsWith("http")) {
        window.location.href = item.href;
        return;
      }

      router.push(item.href);
    },
    [navigateToPanel, closeMenu, router]
  );

  const handleCTAClick = useCallback(() => {
    closeMenu();
    router.push("/#book-consultation");
  }, [closeMenu, router]);

  const handleLogoClick = useCallback(() => {
    setPanelStack(["main"]);
    setCurrentPanelId("main");
    if (isMenuOpen) {
      closeMenu();
    }
  }, [closeMenu, isMenuOpen, setPanelStack, setCurrentPanelId]);

  useEffect(() => {
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.top = "";
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isMenuOpen) return;

      switch (event.key) {
        case "Escape":
          event.preventDefault();
          closeMenu();
          break;
        case "Backspace":
          if (panelStack.length > 1) {
            event.preventDefault();
            navigateBack();
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen, closeMenu, navigateBack, panelStack.length]);

  useEffect(() => {
    if (!isMenuOpen) return;

    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;

      const focusableElements = menuRef.current?.querySelectorAll(
        'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
      ) as NodeListOf<HTMLElement>;

      if (!focusableElements?.length) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", trapFocus);
    return () => document.removeEventListener("keydown", trapFocus);
  }, [isMenuOpen, currentPanelId]);

  const handleBackdropClick = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      if (event.target === overlayRef.current) {
        closeMenu();
      }
    },
    [closeMenu]
  );

  if (!isMobile) return null;

  return (
    <>
      <header className="mobile-toolbar">
        <div className="flex items-center">
          <Link
            href="/"
            onClick={handleLogoClick}
            className="flex items-center focus:outline-none"
            aria-label="Go to home"
          >
            <img
              src={logoSrc}
              alt="Progressive Way Therapy Logo"
              className="object-contain h-full w-auto"
              style={{ maxHeight: "calc(var(--mobile-toolbar-height, 112px) - 16px)" }}
            />
          </Link>
        </div>

        <button
          ref={hamburgerRef}
          onClick={isMenuOpen ? closeMenu : openMenu}
          className={`relative p-2 focus:outline-none rounded-lg ${isMenuOpen ? "hamburger-open" : ""}`}
          role="button"
          aria-controls="mobile-menu"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          <div className="w-6 h-6 relative flex items-center justify-center">
            <span className="hamburger-line absolute" />
            <span className="hamburger-line absolute" />
          </div>
        </button>
      </header>

      {isMenuOpen && (
        <div
          ref={overlayRef}
          className="mobile-menu-overlay"
          onClick={handleBackdropClick}
        >
          <div
            ref={menuRef}
            id="mobile-menu"
            className="mobile-menu-content"
            role="navigation"
            aria-label="Mobile navigation"
          >
            <div className="relative w-full h-full">
              {(() => {
                const panel = getCurrentPanel();
                if (!panel) return null;

                return (
                  <div key={panel.id} className="menu-panel" data-active>
                    {panel.parentId && (
                      <div className="flex items-center py-4 border-b border-border/20">
                        <button
                          onClick={navigateBack}
                          className="back-button flex items-center text-earth-brown hover:text-soft-purple transition-colors focus:outline-none rounded-lg p-1"
                          aria-label={`Back to ${menuData.find((p) => p.id === panel.parentId)?.title}`}
                        >
                          <ChevronLeft className="w-5 h-5 mr-2" />
                          <span className="font-medium">{panel.title}</span>
                        </button>
                      </div>
                    )}

                    <div className="space-y-2">
                      {panel.items.map((item) => (
                        <div key={item.id}>
                          <button
                            onClick={() => handleItemClick(item)}
                            className="w-full flex items-center justify-between py-3 px-4 text-left text-earth-brown hover:text-soft-purple hover:bg-soft-purple/10 transition-colors rounded-lg focus:outline-none"
                            style={{ minHeight: "44px" }}
                          >
                            <span className="font-medium">{item.label}</span>
                            {item.children && item.children.length > 0 && (
                              <ChevronRight className="w-5 h-5 text-muted-foreground" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="mobile-cta-bar">
              <Button onClick={handleCTAClick} className="w-full btn-consultation h-12 text-base font-medium rounded-lg focus:outline-none">
                <Phone className="w-5 h-5 mr-2" />
                Book Free Consultation
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNavigation;
