import { readFileSync, readdirSync } from 'node:fs';
import { parse } from 'yaml';
import { describe, expect, it } from 'vitest';

function workflow(name) {
  return parse(readFileSync(`.github/workflows/${name}`, 'utf8'));
}

describe('release workflow orchestration', () => {
  it('gates develop sync and template update on successful publication', () => {
    const publish = workflow('publish-release.yml');

    expect(publish.jobs['develop-sync-pr'].needs).toBe('publish-release');
    expect(publish.jobs['develop-sync-pr'].uses).toBe('./.github/workflows/develop-sync-pr.yml');
    expect(publish.jobs['template-branch'].needs).toBe('publish-release');
    expect(publish.jobs['template-branch'].uses).toBe('./.github/workflows/template-branch.yml');
  });

  it('keeps post-release workflows reusable and manually recoverable', () => {
    for (const name of ['develop-sync-pr.yml', 'template-branch.yml']) {
      const triggers = workflow(name).on;

      expect(triggers.workflow_call).toBeDefined();
      expect(triggers.workflow_dispatch).toBeDefined();
      expect(triggers.release).toBeUndefined();
    }
  });

  it('does not retrigger release label automation from generated PR edits', () => {
    const triggers = workflow('release-label-guard.yml').on.pull_request.types;

    expect(triggers).toContain('labeled');
    expect(triggers).toContain('unlabeled');
    expect(triggers).not.toContain('edited');
  });

  it('uses current checkout and Node setup action majors', () => {
    const workflowFiles = readdirSync('.github/workflows').filter(name => name.endsWith('.yml'));

    for (const name of workflowFiles) {
      const source = readFileSync(`.github/workflows/${name}`, 'utf8');

      expect(source).not.toContain('actions/checkout@v4');
      expect(source).not.toContain('actions/setup-node@v4');
    }
  });

  it('bypasses local hooks for the generated template branch commit', () => {
    const source = readFileSync('.github/scripts/create-template-branch.mjs', 'utf8');

    expect(source).toContain(
      "runGit(['commit', '--no-verify', '-m', 'initial commit from template'])",
    );
  });
});
