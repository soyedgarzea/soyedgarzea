# Principal Branch Policy

The template uses five permanent branches.

## Branches

- `develop`: integration branch for human work.
- `preview`: non-versioned preview branch for accepted `develop` changes.
- `release`: accepted release-candidate branch.
- `main`: versioned release-history branch.
- `template`: clean default branch for GitHub template consumers.

## Allowed PR Directions

- Working branch -> `develop`
- `develop` -> `preview`
- `preview` -> `release`
- `release` -> `main`
- `main` -> `develop`
- `main` -> `template` through automation-only branch regeneration

## Rules

- Human work starts from latest `develop`.
- Human work targets `develop`.
- Preview automation targets `preview`.
- Release-candidate automation targets `release`.
- Production-release automation targets `main`.
- Post-release sync automation targets `develop`.
- Template branch automation force-regenerates `template`; human PRs into `template` are blocked.
- Direct pushes to principal branches must be blocked locally and in GitHub.

## Branch Formats

Human branches:

- `issue/123/short-description`
- `issue-123-short-description`
- `type/short-description`

Automation branches:

- `preview-candidate/develop`
- `release-candidate/preview`
- `production-release/vX.Y.Z`
- `sync/develop-vX.Y.Z`
- `dependabot/*`

## Merge Policy

- Human work into `develop` uses squash merge.
- Preview promotions into `preview` use merge commits.
- Release candidates into `release` use merge commits.
- Production releases into `main` use squash merge with `Release vX.Y.Z 📦`.
- Template branch updates are not PR-merged; automation recreates one clean starter commit.
