import { expect } from 'chai';

import Rollbar from '../src/browser/rollbar.js';
import * as t from '../src/browser/transforms.js';

// Cause (for Error)
// Error with cause is supported in +ES2022
interface Cause {
  cause?: Error;
}

function TestClientGen() {
  const TestClient = function () {
    this.notifier = {
      addTransform: function () {
        return this.notifier;
      }.bind(this),
    };
    this.queue = {
      addPredicate: function () {
        return this.queue;
      }.bind(this),
    };
  };
  return TestClient;
}

function itemFromArgs(args) {
  const client = new (TestClientGen())();
  const rollbar = new Rollbar({ autoInstrument: false }, client);
  const item = (rollbar as any)._createItem(args);
  item.level = 'debug';
  return item;
}

function chromeMajorVersion() {
  return parseInt(navigator.userAgent.match(/Chrome\/([0-9]+)\./)[1]);
}

describe('handleDomException', function () {
  it('should do nothing if not a DOMException', function (done) {
    const err = new Error('test');
    const args = ['a message', err];
    const item = itemFromArgs(args);
    const options = {};
    t.handleDomException(item, options, function (e, _i) {
      expect(item.err).to.eql(item.err);
      expect(item.err.nested).to.not.be.ok;
      done(e);
    });
  });
  it('should create nested exception for DOMException', function (done) {
    const err = new DOMException('dom error');
    const args = ['a message', err];
    const item = itemFromArgs(args);
    const options = {};
    t.handleDomException(item, options, function (e, _i) {
      expect(item.err.nested.constructor.name).to.eql('DOMException');
      expect(item.err.constructor.name).to.eql('Error');
      done(e);
    });
  });
});
describe('handleItemWithError', function () {
  it('should do nothing if there is no err', function (done) {
    const args = ['a message'];
    const item = itemFromArgs(args);
    const options = {};
    t.handleItemWithError(item, options, function (e, i) {
      expect(i).to.eql(item);
      done(e);
    });
  });
  it('should set stack info from error if it is already saved', function (done) {
    const err = new Error('bork') as Error & { _savedStackTrace?: any };
    const myTrace = { trace: { frames: [1, 2, 3] } };
    err._savedStackTrace = myTrace;
    const args = ['a message', err];
    const item = itemFromArgs(args);
    const options = {};
    t.handleItemWithError(item, options, function (e, i) {
      expect(i.stackInfo).to.eql(myTrace);
      done(e);
    });
  });
  it('should set stack info from error', function (done) {
    let err;
    try {
      throw new Error('bork');
    } catch (e) {
      err = e;
    }
    const args = ['a message', err];
    const item = itemFromArgs(args);
    const options = {};
    t.handleItemWithError(item, options, function (e, i) {
      expect(i.message).to.eql('a message');
      expect(i.stackInfo).to.be.ok;
      done(e);
    });
  });
  it('should handle bad errors and still set stackInfo', function (done) {
    const err = { description: 'bork' };
    const args = ['a message', 'fuzz'];
    const item = itemFromArgs(args);
    item.err = err;
    const options = {};
    t.handleItemWithError(item, options, function (e, i) {
      expect(i.stackInfo).to.be.ok;
      expect(i.message).to.eql('a message');
      done(e);
    });
  });
  it('should use most specific error name', function (done) {
    const err = new Error('bork');
    const args = ['a message', err];
    const options = {};

    const names = [
      { name: 'TypeError', constructor: 'EvalError', result: 'TypeError' },
      { name: 'TypeError', constructor: 'Error', result: 'TypeError' },
      { name: 'Error', constructor: 'TypeError', result: 'TypeError' },
      { name: 'Error', constructor: '', result: 'Error' },
      { name: '', constructor: 'Error', result: 'Error' },
      { name: '', constructor: '', result: '' },
    ];

    for (const { name, constructor, result } of names) {
      err.name = name;
      err.constructor = { name: constructor } as any;
      const item = itemFromArgs(args);

      t.handleItemWithError(item, options, function (e, i) {
        expect(i.stackInfo.name).to.eql(result);
      });
    }
    done();
  });
});

