# Horizon App Boilerplate

PremPage's Horizon boilerplate is a Next.js 14 site that mirrors the Progressive Way Therapy home page. It is intentionally JavaScript-only so it can act as the seed for future cookie-cutter clones.

## Prerequisites
- Node 18+
- pnpm 8+
- Python 3.10+

## Install & Run
```bash
pnpm install
pnpm dev
```
The dev server defaults to http://localhost:3000.

Production checks:
```bash
pnpm lint
pnpm build
```

## Parameterised Site Configuration
Use `scripts/apply_site_config.py` to inject fonts, metadata, and color tokens from a JSON payload. The script accepts either a file path or an inline JSON string:

```bash
python scripts/apply_site_config.py --config config/example-site.json
# or
python scripts/apply_site_config.py --config '{"fonts": [...], "colors": {...}}'
```

### Schema Overview
```jsonc
{
  "metadata": {
    "title": "Page title",
    "description": "SEO description"
  },
  "fonts": [
    {
      "id": "serif",
      "loader": "Playfair_Display", // named import from next/font/google
      "variable": "--font-serif",    // CSS custom property to expose
      "options": {                    // forwarded to the loader
        "subsets": ["latin"],
        "display": "swap"
      }
    },
    {
      "id": "body",
      "loader": "Inter",
      "variable": "--font-body",
      "options": {
        "subsets": ["latin"],
        "display": "swap"
      }
    }
  ],
  "colors": {
    "light": { "background": "30 47% 93%", "foreground": "0 0% 29%" },
    "dark": { "background": "347 12% 15%", "foreground": "337 45% 91%" }
  }
}
```
- Font list order is preserved; each entry produces a `const` assignment and is added to the `<html>` className.
- `colors.light` updates the `:root` CSS variables; `colors.dark` updates the `.dark` block. Only provided keys are touched, so partial overrides are fine.

A full reference configuration that recreates the Progressive Way Therapy palette lives at `config/example-site.json`.

Run the script before templating to bake the chosen palette/fonts into `layout.js` and `globals.css`.

## Cookiecutter Template

The reusable template lives at `public-sites/templates/horizon/cookiecutter-config`. Generate a site directly into the shared `public-sites/sites` directory:

```bash
uv tool run cookiecutter $(pwd)/public-sites/templates/horizon/cookiecutter-config \
  --config-file public-sites/templates/horizon/cookiecutter-config/example-cookiecutter-context.json \
  --output-dir public-sites/sites \
  --no-input
```

Then install dependencies and run the dev server:

```bash
cd public-sites/sites/calmpath-horizon
pnpm install
pnpm dev
```
