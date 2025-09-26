import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tailwindcss from "eslint-plugin-tailwindcss";
import tseslint from "typescript-eslint";

const tailwindWhitelist = [
  "^heading$",
  "^text$",
  "^is-(display|section|subsection|compact|on-dark|muted|lead|caption)$",
  "^btn-(consultation|gentle|secondary|ghost-link)$",
  "^nav-warm$",
  "^service-card$",
  "^safe-space$",
  "^inclusive-card$",
  "^organic-border(-soft|-wave|-tilt)?$",
  "^gentle-hover$",
  "^fade-in-up$",
  "^mobile-(toolbar|menu-overlay|menu-content|cta-bar)$",
  "^menu-panel$",
  "^hamburger-(line|open)$",
];

export default tseslint.config(
  {
    ignores: ["**/dist/**", "**/out/**", "**/node_modules/**", "**/.next/**"],
  },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended, tailwindcss.configs["flat/recommended"]],
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      tailwindcss,
    },
    settings: {
      tailwindcss: {
        callees: ["cn", "cva", "clsx"],
        config: "tailwind.config.ts",
        cssFiles: ["app/**/*.css", "src/**/*.css"],
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": "off",
      "tailwindcss/no-custom-classname": ["warn", { whitelist: tailwindWhitelist }],
      "tailwindcss/classnames-order": "off",
      "tailwindcss/enforces-shorthand": "off",
    },
  },
  {
    files: ["app/**/*.tsx", "src/components/ui/**/*.{ts,tsx}"],
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },
);
