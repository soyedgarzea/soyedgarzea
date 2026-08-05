## Release-Candidate PR

Target branch: `release`

Generated source branch: `release-candidate/preview`

## Release Tracking

Release issue: #

## Summary Of Changes

-

## Issues Closed

-

## Generated Release Scope

-

## Required Labels

- [ ] `type:release`
- [ ] `status:in-review` while review is active
- [ ] `status:approved` before merge
- [ ] Exactly one version label:
  - [ ] `version:patch`
  - [ ] `version:minor`
  - [ ] `version:major`

## Validation

- [ ] `pnpm validate`
- [ ] Release label guard passes
- [ ] Release blockers reviewed
- [ ] Release notes drafted

## Principal Branch Safety

- [ ] Source branch starts with `release-candidate/`
- [ ] Target branch is `release`
- [ ] Source changes already passed through `preview`
- [ ] No unrelated production-only changes are included

## Merge Strategy

- [ ] Merge commit into `release` to preserve the release-candidate boundary

## Release Notes Draft

-

## Next Steps

- [ ] After merge to `release`, create or update the production-release PR
- [ ] Keep the release-tracking issue updated

## Notes Or Risks

-
