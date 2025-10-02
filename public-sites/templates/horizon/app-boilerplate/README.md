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
      "bg_surface": "#ffffff",
      "bg_contrast": "#e8d8cd",
      "text_primary": "#1f140f",
      "text_secondary": "#3f2a22",
      "text_inverse": "#ffffff",
      "brand_primary": "#1d675a",
      "brand_secondary": "#288e7c",
      "accent": "#33b69f",
      "border": "#d9c2b0",
      "ring": "#1d675a",
      "critical": "#b42318",
      "critical_contrast": "#fbeae9"
    },
    "dark": {
      "bg_base": "#082b28",
      "bg_surface": "#0c3b36",
      "bg_contrast": "#114540",
      "text_primary": "#f5f5f5",
      "text_secondary": "#ccbfb3",
      "text_inverse": "#ffffff",
      "brand_primary": "#1d675a",
      "brand_secondary": "#288e7c",
      "accent": "#33b69f",
      "border": "#2f6059",
      "ring": "#2d9f8a",
      "critical": "#b42318",
      "critical_contrast": "#ffffff"
    }
  }
}
```
- Font list order is preserved; each entry produces a `const` assignment and is added to the `<html>` className.
- `colors` updates the global palette. Provide HEX strings—`apply_site_config.py` converts them to the internal HSL tokens.
  - `brand_secondary` can be a tonal shift (lighter/darker than primary) or a complementary hue. Gradients and elevation tokens handle both options.

Apply `data-theme="dark"` to the `<html>` or `<body>` element to opt into the dark palette. Only the neutrals shift—the brand colors stay intact so tonal or complementary pairs remain valid in either mode.

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
