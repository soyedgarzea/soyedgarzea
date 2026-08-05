import { describe, expect, it } from 'vitest';
import { validateBranchPush } from './protected-branches.mjs';

describe('validateBranchPush', () => {
  it('allows feature branch', () => {
    expect(validateBranchPush('issue/123/add-template').valid).toBe(true);
  });

  it('blocks protected branch', () => {
    const result = validateBranchPush('main');

    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain('Direct push to protected branch');
  });

  it('allows override', () => {
    expect(validateBranchPush('develop', { allowOverride: true }).valid).toBe(true);
  });

  it('blocks template branch', () => {
    const result = validateBranchPush('template');

    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain('Direct push to protected branch');
  });
});
