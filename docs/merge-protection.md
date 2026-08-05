# Merge Protection

Merge protection must keep human approval gates separate from automated checks.

## Develop

- Require a pull request.
- Require `Branch Policy`.
- Require `Change Policy`.
- Require `Quality Gate`.
- Require `Workflow Lint`.
- Require issue linkage.
- Require a `type:*` label.
- Require the configured human approval policy.

## Release

- Require release-candidate source branches.
- Require `Branch Policy`.
- Require `Quality Gate`.
- Require `Workflow Lint`.
- Require `Version Label`.
- Require release labels.
- Require exactly one version label.

## Preview

- Require preview-candidate source branches.
- Require `Branch Policy`.
- Require `Quality Gate`.
- Require `Workflow Lint`.
- Require `type:release`.
- Require `automation:preview`.

## Main

- Require production-release source branches.
- Require the canonical release title.
- Require `Branch Policy`.
- Require `Quality Gate`.
- Require `Release Shape`.

## Template

- Block human PRs.
- Allow only trusted automation to regenerate the branch from `main`.
- Keep `package.json` version at `0.0.1`.

Current emitted check names:

- `Quality Gate`
- `Workflow Lint`
- `Dependency Review`
- `Branch Policy`
- `Change Policy`
- `Labels Sync`
- `Preview PR`
- `Version Label`
- `Release Shape`
- `Template Branch`

GitHub branch protection must require only check names that actually exist.
Make `Dependency Review` required only when the repository supports Dependency graph and GitHub
Advanced Security.
