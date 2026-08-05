# Deployment

Deployment behavior is a handoff between the template and the consuming project.

This template defines deployment policy. It does not choose a hosting provider, project ID, domain,
team, secret store, or environment map.

## Template-Owned Rules

- Hosting runtime must match `.nvmrc` and `package.json` engines.
- CI uses `.nvmrc`; deployment providers must be configured to the same Node.js version.
- GitHub Actions should not duplicate provider-owned deployments by default.
- Temporary release automation branches should not create unnecessary deployments.
- Secrets must not be committed.
- `.env.example` contains safe placeholders only.
- Provider-specific deployment settings must live in `docs/project-specific/deployment-provider.md`
  or in provider-owned dashboards/configuration supplied by the consuming project.

## Runtime Alignment

Use the latest official Node.js LTS version pinned in:

- `.nvmrc`
- `package.json` `engines.node`
- GitHub Actions `actions/setup-node` through `node-version-file: ".nvmrc"`
- Hosting provider runtime settings

When the latest official Node.js LTS changes, update all runtime references together in the same
maintenance change. Do not run production deployments with Current, odd-numbered, or non-LTS Node
versions.

## Deployment Ownership

Default ownership:

- GitHub Actions owns validation, branch policy, release guards, and GitHub release publishing.
- The hosting provider owns preview, staging, and production deployments.
- The consuming project owns domains, provider project IDs, environment names, secret values, and
  branch-to-environment mapping.

Add GitHub Actions deployment jobs only when the consuming project documents a provider or custom
deployment requirement that cannot be handled by provider Git integration.

## Branch Deployment Policy

Permanent branches:

- `develop`: integration branch. Usually maps to a development or preview environment.
- `preview`: accepted preview branch before release selection. Usually maps to a shared preview or
  staging preview environment.
- `release`: accepted release-candidate branch. Usually maps to staging or release preview.
- `main`: production branch. Usually maps to production.
- `template`: clean template-consumer branch. Usually should not deploy.

Temporary automation branches:

- `preview-candidate/*`
- `release-candidate/*`
- `production-release/*`
- `sync/*`

Temporary automation branches should be excluded from provider deployments when the provider supports
branch allowlists or deployment exclusions. They exist to move code through repository governance,
not to create public deploys.

Example provider exclusion shape:

```json
{
  "deploymentEnabled": {
    "preview-candidate/*": false,
    "release-candidate/*": false,
    "production-release/*": false,
    "template": false,
    "sync/*": false
  }
}
```

Do not copy this object directly unless the consuming project's provider supports this exact config
shape. Store provider-specific syntax in `docs/project-specific/deployment-provider.md`.

## Environment Variables

Rules:

- Commit `.env.example` with safe placeholders only.
- Never commit real `.env`, `.env.local`, `.env.production`, `.env.development`, or provider-generated
  env files.
- Server-only variables must not use the `NEXT_PUBLIC_` prefix.
- Client-exposed variables must use `NEXT_PUBLIC_` and must never contain secrets.
- Required variables must be documented before a feature depends on them.
- Missing required server configuration should fail fast at startup or request boundary.

Safe placeholder format:

```text
VARIABLE_NAME="replace-in-consuming-project"
NEXT_PUBLIC_VARIABLE_NAME="replace-in-consuming-project"
```

## Deployment Readiness Checklist

Before a consuming project enables deployments:

- Fill `docs/project-specific/deployment-provider.md`.
- Confirm hosting Node.js runtime matches `.nvmrc`.
- Configure branch-to-environment mapping.
- Exclude temporary automation branches where supported.
- Add required secrets in the provider secret store.
- Keep `.env.example` synchronized with required variable names.
- Run `pnpm validate`.
- Open a test PR and verify provider preview behavior.
- Promote through `develop -> preview -> release -> main` once release automation is live. Use
  `template` only as the clean GitHub template source branch.

## Project-Owned Inputs

Provider-specific data should come from the consuming project:

- Hosting provider.
- Project ID.
- Domains.
- Environment names.
- Branch-to-environment mapping.
- Preview deployment policy.
- Temporary branch exclusion syntax.
- Secret names and values.
- Rollback process.
- Manual promotion process when automation is unavailable.

Use `docs/project-specific/deployment-provider.md` for provider-specific details.
