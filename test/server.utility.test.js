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

describe('createItem custom data cloning', function () {
  // Mirrors Express 4, which defines `req.host` as an enumerable getter on the
  // request prototype and prints a deprecation warning whenever it is read.
  function makeRequestLike() {
    const proto = {};
    let hostReads = 0;
    Object.defineProperty(proto, 'host', {
      configurable: true,
      enumerable: true,
      get() {
        hostReads += 1;
        return 'example.com';
      },
    });
    const req = Object.create(proto);
    req.method = 'GET';
    req.url = '/checkout';
    return { req, hostReads: () => hostReads };
  }

  it('does not read inherited getters of custom data', function () {
    const { req, hostReads } = makeRequestLike();

    const item = _.createItem([new Error('boom'), { request: req }]);

    expect(hostReads()).to.equal(0);
    expect(item.custom.request).to.deep.equal({
      method: 'GET',
      url: '/checkout',
    });
  });

  it('does not read inherited getters of extra args', function () {
    const { req, hostReads } = makeRequestLike();

    const item = _.createItem([new Error('boom'), { foo: 1 }, { ctx: req }]);

    expect(hostReads()).to.equal(0);
    expect(item.custom.foo).to.equal(1);
    expect(item.custom.extraArgs[0].ctx).to.deep.equal({
      method: 'GET',
      url: '/checkout',
    });
  });

  it('does not read inherited getters of rollbarContext', function () {
    const { req, hostReads } = makeRequestLike();
    const err = new Error('boom');
    err.rollbarContext = { request: req };
    const item = { data: {}, diagnostic: {} };

    _.addErrorContext(item, [err]);

    expect(hostReads()).to.equal(0);
    expect(item.data.custom.request).to.deep.equal({
      method: 'GET',
      url: '/checkout',
    });
  });

  it('still copies arrays and replaces circular references', function () {
    const custom = { list: [1, { a: 2 }] };
    custom.self = custom;

    const item = _.createItem(['message', custom]);

    expect(item.custom.list).to.deep.equal({ 0: 1, 1: { a: 2 } });
    expect(item.custom.self).to.equal('Removed circular reference: object');
  });
});
