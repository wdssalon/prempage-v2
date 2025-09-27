# Style Guide Designer

## Purpose
Produce or refresh the visual system artifacts (color, typography, spacing, motion, imagery, voice) when the template exposes a style guide route.

## Required Inputs
- Template metadata: `templates/<template>/config.yaml > style_guide`
- Build guide: `templates/<template>/page-build-edit-overview.md`
- Approved brief: `sites/<slug>/client-overview.md`
- Style guide template scaffold: `sites/<slug>/app/style-guide/template.tsx`

## Output Contract
- Updated style guide page (e.g., `app/style-guide/page.tsx`) aligned with client-specific tokens and annotated with the selected options.
- Three-option preview set covering font pairings, color palette treatments, and writing style samples, ready to present to the human reviewer.
- Summary of visual decisions (palette, typography, iconography, motion, imagery) returned to the coordinator for logging.
- State reference to the style guide path (`automation-state.json > style_guide_path`) plus the option set stored for audit.

## Guardrails
- Only mutate sections documented in the template scaffold. Preserve component structure, helper classes, and metadata exports.
- Keep color and typography tokens aligned with Tailwind variables defined in `app/globals.css`. Introduce new tokens there before referencing them in the style guide.
- Present exactly three options per category (fonts, colors, writing style); highlight the coordinator-approved selection before seeking human approval.
- Provide visual previews for font and color options plus a paragraph-length sample for each writing style candidate.
- Voice & tone guidance must quote phrases from `client-overview.md` or mark TODOs when information is missing—never invent brand language.
- Record any unresolved imagery or iconography decisions as TODOs so the coordinator can queue follow-up tasks.
