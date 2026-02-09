import { AsyncLocalStorage } from 'node:async_hooks';

import { expect } from 'chai';

import rollbarExpressMiddleware, {
  extractSessionId,
} from '../src/server/middleware/rollbarExpressMiddleware.js';

function makeReq(headers) {
  return { headers };
}

function makeNext(storeReader) {
  const calls = [];
  const next = () => {
    if (storeReader) {
      calls.push(storeReader());
    } else {
      calls.push('called');
    }
  };
  next.calls = calls;
  return next;
}

describe('rollbarExpressMiddleware', function () {
  let rollbar;

  beforeEach(function () {
    rollbar = {
      client: {
        asyncLocalStorage: new AsyncLocalStorage(),
      },
    };
  });

  afterEach(function () {
    rollbar.client.asyncLocalStorage = undefined;
  });

  describe('extractSessionId', function () {
    it('parses a single rollbar session id', function () {
      expect(extractSessionId('rollbar.session.id=abc123')).to.equal('abc123');
    });

    it('parses a rollbar session id among other baggage values', function () {
      const header = 'foo=bar, rollbar.session.id=abc123, baz=qux';
      expect(extractSessionId(header)).to.equal('abc123');
    });

    it('parses and decodes a URL-encoded rollbar session id', function () {
      expect(extractSessionId('rollbar.session.id=abc%20123')).to.equal(
        'abc 123',
      );
    });

    it('parses when header is an array', function () {
      const header = ['foo=bar', 'rollbar.session.id=xyz'];
      expect(extractSessionId(header)).to.equal('xyz');
    });
  });

  it('stores session id from baggage header in async local storage', function () {
    const middleware = rollbarExpressMiddleware(rollbar);
    const req = makeReq({
      baggage: 'foo=bar, rollbar.session.id=abc123, baz=qux',
    });
    const next = makeNext(() => rollbar.client.asyncLocalStorage.getStore());

    middleware(req, {}, next);

    expect(next.calls).to.have.lengthOf(1);
    expect(next.calls[0]).to.deep.equal({
      sessionId: 'abc123',
    });
  });

  it('does not set async local storage when header is missing', function () {
    const middleware = rollbarExpressMiddleware(rollbar);
    const req = makeReq();
    const next = makeNext(() => rollbar.client.asyncLocalStorage.getStore());

    middleware(req, {}, next);

    expect(next.calls).to.have.lengthOf(1);
    expect(next.calls[0]).to.equal(undefined);
  });

  it('creates async local storage when missing on rollbar', function () {
    rollbar = { client: {} };
    const middleware = rollbarExpressMiddleware(rollbar);
    const req = makeReq({ baggage: 'rollbar.session.id=xyz' });
    const next = makeNext(() => rollbar.client.asyncLocalStorage.getStore());

    middleware(req, {}, next);

    expect(next.calls).to.have.lengthOf(1);
    expect(rollbar.client.asyncLocalStorage).to.be.instanceOf(
      AsyncLocalStorage,
    );
    expect(next.calls[0]).to.deep.equal({
      sessionId: 'xyz',
    });
  });
});
