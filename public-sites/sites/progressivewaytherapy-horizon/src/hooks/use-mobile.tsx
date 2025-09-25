"use client";

import * as React from "react";

const MOBILE_BREAKPOINT = 1280;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const updateIsMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    updateIsMobile();
    mql.addEventListener("change", updateIsMobile);
    window.addEventListener("resize", updateIsMobile);

    return () => {
      mql.removeEventListener("change", updateIsMobile);
      window.removeEventListener("resize", updateIsMobile);
    };
  }, []);

  return isMobile;
}
