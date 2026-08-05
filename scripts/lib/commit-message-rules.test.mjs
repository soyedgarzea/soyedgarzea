import { describe, expect, it } from 'vitest';
import { validateCommitMessage } from './commit-message-rules.mjs';

describe('validateCommitMessage', () => {
  it('accepts conventional commit with issue reference', () => {
    expect(validateCommitMessage('feat(app): add dashboard (#123)').valid).toBe(true);
  });

  it('accepts release commit', () => {
    expect(validateCommitMessage('Release v1.2.3 📦').valid).toBe(true);
  });

  it('rejects missing issue reference', () => {
    const result = validateCommitMessage('feat(app): add dashboard');

    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      'First line must end with a GitHub issue reference like (#123).',
    );
  });

  it('rejects unknown type', () => {
    const result = validateCommitMessage('wip(app): add dashboard (#123)');

    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain('Commit type must be one of:');
  });
});
