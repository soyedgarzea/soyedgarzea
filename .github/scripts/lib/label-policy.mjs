export function normalizeLabel(label) {
  const color = String(label.color ?? '')
    .trim()
    .replace(/^#/, '')
    .toLowerCase();

  if (!/^[0-9a-f]{6}$/.test(color)) {
    throw new Error(`Label "${label.name}" color must be a quoted 6-character hex string.`);
  }

  return {
    name: String(label.name),
    color,
    description: label.description ? String(label.description) : '',
  };
}

export function isLabelAlreadyExistsError(error) {
  const message = String(error?.message ?? '');

  if (!message.startsWith('422 ')) {
    return false;
  }

  const jsonText = message.replace(/^422\s+/, '');

  try {
    const body = JSON.parse(jsonText);
    return body.errors?.some(
      item =>
        item?.resource === 'Label' && item?.code === 'already_exists' && item?.field === 'name',
    );
  } catch {
    return false;
  }
}

export async function listAllLabels({ request, repo, perPage = 100 }) {
  const labels = [];

  for (let page = 1; ; page += 1) {
    const batch = await request(
      `/repos/${repo}/labels?${new URLSearchParams({
        per_page: String(perPage),
        page: String(page),
      })}`,
    );
    labels.push(...batch);

    if (batch.length < perPage) {
      return labels;
    }
  }
}

export async function syncRepositoryLabels({ labels, request, repo, log = () => {} }) {
  const existing = await listAllLabels({ request, repo });
  const existingByName = new Map(existing.map(label => [label.name, label]));

  for (const label of labels.map(normalizeLabel)) {
    const payload = {
      name: label.name,
      color: label.color,
      description: label.description,
    };
    const updatePath = `/repos/${repo}/labels/${encodeURIComponent(label.name)}`;

    if (existingByName.has(label.name)) {
      log(`Update label ${label.name}`);
      await request(updatePath, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
      continue;
    }

    try {
      log(`Create label ${label.name}`);
      await request(`/repos/${repo}/labels`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch (error) {
      if (!isLabelAlreadyExistsError(error)) {
        throw error;
      }

      log(`Update existing label ${label.name}`);
      await request(updatePath, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
    }
  }
}
