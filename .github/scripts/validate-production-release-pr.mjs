import { Buffer } from 'node:buffer';
import { readFileSync } from 'node:fs';
import { fail, pass } from '../../scripts/lib/terminal-ui.mjs';
import { createGithubClient } from './lib/github-api.mjs';
import {
  productionReleaseContentRef,
  validateProductionReleasePr,
  validateReleaseLabels,
} from './lib/release-policy.mjs';

const eventPath = process.env.GITHUB_EVENT_PATH;

if (!eventPath) {
  fail('GITHUB_EVENT_PATH is required.');
  process.exit(1);
}

const event = JSON.parse(readFileSync(eventPath, 'utf8'));
const pr = event.pull_request;
const client = createGithubClient();
const packageContent = await client.getContent('package.json', productionReleaseContentRef(pr));
const packageJson = JSON.parse(Buffer.from(packageContent.content, 'base64').toString('utf8'));
const labelResult = validateReleaseLabels(pr.labels ?? []);
const prResult = validateProductionReleasePr(pr, packageJson.version);
const commits = await client.request(`/repos/${client.repo}/pulls/${pr.number}/commits`);
const errors = [...labelResult.errors, ...prResult.errors];

if (commits.length !== 1) {
  errors.push('Production release PR must contain exactly one release commit.');
}

if (commits[0]?.commit?.message?.split(/\r?\n/, 1)[0] !== pr.title) {
  errors.push('Production release commit title must match PR title.');
}

if (errors.length > 0) {
  for (const error of errors) {
    fail(error);
  }
  process.exit(1);
}

pass('Production release PR accepted.');
