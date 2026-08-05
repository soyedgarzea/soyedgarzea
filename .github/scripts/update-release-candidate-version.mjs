import { Buffer } from 'node:buffer';
import { readFileSync } from 'node:fs';
import { fail, pass, step } from '../../scripts/lib/terminal-ui.mjs';
import { createGithubClient, issueByTitle } from './lib/github-api.mjs';
import {
  buildReleaseCandidateBody,
  pullNeedsUpdate,
  releaseCandidateVersion,
  releaseIssueTitle,
  validateReleaseLabels,
  versionLabel,
} from './lib/release-policy.mjs';

function packageVersion(content) {
  const packageJson = JSON.parse(Buffer.from(content.content, 'base64').toString('utf8'));
  return packageJson.version;
}

const eventPath = process.env.GITHUB_EVENT_PATH;

if (!eventPath) {
  fail('GITHUB_EVENT_PATH is required.');
  process.exit(1);
}

const event = JSON.parse(readFileSync(eventPath, 'utf8'));
const eventPr = event.pull_request;
const client = createGithubClient();
const pr = await client.getPull(eventPr.number);
const labels = pr?.labels ?? [];
const result = validateReleaseLabels(labels);

if (!result.valid) {
  for (const error of result.errors) {
    fail(error);
  }
  process.exit(1);
}

const selectedVersionLabel = versionLabel(labels);
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

const comparison = await client.compare('release', 'preview');
const title = `release: prepare v${version}`;
const body = buildReleaseCandidateBody({
  issueNumber: issue.number,
  comparison,
  version,
  versionLabel: selectedVersionLabel,
});

if (pullNeedsUpdate(pr, { title, body })) {
  step(`Update release-candidate PR #${pr.number}`);
  await client.updatePull(pr.number, { title, body });
} else {
  pass(`Release-candidate PR #${pr.number} already matches selected version.`);
}

pass(`Release-candidate version selected: v${version}.`);
