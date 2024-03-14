/* globals expect */
/* globals describe */
/* globals it */

var _ = require('../src/utility');
var t = require('../src/transforms');

function itemFromArgs(args) {
  var item = _.createItem(args);
  item.level = 'debug';
  return item;
}

var fakeLogger = {
  error: function () {},
  log: function () {},
};

describe('itemToPayload', function () {
  it('ignores options.payload.body but merges in other payload options', function (done) {
    var args = ['a message', { custom: 'stuff' }];
    var item = itemFromArgs(args);
    item.accessToken = 'abc123';
    item._isUncaught = true;
    item._originalArgs = ['c', 3];
    item.data = {};
    var options = {
      endpoint: 'api.rollbar.com',
      payload: { body: 'hey', x: 42 },
    };
    t.itemToPayload(item, options, function (e, i) {
      expect(i._isUncaught).to.eql(item._isUncaught);
      expect(i._originalArgs).to.eql(item._originalArgs);

      // This transform shouldn't apply any payload keys.
      expect(i.body).to.not.eql('hey');
      expect(i.x).to.not.eql(42);
      done(e);
    });
  });
  it('ignores handles trailing slash in endpoint', function (done) {
    var args = ['a message', { custom: 'stuff' }];
    var item = itemFromArgs(args);
    item.accessToken = 'abc123';
    item.data = { message: 'a message' };
    var options = {
      endpoint: 'api.rollbar.com/',
    };
    t.itemToPayload(item, options, function (e, i) {
      expect(i.message).to.eql('a message');
      done(e);
    });
  });
});

describe('addPayloadOptions', function () {
  it('ignores options.payload.body but merges in other payload options', function (done) {
    var args = ['a message', { custom: 'stuff' }];
    var item = itemFromArgs(args);
    item.accessToken = 'abc123';
    var options = {
      endpoint: 'api.rollbar.com',
      payload: { body: 'hey', x: 42 },
    };
    t.addPayloadOptions(item, options, function (e, i) {
      expect(i.data.body).to.not.eql('hey');
      expect(i.data.x).to.eql(42);
      done(e);
    });
  });
});

describe('addTelemetryData', function () {
  it('adds the data to the right place if events exist', function (done) {
    var item = {
      data: {
        body: {
          message: 'hello world',
        },
      },
      telemetryEvents: [
        {
          type: 'log',
          body: {
            subtype: 'console',
            message: 'bork',
          },
          timestamp_ms: 12345,
          level: 'info',
        },
        {
          type: 'manual',
          body: {
            hello: 'world',
          },
          timestamp_ms: 88889,
          level: 'info',
        },
      ],
    };
    var options = {};
    t.addTelemetryData(item, options, function (e, i) {
      expect(i.data.body.telemetry.length).to.eql(2);
      expect(i.data.body.telemetry[0].type).to.eql('log');
      done(e);
    });
  });
});

describe('addConfiguredOptions', function () {
  it('adds the configured options', function (done) {
    var item = {
      data: {
        body: {
          message: 'hello world',
        },
        notifier: {
          name: 'rollbar-js',
        },
      },
    };
    var options = {
      accessToken: 'abc123',
      foo: 'bar',
      captureUncaught: true,
      _configuredOptions: {
        accessToken: 'abc123',
        captureUncaught: true,
      },
    };
    t.addConfiguredOptions(item, options, function (e, i) {
      expect(i.data.notifier.configured_options).to.eql({
        captureUncaught: true,
      });
      done(e);
    });
  });
});

describe('userTransform', function () {
  it('calls user transform if is present and a function', function (done) {
    var args = ['a message'];
    var item = itemFromArgs(args);
    var options = {
      endpoint: 'api.rollbar.com',
      transform: function (newItem, item) {
        newItem.origin = item;
        newItem.message = 'HELLO';
      },
    };
    var payload = {
      access_token: '123',
      data: item,
    };
    expect(payload.data.message).to.not.eql('HELLO');
    t.userTransform(fakeLogger)(payload, options, function (e, i) {
      expect(i.data.origin).to.be.an('object');
      expect(i.data.message).to.eql('HELLO');
      done(e);
    });
  });
  it('does nothing if transform is not a function', function (done) {
    var args = ['a message'];
    var item = itemFromArgs(args);
    var options = {
      endpoint: 'api.rollbar.com',
      transform: 'hi there',
    };
    var payload = {
      access_token: '123',
      data: item,
    };
    expect(payload.data.message).to.not.eql('HELLO');
    t.userTransform(fakeLogger)(payload, options, function (e, i) {
      expect(i.data.message).to.not.eql('HELLO');
      done(e);
    });
  });
  it('does nothing if transform throws', function (done) {
    var args = ['a message'];
    var item = itemFromArgs(args);
    var options = {
      endpoint: 'api.rollbar.com',
      transform: function (i) {
        i.data.message = 'HELLO';
        throw 'bork';
      },
    };
    var payload = {
      access_token: '123',
      data: item,
    };
    expect(payload.data.message).to.not.eql('HELLO');
    t.userTransform(fakeLogger)(payload, options, function (e, i) {
      expect(i.data.message).to.not.eql('HELLO');
      expect(options.transform).to.not.be.ok();
      done(e);
    });
  });

  it('waits for promise resolution if transform returns a promise', function (done) {
    var args = ['a message'];
    var item = itemFromArgs(args);
    var payload = {
      access_token: '123',
      data: item,
    };
    var options = {
      endpoint: 'api.rollbar.com',
      transform: function (newItem) {
        newItem.message = 'HELLO';
        return Promise.resolve();
      },
    };
    t.userTransform(fakeLogger)(payload, options, function (e, i) {
      expect(i.data.message).to.eql('HELLO');
      done(e);
    });
    expect(payload.data.message).to.not.eql('HELLO');
  });

  it('uses resolved value if transform returns a promise with a value', function (done) {
    var args = ['a message'];
    var item = itemFromArgs(args);
    var payload = {
      access_token: '123',
      data: item,
    };
    var options = {
      endpoint: 'api.rollbar.com',
      transform: function (newItem) {
        return Promise.resolve({ message: 'HELLO' });
      },
    };
    t.userTransform(fakeLogger)(payload, options, function (e, i) {
      expect(i.data.message).to.eql('HELLO');
      expect(i.data).to.not.eql(item);
      done(e);
    });
    expect(payload.data.message).to.not.eql('HELLO');
  });

  it('uses untransformed value if transform returns a promise that rejects', function (done) {
    var args = ['a message'];
    var item = itemFromArgs(args);
    var err = { message: 'HELLO' };
    var payload = {
      access_token: '123',
      data: item,
    };
    var options = {
      endpoint: 'api.rollbar.com',
      transform: function (newItem) {
        return Promise.reject(err);
      },
    };
    t.userTransform(fakeLogger)(payload, options, function (e, i) {
      expect(i.data.message).to.not.eql('HELLO');
      expect(i.data).to.eql(item);
      expect(e).to.eql(err);
      done();
    });
    expect(payload.data.message).to.not.eql('HELLO');
  });
});
