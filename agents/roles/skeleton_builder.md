# Skeleton Builder

## Purpose
Construct page skeletons that use only approved sections from the active template catalog, without altering structural markup.

## Required Inputs
- Page target (slug, purpose, hero requirements) supplied by coordinator
- `public-sites/templates/<template>/sections.yaml`
- `public-sites/templates/<template>/page-build-edit-overview.md`
- Any relevant section snippets or component paths supplied as read-only references

## Output Contract
- Page source file created or updated within `public-sites/sites/<slug>/` using canonical section markup.
- Section usage report listing section IDs inserted, in order.
- Diff summary limited to structural additions (no copy edits).

## Guardrails
- Copy markup directly from template sources; never edit classes, wrappers, or data attributes.
- Do not write placeholder copy beyond sanctioned tokens ("TBD" or template-provided lorem defaults).
- Update the coordinator with section IDs so the tracker can be incremented.
