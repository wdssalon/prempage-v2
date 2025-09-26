# Progressive Way Therapy-Horizon Template

This directory hosts the client-specific instance of the Horizon template. Follow the shared instructions in `public-sites/templates/horizon/README.md` for development, build, and deployment details.

Quick reminders:
- Static export assets land in `out/` after `pnpm check` or the helper script runs.
- Images specific to this brand live under `public/` (or the gitignored `images/` directory) and should remain scoped here.
- For deployment, Render Static Sites tracks this directory with `pnpm install --frozen-lockfile && pnpm run check` and publishes `out/`.
- Use `render.yaml` in this directory with `render blueprint apply` to create/update the Render service (`progressivewaytherapy-horizon` on branch `master`).
- GitHub Actions workflow `.github/workflows/deploy-progressivewaytherapy-horizon.yml` rebuilds on pushes to `master`; set the repo secret `RENDER_DEPLOY_HOOK_PROGRESSIVEWAYTHERAPY_HORIZON` to the service’s Deploy Hook URL so it can auto-trigger Render.
