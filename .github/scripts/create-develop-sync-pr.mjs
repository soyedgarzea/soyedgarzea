import { Buffer } from 'node:buffer';
import { pass, step } from '../../scripts/lib/terminal-ui.mjs';
import { branchSha, createGithubClient, openPullByHead } from './lib/github-api.mjs';
import { buildDevelopSyncBody, resolveReleaseVersion } from './lib/release-policy.mjs';

const client = createGithubClient();
const mainPackageContent = await client.getContent('package.json', 'main');
const mainPackageJson = JSON.parse(
  Buffer.from(mainPackageContent.content, 'base64').toString('utf8'),
);
const version = resolveReleaseVersion(process.env.RELEASE_VERSION, mainPackageJson.version);
const head = `sync/develop-v${version}`;
const base = 'develop';
const mainSha = await branchSha(client, 'main');
const comparison = await client.compare(base, 'main');

if (comparison.status === 'identical') {
  pass('Develop already contains production release metadata.');
  process.exit(0);
}

await client.upsertRef(head, mainSha);

const title = `chore(release): sync v${version} back to develop`;
const body = buildDevelopSyncBody({ version });

const existing = await openPullByHead(client, head, base);

if (existing) {
  step(`Update develop sync PR #${existing.number}`);
  await client.updatePull(existing.number, { title, body });
  await client.addLabels(existing.number, ['type:release', 'automation:sync']);
  pass('Develop sync PR updated.');
} else {
  step('Create develop sync PR');
  const pr = await client.createPull({ title, head, base, body, maintainer_can_modify: true });
  await client.addLabels(pr.number, ['type:release', 'automation:sync']);
  pass(`Develop sync PR #${pr.number} created.`);
}
