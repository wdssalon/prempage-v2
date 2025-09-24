# New Website Repo Checklist

This playbook covers the manual steps for spinning up a brand-new website repository using the Progressive Way Therapy starter as a baseline. It is written so either a human or an automation layer can follow it; when the flow is automated later, each numbered step can become a discrete task.

## Prerequisites
- Local copy of the Progressive Way Therapy template repository (this repo).
- Git installed and authenticated with the destination provider (GitHub, GitLab, etc.).
- New project details on hand: working title, preferred directory name, Render/hosting slug, and any organization-specific requirements.
   - Template example: working title "Progressive Way Therapy", directory name `progressivewaytherapy-clarity`, remote `git@github.com:wdssalon/progressive-clarity.git`.
   - Run `git remote -v` inside the template repo to capture the baseline remote format before requesting a new project URL.

## 1. Create the project folder
1. Pick or create the parent directory that will store the new project, e.g. `~/Projects/clients/`.
2. Duplicate the template repo into the new directory (avoid copying the `.git` folder):
   ```bash
   rsync -av --exclude='.git' clarity/ new-client-site/
   ```
   - `cp -R` also works, but `rsync` makes it easy to skip Git metadata.
3. Change into the new project directory.

## 2. Initialize a fresh Git repository
1. Remove any lingering Git metadata (`rm -rf .git` if it was copied accidentally).
2. Run:
   ```bash
   git init
   git branch -M main
   git remote add origin <git-url-for-new-site>
   ```
3. Create an initial `.gitignore` if your hosting platform requires additional ignores; the starter repo is already configured for static exports.

## 3. Update project naming
1. Replace all occurrences of "Progressive Way Therapy" (and any related slugs) with the new project’s name. Recommended command:
   ```bash
   rg "Progressive Way Therapy" -l | xargs sed -i '' 's/Progressive Way Therapy/New Project Name/g'
   ```
   - Run similar replacements for slugs (e.g., `clarity` → `new-project-slug`).
2. Double-check the following hotspots:
   - `README.md` (site name, deployment notes).
   - `client-overview.md` (brand header + scope section).
   - `sites/<slug>/` HTML files (SEO metadata, structured data).
   - `sites/<slug>/overrides/custom.css` or other theme tokens that mention the old brand.

## 4. Refresh configuration files
1. Update Render (or target host) metadata inside `README.md` if deployment settings differ.
2. If the new project uses a different domain, adjust canonical URLs inside each page head during the build process.
3. Confirm the `## Approved Page Scope` block in `client-overview.md` matches the new site's page plan. Document which navigation items are parent-only triggers so the build skips generating standalone pages for them unless the user later requests one. Remove any leftover references that are specific to Progressive Way Therapy.

## 5. Reset progress trackers
1. Clear or rewrite any TODO markers carried over from the template.
2. If imagery will change, leave the placeholders but update alt-text TODOs with project-specific reminders.
3. Ensure navigation/footer links point to the upcoming page URLs (or carry TODO tags).
4. Remove the demo HTML pages from the chosen `sites/<slug>/` directory so the new build starts clean.
5. Remove the `client-overview.md` file (but keep `template/client-overview.md` which you can reference once Phase 1 work begins).

## 6. Create the initial commit
1. Review the diff to verify all brand references were updated:
   ```bash
   git status
   git diff
   ```
2. Stage and commit the baseline:
   ```bash
   git add .
   git commit -m "Initialize <Project Name> from Progressive Way Therapy template"
   ```
3. Push to the new remote:
   ```bash
   git push -u origin main
   ```

## 7. Register in Render (wip)
1. wip..

## 8. Hand off for content production
- Share the new repository URL with the content/build team.
- Move into the normal workflow starting at `generate-website.md` Phase 1 (intake and `client-overview.md`).

> **Tip:** When the flow is automated, each top-level section can become a scriptable task. For now, following the checklist in order ensures every new project starts from a clean, branded baseline.
