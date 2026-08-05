import { pass, step } from '../../scripts/lib/terminal-ui.mjs';
import {
  branchSha,
  branchShaOrNull,
  createGithubClient,
  openPullByHead,
} from './lib/github-api.mjs';
import { buildPreviewBody } from './lib/release-policy.mjs';

const client = createGithubClient();
const head = 'preview-candidate/develop';
const base = 'preview';
const developSha = await branchSha(client, 'develop');
const previewSha = await branchShaOrNull(client, base);

if (!previewSha) {
  step('Bootstrap preview branch from develop');
  await client.upsertRef(base, developSha);
  pass('Preview branch created from develop. Future develop changes will create preview PRs.');
  process.exit(0);
}

const comparison = await client.compare(base, 'develop');

if (comparison.status === 'identical') {
  const stale = await openPullByHead(client, head, base);

  if (stale) {
    step(`Close stale preview PR #${stale.number}`);
    await client.updatePull(stale.number, { state: 'closed' });
  }

  pass('No preview changes remain.');
  process.exit(0);
}

await client.upsertRef(head, developSha);

const title = 'chore(release): promote develop to preview';
const body = buildPreviewBody({ comparison });
const labels = ['type:release', 'automation:preview'];
const existing = await openPullByHead(client, head, base);

if (existing) {
  step(`Update preview PR #${existing.number}`);
  await client.updatePull(existing.number, { title, body });
  await client.setLabels(existing.number, labels);
  pass('Preview PR updated.');
} else {
  step('Create preview PR');
  const pr = await client.createPull({ title, head, base, body, maintainer_can_modify: true });
  await client.setLabels(pr.number, labels);
  pass(`Preview PR #${pr.number} created.`);
}
