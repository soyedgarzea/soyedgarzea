export const conventionalTypes = [
  'feat',
  'fix',
  'chore',
  'docs',
  'style',
  'refactor',
  'perf',
  'test',
  'ci',
  'build',
  'design',
  'content',
];

const releasePattern = /^Release v\d+\.\d+\.\d+ 📦$/;
const issuePattern = /\(#\d+\)$/;
const conventionalPattern = /^([a-z]+)(\([a-z0-9-]+\))?!?: .+/;

export function firstLine(message) {
  return message.split(/\r?\n/, 1)[0]?.trim() ?? '';
}

export function isReleaseCommitMessage(message) {
  return releasePattern.test(firstLine(message));
}

export function validateCommitMessage(message) {
  const header = firstLine(message);
  const errors = [];

  if (!header) {
    return { valid: false, errors: ['Commit message first line is required.'] };
  }

  if (isReleaseCommitMessage(message)) {
    return { valid: true, errors: [] };
  }

  const match = header.match(conventionalPattern);

  if (!match) {
    errors.push('Use conventional format: type(scope): short summary (#123).');
  } else if (!conventionalTypes.includes(match[1])) {
    errors.push(`Commit type must be one of: ${conventionalTypes.join(', ')}.`);
  }

  if (!issuePattern.test(header)) {
    errors.push('First line must end with a GitHub issue reference like (#123).');
  }

  return { valid: errors.length === 0, errors };
}
