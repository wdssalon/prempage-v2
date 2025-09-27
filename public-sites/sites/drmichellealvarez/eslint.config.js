import js from "@eslint/js";
import next from "eslint-config-next";
import globals from "globals";

export default [
  js.configs.recommended,
  ...next(),
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: ["./tsconfig.json"],
      },
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "@next/next/no-img-element": "off"
    },
  },
];
