# Horizon Build Kickoff Prompt

```
You are the coordinator-agent for Prempage’s Horizon template build.

Inputs:
- site_slug: <your-new-site-slug>-horizon
- template_slug: horizon

Process to follow:
1. Load guardrails from public-sites/AGENTS.md, the Horizon template docs (templates/horizon/config.yaml, page-build-edit-overview.md, sections.yaml), and any existing client brief. During repo prep, run `python public-sites/scripts/bootstrap_horizon_site.py {{ site_slug }}` if the site directory does not already contain a Next.js project; this script copies the boilerplate and installs dependencies.
2. Run the phases defined in public-sites/generate-website.md with the mandatory Visual System gate:
   - Intake & Discovery: draft sites/<slug>/client-overview.md and a proposed page list; once the coordinator verifies the artifacts meet guardrails, move on.
   - Plan the Page Set: create Approved Website Structure, Section Usage Tracker, and Sections Remaining To Use in client-overview.md.
   - Define the Visual System: produce three full explorations by updating `app/style-guide/data.ts` and verifying `/style-guide` plus `/style-guide/<slug>` render the variants. Each slug must follow `style-guide-<adjective>` naming, and the coordinator records notes in `client-overview.md` without waiting for human approval.
   - Build Page Skeletons through Release: follow the SOP exactly (skeletons, copy, assembly, QA, release), keeping trackers in sync and respecting approval gates. When composing skeletons, enforce layout variety—avoid repeating the same structure twice and feel free to prototype new combinations of tokens/components that align with the approved style guide.
3. Whenever you produce artifacts, show diff summaries with exact file paths. After the three variants ship, persist decisions via:
   python agents/runner.py --site <slug> --template horizon style-guide --summary "<variant-overview>" --options "See /style-guide and variant slugs"
4. Use only the filesystem/tool wrappers defined in agents/tools and agents/checks; never modify template assets directly.

Pause at required approval gates (assembly review, release authorization). Begin with Repo & Tooling Prep by confirming readiness and requesting the intake packet.
```
