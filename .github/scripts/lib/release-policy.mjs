export const versionLabels = ['version:patch', 'version:minor', 'version:major'];
export const releaseStatusLabels = ['status:in-review', 'status:approved'];
export const pendingReleaseTitle = 'release: select version';

export function names(labels = []) {
  return labels.map(label => (typeof label === 'string' ? label : label.name)).filter(Boolean);
}

export function versionLabel(labels = []) {
  const found = names(labels).filter(label => versionLabels.includes(label));
  return found.length === 1 ? found[0] : null;
}

export function validateReleaseLabels(labels = []) {
  const labelNames = names(labels);
  const errors = [];
  const versions = labelNames.filter(label => versionLabels.includes(label));
  const statuses = labelNames.filter(label => releaseStatusLabels.includes(label));

  if (!labelNames.includes('type:release')) {
    errors.push('Release PR requires type:release label.');
  }

  if (statuses.length === 0) {
    errors.push('Release PR requires status:in-review or status:approved label.');
  }

  if (versions.length !== 1) {
    errors.push('Release PR requires exactly one version label.');
  }

  return { valid: errors.length === 0, errors };
}

export function incrementVersion(version, label) {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)$/);

  if (!match) {
    throw new Error(`Invalid semver version: ${version}`);
  }

  const [, major, minor, patch] = match.map(Number);

  if (label === 'version:major') {
    return `${major + 1}.0.0`;
  }

  if (label === 'version:minor') {
    return `${major}.${minor + 1}.0`;
  }

  if (label === 'version:patch') {
    return `${major}.${minor}.${patch + 1}`;
  }

  throw new Error(`Unknown version label: ${label}`);
}

export function validateProductionReleasePr(pr, packageVersion) {
  const errors = [];
  const title = pr?.title ?? '';
  const head = pr?.head?.ref ?? '';
  const base = pr?.base?.ref ?? '';
  const titleMatch = title.match(/^Release v(\d+\.\d+\.\d+) 📦$/);
  const headMatch = head.match(/^production-release\/v(\d+\.\d+\.\d+)$/);

  if (base !== 'main') {
    errors.push('Production release PR must target main.');
  }

  if (!headMatch) {
    errors.push('Production release PR head must be production-release/vX.Y.Z.');
  }

  if (!titleMatch) {
    errors.push('Production release PR title must be Release vX.Y.Z 📦.');
  }

  if (titleMatch && headMatch && titleMatch[1] !== headMatch[1]) {
    errors.push('Production release PR title version must match branch version.');
  }

  if (titleMatch && packageVersion && titleMatch[1] !== packageVersion) {
    errors.push('package.json version must match release title.');
  }

  return { valid: errors.length === 0, errors };
}

export function releaseIssueTitle(version) {
  return `release: v${version}`;
}

export function releasePrTitle(version) {
  return `Release v${version} 📦`;
}

export function releaseCandidateVersionFromTitle(title) {
  return title?.match(/^release: prepare v(\d+\.\d+\.\d+)$/)?.[1] ?? null;
}

export function valueOrDefault(value, fallback) {
  return value?.trim() || fallback;
}

export function resolveReleaseVersion(requestedVersion, packageVersion) {
  const version = valueOrDefault(requestedVersion, packageVersion);

  if (!/^\d+\.\d+\.\d+$/.test(version ?? '')) {
    throw new Error(`Invalid release version: ${version || 'missing'}`);
  }

  return version;
}

export function nextVersion({ requestedVersion, baseVersion, fallbackVersion, versionLabel }) {
  const requested = valueOrDefault(requestedVersion, '');

  if (requested) {
    return requested;
  }

  if (baseVersion) {
    return incrementVersion(baseVersion, versionLabel);
  }

  if (fallbackVersion) {
    return fallbackVersion;
  }

  throw new Error('A base version or fallback version is required.');
}

export function productionReleaseVersion({
  requestedVersion,
  releaseCandidateTitle,
  baseVersion,
  fallbackVersion,
  versionLabel,
}) {
  return nextVersion({
    requestedVersion: valueOrDefault(
      requestedVersion,
      releaseCandidateVersionFromTitle(releaseCandidateTitle) ?? '',
    ),
    baseVersion,
    fallbackVersion,
    versionLabel,
  });
}

export function releaseCandidateVersion({
  requestedVersion,
  mainVersion,
  fallbackVersion,
  versionLabel,
}) {
  return nextVersion({
    requestedVersion,
    baseVersion: mainVersion,
    fallbackVersion,
    versionLabel,
  });
}

export function pullNeedsUpdate(pr, { title, body }) {
  return pr?.title !== title || (pr?.body ?? '') !== body;
}

export function productionReleasePushArgs(head, remoteSha) {
  const expectedRemoteSha = valueOrDefault(remoteSha, '');

  return [
    'push',
    `--force-with-lease=refs/heads/${head}:${expectedRemoteSha}`,
    'origin',
    `${head}:${head}`,
  ];
}

export function productionReleaseContentRef(pr) {
  return pr?.head?.sha || pr?.head?.ref;
}

