const tailwindcssAnimate = require("tailwindcss-animate");

const withOpacityValue = (variable) => ({ opacityValue } = {}) => {
  if (opacityValue !== undefined) {
    return `hsl(var(${variable}) / ${opacityValue})`;
  }
  return `hsl(var(${variable}))`;
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        transparent: "transparent",
        current: "currentColor",
        border: withOpacityValue("--color-border"),
        ring: withOpacityValue("--color-ring"),
        base: withOpacityValue("--color-bg-base"),
        surface: withOpacityValue("--color-bg-surface"),
        contrast: withOpacityValue("--color-bg-contrast"),
        copy: withOpacityValue("--color-text-primary"),
        muted: withOpacityValue("--color-text-secondary"),
        inverse: withOpacityValue("--color-text-inverse"),
        brand: withOpacityValue("--color-brand-primary"),
        "brand-soft": withOpacityValue("--color-brand-secondary"),
        accent: withOpacityValue("--color-highlight"),
        critical: withOpacityValue("--color-critical"),
        "critical-contrast": withOpacityValue("--color-critical-contrast"),
        neutral: {
          0: "#ffffff",
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          400: "#94a3b8",
          700: "#334155",
          900: "#0f172a",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      backgroundImage: {
        "gradient-hero": "var(--gradient-hero)",
        "gradient-warm": "var(--gradient-warm)",
        "gradient-nature": "var(--gradient-nature)",
        "gradient-dawn": "var(--gradient-dawn)",
        "gradient-dusk": "var(--gradient-dusk)",
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        warm: "var(--shadow-warm)",
        gentle: "var(--shadow-gentle)",
        contrast: "var(--shadow-contrast)",
      },
      transitionTimingFunction: {
        warm: "var(--ease-warm)",
      },
      transitionDuration: {
        250: "250ms",
      },
      borderRadius: {
        xs: "var(--radius-xs)",
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        card: "var(--radius-card)",
        pill: "var(--radius-pill)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0", opacity: "0" },
          to: { height: "var(--radix-accordion-content-height)", opacity: "1" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)", opacity: "1" },
          to: { height: "0", opacity: "0" },
        },
        "gentle-float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "warm-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-left": {
          "0%": { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "caret-blink": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.3s ease-warm",
        "accordion-up": "accordion-up 0.3s ease-warm",
        "gentle-float": "gentle-float 3s ease-in-out infinite",
        "warm-pulse": "warm-pulse 2s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.6s ease-warm",
        "slide-in-left": "slide-in-left 0.6s ease-warm",
        "caret-blink": "caret-blink 1s step-end infinite",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
