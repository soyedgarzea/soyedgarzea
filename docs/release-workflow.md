# Release Workflow

The template release flow is `develop -> preview -> release -> main -> develop + template`.

## Flow

1. Create an issue before implementation work starts.
2. Create a work branch from latest `develop`.
3. Open a work PR into `develop`.
4. Add required PR labels so the work PR can be reviewed and unblocked.
5. Merge the approved work PR into `develop`.
6. Automation creates or updates `preview-candidate/develop` into `preview`.
7. The preview PR summarizes all accepted changes and closed issues since `preview`.
8. Merge the preview PR into `preview`.
9. Automation creates or updates `release-candidate/preview` into `release`.
10. The release-candidate PR starts without a `version:*` label and uses
    `release: select version` until a release manager selects exactly one version label.
11. Adding exactly one `version:*` label updates the release-candidate PR title to
    `release: prepare vX.Y.Z` and creates or updates the release-tracking issue.
12. Merge the approved release-candidate PR into `release`.
13. Automation creates or updates `production-release/vX.Y.Z` into `main`.
14. The production-release PR contains exactly one commit titled `Release vX.Y.Z 📦`.
15. Merge the production-release PR into `main`.
16. Publish automation resolves the non-empty version from `main/package.json`, then creates the Git
    tag and GitHub Release.
17. Successful publication directly calls the develop-sync and template-branch workflows. This
    orchestration must not depend on a `release: published` event created by `GITHUB_TOKEN`.
18. Automation creates or updates `sync/develop-vX.Y.Z` into `develop`.
19. Automation regenerates `template` as a one-commit starter branch with `package.json` set to
    `0.0.1`.
20. Normal PRs into `develop` are blocked while the develop sync PR is open.
21. Merge the sync PR to bring release metadata back to `develop`.

## Workflows

- `.github/workflows/preview-pr.yml`
- `.github/workflows/release-candidate-pr.yml`
- `.github/workflows/release-label-guard.yml`
- `.github/workflows/production-release-pr.yml`
- `.github/workflows/production-release-guard.yml`
- `.github/workflows/publish-release.yml`
- `.github/workflows/develop-sync-pr.yml`
- `.github/workflows/template-branch.yml`

## Scripts

- `.github/scripts/create-preview-pr.mjs`
- `.github/scripts/create-release-candidate-pr.mjs`
- `.github/scripts/update-release-candidate-version.mjs`
- `.github/scripts/create-production-release-pr.mjs`
- `.github/scripts/validate-production-release-pr.mjs`
- `.github/scripts/publish-release.mjs`
- `.github/scripts/create-develop-sync-pr.mjs`
- `.github/scripts/create-template-branch.mjs`

## Check Names

- `Preview PR`
- `Version Label`
- `Release Shape`
- `Release Candidate PR`
- `Production Release PR`
- `Publish Release`
- `Develop Sync PR`
- `Template Branch`

## Rules

- Generated PRs must be idempotent.
- Release automation must update existing generated PRs instead of creating duplicates.
- Empty manual workflow inputs must be treated as missing values and fall back to safe defaults.
- Bootstrap principal branches may not have `package.json` yet; release automation must fall back to
  current branch package metadata instead of failing on missing content.
- Stale generated PRs must close when no releasable changes remain.
- Manual recovery steps must be documented when automation cannot complete safely.
- Preview PRs require `type:release` and `automation:preview`.
- Release-candidate PRs require `type:release`, either `status:in-review` or `status:approved`,
  and exactly one version label before merge.
- Generated release-candidate PRs start with `status:in-review`; release managers should add
  exactly one `version:*` label manually, then add `status:approved` before merge.
- Release-label automation fetches current PR labels after concurrent label events and increments
  from the stable version on `main`; `preview` metadata is only a bootstrap fallback.
- Generated title/body updates are idempotent and must not retrigger the release-label workflow.
- Generated release-candidate PR bodies include change summary, issue summary, required labels,
  validation, merge strategy, and next steps.
- Production release PRs must use `production-release/vX.Y.Z` and `Release vX.Y.Z 📦`.
- GitHub may append ` (#PR)` to the squash commit on `main`; branch policy accepts only that optional
  suffix while keeping the production PR title strict.
- Production release branches must be created from `main`, copy the accepted `release` tree, update
  version metadata, and contain exactly one release commit.
- Publish automation rejects empty or invalid versions and creates the GitHub Release for `vX.Y.Z`.
- `Publish Release` directly gates reusable `Develop Sync PR` and `Template Branch` workflows after
  successful publication.
- Develop sync automation creates or updates `sync/develop-vX.Y.Z`.
- Template branch automation force-regenerates `template` from `main` as one clean starter commit.
  Do not open human PRs into `template`.
- Change PR guard blocks normal PRs into `develop` while a `sync/*` PR is open.

## Recovery

If post-release orchestration fails after `main` is updated:

1. Confirm `main/package.json` contains the intended release version.
2. Remove any malformed release and tag only after confirming no consumer uses them.
3. Dispatch `Publish Release` with the intended `X.Y.Z` version. Publication is idempotent and then
   calls both downstream workflows.
4. If only one downstream step failed, dispatch `Develop Sync PR` or `Template Branch` with the same
   version.
5. Verify `template` has one commit, contains the released tree, and has package version `0.0.1`.

## Live Verification

Live release dry run requires initial pushed `develop`, `preview`, `release`, `main`, and `template`
branches. Configure GitHub template repositories to use `template` as the default branch for new
projects.
