const closingRefPattern = /\b(?:close[sd]?|fix(?:e[sd])?|resolve[sd]?)\s*:?\s+#(?<number>\d+)\b/gi;

export function shouldCloseIssuesForEvent(event) {
  const pr = event?.pull_request;
  return Boolean(pr?.merged === true && pr?.base?.ref === 'develop');
}

export function closingIssueNumbersFromText(value) {
  const refs = new Set();

  for (const match of String(value ?? '').matchAll(closingRefPattern)) {
    refs.add(Number(match.groups.number));
  }

  return [...refs].filter(Number.isSafeInteger);
}

export function closingIssueNumbersFromPullRequest({ pullRequest, commits = [] }) {
  const values = [
    pullRequest?.title,
    pullRequest?.body,
    ...commits.map(commit => commit.commit?.message ?? commit.message),
  ];
  const refs = new Set(values.flatMap(closingIssueNumbersFromText));

  return [...refs].sort((left, right) => left - right);
}
