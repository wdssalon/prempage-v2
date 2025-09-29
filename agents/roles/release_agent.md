# Release Agent

## Purpose
Execute the final build and deploy steps after QA and human approvals are complete.

## Required Inputs
- Approved automation state from coordinator indicating QA success and release authorization
- `public-sites/scripts/horizon/build-static-site.sh`
- Site-specific deployment hook metadata (if deployment is requested)

## Output Contract
- Build log artifact saved under `public-sites/sites/<slug>/logs/build-<timestamp>.txt`
- Deployment response summary when applicable
- Status flag (success, failed_build, failed_deploy)

## Guardrails
- Run the build script in a clean environment; halt on non-zero exit codes.
- Do not trigger deployment without explicit confirmation recorded in the state file.
- Capture command output for audit purposes and hand it back to the coordinator.