describe('ensureItemHasSomethingToSay', function () {
  it('should error if item has nothing', function (done) {
    const args = [];
    const item = itemFromArgs(args);
    const options = {};
    t.ensureItemHasSomethingToSay(item, options, function (e, i) {
      expect(e).to.be.ok;
      done(i);
    });
  });
  it('should do nothing if item has a message', function (done) {
    const args = [];
    const item = itemFromArgs(args);
    item.message = 'bork';
    const options = {};
    t.ensureItemHasSomethingToSay(item, options, function (e, i) {
      expect(i).to.be.ok;
      done(e);
    });
  });
  it('should do nothing if item has stackInfo', function (done) {
    const args = [];
    const item = itemFromArgs(args);
    item.data = item.data || {};
    item.stackInfo = {};
    const options = {};
    t.ensureItemHasSomethingToSay(item, options, function (e, i) {
      expect(i).to.be.ok;
      done(e);
    });
  });
  it('should do nothing if item has custom data', function (done) {
    const args = [];
    const item = itemFromArgs(args);
    item.custom = {};
    const options = {};
    t.ensureItemHasSomethingToSay(item, options, function (e, i) {
      expect(i).to.be.ok;
      done(e);
    });
  });
});

describe('addBaseInfo', function () {
  it('should add all of the expected data', function (done) {
    const args = ['a message'];
    const item = itemFromArgs(args);
    item.level = 'critical';
    const options = {};
    t.addBaseInfo(item, options, function (e, i) {
      expect(i.data.level).to.eql('critical');
      expect(i.data.platform).to.eql('browser');
      expect(i.data.framework).to.eql('browser-js');
      expect(i.data.language).to.eql('javascript');
      expect(i.data.notifier.name).to.eql('rollbar-browser-js');
      done(e);
    });
  });
  it('should pull data from options', function (done) {
    const args = ['a message'];
    const item = itemFromArgs(args);
    const options = {
      environment: 'dev',
      endpoint: 'api.rollbar.com',
      version: '42',
    };
    t.addBaseInfo(item, options, function (e, i) {
      expect(i.data.environment).to.eql('dev');
      expect(i.data.endpoint).to.eql('api.rollbar.com');
      expect(i.data.notifier.version).to.eql('42');
      done(e);
    });
  });
  it('should pull environment from payload options', function (done) {
    const args = ['a message'];
    const item = itemFromArgs(args);
    const options = {
      payload: { environment: 'dev' },
    };
    t.addBaseInfo(item, options, function (e, i) {
      expect(i.data.environment).to.eql('dev');
      done(e);
    });
  });
});

describe('addRequestInfo', function () {
  it('should use window info to set request properties', function (done) {
    const args = ['a message'];
    const item = itemFromArgs(args);
    const options = { captureIp: 'anonymize' };
    t.addRequestInfo(window)(item, options, function (e, i) {
      expect(i.data.request).to.be.ok;
      expect(i.data.request.user_ip).to.eql('$remote_ip_anonymize');
      done(e);
    });
  });
  it('should do nothing without window', function (done) {
    const args = ['a message'];
    const item = itemFromArgs(args);
    item.data = {};
    const options = {};
    const w = null;
    t.addRequestInfo(w)(item, options, function (e, i) {
      expect(i.data.request).to.not.be.ok;
      done(e);
    });
  });
  it('should honor captureIp without window', function (done) {
    const args = ['a message'];
    const item = itemFromArgs(args);
    item.data = {};
    const options = { captureIp: true };
    const w = null;
    t.addRequestInfo(w)(item, options, function (e, i) {
      expect(i.data.request.url).to.not.be.ok;
      expect(i.data.request.query_string).to.not.be.ok;
      expect(i.data.request.user_ip).to.eql('$remote_ip');
      done(e);
    });
  });
});

describe('addClientInfo', function () {
  it('should do nothing without a window', function (done) {
    const args = ['a message'];
    const item = itemFromArgs(args);
    item.data = {};
    const options = {};
    const w = null;
    t.addClientInfo(w)(item, options, function (e, i) {
      expect(i.data.client).to.not.be.ok;
      done(e);
    });
  });
  it('should use window info to set client properties', function (done) {
    const args = ['a message'];
    const item = itemFromArgs(args);
    const options = {};
    t.addClientInfo(window)(item, options, function (e, i) {
      expect(i.data.client).to.be.ok;
      expect(i.data.client.javascript).to.be.ok;
      done(e);
    });
  });
});

describe('addPluginInfo', function () {
  it('should do nothing without a window', function (done) {
    const args = ['a message'];
    const item = itemFromArgs(args);
    const options = {};
    const w = null;
    t.addPluginInfo(w)(item, options, function (e, i) {
      expect(
        i.data &&
          i.data.client &&
          i.data.client.javascript &&
          i.data.client.javascript.plugins,
      ).to.not.be.ok;
      done(e);
    });
  });
  it('should add plugin data from the window', function (done) {
    const args = ['a message'];
    const item = itemFromArgs(args);
    const options = {};
    const w = { navigator: { plugins: [] } };
    w.navigator.plugins.push({ name: 'plugin 1', description: '1' });
    w.navigator.plugins.push({ name: 'plugin 2', description: '2' });
    t.addPluginInfo(w)(item, options, function (e, i) {
      expect(i.data.client.javascript.plugins).to.be.ok;
      expect(i.data.client.javascript.plugins.length).to.eql(2);
      expect(i.data.client.javascript.plugins[0].name).to.eql('plugin 1');
      done(e);
    });
  });
});

