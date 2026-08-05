import { describe, expect, it } from 'vitest';
import { gitCommandOutput } from './git-command.mjs';

describe('git command helper', () => {
  it('trims string output', () => {
    expect(gitCommandOutput(' main\n')).toBe('main');
  });

  it('trims buffer output', () => {
    expect(gitCommandOutput(Buffer.from(' develop\n'))).toBe('develop');
  });

  it('handles ignored stdio output', () => {
    expect(gitCommandOutput(null)).toBe('');
  });
});
