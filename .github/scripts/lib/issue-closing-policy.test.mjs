import { describe, expect, it } from 'vitest';
import {
  closingIssueNumbersFromPullRequest,
  closingIssueNumbersFromText,
  shouldCloseIssuesForEvent,
} from './issue-closing-policy.mjs';

describe('issue closing policy', () => {
  it('detects closing references', () => {
    expect(closingIssueNumbersFromText('Closes #19, fixes: #23 and Resolved #42')).toEqual([
      19, 23, 42,
    ]);
  });

  it('ignores non-closing references', () => {
    expect(closingIssueNumbersFromText('Refs #19 and related to #23')).toEqual([]);
  });

  it('collects unique sorted issue refs from PR and commits', () => {
    expect(
      closingIssueNumbersFromPullRequest({
        pullRequest: {
          title: 'fix(labels): handle duplicates',
          body: 'Closes #19',
        },
        commits: [
          { commit: { message: 'fix(labels): fallback on duplicate create\n\nFixes #23' } },
          { commit: { message: 'docs: mention issue #19' } },
        ],
      }),
    ).toEqual([19, 23]);
  });

  it('runs only for merged develop PRs', () => {
    expect(
      shouldCloseIssuesForEvent({
        pull_request: { merged: true, base: { ref: 'develop' } },
      }),
    ).toBe(true);

    expect(
      shouldCloseIssuesForEvent({
        pull_request: { merged: true, base: { ref: 'template' } },
      }),
    ).toBe(false);

    expect(
      shouldCloseIssuesForEvent({
        pull_request: { merged: false, base: { ref: 'develop' } },
      }),
    ).toBe(false);
  });
});
