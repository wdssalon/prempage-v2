# Progressive Way Therapy Static Site

This repo is contains instructions to create and build websites from templates found in `templates/` across a variety of technologies (next.js, custom static sites, etc.). Projects live under `sites/<slug>/`; the root folder holds shared templates and documentation.

## Where to Start

- `generate-website.md`: high-level website creation playbook.
- `AGENTS.md`: detailed guardrails for LLM automation (editing conventions, overrides, theming).
- `templates/<template-slug>/page-build-edit-overview.md`: step-by-step instructions for assembling or refreshing individual pages in the selected template family.
- `templates/<template-slug>/page-examples/`: frozen copies of the baseline HTML layouts—use them as references before generating new pages.
- `images/images-overview.md`: image sourcing, optimization, and social-share asset requirements.

## Need More Detail?

- `templates/<template-slug>/template.html`: canonical markup reference for every section in that template family.
- Deployment or operational changes should follow the conventions documented in the files above; avoid duplicating instructions across docs so each source stays authoritative.

## Asset Pipeline Quickstart
- Store raw imagery in `sites/<slug>/images/`; files keep their readable names and optional subfolders. The directory stays gitignored, so treat it as working storage rather than a committed artifact.
- Run `pnpm run assets:sync` from the site directory (automatically triggered before `pnpm dev`, `pnpm build`, and `pnpm check`). It hashes content into `public/assets/` and regenerates `src/data/asset-manifest.json` so React components reference `getAssetUrl("filename.ext")`.
- `public-sites/scripts/build-static-site.sh <slug>` now exports the Next.js `out/` folder into `public-sites/dist/<slug>/` and copies the manifest as `assets-manifest.json` for downstream CDN uploads.
- To push assets to Bunny, set the environment described below and run `pnpm run assets:upload` after building; the helper uploads hashed files to storage and emits `public-sites/dist/<slug>/assets-manifest.cdn.json` with CDN URLs.

### Bunny Upload Environment
- `BUNNY_STORAGE_ZONE`: storage zone name (e.g. `prempage-assets`).
- `BUNNY_STORAGE_HOST`: region host (e.g. `la.storage.bunnycdn.com` for the LA region).
- `BUNNY_STORAGE_PASSWORD`: storage access key (treat as secret).
- `BUNNY_PULL_ZONE_BASE_URL`: public base URL, such as `https://assets.prempage.com`.
- Optional: `BUNNY_API_KEY` to purge CDN cache once uploads finish.
