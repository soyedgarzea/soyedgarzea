## Production Release PR

Target branch: `main`

Generated source branch: `production-release/vX.Y.Z`

## Version

Version: `vX.Y.Z`

Source release-candidate PR: #

Release issue: #

## Required Labels

- [ ] `type:release`
- [ ] `status:in-review`
- [ ] Exactly one version label is present

## Validation

- [ ] `pnpm validate`
- [ ] Production release guard passes
- [ ] Release notes are final
- [ ] Version metadata matches the release title while `main` is versioned

## Principal Branch Safety

- [ ] Source branch starts with `production-release/`
- [ ] Target branch is `main`
- [ ] PR title uses the canonical release title

## Merge Strategy

- [ ] Squash merge

## Required Squash Commit Title

`Release vX.Y.Z 📦`

## Release Notes

-

## Next Steps

- [ ] Publish tag and GitHub Release after merge
- [ ] Create or update `main -> develop` sync PR
- [ ] Regenerate the clean `template` branch
- [ ] Update the release-tracking issue

## Notes Or Risks

-
