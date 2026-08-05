## Target

- Target branch:
- Source branch:
- Issue:

## Summary

-

## Validation

- [ ] `pnpm validate`
- [ ] Documentation updated when behavior, workflow, or architecture changed
- [ ] Project-specific placeholders were not replaced with invented assumptions

## Principal Branch Safety

- [ ] This PR follows the allowed branch direction
- [ ] This PR does not directly push to `develop`, `preview`, `release`, `main`, or `template`
- [ ] This PR uses the correct branch-specific template when targeting a principal branch

## Merge Strategy

- Human work into `develop`: squash merge
- Preview promotion into `preview`: merge commit
- Release candidate into `release`: project release policy
- Production release into `main`: squash merge with canonical release title `Release vX.Y.Z 📦`
- Template branch updates: no PR merge; automation regenerates one clean commit

## Suggested Commit Title

`type(scope): summary (#issue)`

## Next Steps

-

## Notes Or Risks

-
