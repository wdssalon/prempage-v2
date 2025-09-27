# Guardrails

## Purpose
Centralize the non-negotiable rules for the `public-sites` workspace. Every coordinator and role agent must load this file before touching a site bundle so automation and human passes stay aligned.

## Core References
- `public-sites/agents/coordinator.md` – phase sequencing, approval gates, and dispatch responsibilities.
- `public-sites/agents/roles/` – per-role checklists and deliverables.
- `public-sites/templates/<template>/config.yaml` – structured metadata, component catalogs, and template plugins.
- `public-sites/templates/<template>/template-supplement.md` or equivalent (for example `horizon/page-build-edit-overview.md`) – template-specific overrides layered on top of these guardrails.
- `public-sites/sites/<slug>/client-overview.md` – site brief, trackers, and approved navigation.
- `public-sites/templates/<template>/agents/plugins.yaml` – toggles for optional stages, tooling, and workflow extensions.

## Repository Layout
- `public-sites/sites/<slug>/` – production-ready site bundles. Treat each directory as the source of truth for that client. Keep edits scoped to the active site slug.
- `public-sites/templates/` – reusable assets per template family: config, catalog files, sample client overview, template supplements, and optional automation hooks.
- `public-sites/scripts/` – vetted helper scripts (bootstrap, extract, export, asset sync/upload). Only run scripts referenced here or surfaced by template plugins.
- Root docs (`README.md`, `CLAUDE.md`) point back to this guardrail file; keep authoritative guidance here to avoid divergence.

## Editing Rules
- Work inside the approved site slug and template directories only. Never touch template catalogs, starter shells, or compiled output except when a template supplement explicitly instructs you to do so.
- Keep `client-overview.md` strictly ASCII. Replace smart quotes, em/en dashes, and other Unicode glyphs before saving.
- Use the canonical sections or components the template provides. Copy markup verbatim (including wrapper divs, data attributes, icons, and hidden nodes) or import the shared React component. Do not recreate structure by hand.
- Update literal copy, alt text, and links only. When you need additional list items or cards, duplicate the template element rather than altering the surrounding structure.
- Maintain the trackers inside `client-overview.md`: `Approved Website Structure`, `Section Usage Tracker`, and `Sections Remaining To Use`. Update them immediately after each page-level change.
- Treat navigation and footers as global assets. Once finalized, propagate changes through the shared component or HTML block, not per page.
- Use template-defined commands for imagery and assets (`images/images-overview.md`, asset sync/upload scripts). Leave `src` attributes in place until imagery is explicitly requested.

## Workflow Expectations
- Follow the phase order enforced by the coordinator: Prep → Intake → Planning → (optional) Visual System → Skeletons → Copy → Assembly → QA → Release. Do not skip or merge phases without coordinator approval.
- Require human approval after Intake (client overview + page list) and before Release. Capture all checkpoints in `automation-state.json`.
- Template plugins (`templates/<template>/agents/plugins.yaml`) may enable/disable stages, scripts, or tools. Always read plugin overrides before executing optional steps.

## Overrides & Theming
- Introduce new tokens or styles via the template’s sanctioned extension points (for example Tailwind config, `app/globals.css`, or `overrides/` directories). Never edit compiled bundles (`.next/`, `dist/`, `css/`, `js/` output).
- When a template exposes icon or asset libraries, stick to the documented packages. Log any new selections in `client-overview.md` so downstream passes stay consistent.
- Register fonts, analytics, or script loaders using the template’s provider hooks (`app/layout.tsx`, `app/providers.tsx`, etc.). Avoid ad hoc script tags.

## Assets & Deployment
- Store raw imagery in `sites/<slug>/images/` (gitignored). Run `pnpm run assets:sync` before local previews or builds when the template enables the asset pipeline.
- Use `public-sites/scripts/build-static-site.sh <slug>` for exportable bundles. When Bunny/CDN uploads are enabled, run `pnpm run assets:upload` from the site directory and retain resulting manifests under `public-sites/dist/<slug>/`.
- Never remove or rename generated manifests (`asset-manifest.json`, `assets-manifest.cdn.json`) without coordinating with the release agent. Deployment jobs depend on their format and location.

## Collaboration
- Surface blockers immediately—do not guess when requirements are unclear or approvals are missing.
- Document open questions, TODOs, and pending approvals inside `client-overview.md` or the coordinator’s status summary so every agent inherits the same context.
- When you discover a new guardrail, update this file instead of scattering instructions across other docs.

Adhering to these guardrails keeps human and AI contributors aligned and protects template integrity across every site build.
