# {{ cookiecutter.project_name }}

This project was generated from the PremPage Horizon cookiecutter template.

## After generation

1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Apply the site configuration (already done automatically, but re-run if you tweak `site-config.json`):
   ```bash
   python scripts/apply_site_config.py --config site-config.json
   ```
3. Start the dev server:
   ```bash
   pnpm dev
   ```
