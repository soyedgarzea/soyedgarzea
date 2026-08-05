export function requiredEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required.`);
  }

  return value;
}

export function createGithubClient({
  token = requiredEnv('GITHUB_TOKEN'),
  repo = requiredEnv('GITHUB_REPOSITORY'),
} = {}) {
  async function request(path, options = {}) {
    const response = await fetch(`https://api.github.com${path}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'nextjs-template-release-automation',
        'X-GitHub-Api-Version': '2022-11-28',
        ...options.headers,
      },
    });

    if (response.status === 204) {
      return null;
    }

    const text = await response.text();
    const body = text ? JSON.parse(text) : null;

    if (!response.ok) {
      throw new Error(`${response.status} ${text}`);
    }

    return body;
  }

  return {
    repo,
    request,
    getRef(branch) {
      return request(`/repos/${repo}/git/ref/heads/${encodeURIComponent(branch)}`);
    },
    async getRefOrNull(branch) {
      try {
        return await request(`/repos/${repo}/git/ref/heads/${encodeURIComponent(branch)}`);
      } catch (error) {
        if (String(error.message).startsWith('404')) {
          return null;
        }

        throw error;
      }
    },
    async upsertRef(branch, sha) {
      try {
        await request(`/repos/${repo}/git/refs`, {
          method: 'POST',
          body: JSON.stringify({ ref: `refs/heads/${branch}`, sha }),
        });
      } catch (error) {
        if (!String(error.message).startsWith('422')) {
          throw error;
        }

        await request(`/repos/${repo}/git/refs/heads/${encodeURIComponent(branch)}`, {
          method: 'PATCH',
          body: JSON.stringify({ sha, force: true }),
        });
      }
    },
    compare(base, head) {
      return request(
        `/repos/${repo}/compare/${encodeURIComponent(base)}...${encodeURIComponent(head)}`,
      );
    },
    listPulls(params) {
      return request(`/repos/${repo}/pulls?${new URLSearchParams(params)}`);
    },
    getPull(number) {
      return request(`/repos/${repo}/pulls/${number}`);
    },
    createPull(body) {
      return request(`/repos/${repo}/pulls`, { method: 'POST', body: JSON.stringify(body) });
    },
    updatePull(number, body) {
      return request(`/repos/${repo}/pulls/${number}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      });
    },
    addLabels(number, labels) {
      return request(`/repos/${repo}/issues/${number}/labels`, {
        method: 'POST',
        body: JSON.stringify({ labels }),
      });
    },
    setLabels(number, labels) {
      return request(`/repos/${repo}/issues/${number}/labels`, {
        method: 'PUT',
        body: JSON.stringify({ labels }),
      });
    },
    listIssues(params) {
      return request(`/repos/${repo}/issues?${new URLSearchParams(params)}`);
    },
    createIssue(body) {
      return request(`/repos/${repo}/issues`, { method: 'POST', body: JSON.stringify(body) });
    },
    getContent(path, ref) {
      return request(
        `/repos/${repo}/contents/${encodeURIComponent(path)}?${new URLSearchParams({ ref })}`,
      );
    },
    async getContentOrNull(path, ref) {
      try {
        return await request(
          `/repos/${repo}/contents/${encodeURIComponent(path)}?${new URLSearchParams({ ref })}`,
        );
      } catch (error) {
        if (String(error.message).startsWith('404')) {
          return null;
        }

        throw error;
      }
    },
    createRelease(body) {
      return request(`/repos/${repo}/releases`, { method: 'POST', body: JSON.stringify(body) });
    },
    getReleaseByTag(tag) {
      return request(`/repos/${repo}/releases/tags/${encodeURIComponent(tag)}`);
    },
  };
}

export async function branchSha(client, branch) {
  const ref = await client.getRef(branch);
  return ref.object.sha;
}

export async function branchShaOrNull(client, branch) {
  const ref = await client.getRefOrNull(branch);
  return ref?.object.sha ?? null;
}

export async function openPullByHead(client, head, base) {
  const pulls = await client.listPulls({
    state: 'open',
    head: `${client.repo.split('/')[0]}:${head}`,
    base,
  });
  return pulls[0] ?? null;
}

export async function issueByTitle(client, title) {
  const issues = await client.listIssues({
    state: 'open',
    labels: 'type:release',
    per_page: '100',
  });
  return issues.find(issue => issue.title === title) ?? null;
}
