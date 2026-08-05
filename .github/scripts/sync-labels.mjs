import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
import { fail, pass, step } from '../../scripts/lib/terminal-ui.mjs';
import { syncRepositoryLabels } from './lib/label-policy.mjs';

const token = process.env.GITHUB_TOKEN;
const repo = process.env.GITHUB_REPOSITORY;
const labels = parse(readFileSync('.github/labels.yml', 'utf8'));

if (!token || !repo) {
  fail('GITHUB_TOKEN and GITHUB_REPOSITORY are required.');
  process.exit(1);
}

async function request(path, options = {}) {
  const response = await fetch(`https://api.github.com${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'nextjs-template-label-sync',
      'X-GitHub-Api-Version': '2022-11-28',
      ...options.headers,
    },
  });

  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  const body = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(`${response.status} ${text}`);
  }

  return body;
}

await syncRepositoryLabels({ labels, request, repo, log: step });

pass('Labels synced.');
