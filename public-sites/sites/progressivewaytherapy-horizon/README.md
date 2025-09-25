# Progressive Way Therapy Horizon (Next.js Static Export)

This project rebuilds the **Progressive Way Therapy** marketing site using Next.js 14 with the App Router, while preserving the original Vite/React design system, component library (shadcn/ui), and styling. The site is configured for static export so it can be deployed to any static hosting provider.

## Tech stack
- Next.js 14 (App Router) with static export (`output: 'export'`)
- React 18 with TypeScript
- Tailwind CSS 3 with custom design tokens and animations
- shadcn/ui component collection (Radix UI + Tailwind)
- @tanstack/react-query, lucide-react icons, sonner toasts, and the original utility libraries

## Getting started
```bash
npm install
npm run dev
```

The development server runs on `http://localhost:3000` with hot reload.

## Building a static export
```bash
npm run build
```

The static export is written to the `out/` directory (thanks to `output: 'export'` and unoptimised images in `next.config.mjs`). You can deploy the `out/` folder to any static host or CDN.

## Project structure
- `app/` – Next.js app router pages (`page.tsx`, `about/page.tsx`, `not-found.tsx`) and shared providers
- `src/components/` – Ported presentation components and shadcn/ui primitives
- `src/hooks/` – Custom hooks such as `useIsMobile` and toast management
- `src/lib/` – Utility helpers (e.g. `cn`)
- `public/` – Static assets and images copied from the original site
- `tailwind.config.ts`, `postcss.config.js` – Tailwind configuration copied from the Vite build to keep styling identical

## Notes
- The project keeps the same dependency set as the Vite version, with the addition of Next.js and its lint config.
- Images are served from `public/assets` so imports from the Vite build were updated to use public paths (e.g. `/assets/logo.webp`).
- Client components are marked with `'use client'` so they can reuse the original React hooks and shadcn/ui primitives in the Next.js environment.
