(function () {
  const STAR_PATH = "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z";

  const testimonials = [
    {
      name: "Jordan M.",
      identity: "LGBTQIA+ Client",
      quote:
        "Finally found a therapist who truly understands the challenges of being queer in Texas. Blanca created a space where I could be completely authentic without fear of judgment.",
      rating: 5,
    },
    {
      name: "Maria S.",
      identity: "Trauma Survivor",
      quote:
        "The EMDR sessions changed my life. After years of carrying trauma, I finally feel like I can breathe again. Blanca's approach is both gentle and incredibly effective.",
      rating: 5,
    },
    {
      name: "Alex R.",
      identity: "Young Professional",
      quote:
        "As someone struggling with anxiety and depression, I was skeptical about therapy. But Blanca's progressive approach and genuine care made all the difference. I actually look forward to our sessions.",
      rating: 5,
    },
    {
      name: "Carmen L.",
      identity: "Immigrant Client",
      quote:
        "Finding culturally responsive therapy was so important to me. Blanca understands the unique challenges immigrants face and helps me navigate both healing and identity with such compassion.",
      rating: 5,
    },
  ];

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  }

  function initMobileMenu() {
    let scrollPosition = 0;
    const toggle = document.querySelector(".mobile-menu-toggle");
    const overlay = document.querySelector(".mobile-menu-overlay");
    if (!toggle || !overlay) return;

    const closeButton = overlay.querySelector(".mobile-menu-close");
    const focusFirstInteractive = () => {
      const activePanel = overlay.querySelector('.menu-panel[data-active="true"]');
      if (!activePanel) return;
      const focusable = activePanel.querySelector('button, a');
      if (focusable) {
        focusable.focus();
      }
    };
    const panelElements = Array.from(overlay.querySelectorAll(".menu-panel"));
    const closeSelectors = overlay.querySelectorAll("[data-close-on-click]");
    const panelHistory = [];

    const setPanelActive = (panelId) => {
      panelElements.forEach((panel) => {
        panel.dataset.active = panel.dataset.panel === panelId ? "true" : "false";
      });
    };

    const openMenu = () => {
      if (overlay.classList.contains("is-open")) return;
      scrollPosition = window.scrollY || window.pageYOffset;
      overlay.classList.remove("hidden");
      document.documentElement.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPosition}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
      document.body.classList.add("mobile-menu-open");
      requestAnimationFrame(() => {
        overlay.classList.add("is-open");
        setTimeout(focusFirstInteractive, 200);
      });
      overlay.setAttribute("aria-hidden", "false");
      toggle.classList.add("hamburger-open");
      toggle.setAttribute("aria-expanded", "true");
    };

    const closeMenu = () => {
      if (!overlay.classList.contains("is-open")) return;
      overlay.classList.remove("is-open");
      overlay.setAttribute("aria-hidden", "true");
      document.body.classList.remove("mobile-menu-open");
      toggle.classList.remove("hamburger-open");
      toggle.setAttribute("aria-expanded", "false");
      setPanelActive("main");
      panelHistory.length = 0;
      document.documentElement.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollPosition);
      setTimeout(() => {
        if (!overlay.classList.contains("is-open")) {
          overlay.classList.add("hidden");
        }
        toggle.focus();
      }, 200);
    };

    toggle.addEventListener("click", () => {
      if (overlay.classList.contains("is-open")) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    if (closeButton) {
      closeButton.addEventListener("click", closeMenu);
    }

    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && overlay.classList.contains("is-open")) {
        event.preventDefault();
        closeMenu();
      }
      if (event.key === "Tab" && overlay.classList.contains("is-open")) {
        const focusable = overlay.querySelectorAll('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])');
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });

    overlay.querySelectorAll("[data-panel-target]").forEach((button) => {
      button.addEventListener("click", () => {
        const target = button.getAttribute("data-panel-target");
        const currentPanel = button.closest(".menu-panel");
        if (!target || !currentPanel) return;
        const currentId = currentPanel.dataset.panel;
        if (currentId !== target) {
          panelHistory.push(currentId || "main");
          setPanelActive(target);
          setTimeout(focusFirstInteractive, 100);
        }
      });
    });

    overlay.querySelectorAll(".mobile-menu-back").forEach((button) => {
      button.addEventListener("click", () => {
        const fallback = button.closest(".menu-panel")?.dataset.parent || "main";
        const previous = panelHistory.pop() || fallback;
        setPanelActive(previous);
        setTimeout(focusFirstInteractive, 100);
      });
    });

    closeSelectors.forEach((link) => {
      link.addEventListener("click", () => {
        closeMenu();
      });
    });

    // Ensure main panel visible on load
    setPanelActive("main");
  }

  function createStarSvg() {
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("xmlns", svgNS);
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("width", "24");
    svg.setAttribute("height", "24");
    svg.setAttribute("fill", "currentColor");
    svg.classList.add("lucide", "lucide-star", "w-5", "h-5");
    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", STAR_PATH);
    svg.appendChild(path);
    return svg;
  }

  function initTestimonialSlider() {
    const slider = document.querySelector("[data-testimonial-slider]");
    if (!slider) return;

    const quoteElement = slider.querySelector("[data-testimonial-quote]");
    const nameElement = slider.querySelector("[data-testimonial-name]");
    const identityElement = slider.querySelector("[data-testimonial-identity]");
    const ratingContainer = slider.querySelector("[data-testimonial-rating]");
    const indicatorsContainer = slider.querySelector("[data-testimonial-indicators]");
    const prevButton = slider.querySelector("[data-testimonial-prev]");
    const nextButton = slider.querySelector("[data-testimonial-next]");

    if (!quoteElement || !nameElement || !identityElement || !ratingContainer || !indicatorsContainer) {
      return;
    }

    let currentIndex = 0;

    const renderRating = (rating) => {
      ratingContainer.innerHTML = "";
      const srOnly = document.createElement("span");
      srOnly.className = "sr-only";
      srOnly.textContent = `${rating} out of 5 stars`;
      ratingContainer.appendChild(srOnly);
      for (let i = 0; i < rating; i += 1) {
        ratingContainer.appendChild(createStarSvg());
      }
    };

    const setActiveIndicator = (index) => {
      indicatorsContainer.querySelectorAll("button").forEach((button) => {
        if (Number(button.dataset.index) === index) {
          button.classList.add("is-active");
          button.classList.add("w-8");
          button.classList.remove("w-3");
          button.classList.remove("bg-border");
        } else {
          button.classList.remove("is-active");
          button.classList.add("w-3");
          button.classList.remove("w-8");
          if (!button.classList.contains("bg-border")) {
            button.classList.add("bg-border");
          }
        }
      });
    };

    const renderIndicators = () => {
      indicatorsContainer.innerHTML = "";
      testimonials.forEach((_, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.dataset.index = String(index);
        button.className = "w-3 h-3 rounded-full transition-all bg-border";
        button.setAttribute("aria-label", `Go to testimonial ${index + 1}`);
        button.addEventListener("click", () => {
          currentIndex = index;
          updateSlide();
        });
        indicatorsContainer.appendChild(button);
      });
    };

    const updateSlide = () => {
      const item = testimonials[currentIndex];
      if (!item) return;
      quoteElement.textContent = `"${item.quote}"`;
      nameElement.textContent = item.name;
      identityElement.textContent = item.identity;
      renderRating(item.rating);
      setActiveIndicator(currentIndex);
    };

    const showNext = () => {
      currentIndex = (currentIndex + 1) % testimonials.length;
      updateSlide();
    };

    const showPrevious = () => {
      currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
      updateSlide();
    };

    if (prevButton) {
      prevButton.addEventListener("click", showPrevious);
    }

    if (nextButton) {
      nextButton.addEventListener("click", showNext);
    }

    renderIndicators();
    updateSlide();
  }

  ready(() => {
    initMobileMenu();
    initTestimonialSlider();
  });
})();
