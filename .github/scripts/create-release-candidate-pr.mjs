import { Buffer } from 'node:buffer';
import { pass, step } from '../../scripts/lib/terminal-ui.mjs';
import { branchSha, createGithubClient, issueByTitle, openPullByHead } from './lib/github-api.mjs';
import {
  buildReleaseCandidateBody,
  names,
  pendingReleaseTitle,
  releaseCandidateVersion,
  releaseIssueTitle,
  versionLabel,
} from './lib/release-policy.mjs';

function packageVersion(content) {
  const packageJson = JSON.parse(Buffer.from(content.content, 'base64').toString('utf8'));
  return packageJson.version;
}

const client = createGithubClient();
const head = 'release-candidate/preview';
const base = 'release';
const previewSha = await branchSha(client, 'preview');
const comparison = await client.compare(base, 'preview');

if (comparison.status === 'identical') {
  const stale = await openPullByHead(client, head, base);

  if (stale) {
    step(`Close stale release-candidate PR #${stale.number}`);
    await client.updatePull(stale.number, { state: 'closed' });
  }

  pass('No releasable changes remain.');
  process.exit(0);
}

await client.upsertRef(head, previewSha);

const existing = await openPullByHead(client, head, base);
const existingLabels = names(existing?.labels ?? []);
const statusLabel = existingLabels.includes('status:approved')
  ? 'status:approved'
  : 'status:in-review';
const selectedVersionLabel = versionLabel(existingLabels);
const labels = [
  'type:release',
  statusLabel,
  'automation:release-candidate',
  ...(selectedVersionLabel ? [selectedVersionLabel] : []),
];

let title = pendingReleaseTitle;
let body = buildReleaseCandidateBody({ comparison });

if (selectedVersionLabel) {
  const mainPackageContent = await client.getContentOrNull('package.json', 'main');
  const previewPackageContent = await client.getContent('package.json', 'preview');
  const version = releaseCandidateVersion({
    requestedVersion: process.env.RELEASE_VERSION,
    mainVersion: mainPackageContent ? packageVersion(mainPackageContent) : null,
    fallbackVersion: packageVersion(previewPackageContent),
    versionLabel: selectedVersionLabel,
  });
  const issueTitle = releaseIssueTitle(version);
  let issue = await issueByTitle(client, issueTitle);

  if (!issue) {
    step(`Create release tracking issue ${issueTitle}`);
    issue = await client.createIssue({
      title: issueTitle,
      labels: ['type:release', 'status:triage'],
      body: 'Release tracking issue generated after manual version-label selection.',
    });
  }

  title = `release: prepare v${version}`;
  body = buildReleaseCandidateBody({
    issueNumber: issue.number,
    comparison,
    version,
    versionLabel: selectedVersionLabel,
  });
}

if (existing) {
  step(`Update release-candidate PR #${existing.number}`);
  await client.updatePull(existing.number, { title, body });
  await client.setLabels(existing.number, labels);
  pass('Release-candidate PR updated.');
} else {
  step('Create release-candidate PR');
  const pr = await client.createPull({ title, head, base, body, maintainer_can_modify: true });
  await client.setLabels(pr.number, labels);
  pass(`Release-candidate PR #${pr.number} created.`);
}
