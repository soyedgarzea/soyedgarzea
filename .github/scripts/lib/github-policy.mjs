const issueRefPattern = /#\d+/;
const releaseCommitPattern = /^Release v\d+\.\d+\.\d+ 📦(?: \(#\d+\))?$/;
const branchPatterns = [
  /^issue\/\d+\/[a-z0-9][a-z0-9-]*$/,
  /^issue-\d+-[a-z0-9][a-z0-9-]*$/,
  /^(feat|fix|chore|docs|style|refactor|perf|test|ci|build|design|content)\/[a-z0-9][a-z0-9-]*$/,
  /^dependabot\/.+$/,
];

export function labelNames(labels = []) {
  return labels.map(label => (typeof label === 'string' ? label : label.name)).filter(Boolean);
}

export function hasIssueReference(...values) {
  return values.filter(Boolean).some(value => issueRefPattern.test(value));
}

export function isAcceptedHumanBranch(branchName) {
  return branchPatterns.some(pattern => pattern.test(branchName));
}

export function validateBranchPolicy(event) {
  const errors = [];

  if (event.pull_request) {
    const pr = event.pull_request;
    const base = pr.base?.ref;
    const head = pr.head?.ref;
    const title = pr.title ?? '';

    if (
      base === 'develop' &&
      ['develop', 'preview', 'release', 'main', 'template'].includes(head)
    ) {
      errors.push('PRs to develop must not come from a protected principal branch.');
    }

    if (base === 'preview' && head !== 'preview-candidate/develop') {
      errors.push('PRs to preview must come from preview-candidate/develop.');
    }

    if (base === 'release' && !head?.startsWith('release-candidate/')) {
      errors.push('PRs to release must come from release-candidate/*.');
    }

    if (base === 'main') {
      if (!/^production-release\/v\d+\.\d+\.\d+$/.test(head ?? '')) {
        errors.push('PRs to main must come from production-release/vX.Y.Z.');
      }

      if (!/^Release v\d+\.\d+\.\d+ 📦$/.test(title)) {
        errors.push('Production release PR title must be Release vX.Y.Z 📦.');
      }
    }

    if (base === 'template') {
      errors.push('PRs to template are blocked. Regenerate the template branch by automation.');
    }
  }

  if (event.ref === 'refs/heads/main') {
    const message = event.head_commit?.message?.split(/\r?\n/, 1)[0] ?? '';

    if (!releaseCommitPattern.test(message)) {
      errors.push(
        'Pushes to main must use release commit title Release vX.Y.Z 📦 with an optional GitHub PR suffix.',
      );
    }
  }

  return { valid: errors.length === 0, errors };
}

export function validateChangePr(event, options = {}) {
  const pr = event.pull_request;

  if (!pr || pr.base?.ref !== 'develop') {
    return { valid: true, errors: [] };
  }

  const errors = [];
  const labels = labelNames(pr.labels);
  const head = pr.head?.ref ?? '';
  const title = pr.title ?? '';
  const body = pr.body ?? '';
  const commits = options.commits ?? [];

  if (head.startsWith('sync/')) {
    if (!labels.includes('type:release')) {
      errors.push('Develop sync PR requires type:release label.');
    }

    if (!labels.includes('automation:sync')) {
      errors.push('Develop sync PR requires automation:sync label.');
    }

    return { valid: errors.length === 0, errors };
  }

  if (!isAcceptedHumanBranch(head)) {
    errors.push('PRs to develop must use an accepted branch name.');
  }

  if (!hasIssueReference(title, body)) {
    errors.push('PR title or body must reference a GitHub issue.');
  }

  if (!labels.some(label => label.startsWith('type:'))) {
    errors.push('PR must include a type:* label.');
  }

  if (!labels.includes('status:approved')) {
    errors.push('Human PRs to develop require status:approved before merge.');
  }

  for (const commit of commits) {
    const message = commit.commit?.message ?? commit.message ?? '';
    const firstLine = message.split(/\r?\n/, 1)[0] ?? '';

    if (!hasIssueReference(firstLine)) {
      errors.push(`Commit "${commit.sha ?? firstLine}" must reference an issue in the first line.`);
    }
  }

  if (options.syncPrOpen) {
    errors.push('Normal develop PRs are blocked while a post-release sync PR is open.');
  }

  return { valid: errors.length === 0, errors };
}
