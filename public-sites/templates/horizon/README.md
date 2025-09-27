# Horizon Template – Static Next.js Export

This template powers Horizon-class marketing sites. Each client instance under `public-sites/sites/<slug>` reuses this stack with minimal overrides.

## Tech Highlights
- Next.js 14 App Router configured for static export (`next.config.mjs` sets `output: 'export'` and disables image optimization).
- React 18 + TypeScript, Tailwind CSS, shadcn/ui, and the shared utility libraries carried over from the Vite build.
- All assets and generated HTML live under `out/` after a production build, ready for any static host (Render Static Sites, S3/CloudFront, etc.).

## Local Development
```bash
pnpm install
pnpm dev
```

The dev server runs at `http://localhost:3000` with hot reload.

### Bootstrapping a new site
```bash
python public-sites/scripts/bootstrap_horizon_site.py <site-slug>-horizon
```

This copies the Horizon boilerplate into `public-sites/sites/<site-slug>-horizon` and runs `pnpm install` so the project
is ready for local work or automation. Pass `--force` to overwrite an existing workspace and `--skip-install` when you
only want the files copied.

### Visual system explorations
- Populate `app/style-guide/data.ts` with three variants. The dynamic route at `/style-guide/[variant]` renders each exploration, and the root `/style-guide` page provides an overview.
- Variants must use unique slugs with the `style-guide-` prefix (e.g., `style-guide-sunrise-haven`, `style-guide-evergreen-balance`, `style-guide-nocturne-focus`). Update palette, typography, and hero samples to reflect the direction.
- After saving variants, run `python agents/runner.py --site <slug> --template horizon style-guide --summary "<variant-overview>" --options "See /style-guide"` so automation state and `client-overview.md` stay in sync.

## Static Export & Checks
```bash
pnpm check
```

`pnpm check` runs ESLint and builds a static export (`out/`). This script is what Render will call during deploys. The build fetches Google Fonts at compile time; make sure the environment has outbound network access (Render does by default).

To build outside the project root, use the helper script from the repo root:
```bash
./public-sites/scripts/build-static-site.sh <site-slug>
```

## Render Static Site Deployment
For each Horizon client site (e.g., `progressivewaytherapy-horizon`):
1. **Render service type**: Static Site.
2. **Repo**: `prempage-v2` monorepo (`https://github.com/wdssalon/prempage-v2.git`).
3. **Root directory**: `public-sites/sites/<slug>`.
4. **Build command**: `pnpm install --frozen-lockfile && pnpm run check`.
5. **Publish directory**: `out`.
6. Add `NODE_VERSION=20` env var (matches local tooling).
7. Service name should exactly match the site directory slug (e.g., `progressivewaytherapy-horizon`).
8. Enable auto-deploy on the branch that owns releases (e.g., `master`). Render will rebuild whenever that path changes.

You can also generate the service via blueprint. Copy `render-static-site.example.yaml`, replace `<site-slug>`, and run `render blueprint apply` (or upload in the Render dashboard). Site-specific blueprints can live beside each client directory for convenience.

Publishing = merging to the tracked branch. The Render build runs the same lint + export pipeline as local development.

## GitHub Actions Auto-Deploy
- The repository contains per-site workflows under `.github/workflows/` that watch `public-sites/sites/<slug>` and call the matching Render Deploy Hook after a successful lint + static export (`./public-sites/scripts/build-static-site.sh <slug>`).
- CI caches the pnpm store keyed by `pnpm-lock.yaml`, so subsequent installs run with `pnpm install --frozen-lockfile --prefer-offline` for faster builds.
- The workflow also caches `.next/cache` keyed by package + source hashes to speed up incremental Next.js builds.
- A repo-level `pre-push` hook (`.githooks/pre-push`) runs `pnpm lint` for all Horizon sites. Enable hooks with `git config core.hooksPath .githooks` so lint failures stop before they reach CI.
- Create a secret named `RENDER_DEPLOY_HOOK_<SLUG_IN_SCREAMING_SNAKE>` (for `progressivewaytherapy-horizon`, use `RENDER_DEPLOY_HOOK_PROGRESSIVEWAYTHERAPY_HORIZON`) holding the Deploy Hook URL from Render.
- Workflows run on pushes to `master` and can also be triggered manually via *Run workflow*.

## Operational Notes
- Keep per-site overrides scoped within the site directory so the template stays zero-config.
- Update this document if the build command, tooling, or Render configuration changes.
- For now, new site scaffolds are produced locally with Codex; the hosted editor will focus on safe iterative edits once it launches.
- Automation backlog: add CI checks to run `public-sites/scripts/build-static-site.sh <slug>` on pull requests, and script `render blueprint apply` once the static site service name and branch strategy are finalized.
