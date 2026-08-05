import { execFileSync, spawnSync } from 'node:child_process';
import { fail, pass, step } from './lib/terminal-ui.mjs';

const stagedFiles = execFileSync('git', ['diff', '--cached', '--name-only', '--diff-filter=ACMR'], {
  encoding: 'utf8',
})
  .split(/\r?\n/)
  .filter(Boolean);

if (stagedFiles.length === 0) {
  pass('No staged files to check.');
  process.exit(0);
}

step(`Checking ${stagedFiles.length} staged file(s).`);

function bin(name) {
  return process.platform === 'win32'
    ? `node_modules/.bin/${name}.cmd`
    : `node_modules/.bin/${name}`;
}

function matches(filePath, extensions) {
  return extensions.some(extension => filePath.endsWith(extension));
}

const codeFiles = stagedFiles.filter(filePath =>
  matches(filePath, ['.js', '.jsx', '.mjs', '.cjs', '.ts', '.tsx']),
);
const formatFiles = stagedFiles.filter(filePath =>
  matches(filePath, ['.json', '.md', '.css', '.yml', '.yaml']),
);
const checks = [
  ['Staged ESLint', bin('eslint'), ['--max-warnings=0', ...codeFiles], codeFiles.length],
  ['Staged Prettier', bin('prettier'), ['--check', ...formatFiles], formatFiles.length],
];
const failures = [];

for (const [name, command, args, fileCount] of checks) {
  if (fileCount === 0) {
    pass(`${name} skipped; no matching files.`);
    continue;
  }

  step(`${name} on ${fileCount} file(s).`);
  const result = spawnSync(command, args, { stdio: 'inherit' });

  if (result.status !== 0) {
    failures.push(name);
    fail(`${name} failed.`);
  }
}

if (failures.length > 0) {
  fail(`Staged checks failed: ${failures.join(', ')}.`);
  process.exit(1);
}

pass('All staged checks passed.');
