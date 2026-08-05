# Documentation Index

This documentation set separates template rules from project-specific decisions.

## Read First

- [AI agent specs](./ai-agent-specs.md)

## Repository And Workflow Docs

These documents define the expected behavior before workflow files and automation scripts are added.

- [Contributing](./contributing.md)
- [GitHub collaboration](./github-collaboration.md)
- [Repository labels](./repository-labels.md)
- [Principal branch policy](./principal-branch-policy.md)
- [Merge protection](./merge-protection.md)
- [Local quality gates](./local-quality-gates.md)
- [Repository checks](./repository-checks.md)
- [Release workflow](./release-workflow.md)
- [Deployment](./deployment.md)

Current concrete GitHub files:

- `.github/ISSUE_TEMPLATE/`
- `.github/pull_request_template.md`
- `.github/PULL_REQUEST_TEMPLATE/`
- `.github/labels.yml`
- `.github/workflows/`
- `.github/scripts/`

## Project-Specific Inputs

These files intentionally contain placeholders. The consuming project must provide the real data.

- [Project inputs](./project-inputs.md)
- [Design system](./project-specific/design-system.md)
- [Domain model](./project-specific/domain-model.md)
- [Brand and content](./project-specific/brand-content.md)
- [Authentication](./project-specific/auth.md)
- [Analytics](./project-specific/analytics.md)
- [Deployment provider](./project-specific/deployment-provider.md)

## Rule

Do not replace project-specific placeholders with invented assumptions in this template. Fill them
only when creating or configuring a real project from the template.

## Template Branch

The repository development workflow starts from `develop`, but GitHub template consumers should use
the clean `template` branch. New projects may rename that branch to `main` after creation.
