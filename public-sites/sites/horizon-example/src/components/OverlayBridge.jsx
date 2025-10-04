"use client";

import { useEffect, useRef } from "react";

const STUDIO_SOURCE = "prempage-studio";
const SITE_SOURCE = "prempage-site";

export default function OverlayBridge() {
  const initPromiseRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    if (window === window.parent) {
      return undefined;
    }

    const ensureOverlay = async () => {
      console.time("[overlay] ensureOverlay");
      if (window.__premOverlayController) {
        console.debug("[overlay] controller already cached");
        const existing = window.__premOverlayController;
        console.timeEnd("[overlay] ensureOverlay");
        return existing;
      }

      if (!initPromiseRef.current) {
        console.debug("[overlay] importing @prempage/editor-overlay…");
        initPromiseRef.current = import("@prempage/editor-overlay")
          .then((module) => {
            console.debug("[overlay] module loaded, calling initOverlay()");
            const controller = module.initOverlay();
            window.__premOverlayController = controller;
            console.timeEnd("[overlay] ensureOverlay");
            window.parent?.postMessage(
              { source: SITE_SOURCE, type: "overlay-mounted" },
              "*",
            );
            return controller;
          })
          .catch((error) => {
            console.timeEnd("[overlay] ensureOverlay");
            console.error("prempage: failed to initialize overlay", error);
            initPromiseRef.current = null;
            throw error;
          });
      }

      return initPromiseRef.current;
    };

    const destroyOverlay = () => {
      const controller = window.__premOverlayController;
      if (controller?.destroy) {
        controller.destroy();
      }
      delete window.__premOverlayController;
      initPromiseRef.current = null;
    };

    const handleMessage = (event) => {
      const { data } = event;
      if (!data || typeof data !== "object") {
        return;
      }

      if (data.source !== STUDIO_SOURCE) {
        return;
      }

      if (data.type === "overlay-init") {
        console.debug("[overlay] received overlay-init from studio");
        ensureOverlay().catch(() => {
          /* error already logged */
        });
      } else if (data.type === "overlay-destroy") {
        console.debug("[overlay] received overlay-destroy from studio");
        destroyOverlay();
      }
    };

    window.addEventListener("message", handleMessage);
    console.debug("[overlay] posting bridge-ready to studio");
    window.parent?.postMessage({ source: SITE_SOURCE, type: "bridge-ready" }, "*");

    return () => {
      window.removeEventListener("message", handleMessage);
      destroyOverlay();
    };
  }, []);

  return null;
}
