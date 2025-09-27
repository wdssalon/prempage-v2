# Public Sites Toolkit

## Start Here
- `agents/guardrails.md` – canonical rules for editing, trackers, assets, and collaboration.
- `agents/coordinator.md` – phase sequencing, approval gates, and coordinator responsibilities.
- `agents/roles/` – per-role mission briefs and deliverables. Load the relevant file before executing a stage.
- `templates/<template>/page-build-edit-overview.md` – template supplement with Horizon/Clarity-specific overrides layered on top of the guardrails.

## Directory Map
- `sites/<slug>/` – production site bundles. Each slug owns its Next.js or static export.
- `templates/<template>/` – reusable assets: config, sections catalog, client overview starter, template supplement, agent plugins.
- `scripts/` – vetted automation helpers (bootstrap, extract, build, asset sync/upload). Run only the commands referenced in the guardrails or template supplements.
- `images/` – shared imagery workflow documentation (`images-overview.md`).

## Common Commands
```bash
python public-sites/scripts/bootstrap_horizon_site.py <site-slug>   # Horizon scaffold when missing
python public-sites/scripts/extract_site.py <site-slug> <url>       # Legacy site scrape during intake
pnpm run assets:sync                                                # Refresh hashed assets for Horizon
public-sites/scripts/build-static-site.sh <site-slug>               # Export static bundle
pnpm run assets:upload                                              # Upload assets to Bunny when enabled
```

Keep the guardrails as the single source of truth. When new rules surface, update `agents/guardrails.md` and link to the change here when helpful.
