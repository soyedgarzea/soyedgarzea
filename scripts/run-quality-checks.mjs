import { spawnSync } from 'node:child_process';
import { fail, pass, step } from './lib/terminal-ui.mjs';

function bin(name) {
  return process.platform === 'win32'
    ? `node_modules/.bin/${name}.cmd`
    : `node_modules/.bin/${name}`;
}

const checks = [
  ['Format', [bin('prettier'), ['--check', '.']]],
  ['Lint', [bin('eslint'), ['.', '--max-warnings=0']]],
  ['Typecheck', [bin('tsc'), ['--noEmit']]],
  ['Tests', [bin('vitest'), ['run']]],
  ['Workflow lint', ['node', ['./scripts/run-workflow-lint.mjs']]],
  ['Build', [bin('next'), ['build']]],
];

const failures = [];

for (const [name, [command, args]] of checks) {
  step(name);
  const result = spawnSync(command, args, { stdio: 'inherit' });

  if (result.status !== 0) {
    failures.push(name);
    fail(`${name} failed.`);
  }
}

if (failures.length > 0) {
  fail(`Quality checks failed: ${failures.join(', ')}.`);
  process.exit(1);
}

pass('All quality checks passed.');
