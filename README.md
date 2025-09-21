# Prempage V2 React App

This repository hosts a Vite-powered React single-page application scaffolded with the JavaScript template. It includes fast-refresh hot reloading and linting out of the box so you can focus on building features.

## Prerequisites
- Node.js 18 or newer
- npm 9 or newer (bundled with recent Node.js releases)

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server with hot reloading:
   ```bash
   npm run dev
   ```
   The app is served at the URL printed in the terminal (defaults to http://localhost:5173).

## Available Scripts
- `npm run dev` – start the Vite dev server with React Fast Refresh.
- `npm run build` – create a production build in the `dist/` directory.
- `npm run preview` – preview the production build locally.
- `npm run lint` – run ESLint against the project source.

## Project Structure
- `src/` – React components, entry point (`main.jsx`), and global styles (`index.css`).
- `public/` – Static assets copied as-is to the build output.
- `vite.config.js` – Vite configuration (React plugin already configured).
- `eslint.config.js` – ESLint setup for the project.
- `prempage-webflow/` – Imported Webflow export ready to integrate as needed.

## Next Steps
- Replace the placeholder React component in `src/App.jsx` with your application UI.
- Integrate assets or templates from `prempage-webflow/` into your React components.
- Add environment-specific configuration or routing as your feature set grows.
