/**
 * Common test utilities for server transforms tests
 */

import Rollbar from '../src/server/rollbar.js';
import { merge } from '../src/utility.js';

export class CustomError extends Rollbar.Error {
  nested: Error | null;

  constructor(message?: string, nested?: Error) {
    super(message, nested);
    this.nested = nested;
  }
}

export const nodeVersion = process.versions.node
  .split('.')
  .map((v) => parseInt(v, 10));

export const isMinNodeVersion = (major: number, minor: number): boolean =>
  nodeVersion[0] > major ||
  (nodeVersion[0] === major && nodeVersion[1] >= minor);

export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function throwInScriptFile(filepath: string): Promise<void> {
  const module = await import(filepath);
  const run = module.default as () => unknown;

  setTimeout(() => run(), 10);
  await wait(500);
}

// Base test item factory for request-related tests
export function createTestItem(
  overrides: Record<string, unknown> = {},
): Record<string, unknown> {
  const base = {
    request: {
      headers: {
        host: 'example.com',
        'x-auth-token': '12345',
      },
      protocol: 'https',
      url: '/some/endpoint',
      ip: '192.192.192.1',
      method: 'GET',
      body: {
        token: 'abc123',
        something: 'else',
      },
      user: {
        id: 42,
        email: 'fake@example.com',
      },
    },
    stuff: 'hey',
    data: { other: 'thing' },
  };

  return merge(base, overrides);
}
