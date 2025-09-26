import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
        },
        /* Therapy-specific warm earth tones */
        "sage-green": "hsl(var(--sage-green))",
        "warm-tan": "hsl(var(--warm-tan))",
        "soft-purple": "hsl(var(--soft-purple))",
        "earth-brown": "hsl(var(--earth-brown))",
        "cream": "hsl(var(--cream))",
        "nature-green": "hsl(var(--nature-green))",
        "deep-forest": "hsl(var(--deep-forest))",
        "river-stone": "hsl(var(--river-stone))",
        "sunrise-peach": "hsl(var(--sunrise-peach))",
        "plum-mauve": "hsl(var(--plum-mauve))",
        "soft-cream": "hsl(var(--soft-cream))",
        "sidebar-border": "hsl(var(--sidebar-border))",
        "sidebar-ring": "hsl(var(--sidebar-ring))",
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-hero': 'var(--gradient-hero)',
        'gradient-warm': 'var(--gradient-warm)',
        'gradient-nature': 'var(--gradient-nature)',
        'gradient-dawn': 'var(--gradient-dawn)',
        'gradient-dusk': 'var(--gradient-dusk)',
      },
      boxShadow: {
        'soft': 'var(--shadow-soft)',
        'warm': 'var(--shadow-warm)',
        'gentle': 'var(--shadow-gentle)',
        'contrast': 'var(--shadow-contrast)',
      },
      transitionTimingFunction: {
        'warm': 'var(--ease-warm)',
      },
      transitionDuration: {
        '250': '250ms',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
} satisfies Config;
