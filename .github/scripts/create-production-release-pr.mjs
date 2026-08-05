import { Buffer } from 'node:buffer';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { pass, step } from '../../scripts/lib/terminal-ui.mjs';
import { branchShaOrNull, createGithubClient, openPullByHead } from './lib/github-api.mjs';
import {
  buildProductionReleaseBody,
  names,
  productionReleasePushArgs,
  productionReleaseVersion,
  releasePrTitle,
  valueOrDefault,
  versionLabel,
  versionLabels,
} from './lib/release-policy.mjs';

function git(args) {
  return execFileSync('git', args, { encoding: 'utf8', stdio: 'pipe' }).trim();
}

function eventLabels() {
  const eventPath = process.env.GITHUB_EVENT_PATH;

  if (!eventPath) {
    return [];
  }

  return eventPullRequest()?.labels ?? [];
}

function eventPullRequest() {
  const eventPath = process.env.GITHUB_EVENT_PATH;

  if (!eventPath) {
    return null;
  }

  const event = JSON.parse(readFileSync(eventPath, 'utf8'));
  return event.pull_request ?? null;
}

function packageVersion(content) {
  const packageJson = JSON.parse(Buffer.from(content.content, 'base64').toString('utf8'));
  return packageJson.version;
}

const client = createGithubClient();
const base = 'main';
const mainPackageContent = await client.getContentOrNull('package.json', base);
const releasePackageContent = await client.getContent('package.json', 'release');
const selectedVersionLabel = valueOrDefault(
  process.env.RELEASE_VERSION_LABEL,
  versionLabel(eventLabels()) ?? 'version:patch',
);

if (!versionLabels.includes(selectedVersionLabel)) {
  throw new Error(`RELEASE_VERSION_LABEL must be one of: ${versionLabels.join(', ')}.`);
}

const version = productionReleaseVersion({
  requestedVersion: process.env.RELEASE_VERSION,
  releaseCandidateTitle: eventPullRequest()?.title,
  baseVersion: mainPackageContent ? packageVersion(mainPackageContent) : null,
  fallbackVersion: packageVersion(releasePackageContent),
  versionLabel: selectedVersionLabel,
});
const head = `production-release/v${version}`;
const comparison = await client.compare(base, 'release');

if (comparison.status === 'identical' && version === packageVersion(releasePackageContent)) {
  pass('No production release diff remains.');
  process.exit(0);
}

step(`Create one-commit production branch ${head}`);
git(['fetch', 'origin', 'main', 'release']);
git(['checkout', '-B', head, 'origin/main']);
git(['read-tree', '--reset', '-u', 'origin/release']);

const nextPackageJson = {
  ...JSON.parse(readFileSync('package.json', 'utf8')),
  version,
};
writeFileSync('package.json', `${JSON.stringify(nextPackageJson, null, 2)}\n`);

git(['config', 'user.name', 'github-actions[bot]']);
git(['config', 'user.email', '41898282+github-actions[bot]@users.noreply.github.com']);
git(['add', '-A']);

try {
  git(['commit', '-m', releasePrTitle(version)]);
} catch {
  pass('Production release branch already matches requested release.');
}

const remoteHeadSha = await branchShaOrNull(client, head);
git(productionReleasePushArgs(head, remoteHeadSha));

const title = releasePrTitle(version);
const body = buildProductionReleaseBody({
  version,
  comparison,
  versionLabel: selectedVersionLabel,
});
const existing = await openPullByHead(client, head, base);
const existingLabels = names(existing?.labels ?? []);
const statusLabel = existingLabels.includes('status:approved')
  ? 'status:approved'
  : 'status:in-review';
const labels = ['type:release', statusLabel, selectedVersionLabel, 'automation:production-release'];

if (existing) {
  step(`Update production-release PR #${existing.number}`);
  await client.updatePull(existing.number, { title, body });
  await client.setLabels(existing.number, labels);
  pass('Production-release PR updated.');
} else {
  step('Create production-release PR');
  const pr = await client.createPull({ title, head, base, body, maintainer_can_modify: true });
  await client.setLabels(pr.number, labels);
  pass(`Production-release PR #${pr.number} created.`);
}
