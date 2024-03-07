/* globals expect */
/* globals describe */
/* globals it */
/* globals sinon */

var Rollbar = require('../src/browser/rollbar');
var t = require('../src/browser/transforms');

function TestClientGen() {
  var TestClient = function () {
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
  var client = new (TestClientGen())();
  var rollbar = new Rollbar({ autoInstrument: false }, client);
  var item = rollbar._createItem(args);
  item.level = 'debug';
  return item;
}

function chromeMajorVersion() {
  return parseInt(navigator.userAgent.match(/Chrome\/([0-9]+)\./)[1]);
}

describe('handleDomException', function () {
  it('should do nothing if not a DOMException', function (done) {
    var err = new Error('test');
    var args = ['a message', err];
    var item = itemFromArgs(args);
    var options = {};
    t.handleDomException(item, options, function (e, i) {
      expect(item.err).to.eql(item.err);
      expect(item.err.nested).to.not.be.ok();
      done(e);
    });
  });
  it('should create nested exception for DOMException', function (done) {
    var err = new DOMException('dom error');
    var args = ['a message', err];
    var item = itemFromArgs(args);
    var options = {};
    t.handleDomException(item, options, function (e, i) {
      expect(item.err.nested.constructor.name).to.eql('DOMException');
      expect(item.err.constructor.name).to.eql('Error');
      done(e);
    });
  });
});
describe('handleItemWithError', function () {
  it('should do nothing if there is no err', function (done) {
    var args = ['a message'];
    var item = itemFromArgs(args);
    var options = {};
    t.handleItemWithError(item, options, function (e, i) {
      expect(i).to.eql(item);
      done(e);
    });
  });
  it('should set stack info from error if it is already saved', function (done) {
    var err = new Error('bork');
    var myTrace = { trace: { frames: [1, 2, 3] } };
    err._savedStackTrace = myTrace;
    var args = ['a message', err];
    var item = itemFromArgs(args);
    var options = {};
    t.handleItemWithError(item, options, function (e, i) {
      expect(i.stackInfo).to.eql(myTrace);
      done(e);
    });
  });
  it('should set stack info from error', function (done) {
    var err;
    try {
      throw new Error('bork');
    } catch (e) {
      err = e;
    }
    var args = ['a message', err];
    var item = itemFromArgs(args);
    var options = {};
    t.handleItemWithError(item, options, function (e, i) {
      expect(i.message).to.eql('a message');
      expect(i.stackInfo).to.be.ok();
      done(e);
    });
  });
  it('should handle bad errors and still set stackInfo', function (done) {
    var err = { description: 'bork' };
    var args = ['a message', 'fuzz'];
    var item = itemFromArgs(args);
    item.err = err;
    var options = {};
    t.handleItemWithError(item, options, function (e, i) {
      expect(i.stackInfo).to.be.ok();
      expect(i.message).to.eql('a message');
      done(e);
    });
  });
  it('should use most specific error name', function (done) {
    var err = new Error('bork');
    var args = ['a message', err];
    var options = {};

    var names = [
      { name: 'TypeError', constructor: 'EvalError', result: 'TypeError' },
      { name: 'TypeError', constructor: 'Error', result: 'TypeError' },
      { name: 'Error', constructor: 'TypeError', result: 'TypeError' },
      { name: 'Error', constructor: '', result: 'Error' },
      { name: '', constructor: 'Error', result: 'Error' },
      { name: '', constructor: '', result: '' },
    ];

    for (var i = 0; i < names.length; i++) {
      err.name = names[i].name;
      err.constructor = { name: names[i].constructor };
      var item = itemFromArgs(args);
      var result = names[i].result;

      t.handleItemWithError(item, options, function (e, i) {
        expect(i.stackInfo.name).to.eql(result);
      });
    }
    done();
  });
});

describe('ensureItemHasSomethingToSay', function () {
  it('should error if item has nothing', function (done) {
    var args = [];
    var item = itemFromArgs(args);
    var options = {};
    t.ensureItemHasSomethingToSay(item, options, function (e, i) {
      expect(e).to.be.ok();
      done(i);
    });
  });
  it('should do nothing if item has a message', function (done) {
    var args = [];
    var item = itemFromArgs(args);
    item.message = 'bork';
    var options = {};
    t.ensureItemHasSomethingToSay(item, options, function (e, i) {
      expect(i).to.be.ok();
      done(e);
    });
  });
  it('should do nothing if item has stackInfo', function (done) {
    var args = [];
    var item = itemFromArgs(args);
    item.data = item.data || {};
    item.stackInfo = {};
    var options = {};
    t.ensureItemHasSomethingToSay(item, options, function (e, i) {
      expect(i).to.be.ok();
      done(e);
    });
  });
  it('should do nothing if item has custom data', function (done) {
    var args = [];
    var item = itemFromArgs(args);
    item.custom = {};
    var options = {};
    t.ensureItemHasSomethingToSay(item, options, function (e, i) {
      expect(i).to.be.ok();
      done(e);
    });
  });
});

describe('addBaseInfo', function () {
  it('should add all of the expected data', function (done) {
    var args = ['a message'];
    var item = itemFromArgs(args);
    item.level = 'critical';
    var options = {};
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
    var args = ['a message'];
    var item = itemFromArgs(args);
    var options = {
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
    var args = ['a message'];
    var item = itemFromArgs(args);
    var options = {
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
    var args = ['a message'];
    var item = itemFromArgs(args);
    var options = { captureIp: 'anonymize' };
    t.addRequestInfo(window)(item, options, function (e, i) {
      expect(i.data.request).to.be.ok();
      expect(i.data.request.user_ip).to.eql('$remote_ip_anonymize');
      done(e);
    });
  });
  it('should do nothing without window', function (done) {
    var args = ['a message'];
    var item = itemFromArgs(args);
    item.data = {};
    var options = {};
    var w = null;
    t.addRequestInfo(w)(item, options, function (e, i) {
      expect(i.data.request).to.not.be.ok();
      done(e);
    });
  });
  it('should honor captureIp without window', function (done) {
    var args = ['a message'];
    var item = itemFromArgs(args);
    item.data = {};
    var options = { captureIp: true };
    var w = null;
    t.addRequestInfo(w)(item, options, function (e, i) {
      expect(i.data.request.url).to.not.be.ok();
      expect(i.data.request.query_string).to.not.be.ok();
      expect(i.data.request.user_ip).to.eql('$remote_ip');
      done(e);
    });
  });
});

describe('addClientInfo', function () {
  it('should do nothing without a window', function (done) {
    var args = ['a message'];
    var item = itemFromArgs(args);
    item.data = {};
    var options = {};
    var w = null;
    t.addClientInfo(w)(item, options, function (e, i) {
      expect(i.data.client).to.not.be.ok();
      done(e);
    });
  });
  it('should use window info to set client properties', function (done) {
    var args = ['a message'];
    var item = itemFromArgs(args);
    var options = {};
    t.addClientInfo(window)(item, options, function (e, i) {
      expect(i.data.client).to.be.ok();
      expect(i.data.client.javascript).to.be.ok();
      done(e);
    });
  });
});

describe('addPluginInfo', function () {
  it('should do nothing without a window', function (done) {
    var args = ['a message'];
    var item = itemFromArgs(args);
    var options = {};
    var w = null;
    t.addPluginInfo(w)(item, options, function (e, i) {
      expect(
        i.data &&
          i.data.client &&
          i.data.client.javascript &&
          i.data.client.javascript.plugins,
      ).to.not.be.ok();
      done(e);
    });
  });
  it('should add plugin data from the window', function (done) {
    var args = ['a message'];
    var item = itemFromArgs(args);
    var options = {};
    var w = { navigator: { plugins: [] } };
    w.navigator.plugins.push({ name: 'plugin 1', description: '1' });
    w.navigator.plugins.push({ name: 'plugin 2', description: '2' });
    t.addPluginInfo(w)(item, options, function (e, i) {
      expect(i.data.client.javascript.plugins).to.be.ok();
      expect(i.data.client.javascript.plugins.length).to.eql(2);
      expect(i.data.client.javascript.plugins[0].name).to.eql('plugin 1');
      done(e);
    });
  });
});

describe('addBody', function () {
  describe('with stackInfo', function () {
    it('should use the stackInfo to add a trace to the body', function (done) {
      var err;
      try {
        throw new Error('bork');
      } catch (e) {
        err = e;
      }
      var args = ['a message', err, { custom: 'stuff' }];
      var item = itemFromArgs(args);
      item.description = 'borked';
      var options = {};
      t.handleItemWithError(item, options, function (e, i) {
        expect(i.stackInfo).to.be.ok();
        t.addBody(i, options, function (e, i) {
          expect(i.data.body.trace).to.be.ok();
          done(e);
        });
      });
    });
    it('should add a message with a bad stackInfo', function (done) {
      var args = ['a message'];
      var item = itemFromArgs(args);
      item.description = 'borked';
      item.data = item.data || {};
      item.stackInfo = { name: 'bork' };
      var options = {};
      t.addBody(item, options, function (e, i) {
        expect(i.data.body.trace).to.not.be.ok();
        expect(i.data.body.message.body).to.be.ok();
        done(e);
      });
    });
  });
  describe('without stackInfo', function () {
    it('should add a message as the body', function (done) {
      var args = ['a message', { custom: 'stuff' }];
      var item = itemFromArgs(args);
      var options = {};
      t.addBody(item, options, function (e, i) {
        expect(i.data.body.message.body).to.be.ok();
        done(e);
      });
    });
    it('should send message when sent without a message', function (done) {
      var args = [{ custom: 'stuff' }];
      var item = itemFromArgs(args);
      var options = {};
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
      var err;
      try {
        throw new Error('bork');
      } catch (e) {
        err = e;
      }
      var args = ['a message', err, { custom: 'stuff' }];
      var item = itemFromArgs(args);
      item.description = 'borked';
      var options = {};
      t.handleItemWithError(item, options, function (e, i) {
        expect(i.stackInfo).to.be.ok();
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
        var err;
        try {
          throw new Error('GuessedError: bork');
        } catch (e) {
          err = e;
        }
        var args = [err, { custom: 'stuff' }];
        var item = itemFromArgs(args);
        item.description = 'borked';
        var options = { guessErrorClass: true };
        t.handleItemWithError(item, options, function (e, i) {
          expect(i.stackInfo).to.be.ok();
          i.stackInfo.name = null; // force alternate path to determine error class.
          t.addBody(i, options, function (e, i) {
            expect(i.data.body.trace.exception.class).to.eql('GuessedError');
            expect(i.data.body.trace.exception.message).to.eql('bork');
            done(e);
          });
        });
      });
      it('should set error class unknown', function (done) {
        var err;
        try {
          throw new Error('bork');
        } catch (e) {
          err = e;
        }
        var args = [err, { custom: 'stuff' }];
        var item = itemFromArgs(args);
        item.description = 'borked';
        var options = { guessErrorClass: true };
        t.handleItemWithError(item, options, function (e, i) {
          expect(i.stackInfo).to.be.ok();
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
      var nestedErr = new Error('nested error');
      var err = new Error('test error');
      err.nested = nestedErr;
      var args = ['a message', err];
      var item = itemFromArgs(args);
      var options = {};
      t.handleItemWithError(item, options, function (e, i) {
        expect(i.stackInfo).to.be.ok();
      });
      t.addBody(item, options, function (e, i) {
        expect(i.data.body.trace_chain.length).to.eql(2);
        expect(i.data.body.trace_chain[0].exception.message).to.eql(
          'test error',
        );
        expect(i.data.body.trace_chain[1].exception.message).to.eql(
          'nested error',
        );
        done(e);
      });
    });
    it('should create add error context as custom data', function (done) {
      var nestedErr = new Error('nested error');
      nestedErr.rollbarContext = { err1: 'nested context' };
      var err = new Error('test error');
      err.rollbarContext = { err2: 'error context' };
      err.nested = nestedErr;
      var args = ['a message', err];
      var item = itemFromArgs(args);
      var options = { addErrorContext: true };
      t.handleItemWithError(item, options, function (e, i) {
        expect(i.stackInfo).to.be.ok();
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
      var causeErr = new Error('cause error');
      var err = new Error('test error', { cause: causeErr });
      var args = ['a message', err];
      var item = itemFromArgs(args);
      var options = {};
      t.handleItemWithError(item, options, function (e, i) {
        expect(i.stackInfo).to.be.ok();
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
      var causeErr = new Error('cause error');
      causeErr.rollbarContext = { err1: 'cause context' };
      var err = new Error('test error', { cause: causeErr });
      err.rollbarContext = { err2: 'error context' };
      var args = ['a message', err];
      var item = itemFromArgs(args);
      var options = { addErrorContext: true };
      t.handleItemWithError(item, options, function (e, i) {
        expect(i.stackInfo).to.be.ok();
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
  it('only scrubs payload data', function (done) {
    var args = [
      'a message',
      { scooby: 'doo', okay: 'fizz=buzz&fuzz=baz', user: { id: 42 } },
    ];
    var item = itemFromArgs(args);
    var accessToken = 'abc123';
    var options = {
      endpoint: 'api.rollbar.com/',
      scrubFields: ['access_token', 'accessToken', 'scooby', 'fizz', 'user'],
    };
    var payload = {
      access_token: accessToken,
      data: item,
    };
    expect(payload.access_token).to.eql(accessToken);
    expect(payload.data.custom.scooby).to.eql('doo');
    expect(payload.data.custom.okay).to.eql('fizz=buzz&fuzz=baz');
    expect(payload.data.custom.user.id).to.eql(42);

    var scrub = require('../src/scrub');
    t.addScrubber(scrub)(payload, options, function (e, i) {
      expect(i.access_token).to.eql(accessToken);
      expect(i.data.custom.scooby).to.not.eql('doo');
      expect(payload.data.custom.okay).to.not.eql('fizz=buzz&fuzz=baz');
      expect(payload.data.custom.okay).to.match(/fizz=\*+&fuzz=baz/);
      expect(payload.data.custom.user.id).to.not.be.ok();
      expect(payload.data.custom.user).to.match(/\*+/);
      expect(i.data.message).to.eql('a message');
      done(e);
    });
  });
});
