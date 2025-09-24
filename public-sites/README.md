# Progressive Way Therapy Static Site

This repo now houses multiple Progressive Way Therapy static exports. Production-ready HTML, CSS, and JS live under `sites/<slug>/`; the root folder holds shared tooling and documentation.

## Deploying

- Platform: Render static site
- Publish directory: point each service at the corresponding `sites/<slug>/` folder.
- Build command: *(leave blank)*

Pushes to the selected `sites/<slug>/` directory deploy automatically once Render is configured for that slug.

## Where to Start

- `generate-website.md`: high-level website creation playbook.
- `AGENTS.md`: detailed guardrails for LLM automation (editing conventions, overrides, theming).
- `tooling/<template-slug>/page-build-edit-overview.md`: step-by-step instructions for assembling or refreshing individual pages in the selected template family.
- `tooling/<template-slug>/page-examples/`: frozen copies of the baseline HTML layouts—use them as references before generating new pages.
- `images/images-overview.md`: image sourcing, optimization, and social-share asset requirements.
- `new-website-repo-checklist.md`: manual process for cloning this template into a brand-new project repository.

## Need More Detail?

- `tooling/<template-slug>/template.html`: canonical markup reference for every section in that template family.
- Deployment or operational changes should follow the conventions documented in the files above; avoid duplicating instructions across docs so each source stays authoritative.
