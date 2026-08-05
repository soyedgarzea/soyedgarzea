import { readFileSync } from 'node:fs';
import { pass, step } from '../../scripts/lib/terminal-ui.mjs';
import { createGithubClient } from './lib/github-api.mjs';
import {
  closingIssueNumbersFromPullRequest,
  shouldCloseIssuesForEvent,
} from './lib/issue-closing-policy.mjs';

const eventPath = process.env.GITHUB_EVENT_PATH;

if (!eventPath) {
  throw new Error('GITHUB_EVENT_PATH is required.');
}

const event = JSON.parse(readFileSync(eventPath, 'utf8'));
const pullRequest = event.pull_request;

if (!shouldCloseIssuesForEvent(event)) {
  pass('No develop merge detected; linked issue closure skipped.');
  process.exit(0);
}

const client = createGithubClient();
const commits = await client.request(`/repos/${client.repo}/pulls/${pullRequest.number}/commits`);
const issueNumbers = closingIssueNumbersFromPullRequest({ pullRequest, commits });

if (issueNumbers.length === 0) {
  pass('No closing issue references found.');
  process.exit(0);
}

for (const issueNumber of issueNumbers) {
  const issue = await client.request(`/repos/${client.repo}/issues/${issueNumber}`);

  if (issue.pull_request) {
    step(`Skip #${issueNumber}; reference points to a pull request.`);
    continue;
  }

  if (issue.state === 'closed') {
    step(`Skip #${issueNumber}; issue already closed.`);
    continue;
  }

  step(`Close linked issue #${issueNumber}`);
  await client.request(`/repos/${client.repo}/issues/${issueNumber}/comments`, {
    method: 'POST',
    body: JSON.stringify({
      body: `Closed after PR #${pullRequest.number} was merged into \`develop\`. The repository default branch is \`template\`, so GitHub native closing keywords do not close develop-targeted PR issues automatically.`,
    }),
  });
  await client.request(`/repos/${client.repo}/issues/${issueNumber}`, {
    method: 'PATCH',
    body: JSON.stringify({ state: 'closed', state_reason: 'completed' }),
  });
}

pass(`Processed ${issueNumbers.length} linked issue reference(s).`);
