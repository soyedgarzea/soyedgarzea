import { Buffer } from 'node:buffer';
import { appendFileSync } from 'node:fs';
import { fail, pass, step } from '../../scripts/lib/terminal-ui.mjs';
import { createGithubClient } from './lib/github-api.mjs';
import { resolveReleaseVersion } from './lib/release-policy.mjs';

const client = createGithubClient();
const packageContent = await client.getContent('package.json', 'main');
const packageJson = JSON.parse(Buffer.from(packageContent.content, 'base64').toString('utf8'));
const version = resolveReleaseVersion(process.env.RELEASE_VERSION, packageJson.version);
const tag = `v${version}`;

if (process.env.GITHUB_OUTPUT) {
  appendFileSync(process.env.GITHUB_OUTPUT, `version=${version}\n`);
}

try {
  await client.getReleaseByTag(tag);
  pass(`Release ${tag} already exists.`);
} catch (error) {
  if (!String(error.message).startsWith('404')) {
    fail(error.message);
    process.exit(1);
  }

  step(`Create GitHub Release ${tag}`);
  await client.createRelease({
    tag_name: tag,
    target_commitish: 'main',
    name: tag,
    body: `Release ${tag}`,
    draft: false,
    prerelease: false,
  });
  pass(`Release ${tag} created.`);
}
