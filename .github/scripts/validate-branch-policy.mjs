import { readFileSync } from 'node:fs';
import { fail, pass } from '../../scripts/lib/terminal-ui.mjs';
import { validateBranchPolicy } from './lib/github-policy.mjs';

const eventPath = process.env.GITHUB_EVENT_PATH;

if (!eventPath) {
  fail('GITHUB_EVENT_PATH is required.');
  process.exit(1);
}

const event = JSON.parse(readFileSync(eventPath, 'utf8'));
const result = validateBranchPolicy(event);

if (!result.valid) {
  for (const error of result.errors) {
    fail(error);
  }
  process.exit(1);
}

pass('Branch policy accepted.');
