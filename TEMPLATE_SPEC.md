# Template Blueprint Specification

This document defines the mandatory specification for all Zinns repository templates. By adhering to this specification, all repositories maintain a consistent collaboration model, automation standards, and quality gates, regardless of the underlying technology (e.g., Next.js, React Native).

## 1. GitHub Collaboration Model

- **Issue Templates**: Mandatory templates for `bug_report`, `feature_request`, `engineering_task`, and `release_tracking`.
- **PR Templates**: Mandatory templates for standard changes, release candidates, and production releases.
- **Label Policy**: Standardized repository labels (defined in `.github/labels.yml`) used as the truth for automation.
- **Branch Protection**: Strict branch protection rules enforcing `develop -> release -> main` workflow.

## 2. CI/CD and Automations

- **Workflows**:
  - `ci.yml`: Mandatory continuous integration.
  - `branch-protection-check.yml`: Enforce branch policies.
  - `change-pr-guard.yml`: Guard PRs with issue linkage and label requirements.
  - `release-candidate-pr.yml`: Automate release candidate PR creation.
  - `production-release-pr.yml`: Automate production release PR creation.
  - `publish-release.yml`: Automate release publishing (tagging and release notes).
  - `develop-sync-pr.yml`: Automate post-release sync back to `develop`.
- **Labels Guard**: Workflows that ensure release-related labels are present and correctly applied.

## 3. Local Quality Gates

- **Commit Message Validator**: Mandatory `commitlint` (or equivalent) enforcement for Conventional Commits.
- **Git Hooks**: `husky` pre-commit and commit-msg hooks required.
- **Pre-commit/push Checks**:
  - Linting (framework-specific).
  - Type checking (framework-specific).
  - Format checking (Prettier/equivalent).
  - Staged-only checks to prevent local workspace pollution.
- **Validation Runner**: A single command (e.g., `pnpm validate`) that runs all local quality checks (lint, test, build, workflow lint).

## 4. AI Agent Standards

- **Agent Rules**: Mandatory `AGENTS.md` and `docs/ai-agent-specs.md` defining interaction rules, component boundaries, and framework conventions.
- **Documentation**: All architectural decisions must be documented. Placeholder files exist for project-specific decisions (e.g., `docs/project-specific/`).

---

## Homogeneity Checklist

Use this checklist to ensure a repository complies with the Zinns template standard.

### GitHub Setup

- [ ] `.github/ISSUE_TEMPLATE/` populated and configured.
- [ ] `.github/PULL_REQUEST_TEMPLATE/` populated.
- [ ] `.github/labels.yml` synchronized.
- [ ] Mandatory workflows (`ci.yml`, `branch-protection-check.yml`, etc.) added.

### Quality and Validation

- [ ] `commitlint` configured and `commit-msg` hook active.
- [ ] `pre-commit` hook enforcing lint/format/types.
- [ ] `pnpm validate` (or equivalent) script implements full check suite.
- [ ] Workflow files have corresponding linting in the validation suite.

### Documentation and AI

- [ ] `AGENTS.md` and `docs/ai-agent-specs.md` present.
- [ ] `README.md` follows the standard documentation order.
- [ ] All `docs/project-specific/` placeholders present.

### Policies

- [ ] Branch protection rules (`develop`, `release`, `main`) active.
- [ ] Mandatory PR/Issue template requirements met.
