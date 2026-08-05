import { readFileSync } from 'node:fs';
import { fail, pass } from '../../scripts/lib/terminal-ui.mjs';
import { validateChangePr } from './lib/github-policy.mjs';

const eventPath = process.env.GITHUB_EVENT_PATH;
const token = process.env.GITHUB_TOKEN;

if (!eventPath) {
  fail('GITHUB_EVENT_PATH is required.');
  process.exit(1);
}

const event = JSON.parse(readFileSync(eventPath, 'utf8'));
let commits = [];
let syncPrOpen = false;

async function github(path) {
  const response = await fetch(`https://api.github.com${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'User-Agent': 'nextjs-template-policy',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub API failed: ${response.status} ${await response.text()}`);
  }

  return response.json();
}

if (token && event.repository?.full_name && event.pull_request?.number) {
  const repo = event.repository.full_name;
  commits = await github(`/repos/${repo}/pulls/${event.pull_request.number}/commits`);
  const developPrs = await github(`/repos/${repo}/pulls?state=open&base=develop&per_page=100`);
  syncPrOpen = developPrs.some(
    pr => pr.number !== event.pull_request.number && pr.head?.ref?.startsWith('sync/'),
  );
}

const result = validateChangePr(event, { commits, syncPrOpen });

if (!result.valid) {
  for (const error of result.errors) {
    fail(error);
  }
  process.exit(1);
}

pass('Change PR policy accepted.');
