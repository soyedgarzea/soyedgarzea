import { readFileSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { parse } from 'yaml';
import { fail, pass, step } from './lib/terminal-ui.mjs';

const workflowDir = '.github/workflows';
const files = (await readdir(workflowDir)).filter(file => /\.(ya?ml)$/.test(file)).sort();
const errors = [];

for (const file of files) {
  const path = join(workflowDir, file);
  step(`Workflow lint ${path}`);

  try {
    const workflow = parse(readFileSync(path, 'utf8'));

    if (!workflow?.name) {
      errors.push(`${path}: missing workflow name.`);
    }

    if (!workflow?.on && !workflow?.['on']) {
      errors.push(`${path}: missing workflow triggers.`);
    }

    if (!workflow?.jobs || Object.keys(workflow.jobs).length === 0) {
      errors.push(`${path}: missing jobs.`);
    }
  } catch (error) {
    errors.push(`${path}: ${error.message}`);
  }
}

if (errors.length > 0) {
  for (const error of errors) {
    fail(error);
  }
  process.exit(1);
}

pass(`${files.length} workflow file(s) passed lint.`);
