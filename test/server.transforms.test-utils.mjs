/**
 * Common test utilities for server transforms tests
 */

import Rollbar from '../src/server/rollbar.js';
import merge from '../src/merge.js';

export class CustomError extends Rollbar.Error {
  constructor(message, nested) {
    super(message, nested);
  }
}

export const nodeVersion = process.versions.node
  .split('.')
  .map((v) => parseInt(v));

export const isMinNodeVersion = (major, minor) =>
  nodeVersion[0] > major ||
  (nodeVersion[0] === major && nodeVersion[1] >= minor);

export async function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function throwInScriptFile(filepath) {
  // Dynamic imports inside setTimeout with async/await can create timing
  // issues where the error escapes before Rollbar's handler can catch it.
  const module = await import(filepath);
  setTimeout(() => module.default(), 10);
  await wait(500);
}

// Base test item factory for request-related tests
export function createTestItem(overrides = {}) {
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
