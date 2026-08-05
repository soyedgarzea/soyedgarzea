# Repository Checks

Phase 5 mirrors local gates in GitHub Actions.

## Workflows

- `.github/workflows/ci.yml`
- `.github/workflows/branch-protection-check.yml`
- `.github/workflows/change-pr-guard.yml`
- `.github/workflows/close-linked-issues.yml`
- `.github/workflows/labels-sync.yml`
- `.github/workflows/preview-pr.yml`
- `.github/workflows/release-candidate-pr.yml`
- `.github/workflows/production-release-pr.yml`
- `.github/workflows/publish-release.yml`
- `.github/workflows/develop-sync-pr.yml`
- `.github/workflows/template-branch.yml`

## Check Names

- `Quality Gate`
- `Workflow Lint`
- `Dependency Review`
- `Branch Policy`
- `Change Policy`
- `Close Linked Issues`
- `Labels Sync`
- `Preview PR`
- `Release Candidate PR`
- `Version Label`
- `Production Release PR`
- `Release Shape`
- `Publish Release`
- `Develop Sync PR`
- `Template Branch`

## Rules

- Required check names must match emitted job names.
- Human PRs into `develop` require issue linkage, a `type:*` label, and `status:approved`.
- Merged PRs into `develop` close linked issues through `Close Linked Issues` because `template` is
  the repository default branch.
- Normal PRs into `develop` are blocked while a post-release sync PR is open.
- PRs into `template` are blocked; automation regenerates `template` as a clean starter branch.
- Main release pushes accept GitHub's optional squash `(#PR)` suffix but reject other commit titles.
- Post-release sync and template jobs run only after successful publication and remain manually
  dispatchable for recovery.
- Automation checks run independently from human approval gates.
- Workflow files are linted locally through `pnpm workflow:lint`.
- Label sync reads `.github/labels.yml` as source of truth.
- Dependency Review is advisory unless the repository supports Dependency graph and GitHub Advanced
  Security; only then should branch protection require it.

## Validation

Local validation includes:

```bash
pnpm workflow:lint
pnpm validate
```

Live validation requires initial `develop`, `preview`, `release`, `main`, and `template` branches
and a test PR into `develop`.
