import { readFileSync, writeFileSync } from 'node:fs';
import { pass, step } from '../../scripts/lib/terminal-ui.mjs';
import { runGit } from './lib/git-command.mjs';
import { releasePrTitle, resolveReleaseVersion } from './lib/release-policy.mjs';

const branch = 'template';
const buildBranch = 'template-build';
const currentPackageJson = JSON.parse(readFileSync('package.json', 'utf8'));
const version = resolveReleaseVersion(process.env.RELEASE_VERSION, currentPackageJson.version);

step(`Regenerate ${branch} branch from main release v${version}`);
runGit(['fetch', 'origin', 'main']);
runGit(['checkout', '--orphan', buildBranch]);
runGit(['rm', '-rf', '.'], { stdio: 'ignore' });
runGit(['checkout', 'origin/main', '--', '.']);

const packageJson = {
  ...JSON.parse(readFileSync('package.json', 'utf8')),
  version: '0.0.1',
};
writeFileSync('package.json', `${JSON.stringify(packageJson, null, 2)}\n`);

runGit(['config', 'user.name', 'github-actions[bot]']);
runGit(['config', 'user.email', '41898282+github-actions[bot]@users.noreply.github.com']);
runGit(['add', '-A']);
runGit(['commit', '--no-verify', '-m', 'initial commit from template']);
runGit(['push', '--force', 'origin', `${buildBranch}:${branch}`]);

pass(`${branch} branch regenerated from ${releasePrTitle(version)} with package version 0.0.1.`);
