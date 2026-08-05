export const protectedBranches = ['develop', 'preview', 'release', 'main', 'template'];

export function isProtectedBranch(branchName) {
  return protectedBranches.includes(branchName);
}

export function validateBranchPush(branchName, options = {}) {
  if (!branchName) {
    return { valid: true, errors: [] };
  }

  if (options.allowOverride) {
    return { valid: true, errors: [] };
  }

  if (!isProtectedBranch(branchName)) {
    return { valid: true, errors: [] };
  }

  return {
    valid: false,
    errors: [
      `Direct push to protected branch "${branchName}" is blocked.`,
      'Open a pull request instead.',
    ],
  };
}
