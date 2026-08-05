import { execFileSync } from 'node:child_process';
import { fail, pass } from './lib/terminal-ui.mjs';
import { validateBranchPush } from './lib/protected-branches.mjs';

const branchName = execFileSync('git', ['branch', '--show-current'], {
  encoding: 'utf8',
}).trim();

const result = validateBranchPush(branchName, {
  allowOverride: process.env.ALLOW_PROTECTED_BRANCH_PUSH === '1',
});

if (!result.valid) {
  for (const error of result.errors) {
    fail(error);
  }
  process.exit(1);
}

pass(`Branch "${branchName || 'detached'}" is allowed for push.`);
