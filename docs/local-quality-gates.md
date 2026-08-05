# Local Quality Gates

Phase 4 local gates catch common mistakes before GitHub.

## Hooks

- `.husky/commit-msg`: validates commit message format and issue reference.
- `.husky/pre-commit`: runs all staged checks, reports every failing staged gate, and blocks the
  commit when at least one staged gate fails.
- `.husky/pre-push`: blocks protected branch pushes and runs full validation.

## Scripts

- `pnpm commit:verify <commit-msg-file>`
- `pnpm staged:check`
- `pnpm branch:protect`
- `pnpm validate`

## Commit Rules

Normal commits must use:

```text
type(scope): short summary (#123)
```

Release commits may use:

```text
Release vX.Y.Z 📦
```

Accepted commit types:

- `feat`
- `fix`
- `chore`
- `docs`
- `style`
- `refactor`
- `perf`
- `test`
- `ci`
- `build`
- `design`
- `content`

## Branch Rules

Direct pushes are blocked for:

- `develop`
- `release`
- `main`

Use pull requests for those branches. Emergency override exists through
`ALLOW_PROTECTED_BRANCH_PUSH=1`, but normal project work should not use it.

## Validation Order

`pnpm validate` runs:

1. Prettier format check.
2. ESLint.
3. TypeScript typecheck.
4. Vitest tests.
5. Workflow lint.
6. Production build.

The validation runner continues through every configured gate, reports all failed gates, and exits
with a failing status when one or more gates fail.
