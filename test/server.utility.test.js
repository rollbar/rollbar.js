import { AsyncLocalStorage } from 'node:async_hooks';

import { expect } from 'chai';

import * as _ from '../src/utility.js';

describe('getSessionIdFromAsyncLocalStorage', function () {
  it('should return session id from async local storage', function () {
    const storage = new AsyncLocalStorage();
    const rollbar = { asyncLocalStorage: storage };

    storage.run({ sessionId: 'abc123' }, () => {
      expect(_.getSessionIdFromAsyncLocalStorage(rollbar)).to.equal('abc123');
    });
  });

  it('should return null when async local storage is missing', function () {
    expect(_.getSessionIdFromAsyncLocalStorage({})).to.equal(null);
  });

  it('should return null when session id is missing', function () {
    const storage = new AsyncLocalStorage();
    const rollbar = { asyncLocalStorage: storage };

    storage.run({}, () => {
      expect(_.getSessionIdFromAsyncLocalStorage(rollbar)).to.equal(null);
    });
  });
});
