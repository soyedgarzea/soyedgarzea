import { describe, expect, it } from 'vitest';
import {
  isLabelAlreadyExistsError,
  listAllLabels,
  normalizeLabel,
  syncRepositoryLabels,
} from './label-policy.mjs';

describe('label policy', () => {
  it('normalizes quoted hex colors', () => {
    expect(normalizeLabel({ name: 'type:task', color: '5319E7' })).toEqual({
      name: 'type:task',
      color: '5319e7',
      description: '',
    });
  });

  it('rejects YAML-parsed numeric colors', () => {
    expect(() => normalizeLabel({ name: 'type:task', color: 53190000000 })).toThrow(
      'Label "type:task" color must be a quoted 6-character hex string.',
    );
  });

  it('detects duplicate label create errors', () => {
    const error = new Error(
      '422 {"message":"Validation Failed","errors":[{"resource":"Label","code":"already_exists","field":"name"}]}',
    );

    expect(isLabelAlreadyExistsError(error)).toBe(true);
  });

  it('paginates existing labels', async () => {
    const request = async path => {
      const page = new URL(`https://example.test${path}`).searchParams.get('page');
      return page === '1' ? [{ name: 'a' }, { name: 'b' }] : [];
    };

    await expect(listAllLabels({ request, repo: 'owner/repo', perPage: 2 })).resolves.toEqual([
      { name: 'a' },
      { name: 'b' },
    ]);
  });

  it('updates when create races with an existing label', async () => {
    const calls = [];
    const request = async (path, options = {}) => {
      calls.push({ path, method: options.method ?? 'GET' });

      if (path.startsWith('/repos/owner/repo/labels?')) {
        return [];
      }

      if (path === '/repos/owner/repo/labels' && options.method === 'POST') {
        throw new Error(
          '422 {"message":"Validation Failed","errors":[{"resource":"Label","code":"already_exists","field":"name"}]}',
        );
      }

      return {};
    };

    await syncRepositoryLabels({
      labels: [{ name: 'automation:preview', color: '0052cc', description: 'Preview flow.' }],
      request,
      repo: 'owner/repo',
    });

    expect(calls).toEqual([
      { path: '/repos/owner/repo/labels?per_page=100&page=1', method: 'GET' },
      { path: '/repos/owner/repo/labels', method: 'POST' },
      { path: '/repos/owner/repo/labels/automation%3Apreview', method: 'PATCH' },
    ]);
  });
});