describe('addBody', function () {
  describe('with stackInfo', function () {
    it('should use the stackInfo to add a trace to the body', function (done) {
      let err;
      try {
        throw new Error('bork');
      } catch (e) {
        err = e;
      }
      const args = ['a message', err, { custom: 'stuff' }];
      const item = itemFromArgs(args);
      item.description = 'borked';
      const options = {};
      t.handleItemWithError(item, options, function (e, i) {
        expect(i.stackInfo).to.be.ok;
        t.addBody(i, options, function (e, i) {
          expect(i.data.body.trace).to.be.ok;
          done(e);
        });
      });
    });
    it('should add a message with a bad stackInfo', function (done) {
      const args = ['a message'];
      const item = itemFromArgs(args);
      item.description = 'borked';
      item.data = item.data || {};
      item.stackInfo = { name: 'bork' };
      const options = {};
      t.addBody(item, options, function (e, i) {
        expect(i.data.body.trace).to.not.be.ok;
        expect(i.data.body.message.body).to.be.ok;
        done(e);
      });
    });
  });
  describe('without stackInfo', function () {
    it('should add a message as the body', function (done) {
      const args = ['a message', { custom: 'stuff' }];
      const item = itemFromArgs(args);
      const options = {};
      t.addBody(item, options, function (e, i) {
        expect(i.data.body.message.body).to.be.ok;
        done(e);
      });
    });
    it('should send message when sent without a message', function (done) {
      const args = [{ custom: 'stuff' }];
      const item = itemFromArgs(args);
      const options = {};
      t.addBody(item, options, function (e, i) {
        expect(i.data.body.message.body).to.eql(
          'Item sent with null or missing arguments.',
        );
        done(e);
      });
    });
  });
  describe('without stackInfo.name', function () {
    it('should set error class unknown', function (done) {
      let err;
      try {
        throw new Error('bork');
      } catch (e) {
        err = e;
      }
      const args = ['a message', err, { custom: 'stuff' }];
      const item = itemFromArgs(args);
      item.description = 'borked';
      const options = {};
      t.handleItemWithError(item, options, function (e, i) {
        expect(i.stackInfo).to.be.ok;
        i.stackInfo.name = null; // force alternate path to determine error class.
        t.addBody(i, options, function (e, i) {
          expect(i.data.body.trace.exception.class).to.eql('(unknown)');
          expect(i.data.body.trace.exception.message).to.eql('bork');
          done(e);
        });
      });
    });
    describe('when config.guessErrorClass is set', function () {
      it('should guess error class ', function (done) {
        let err;
        try {
          throw new Error('GuessedError: bork');
        } catch (e) {
          err = e;
        }
        const args = [err, { custom: 'stuff' }];
        const item = itemFromArgs(args);
        item.description = 'borked';
        const options = { guessErrorClass: true };
        t.handleItemWithError(item, options, function (e, i) {
          expect(i.stackInfo).to.be.ok;
          i.stackInfo.name = null; // force alternate path to determine error class.
          t.addBody(i, options, function (e, i) {
            expect(i.data.body.trace.exception.class).to.eql('GuessedError');
            expect(i.data.body.trace.exception.message).to.eql('bork');
            done(e);
          });
        });
      });
      it('should set error class unknown', function (done) {
        let err;
        try {
          throw new Error('bork');
        } catch (e) {
          err = e;
        }
        const args = [err, { custom: 'stuff' }];
        const item = itemFromArgs(args);
        item.description = 'borked';
        const options = { guessErrorClass: true };
        t.handleItemWithError(item, options, function (e, i) {
          expect(i.stackInfo).to.be.ok;
          i.stackInfo.name = null; // force alternate path to determine error class.
          t.addBody(i, options, function (e, i) {
            expect(i.data.body.trace.exception.class).to.eql('(unknown)');
            expect(i.data.body.trace.exception.message).to.eql('bork');
            done(e);
          });
        });
      });
    });
  });
  describe('with nested error', function () {
    it('should create trace_chain', function (done) {
      const nestedErr = new Error('nested error');
      const err = new Error('test error') as Rollbar.ErrorWithContext;
      err.nested = nestedErr;
      const args = ['a message', err];
      const item = itemFromArgs(args);
      const options = {};
      t.handleItemWithError(item, options, function (e, i) {
        expect(i.stackInfo).to.be.ok;
      });
      t.addBody(item, options, function (e, i) {
        expect(i.data.body.trace_chain.length).to.eql(2);
        expect(i.data.body.trace_chain[0].exception.message).to.eql(
          'test error',
        );
        expect(i.data.body.trace_chain[1].exception.message).to.eql(
          'nested error',
        );
        expect(i.data.body.trace_chain[0].frames.at(-1).lineno).to.not.eql(
          i.data.body.trace_chain[1].frames.at(-1).lineno,
        );
        done(e);
      });
    });
    it('should create add error context as custom data', function (done) {
      const nestedErr = new Error('nested error') as Rollbar.ErrorWithContext;
      nestedErr.rollbarContext = { err1: 'nested context' };
      const err = new Error('test error') as Rollbar.ErrorWithContext;
      err.rollbarContext = { err2: 'error context' };
      err.nested = nestedErr;
      const args = ['a message', err];
      const item = itemFromArgs(args);
      const options = { addErrorContext: true };
      t.handleItemWithError(item, options, function (e, i) {
        expect(i.stackInfo).to.be.ok;
      });
      t.addBody(item, options, function (e, i) {
        expect(i.data.body.trace_chain.length).to.eql(2);
        expect(i.data.custom.err1).to.eql('nested context');
        expect(i.data.custom.err2).to.eql('error context');
        done(e);
      });
    });
  });
  describe('with error cause', function () {
    // Error cause was introduced in Chrome 93.
    if (chromeMajorVersion() < 93) return;

    it('should create trace_chain', function (done) {
      const causeErr = new Error('cause error');
      const err = new Error('test error') as Error & Cause;
      err.cause = causeErr;
      const args = ['a message', err];
      const item = itemFromArgs(args);
      const options = {};
      t.handleItemWithError(item, options, function (e, i) {
        expect(i.stackInfo).to.be.ok;
      });
      t.addBody(item, options, function (e, i) {
        expect(i.data.body.trace_chain.length).to.eql(2);
        expect(i.data.body.trace_chain[0].exception.message).to.eql(
          'test error',
        );
        expect(i.data.body.trace_chain[1].exception.message).to.eql(
          'cause error',
        );
        done(e);
      });
    });
    it('should create add error context as custom data', function (done) {
      const causeErr = new Error('cause error') as Rollbar.ErrorWithContext;
      causeErr.rollbarContext = { err1: 'cause context' };
      const err = new Error('test error') as Rollbar.ErrorWithContext & Cause;
      err.cause = causeErr;
      err.rollbarContext = { err2: 'error context' };
      const args = ['a message', err];
      const item = itemFromArgs(args);
      const options = { addErrorContext: true };
      t.handleItemWithError(item, options, function (e, i) {
        expect(i.stackInfo).to.be.ok;
      });
      t.addBody(item, options, function (e, i) {
        expect(i.data.body.trace_chain.length).to.eql(2);
        expect(i.data.custom.err1).to.eql('cause context');
        expect(i.data.custom.err2).to.eql('error context');
        done(e);
      });
    });
  });
});

