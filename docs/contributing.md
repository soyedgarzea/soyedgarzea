# Contributing

This document defines the contribution contract for projects created from this template.

## Baseline

- Use `nvm use`.
- Use `pnpm install --frozen-lockfile`.
- Start human work from `develop`.
- Link work to an issue before opening a PR.
- Follow `docs/ai-agent-specs.md`.

## Validation

Run before handoff:

```bash
pnpm validate
```

## Local Gates

Phase 4 adds local hooks and scripts:

- `pnpm commit:verify <commit-msg-file>` validates commit format.
- `pnpm staged:check` runs staged checks through lint-staged.
- `pnpm branch:protect` blocks direct pushes to `develop`, `preview`, `release`, `main`, and
  `template`.
- `pnpm validate` runs format check, lint, typecheck, tests, and build.

CI workflows mirror these checks.
