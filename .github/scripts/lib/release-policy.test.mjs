import { describe, expect, it } from 'vitest';
import {
  buildReleaseCandidateBody,
  buildDevelopSyncBody,
  buildPreviewBody,
  buildProductionReleaseBody,
  changeSummaryFromCommits,
  incrementVersion,
  issueRefsFromCommits,
  nextVersion,
  productionReleasePushArgs,
  productionReleaseContentRef,
  productionReleaseVersion,
  pullNeedsUpdate,
  releaseCandidateVersion,
  releaseCandidateVersionFromTitle,
  releaseIssueTitle,
  releasePrTitle,
  resolveReleaseVersion,
  valueOrDefault,
  validateProductionReleasePr,
  validateReleaseLabels,
  versionLabel,
} from './release-policy.mjs';

describe('release policy', () => {
  it('requires release labels and one version label', () => {
    expect(validateReleaseLabels(['type:release', 'status:in-review', 'version:minor']).valid).toBe(
      true,
    );

    expect(validateReleaseLabels(['type:release', 'status:approved', 'version:minor']).valid).toBe(
      true,
    );

    expect(validateReleaseLabels(['type:release', 'version:patch', 'version:minor']).valid).toBe(
      false,
    );
  });

  it('finds exactly one version label', () => {
    expect(versionLabel(['type:release', 'version:patch'])).toBe('version:patch');
    expect(versionLabel(['version:patch', 'version:minor'])).toBeNull();
  });

  it('increments versions', () => {
    expect(incrementVersion('1.2.3', 'version:patch')).toBe('1.2.4');
    expect(incrementVersion('1.2.3', 'version:minor')).toBe('1.3.0');
    expect(incrementVersion('1.2.3', 'version:major')).toBe('2.0.0');
  });

  it('chooses requested version before automatic versions', () => {
    expect(
      nextVersion({
        requestedVersion: '2.0.0',
        baseVersion: '1.2.3',
        fallbackVersion: '1.2.3',
        versionLabel: 'version:minor',
      }),
    ).toBe('2.0.0');
  });

  it('increments base version when principal branch has package metadata', () => {
    expect(
      nextVersion({
        requestedVersion: '',
        baseVersion: '1.2.3',
        fallbackVersion: '9.9.9',
        versionLabel: 'version:patch',
      }),
    ).toBe('1.2.4');
  });

  it('uses fallback version for bootstrap principal branches without package metadata', () => {
    expect(
      nextVersion({
        requestedVersion: '',
        baseVersion: null,
        fallbackVersion: '0.1.0',
        versionLabel: 'version:patch',
      }),
    ).toBe('0.1.0');
  });

  it('requires either base or fallback version', () => {
    expect(() =>
      nextVersion({
        requestedVersion: '',
        baseVersion: null,
        fallbackVersion: null,
        versionLabel: 'version:patch',
      }),
    ).toThrow('A base version or fallback version is required.');
  });

  it('validates production release PR shape', () => {
    const result = validateProductionReleasePr(
      {
        title: 'Release v1.2.3 📦',
        base: { ref: 'main' },
        head: { ref: 'production-release/v1.2.3' },
      },
      '1.2.3',
    );

    expect(result.valid).toBe(true);
  });

  it('builds release titles', () => {
    expect(releaseIssueTitle('1.2.3')).toBe('release: v1.2.3');
    expect(releasePrTitle('1.2.3')).toBe('Release v1.2.3 📦');
  });

  it('extracts selected release-candidate version', () => {
    expect(releaseCandidateVersionFromTitle('release: prepare v1.0.0')).toBe('1.0.0');
    expect(releaseCandidateVersionFromTitle('release: select version')).toBeNull();
  });

  it('uses release-candidate version before package fallback for production', () => {
    expect(
      productionReleaseVersion({
        requestedVersion: '',
        releaseCandidateTitle: 'release: prepare v1.0.0',
        baseVersion: null,
        fallbackVersion: '0.1.0',
        versionLabel: 'version:major',
      }),
    ).toBe('1.0.0');
  });

  it('increments release candidates from stable main version', () => {
    expect(
      releaseCandidateVersion({
        requestedVersion: '',
        mainVersion: '0.2.0',
        fallbackVersion: '0.1.0',
        versionLabel: 'version:minor',
      }),
    ).toBe('0.3.0');
  });

  it('updates generated PR content only when title or body changed', () => {
    const pr = { title: 'release: prepare v0.3.0', body: 'Generated body' };

    expect(pullNeedsUpdate(pr, pr)).toBe(false);
    expect(pullNeedsUpdate(pr, { ...pr, title: 'release: prepare v0.4.0' })).toBe(true);
    expect(pullNeedsUpdate(pr, { ...pr, body: 'Updated body' })).toBe(true);
  });

  it('uses an explicit lease when updating production release branches', () => {
    expect(productionReleasePushArgs('production-release/v1.0.0', 'abc123')).toEqual([
      'push',
      '--force-with-lease=refs/heads/production-release/v1.0.0:abc123',
      'origin',
      'production-release/v1.0.0:production-release/v1.0.0',
    ]);
  });

  it('protects missing production release branches with an empty lease', () => {
    expect(productionReleasePushArgs('production-release/v1.0.0', null)).toEqual([
      'push',
      '--force-with-lease=refs/heads/production-release/v1.0.0:',
      'origin',
      'production-release/v1.0.0:production-release/v1.0.0',
    ]);
  });

  it('falls back when workflow inputs resolve to empty strings', () => {
    expect(valueOrDefault('', 'version:patch')).toBe('version:patch');
    expect(valueOrDefault('   ', '0.1.0')).toBe('0.1.0');
    expect(valueOrDefault('version:minor', 'version:patch')).toBe('version:minor');
  });

  it('resolves non-empty release versions from workflow input or package metadata', () => {
    expect(resolveReleaseVersion('1.2.3', '1.2.2')).toBe('1.2.3');
    expect(resolveReleaseVersion('', '1.2.2')).toBe('1.2.2');
    expect(() => resolveReleaseVersion('', 'main')).toThrow('Invalid release version: main');
  });

  it('uses immutable production PR head SHA for content reads', () => {
    expect(
      productionReleaseContentRef({
        head: { ref: 'production-release/v1.2.3', sha: 'abc123' },
      }),
    ).toBe('abc123');
    expect(productionReleaseContentRef({ head: { ref: 'production-release/v1.2.3' } })).toBe(
      'production-release/v1.2.3',
    );
  });

  it('summarizes release candidate commits and issue refs', () => {
    const commits = [
      { commit: { message: 'feat(app): add dashboard (#12)' } },
      { commit: { message: 'fix(auth): refresh token (#9)\n\nBody' } },
    ];

    expect(changeSummaryFromCommits(commits)).toEqual([
      'feat(app): add dashboard (#12)',
      'fix(auth): refresh token (#9)',
    ]);
    expect(issueRefsFromCommits(commits)).toEqual(['#9', '#12']);
  });

  it('builds a preview body', () => {
    const body = buildPreviewBody({
      comparison: {
        html_url: 'https://github.com/example/repo/compare/preview...develop',
        commits: [{ commit: { message: 'fix(flow): adjust release policy (#16)' } }],
      },
    });

    expect(body).toContain('## Summary Of Changes');
    expect(body).toContain('- fix(flow): adjust release policy (#16)');
    expect(body).toContain('## Merge Strategy');
    expect(body).toContain('Merge commit into `preview`');
  });

  it('builds a meaningful release-candidate body', () => {
    const body = buildReleaseCandidateBody({
      issueNumber: 7,
      version: '1.2.3',
      versionLabel: 'version:minor',
      comparison: {
        html_url: 'https://github.com/example/repo/compare/release...develop',
        commits: [{ commit: { message: 'feat(app): add dashboard (#12)' } }],
      },
    });

    expect(body).toContain('## Summary Of Changes');
    expect(body).toContain('- feat(app): add dashboard (#12)');
    expect(body).toContain('## Issues Closed');
    expect(body).toContain('- #12');
    expect(body).toContain('## Merge Strategy');
    expect(body).toContain('`status:approved` before merge');
    expect(body).toContain('Intended version: v1.2.3');
    expect(body).toContain('`version:minor`');
  });

  it('builds a pending release-candidate body before version selection', () => {
    const body = buildReleaseCandidateBody({
      comparison: {
        html_url: 'https://github.com/example/repo/compare/release...preview',
        commits: [],
      },
    });

    expect(body).toContain('Release issue: pending version selection');
    expect(body).toContain('Intended version: pending manual `version:*` label');
    expect(body).toContain('Exactly one of `version:patch`, `version:minor`, or `version:major`');
  });

  it('builds production release body with one-commit rule', () => {
    const body = buildProductionReleaseBody({
      version: '1.2.3',
      versionLabel: 'version:minor',
      comparison: {
        html_url: 'https://github.com/example/repo/compare/main...release',
      },
    });

    expect(body).toContain('Version: v1.2.3');
    expect(body).toContain('Version label: `version:minor`');
    expect(body).toContain('exactly one commit: `Release v1.2.3 📦`');
    expect(body).toContain('## Merge Strategy');
    expect(body).toContain('Squash merge into `main`');
  });

  it('builds develop sync body with required policy sections', () => {
    const body = buildDevelopSyncBody({ version: '1.2.3' });

    expect(body).toContain('## Required Labels');
    expect(body).toContain('`type:release`');
    expect(body).toContain('`automation:sync`');
    expect(body).toContain('## Merge Strategy');
    expect(body).toContain('Merge commit into `develop`');
  });
});
