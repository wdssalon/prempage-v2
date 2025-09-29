# Horizon Cookiecutter Template

This cookiecutter wraps the `app-boilerplate` workspace to produce a ready-to-run site with your chosen fonts and colours.

## Usage

Generate a new site directly inside `public-sites/sites`:

```bash
uv tool run cookiecutter $(pwd)/public-sites/templates/horizon/cookiecutter-config \
  --output-dir public-sites/sites \
  --config-file public-sites/templates/horizon/cookiecutter-config/example-cookiecutter-context.json \
  --no-input
```

The post-generation hook will:
- copy `app-boilerplate` into the new project directory,
- rename the package using `project_slug`, and
- run `scripts/apply_site_config.py --config site-config.json` with the rendered palette/font values.

After generation:

```bash
cd public-sites/sites/<your-project-slug>
pnpm install
pnpm dev
```

Swap the context file to create additional brands; the same command works with any JSON that matches `cookiecutter.json` keys.