describe('scrubPayload', function () {
  it('only scrubs payload data', async function () {
    const args = [
      'a message',
      { scooby: 'doo', okay: 'fizz=buzz&fuzz=baz', user: { id: 42 } },
    ];
    const item = itemFromArgs(args);
    const accessToken = 'abc123';
    const options = {
      endpoint: 'api.rollbar.com/',
      scrubFields: ['access_token', 'accessToken', 'scooby', 'fizz', 'user'],
    };
    const payload = {
      access_token: accessToken,
      data: item,
    };
    expect(payload.access_token).to.eql(accessToken);
    expect(payload.data.custom.scooby).to.eql('doo');
    expect(payload.data.custom.okay).to.eql('fizz=buzz&fuzz=baz');
    expect(payload.data.custom.user.id).to.eql(42);

    const scrubModule = await import('../src/scrub.js');
    const scrub = scrubModule.default;

    const scrubberFn = t.addScrubber(scrub);
    const result: any = await new Promise((resolve, reject) => {
      scrubberFn(payload, options, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    expect(result.access_token).to.eql(accessToken);
    expect(result.data.custom.scooby).to.not.eql('doo');
    expect(payload.data.custom.okay).to.not.eql('fizz=buzz&fuzz=baz');
    expect(payload.data.custom.okay).to.match(/fizz=\*+&fuzz=baz/);
    expect(payload.data.custom.user.id).to.not.be.ok;
    expect(payload.data.custom.user).to.match(/\*+/);
    expect(result.data.message).to.eql('a message');
  });
});
