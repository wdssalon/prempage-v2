"use client";

import { useEffect, useMemo, useState } from "react";

import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import { useSearchParams } from "next/navigation";

const SECTION_COMPONENTS = {
  "global--navigation": (props) => <Navigation {...props} />,
  "home--liberation-hero": (props) => <Hero sectionId="home--liberation-hero" {...props} />,
  "home--services-overview": (props) => <Services sectionId="home--services-overview" {...props} />,
  "home--why-choose": (props) => <WhyChooseUs sectionId="home--why-choose" {...props} />,
  "home--stories": (props) => <Testimonials sectionId="home--stories" {...props} />,
  "home--closing-invite": (props) => <FinalCTA sectionId="home--closing-invite" {...props} />,
  "global--footer": (props) => <Footer {...props} />,
};

export default function PreviewPage() {
  const params = useSearchParams();
  const sectionId = params.get("section");
  const variant = params.get("variant") ?? "default";
  const Component = sectionId ? SECTION_COMPONENTS[sectionId] : null;

  const [theme, setTheme] = useState(null);

  useEffect(() => {
    const themeParam = params.get("theme");
    if (!themeParam) {
      setTheme(null);
      return;
    }

    try {
      const decoded = JSON.parse(themeParam);
      setTheme(decoded);
    } catch (error) {
      console.warn("Invalid theme payload", error);
      setTheme(null);
    }
  }, [params]);

  const themeStyle = useMemo(() => {
    if (!theme || typeof theme !== "object") {
      return undefined;
    }

    const cssVars = Object.entries(theme).reduce((acc, [key, value]) => {
      if (typeof value === "string") {
        acc[`--${key}`] = value;
      }
      return acc;
    }, {});

    return Object.keys(cssVars).length > 0 ? cssVars : undefined;
  }, [theme]);

  if (!Component) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-sm text-slate-600">
        <p
          data-ppid="code:public-sites/sites/horizon-example/src/app/preview/page.jsx#Page.body.1">Select a section to preview.</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-base"
      data-preview-section={sectionId}
      style={themeStyle}
    >
      <Component variant={variant} />
    </div>
  );
}
