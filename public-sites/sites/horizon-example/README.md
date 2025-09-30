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
      "loader": "Playfair_Display",
      "variable": "--font-serif",
      "options": {
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
    "light": {
      "bg_base": "#f6ede5",
      "bg_surface": "#faf5f0",
      "bg_contrast": "#fce3ea",
      "text_primary": "#4a4a4a",
      "text_secondary": "#6b5247",
      "text_inverse": "#ffffff",
      "brand_primary": "#6ca37a",
      "brand_secondary": "#d9a6b5",
      "accent": "#e4d0c9",
      "border": "#ddccc5",
      "ring": "#6ca37a",
      "critical": "#dd3c3c",
      "critical_contrast": "#faf8f5"
    },
    "dark": {
      "bg_base": "#2b2224",
      "bg_surface": "#33282b",
      "bg_contrast": "#493139",
      "text_primary": "#f2dee6",
      "text_secondary": "#cd98ac",
      "text_inverse": "#2b2224",
      "brand_primary": "#75a983",
      "brand_secondary": "#9b4b63",
      "accent": "#6b4753",
      "border": "#47383b",
      "ring": "#75a983",
      "critical": "#ae2929",
      "critical_contrast": "#f2dee6"
    }
  }
}
```
- Font list order is preserved; each entry produces a `const` assignment and is added to the `<html>` className.
- `colors` updates the global palette. Provide HEX strings—`apply_site_config.py` converts them to the internal HSL tokens.

A full reference configuration that recreates the Progressive Way Therapy palette lives at `config/example-site.json`.

Run the script before templating to bake the chosen palette/fonts into `layout.js` and `globals.css`.

## Cookiecutter Template

The reusable template lives at `public-sites/templates/horizon/cookiecutter-config`. Generate a site directly into the shared `public-sites/sites` directory:

```bash
uv tool run cookiecutter $(pwd)/public-sites/templates/horizon/cookiecutter-config \
  --output-dir public-sites/sites \
  --no-input
```

Then install dependencies and run the dev server:

```bash
cd public-sites/sites/calmpath-horizon
pnpm install
pnpm dev
```
