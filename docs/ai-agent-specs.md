# AI Agent Specs

These rules are mandatory for AI agents and coding assistants working in projects created from this
template. Read this file before editing code or docs.

## Operating Rules

- Follow `README.md`.
- Do not invent project-specific data. Use the placeholders under `docs/project-specific/` until a
  consuming project supplies real requirements.
- Keep docs updated in the same change that changes architecture, workflow, or validation behavior.
- Prefer small, scoped changes over broad refactors.
- Run the narrowest useful validation first, then `pnpm validate` before handoff when practical.

## File Structure Rules

- Component files must focus on rendering.
- Custom types must not be declared in component files.
- Component props must live in adjacent `*.types.ts` files.
- Static component data must live in adjacent `*.data.ts` files.
- Hooks must live in `*.hook.ts`, `*.hooks.ts`, or a feature-level hooks file.
- Validation schemas must live in `*.schema.ts` files.
- Server-only adapters must live under `server/` or a clearly named server-only module.
- Framework-neutral business logic must live under `lib/`, `domain/`, or a feature-level module.

## TypeScript Rules

- Keep `strict` TypeScript enabled.
- Avoid `any`.
- Use `unknown` for untrusted data and narrow it deliberately.
- Export public types from their owning `*.types.ts` file.
- Keep route params, search params, API payloads, and view models typed explicitly.
- Do not use type assertions to bypass validation.

## React And Next.js Rules

- Use the App Router.
- Server Components are the default.
- Add `"use client"` only for browser APIs, event handlers, local state, refs, effects, or client
  hooks.
- Push client components as low in the tree as practical.
- Keep route files focused on composition, metadata, and data loading.
- Keep data fetching out of reusable client UI components.
- Use Route Handlers for public APIs, webhooks, uploads, and streaming.
- Use Server Actions only for in-app mutations when the security model is clear.

## Hook Rules

- Hooks must be small and purpose-specific.
- Hooks must not hide unrelated business workflows.
- Hooks must not fetch server-only secrets or access server-only modules.
- Expensive derived values inside client hooks should use `useMemo` when inputs are stable.
- Callbacks returned by hooks should use `useCallback` when consumers depend on stable identity.
- Effects must synchronize with external systems; do not use effects for ordinary derived state.

## Performance Rules

- Treat performance as a core requirement.
- Prefer Server Components and static rendering where practical.
- Memoize expensive derived client values.
- Memoize callbacks passed to memoized children, providers, or dependency-sensitive hooks.
- Use `memo` only when props are stable and re-render reduction is meaningful.
- Split state to avoid re-rendering large page sections for small interactions.
- Dynamically import heavy client-only modules.
- Use virtualization for long lists.
- Avoid remote build-time dependencies such as externally fetched fonts.
- Explain performance tradeoffs in the PR when a feature is intentionally not optimized.

## Data And Validation Rules

- Validate all external input at the boundary.
- Treat request bodies, query strings, form data, environment variables, and third-party responses as
  untrusted.
- Convert external payloads into internal models before complex rendering.
- Keep parsing and transformation logic testable without React.
- Keep secrets server-only.

## Documentation Rules

- If a coding rule changes, update this file.
- If a decision depends on the consuming project, add or update a placeholder under
  `docs/project-specific/`.

## GitHub Workflow Rules

- Human work should start from `develop`.
- Human PRs should target `develop`.
- Preview PRs target `preview`.
- Release-candidate PRs target `release`.
- Production release PRs target `main`.
- Post-release sync PRs target `develop`.
- Successful publish automation must directly gate develop sync and template regeneration; do not
  rely on events emitted by `GITHUB_TOKEN` to start downstream workflows.
- Template branch updates must be automation-only and keep `package.json` at `0.0.1`.
- Do not collapse human approval policy and automation checks into the same rule.
