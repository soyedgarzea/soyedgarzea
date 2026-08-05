import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fail, pass } from './lib/terminal-ui.mjs';
import { isReleaseCommitMessage, validateCommitMessage } from './lib/commit-message-rules.mjs';

const messagePath = process.argv[2];

if (!messagePath) {
  fail('Commit message file path is required.');
  process.exit(1);
}

const message = readFileSync(messagePath, 'utf8');
const result = validateCommitMessage(message);

if (!result.valid) {
  for (const error of result.errors) {
    fail(error);
  }
  process.exit(1);
}

if (!isReleaseCommitMessage(message)) {
  const commitlintBin =
    process.platform === 'win32'
      ? 'node_modules/.bin/commitlint.cmd'
      : 'node_modules/.bin/commitlint';
  const commitlint = spawnSync(commitlintBin, ['--edit', messagePath], { stdio: 'inherit' });

  if (commitlint.status !== 0) {
    process.exit(commitlint.status ?? 1);
  }
}

pass('Commit message accepted.');