export function issueRefsFromCommits(commits = []) {
  const refs = new Set();

  for (const commit of commits) {
    const message = commit.commit?.message ?? commit.message ?? '';
    for (const match of message.matchAll(/#\d+/g)) {
      refs.add(match[0]);
    }
  }

  return [...refs].sort((left, right) => Number(left.slice(1)) - Number(right.slice(1)));
}

export function changeSummaryFromCommits(commits = []) {
  return commits
    .map(commit => commit.commit?.message ?? commit.message ?? '')
    .map(message => message.split(/\r?\n/, 1)[0]?.trim())
    .filter(Boolean)
    .slice(0, 20);
}

export function buildPreviewBody({ comparison }) {
  const commits = comparison?.commits ?? [];
  const changes = changeSummaryFromCommits(commits);
  const issues = issueRefsFromCommits(commits);
  const issueSummary =
    issues.length > 0 ? issues.map(issue => `- ${issue}`).join('\n') : '- No issue refs found.';
  const changeSummary =
    changes.length > 0
      ? changes.map(change => `- ${change}`).join('\n')
      : '- No commit summary available.';

  return [
    '## Purpose',
    '',
    'Promote accepted develop changes into preview before release selection.',
    '',
    '## Summary Of Changes',
    '',
    changeSummary,
    '',
    '## Issues Closed',
    '',
    issueSummary,
    '',
    '## Generated Preview Scope',
    '',
    `Compare: ${comparison?.html_url ?? 'Comparison URL unavailable.'}`,
    '',
    '## Required Labels',
    '',
    '- [x] `type:release`',
    '- [x] `automation:preview`',
    '',
    '## Merge Strategy',
    '',
    '- [x] Merge commit into `preview` to preserve the preview boundary',
    '',
    '## Next Steps',
    '',
    '- [ ] Merge into `preview`',
    '- [ ] Create or update the release-candidate PR',
  ].join('\n');
}

export function buildReleaseCandidateBody({ issueNumber, comparison, version, versionLabel }) {
  const commits = comparison?.commits ?? [];
  const changes = changeSummaryFromCommits(commits);
  const issues = issueRefsFromCommits(commits);
  const issueSummary =
    issues.length > 0 ? issues.map(issue => `- ${issue}`).join('\n') : '- No issue refs found.';
  const changeSummary =
    changes.length > 0
      ? changes.map(change => `- ${change}`).join('\n')
      : '- No commit summary available.';

  return [
    '## Release Tracking',
    '',
    issueNumber ? `Release issue: #${issueNumber}` : 'Release issue: pending version selection',
    '',
    '## Version',
    '',
    version
      ? `Intended version: v${version}`
      : 'Intended version: pending manual `version:*` label',
    '',
    '## Summary Of Changes',
    '',
    changeSummary,
    '',
    '## Issues Closed',
    '',
    issueSummary,
    '',
    '## Generated Release Scope',
    '',
    `Compare: ${comparison?.html_url ?? 'Comparison URL unavailable.'}`,
    '',
    '## Required Labels',
    '',
    '- [x] `type:release`',
    '- [x] `status:in-review` when generated',
    '- [ ] `status:approved` before merge',
    versionLabel
      ? `- [x] \`${versionLabel}\``
      : '- [ ] Exactly one of `version:patch`, `version:minor`, or `version:major`',
    '',
    '## Validation',
    '',
    '- [ ] `pnpm validate`',
    '- [ ] Release label guard passes',
    '- [ ] Release blockers reviewed',
    '- [ ] Release notes drafted',
    '',
    '## Merge Strategy',
    '',
    '- [x] Merge commit into `release` to preserve release-candidate boundary',
    '',
    '## Next Steps',
    '',
    '- [ ] Replace or pair `status:in-review` with `status:approved` after approval',
    '- [ ] Add exactly one `version:*` label when ready to select the release version',
    '- [ ] Merge into `release`',
    '- [ ] Create or update the production-release PR',
  ].join('\n');
}

export function buildProductionReleaseBody({ version, comparison, versionLabel }) {
  return [
    '## Version',
    '',
    `Version: v${version}`,
    `Version label: \`${versionLabel}\``,
    '',
    '## Source',
    '',
    `Compare: ${comparison?.html_url ?? 'Comparison URL unavailable.'}`,
    '',
    '## Release Commit',
    '',
    `This PR must contain exactly one commit: \`Release v${version} 📦\`.`,
    '',
    '## Validation',
    '',
    '- [ ] `pnpm validate`',
    '- [ ] Production release guard passes',
    '- [ ] Release notes are final',
    '',
    '## Merge Strategy',
    '',
    '- [x] Squash merge into `main` with the exact commit title shown above',
    '',
    '## Next Steps',
    '',
    '- [ ] Merge into `main`',
    '- [ ] Publish tag and GitHub Release',
    '- [ ] Create or update `main -> develop` sync PR',
    '- [ ] Regenerate the clean `template` branch',
  ].join('\n');
}

export function buildDevelopSyncBody({ version }) {
  return [
    '## Purpose',
    '',
    `Sync production release metadata for v${version} back to develop.`,
    '',
    '## Required Labels',
    '',
    '- [x] `type:release`',
    '- [x] `automation:sync`',
    '',
    '## Validation',
    '',
    '- [ ] `pnpm validate`',
    '- [ ] Branch Policy passes',
    '- [ ] Change Policy passes',
    '',
    '## Merge Strategy',
    '',
    '- [x] Merge commit into `develop` to preserve production release ancestry',
    '',
    '## Next Steps',
    '',
    '- [ ] Merge the sync PR before normal develop work resumes',
  ].join('\n');
}
