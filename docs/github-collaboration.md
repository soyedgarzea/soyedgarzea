# GitHub Collaboration

This document defines the GitHub collaboration behavior for projects created from this template.

## Issue-First Workflow

- Create an issue before implementation starts.
- Create the work branch from latest `develop`.
- Include the issue ID in the branch name when practical.
- Include the issue ID in commit messages.
- Link the PR to the issue.
- Keep release-tracking issues separate from implementation issues.
- Do not use project-specific placeholders as a replacement for real requirements.

## Required Templates

- `.github/ISSUE_TEMPLATE/bug_report.yml`
- `.github/ISSUE_TEMPLATE/feature_request.yml`
- `.github/ISSUE_TEMPLATE/engineering_task.yml`
- `.github/ISSUE_TEMPLATE/release_tracking.yml`
- `.github/pull_request_template.md`
- `.github/PULL_REQUEST_TEMPLATE/change.md`
- `.github/PULL_REQUEST_TEMPLATE/preview.md`
- `.github/PULL_REQUEST_TEMPLATE/release-candidate.md`
- `.github/PULL_REQUEST_TEMPLATE/production-release.md`

## PR Expectations

- Human change PRs target `develop`.
- Preview PRs target `preview`.
- Release-candidate PRs target `release`.
- Production-release PRs target `main`.
- Post-release sync PRs target `develop`.
- No human PRs target `template`; automation regenerates it as the default template branch.
- PR bodies must include issue linkage, validation, branch safety, merge strategy, and next steps.

## Label Expectations

- Labels are defined in `.github/labels.yml`.
- Human PRs into `develop` need a `type:*` label.
- Human PRs into `develop` need the configured approval policy before merge.
- Preview PRs need `type:release` and `automation:preview`.
- Release-candidate PRs need `type:release`, `status:in-review` while active, and exactly one
  manually selected `version:*` label before merge.
- Workflow checks must read labels directly instead of relying on GitHub Projects fields.
- Because the default branch is `template`, GitHub native closing keywords do not automatically
  close issues when PRs merge into `develop`. The `Close Linked Issues` workflow closes those linked
  issues after successful `develop` merges.

## Repository Checks

Phase 5 adds workflow checks for branch, PR, label, and validation policy:

- `Quality Gate`
- `Workflow Lint`
- `Dependency Review`
- `Branch Policy`
- `Change Policy`
- `Labels Sync`
- `Close Linked Issues`

Release automation owns preview, release-candidate, production-release, sync, and template branch
updates.

## Consuming Projects

Projects created from this template must review copied workflows, branch rulesets, labels, and PR
templates before first use. Keep template-only automation, such as `template` branch regeneration,
only when the project needs that release model. Smaller projects should disable or delete unused
automation rather than carry inactive checks.
