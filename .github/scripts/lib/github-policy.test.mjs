import { describe, expect, it } from 'vitest';
import { validateBranchPolicy, validateChangePr } from './github-policy.mjs';

describe('validateBranchPolicy', () => {
  it('accepts release candidate PR into release', () => {
    const result = validateBranchPolicy({
      pull_request: {
        base: { ref: 'release' },
        head: { ref: 'release-candidate/preview' },
      },
    });

    expect(result.valid).toBe(true);
  });

  it('rejects invalid production branch and title', () => {
    const result = validateBranchPolicy({
      pull_request: {
        base: { ref: 'main' },
        head: { ref: 'feature/wrong' },
        title: 'Ship it',
      },
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('PRs to main must come from production-release/vX.Y.Z.');
    expect(result.errors).toContain('Production release PR title must be Release vX.Y.Z 📦.');
  });

  it('accepts GitHub squash PR suffix on main release pushes', () => {
    const result = validateBranchPolicy({
      ref: 'refs/heads/main',
      head_commit: { message: 'Release v1.2.3 📦 (#40)' },
    });

    expect(result.valid).toBe(true);
  });

  it('rejects non-release main push titles', () => {
    const result = validateBranchPolicy({
      ref: 'refs/heads/main',
      head_commit: { message: 'chore: bypass release (#40)' },
    });

    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain('optional GitHub PR suffix');
  });
});

describe('validateChangePr', () => {
  it('accepts approved develop PR', () => {
    const result = validateChangePr(
      {
        pull_request: {
          base: { ref: 'develop' },
          head: { ref: 'issue/123/add-ci' },
          title: 'ci: add checks (#123)',
          body: 'Closes #123',
          labels: [{ name: 'type:task' }, { name: 'status:approved' }],
        },
      },
      {
        commits: [{ sha: 'abc123', commit: { message: 'ci: add checks (#123)' } }],
      },
    );

    expect(result.valid).toBe(true);
  });

  it('accepts preview promotion PR', () => {
    const result = validateBranchPolicy({
      pull_request: {
        base: { ref: 'preview' },
        head: { ref: 'preview-candidate/develop' },
        title: 'chore(release): promote develop to preview',
      },
    });

    expect(result.valid).toBe(true);
  });

  it('blocks template PRs', () => {
    const result = validateBranchPolicy({
      pull_request: {
        base: { ref: 'template' },
        head: { ref: 'release-template/v1.2.3' },
        title: 'chore(template): regenerate template',
      },
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      'PRs to template are blocked. Regenerate the template branch by automation.',
    );
  });

  it('rejects missing label and issue', () => {
    const result = validateChangePr({
      pull_request: {
        base: { ref: 'develop' },
        head: { ref: 'bad branch' },
        title: 'add checks',
        body: '',
        labels: [],
      },
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('PRs to develop must use an accepted branch name.');
    expect(result.errors).toContain('PR title or body must reference a GitHub issue.');
    expect(result.errors).toContain('PR must include a type:* label.');
    expect(result.errors).toContain('Human PRs to develop require status:approved before merge.');
  });

  it('accepts automation sync PR with release sync labels', () => {
    const result = validateChangePr({
      pull_request: {
        base: { ref: 'develop' },
        head: { ref: 'sync/develop-v1.2.3' },
        title: 'chore(release): sync v1.2.3 back to develop',
        body: '',
        labels: [{ name: 'type:release' }, { name: 'automation:sync' }],
      },
    });

    expect(result.valid).toBe(true);
  });

  it('blocks normal develop PRs while sync PR is open', () => {
    const result = validateChangePr(
      {
        pull_request: {
          base: { ref: 'develop' },
          head: { ref: 'issue/123/add-ci' },
          title: 'ci: add checks (#123)',
          body: 'Closes #123',
          labels: [{ name: 'type:task' }, { name: 'status:approved' }],
        },
      },
      {
        commits: [{ sha: 'abc123', commit: { message: 'ci: add checks (#123)' } }],
        syncPrOpen: true,
      },
    );

    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      'Normal develop PRs are blocked while a post-release sync PR is open.',
    );
  });
});
