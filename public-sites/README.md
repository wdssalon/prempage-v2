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
