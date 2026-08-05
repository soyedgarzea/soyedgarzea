import { execFileSync } from 'node:child_process';

export function gitCommandOutput(output) {
  if (typeof output === 'string') {
    return output.trim();
  }

  if (Buffer.isBuffer(output)) {
    return output.toString('utf8').trim();
  }

  return '';
}

export function runGit(args, options = {}) {
  return gitCommandOutput(
    execFileSync('git', args, { encoding: 'utf8', stdio: 'pipe', ...options }),
  );
}
