'use strict';

var assert = require('assert');
var vows = require('vows');
var sinon = require('sinon');

process.env.NODE_ENV = process.env.NODE_ENV || 'test-node-env';
var Rollbar = require('../src/server/rollbar');
var logger = require('../src/server/logger');
var Locals = require('../src/server/locals');
var localsFixtures = require('./fixtures/locals.fixtures');

var nodeMajorVersion = process.versions.node.split('.')[0];

async function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function promiseReject(rollbar, callback) {
  var error = new Error('promise reject');

  Promise.reject(error);
  await wait(500);
  callback(null, rollbar);
}

async function nodeThrow(rollbar, callback) {
  setTimeout(function () {
    var error = new Error('node error');
    throw error;
  }, 1);
  await wait(500);
  callback(null, rollbar);
}

async function nodeThrowAndCatch(rollbar, callback) {
  setTimeout(function () {
    var error = new Error('caught error');
    try {
      throw error;
    } catch (e) {
      rollbar.error(e);
    }
  }, 1);
  await wait(500);
  callback(null, rollbar);
}

function nestedError(nestedMessage, _password) {
  var nestedError = new Error(nestedMessage);
  throw nestedError;
}

async function nodeThrowNested(rollbar, callback) {
  setTimeout(function () {
    var message = 'test error';
    var password = '123456';
    var err = new Error(message);

    try {
      var newMessage = 'nested ' + message;
      nestedError(newMessage, password);
    } catch (e) {
      err.nested = e;
    }

    throw err;
  }, 1);
  await wait(500);
  callback(null, rollbar);
}

function fakeSessionPostHandler(responses) {
  return function fakeSessionPost(command, options, callback) {
    var error;
    var response;

    if (command === 'Runtime.getProperties') {
      response = { result: responses[options.objectId] };
    } else {
      error = new Error('Unexpected session.post command');
    }

    setTimeout(function () {
      callback(error, response);
    }, 1);
  };
}

async function nodeThrowWithNestedLocals(rollbar, callback) {
  setTimeout(function () {
    var arr = [{ zero: [0, 0] }, { one: 1 }, { two: 2 }, { three: 3 }];
    var obj = { a: 'a', b: 'b', c: 'c', d: 'd', e: 'e', f: 'f' };
    var password = 'password';
    var sym = Symbol('foo');
    var error = new Error('node error');
    throw error;
  }, 1);
  await wait(500);
  callback(null, rollbar);
}

function recurse(curr, limit) {
  if (curr < limit) {
    recurse(curr + 1, limit);
  } else {
    throw new Error('deep stack error, limit=' + limit);
  }
}

async function nodeThrowRecursionError(rollbar, callback) {
  setTimeout(function () {
    recurse(0, 3);
  }, 1);
  await wait(500);
  callback(null, rollbar);
}

function cloneStack(stack) {
  // Deep clone, because stack gets modified by mergeLocals
  // and we don't want to modify the test fixtures.
  return JSON.parse(JSON.stringify(stack));
}

function verifyThrownError(r) {
  var addItemStub = r.addItemStub;

  assert.isTrue(addItemStub.called);
  var data = addItemStub.getCall(0).args[3].data;
  assert.equal(data.body.trace_chain[0].exception.message, 'node error');
  var length = data.body.trace_chain[0].frames.length;
  assert.ok(length > 1);

  if (nodeMajorVersion >= 18) {
    // Node >=18; locals only in top frame
    assert.equal(
      data.body.trace_chain[0].frames[length - 1].locals.error,
      '<Error object>',
    );
    assert.equal(data.body.trace_chain[0].frames[length - 2].locals, undefined);
  } else if (nodeMajorVersion >= 10) {
    // Node >=10; locals enabled
    assert.equal(
      data.body.trace_chain[0].frames[length - 1].locals.error,
      '<Error object>',
    );
    assert.equal(
      data.body.trace_chain[0].frames[length - 2].locals.timer,
      '<Timeout object>',
    );
  } else {
    // Node <=8; locals disabled
    assert.equal(data.body.trace_chain[0].frames[length - 1].locals, undefined);
    assert.equal(data.body.trace_chain[0].frames[length - 2].locals, undefined);
  }
  addItemStub.restore();
}

function verifyCaughtError(r) {
  var addItemStub = r.addItemStub;

  assert.isTrue(addItemStub.called);
  var data = addItemStub.getCall(0).args[3].data;
  assert.equal(data.body.trace_chain[0].exception.message, 'caught error');
  var length = data.body.trace_chain[0].frames.length;
  assert.ok(length > 1);

  if (nodeMajorVersion >= 18) {
    // Node >=18; locals only in top frame
    assert.equal(
      data.body.trace_chain[0].frames[length - 1].locals.error,
      '<Error object>',
    );
    assert.equal(data.body.trace_chain[0].frames[length - 2].locals, undefined);
  } else if (nodeMajorVersion >= 10) {
    // Node 10..<18; locals enabled
    assert.equal(
      data.body.trace_chain[0].frames[length - 1].locals.error,
      '<Error object>',
    );
    assert.equal(
      data.body.trace_chain[0].frames[length - 2].locals.timer,
      '<Timeout object>',
    );
  } else {
    assert.equal(data.body.trace_chain[0].frames[length - 1].locals, undefined);
    assert.equal(data.body.trace_chain[0].frames[length - 2].locals, undefined);
  }
  addItemStub.restore();
}

function verifyNestedError(r) {
  var addItemStub = r.addItemStub;

  assert.isTrue(addItemStub.called);
  var data = addItemStub.getCall(0).args[3].data;
  assert.equal(data.body.trace_chain[0].exception.message, 'test error');
  assert.equal(data.body.trace_chain[1].exception.message, 'nested test error');
  var length = data.body.trace_chain[0].frames.length;
  assert.ok(length > 1);

  if (nodeMajorVersion >= 18) {
    // Node >=18; locals only in top frame
    assert.equal(
      data.body.trace_chain[0].frames[length - 1].locals.message,
      'test error',
    );
    assert.equal(
      data.body.trace_chain[0].frames[length - 1].locals.password,
      '********',
    );
    assert.equal(
      data.body.trace_chain[0].frames[length - 1].locals.err,
      '<Error object>',
    );
    assert.equal(
      data.body.trace_chain[0].frames[length - 1].locals.newMessage,
      'nested test error',
    );
    assert.equal(data.body.trace_chain[0].frames[length - 2].locals, undefined);

    length = data.body.trace_chain[1].frames.length;
    assert.ok(length > 1);
    assert.equal(
      data.body.trace_chain[1].frames[length - 1].locals.nestedMessage,
      'nested test error',
    );
    assert.equal(
      data.body.trace_chain[1].frames[length - 1].locals._password,
      '123456',
    );
    assert.equal(
      data.body.trace_chain[1].frames[length - 1].locals.nestedError,
      '<Error object>',
    );
    assert.equal(data.body.trace_chain[1].frames[length - 2].locals, undefined);
  } else if (nodeMajorVersion >= 10) {
    // Node >=10; locals enabled
    assert.equal(
      data.body.trace_chain[0].frames[length - 1].locals.err,
      '<Error object>',
    );
    assert.equal(
      data.body.trace_chain[0].frames[length - 2].locals.timer,
      '<Timeout object>',
    );

    length = data.body.trace_chain[1].frames.length;
    assert.ok(length > 1);
    assert.equal(
      data.body.trace_chain[1].frames[length - 1].locals.nestedMessage,
      'nested test error',
    );
    assert.equal(
      data.body.trace_chain[1].frames[length - 1].locals.nestedError,
      '<Error object>',
    );
    assert.equal(
      data.body.trace_chain[1].frames[length - 2].locals.message,
      'test error',
    );
    assert.equal(
      data.body.trace_chain[1].frames[length - 2].locals.password,
      '********',
    );
    assert.equal(
      data.body.trace_chain[1].frames[length - 2].locals.err,
      '<Error object>',
    );
    assert.equal(
      data.body.trace_chain[1].frames[length - 2].locals.newMessage,
      'nested test error',
    );
  } else {
    // Node <=8; locals disabled
    assert.equal(data.body.trace_chain[0].frames[length - 1].locals, undefined);
    assert.equal(data.body.trace_chain[0].frames[length - 2].locals, undefined);
  }
  addItemStub.restore();
}

function verifyRejectedPromise(r) {
  var addItemStub = r.addItemStub;

  assert.isTrue(addItemStub.called);
  var data = addItemStub.getCall(0).args[3].data;
  assert.equal(data.body.trace_chain[0].exception.message, 'promise reject');
  var length = data.body.trace_chain[0].frames.length;
  assert.ok(length > 1);

  if (nodeMajorVersion >= 18) {
    // Node >=18; locals only in top frame
    assert.equal(
      data.body.trace_chain[0].frames[length - 1].locals.error,
      '<Error object>',
    );
    assert.equal(
      data.body.trace_chain[0].frames[length - 1].locals.callback,
      '<Function object>',
    );
    assert.equal(
      data.body.trace_chain[0].frames[length - 1].locals.rollbar,
      '<Rollbar object>',
    );
    assert.equal(data.body.trace_chain[0].frames[length - 2].locals, undefined);
  } else if (nodeMajorVersion >= 10) {
    // Node >=10; locals enabled
    assert.equal(
      data.body.trace_chain[0].frames[length - 1].locals.error,
      '<Error object>',
    );
    assert.equal(
      data.body.trace_chain[0].frames[length - 1].locals.rollbar,
      '<Rollbar object>',
    );
    assert.equal(
      data.body.trace_chain[0].frames[length - 2].locals.notifier,
      '<Notifier object>',
    );
    assert.equal(
      data.body.trace_chain[0].frames[length - 2].locals.r,
      '<Rollbar object>',
    );
  } else {
    // Node <=8; locals disabled
    assert.equal(data.body.trace_chain[0].frames[length - 1].locals, undefined);
    assert.equal(data.body.trace_chain[0].frames[length - 2].locals, undefined);
  }
  addItemStub.restore();
}

function verifyDefaultOptions(options) {
  assert.equal(options.enabled, true);
  assert.equal(options.uncaughtOnly, true);
  assert.equal(options.depth, 1);
  assert.equal(options.maxProperties, 30);
  assert.equal(options.maxArray, 5);
}

vows
  .describe('locals')
  .addBatch({
    enabled: {
      topic: function () {
        var rollbar = new Rollbar({
          accessToken: 'abc123',
          captureUncaught: true,
          captureUnhandledRejections: true,
          locals: { module: Locals, uncaughtOnly: true, depth: 0 },
        });
        var notifier = rollbar.client.notifier;
        rollbar.addItemStub = sinon.stub(notifier.queue, 'addItem');

        nodeThrow(rollbar, this.callback);
      },
      'should include locals': function (_err, r) {
        verifyThrownError(r);
      },
      'then disabled': {
        topic: function (_err, r) {
          r.configure({ locals: { enabled: false } });
          var notifier = r.client.notifier;
          assert.ok(notifier);
          r.addItemStub = sinon.stub(notifier.queue, 'addItem');

          nodeThrowNested(r, this.callback);
        },
        'should not include locals': function (_err, r) {
          var addItemStub = r.addItemStub;
          assert.ok(addItemStub);

          assert.isTrue(addItemStub.called);
          var data = addItemStub.getCall(0).args[3].data;
          assert.equal(
            data.body.trace_chain[0].exception.message,
            'test error',
          );
          assert.equal(
            data.body.trace_chain[1].exception.message,
            'nested test error',
          );
          var length = data.body.trace_chain[0].frames.length;
          assert.ok(length > 1);
          assert.equal(
            data.body.trace_chain[0].frames[length - 1].locals,
            undefined,
          );
          assert.equal(
            data.body.trace_chain[0].frames[length - 2].locals,
            undefined,
          );
          addItemStub.restore();
        },
        'then enabled': {
          topic: function (_err, r) {
            r.configure({ locals: { enabled: true, uncaughtOnly: false } });
            var notifier = r.client.notifier;
            r.addItemStub = sinon.stub(notifier.queue, 'addItem');

            promiseReject(r, this.callback);
          },
          'should include locals': function (_err, r) {
            verifyRejectedPromise(r);
          },
        },
      },
    },
  })

  .addBatch({
    'on caught error': {
      'uncaughtOnly: true': {
        topic: function () {
          var rollbar = new Rollbar({
            accessToken: 'abc123',
            captureUncaught: true,
            captureUnhandledRejections: true,
            locals: { module: Locals, uncaughtOnly: true, depth: 0 },
          });
          var notifier = rollbar.client.notifier;
          rollbar.addItemStub = sinon.stub(notifier.queue, 'addItem');

          nodeThrowAndCatch(rollbar, this.callback);
        },
        'should not include locals': function (_err, r) {
          var addItemStub = r.addItemStub;

          assert.isTrue(addItemStub.called);
          var data = addItemStub.getCall(0).args[3].data;
          assert.equal(
            data.body.trace_chain[0].exception.message,
            'caught error',
          );
          var length = data.body.trace_chain[0].frames.length;
          assert.ok(length > 1);
          assert.equal(
            data.body.trace_chain[0].frames[length - 1].locals,
            undefined,
          );
          assert.equal(
            data.body.trace_chain[0].frames[length - 2].locals,
            undefined,
          );

          addItemStub.restore();
        },
        'then uncaughtOnly: false': {
          topic: function (_err, r) {
            r.configure({ locals: { uncaughtOnly: false } });
            var notifier = r.client.notifier;
            r.addItemStub = sinon.stub(notifier.queue, 'addItem');

            nodeThrowAndCatch(r, this.callback);
          },
          'should include locals': function (_err, r) {
            verifyCaughtError(r);
          },
        },
      },
    },
  })

  .addBatch({
    'on exception': {
      uncaught: {
        topic: function () {
          var rollbar = new Rollbar({
            accessToken: 'abc123',
            captureUncaught: true,
            captureUnhandledRejections: true,
            locals: { module: Locals, uncaughtOnly: true, depth: 0 },
          });
          var notifier = rollbar.client.notifier;
          rollbar.addItemStub = sinon.stub(notifier.queue, 'addItem');

          nodeThrow(rollbar, this.callback);
        },
        'should include locals': function (_err, r) {
          verifyThrownError(r);
        },
      },
    },
  })

  .addBatch({
    'on exception': {
      nested: {
        topic: function () {
          var rollbar = new Rollbar({
            accessToken: 'abc123',
            captureUncaught: true,
            locals: { module: Locals, uncaughtOnly: false, depth: 0 },
          });
          var notifier = rollbar.client.notifier;
          rollbar.addItemStub = sinon.stub(notifier.queue, 'addItem');

          nodeThrowNested(rollbar, this.callback);
        },
        'should include locals': function (_err, r) {
          verifyNestedError(r);
        },
      },
    },
  })

  .addBatch({
    'on exception': {
      'promise rejection': {
        topic: function () {
          var r = new Rollbar({
            accessToken: 'abc123',
            captureUnhandledRejections: true,
            locals: { module: Locals, uncaughtOnly: false, depth: 0 },
          });
          var notifier = r.client.notifier;
          r.addItemStub = sinon.stub(notifier.queue, 'addItem');

          promiseReject(r, this.callback);
        },
        'should include locals': function (_err, r) {
          verifyRejectedPromise(r);
        },
      },
    },
  })

  .addBatch({
    'on exception': {
      'with custom options': {
        topic: function () {
          var rollbar = new Rollbar({
            accessToken: 'abc123',
            captureUncaught: true,
            locals: { module: Locals, depth: 2, maxProperties: 5, maxArray: 2 },
          });
          var notifier = rollbar.client.notifier;
          rollbar.addItemStub = sinon.stub(notifier.queue, 'addItem');

          nodeThrowWithNestedLocals(rollbar, this.callback);
        },
        'should include locals': function (_err, r) {
          var addItemStub = r.addItemStub;

          assert.isTrue(addItemStub.called);
          var data = addItemStub.getCall(0).args[3].data;
          assert.equal(
            data.body.trace_chain[0].exception.message,
            'node error',
          );
          if (nodeMajorVersion < 10) {
            // Node 8; locals disabled
            var length = data.body.trace_chain[0].frames.length;
            assert.equal(
              data.body.trace_chain[0].frames[length - 1].locals,
              undefined,
            );
          } else {
            var length = data.body.trace_chain[0].frames.length;
            assert.equal(
              Object.keys(
                data.body.trace_chain[0].frames[length - 1].locals.obj,
              ).length,
              5,
            );
            assert.deepEqual(
              data.body.trace_chain[0].frames[length - 1].locals.obj,
              { a: 'a', b: 'b', c: 'c', d: 'd', e: 'e' },
            );
            assert.equal(
              data.body.trace_chain[0].frames[length - 1].locals.arr.length,
              2,
            );
            assert.deepEqual(
              data.body.trace_chain[0].frames[length - 1].locals.arr[0],
              { zero: '<Array object>' },
            );
            assert.deepEqual(
              data.body.trace_chain[0].frames[length - 1].locals.arr[1],
              { one: 1 },
            );
            assert.deepEqual(
              data.body.trace_chain[0].frames[length - 1].locals.password,
              '********',
            );
            assert.deepEqual(
              data.body.trace_chain[0].frames[length - 1].locals.sym,
              'Symbol(foo)',
            );
          }
          addItemStub.reset();
          Locals.session = undefined;
        },
      },
    },
  })

  .addBatch({
    'on exception': {
      'with recursive stack': {
        topic: function () {
          var rollbar = new Rollbar({
            accessToken: 'abc123',
            captureUncaught: true,
            locals: Locals,
          });
          var notifier = rollbar.client.notifier;
          rollbar.addItemStub = sinon.stub(notifier.queue, 'addItem');

          nodeThrowRecursionError(rollbar, this.callback);
        },
        'should include locals': function (_err, r) {
          var addItemStub = r.addItemStub;

          assert.isTrue(addItemStub.called);
          var data = addItemStub.getCall(0).args[3].data;
          assert.equal(
            data.body.trace_chain[0].exception.message,
            'deep stack error, limit=3',
          );
          var length = data.body.trace_chain[0].frames.length;
          assert.ok(length > 1);

          if (nodeMajorVersion >= 18) {
            // Node >=18; locals only in top frame
            assert.deepEqual(
              data.body.trace_chain[0].frames[length - 1].locals,
              { curr: 3, limit: 3 },
            );
            assert.equal(
              data.body.trace_chain[0].frames[length - 2].locals,
              undefined,
            );
            assert.equal(
              data.body.trace_chain[0].frames[length - 3].locals,
              undefined,
            );
          } else if (nodeMajorVersion >= 10) {
            // Node >=10; locals enabled
            assert.deepEqual(
              data.body.trace_chain[0].frames[length - 1].locals,
              { curr: 3, limit: 3 },
            );
            assert.deepEqual(
              data.body.trace_chain[0].frames[length - 2].locals,
              { curr: 2, limit: 3 },
            );
            assert.deepEqual(
              data.body.trace_chain[0].frames[length - 3].locals,
              { curr: 1, limit: 3 },
            );
          } else {
            // Node <=8; locals disabled
            assert.equal(
              data.body.trace_chain[0].frames[length - 1].locals,
              undefined,
            );
          }
          addItemStub.reset();
          Locals.session = undefined;
        },
      },
    },
  })

  .addBatch({
    constructor: {
      'passing true boolean': {
        topic: function () {
          return new Locals(true, logger);
        },
        'should use defaults': function (locals) {
          verifyDefaultOptions(locals.options);
        },
      },
      'passing false boolean': {
        topic: function () {
          return new Locals(false, logger);
        },
        'should use defaults': function (locals) {
          verifyDefaultOptions(locals.options);
        },
      },
      'passing empty object': {
        topic: function () {
          return new Locals({}, logger);
        },
        'should use defaults': function (locals) {
          verifyDefaultOptions(locals.options);
        },
      },
      'passing depth option': {
        topic: function () {
          return new Locals({ depth: 0 }, logger);
        },
        'should use updated depth with remaining defaults': function (locals) {
          var options = locals.options;

          assert.equal(options.enabled, true);
          assert.equal(options.uncaughtOnly, true);
          assert.equal(options.depth, 0);
          assert.equal(options.maxProperties, 30);
          assert.equal(options.maxArray, 5);
        },
      },
      'passing enabled option': {
        topic: function () {
          return new Locals({ enabled: false }, logger);
        },
        'should use updated enabled with remaining defaults': function (
          locals,
        ) {
          var options = locals.options;

          assert.equal(options.enabled, false);
          assert.equal(options.uncaughtOnly, true);
          assert.equal(options.depth, 1);
          assert.equal(options.maxProperties, 30);
          assert.equal(options.maxArray, 5);
        },
      },
      'passing uncaughtOnly option': {
        topic: function () {
          return new Locals({ uncaughtOnly: false }, logger);
        },
        'should use updated uncaughtOnly with remaining defaults': function (
          locals,
        ) {
          var options = locals.options;

          assert.equal(options.enabled, true);
          assert.equal(options.uncaughtOnly, false);
          assert.equal(options.depth, 1);
          assert.equal(options.maxProperties, 30);
          assert.equal(options.maxArray, 5);
        },
      },
      'passing all options': {
        topic: function () {
          return new Locals(
            {
              enabled: false,
              uncaughtOnly: false,
              depth: 2,
              maxProperties: 15,
              maxArray: 10,
            },
            logger,
          );
        },
        'should use updated options': function (locals) {
          var options = locals.options;

          assert.equal(options.enabled, false);
          assert.equal(options.uncaughtOnly, false);
          assert.equal(options.depth, 2);
          assert.equal(options.maxProperties, 15);
          assert.equal(options.maxArray, 10);
        },
      },
    },
  })

  // The following tests stub a singleton (Locals.session.post()), and need to run sequentially.
  // One way to do this in vows is to put each in a separate batch.
  .addBatch({
    'mergeLocals returns error from session.post()': {
      topic: function () {
        var locals = new Locals({}, logger);
        var err = new Error('post error');
        sinon.stub(Locals.session, 'post').yields(err);

        var key = 'key';
        var localsMap = new Map();
        localsMap.set('key', localsFixtures.maps.simple);

        var stack = localsFixtures.stacks.simple;

        locals.mergeLocals(localsMap, stack, key, this.callback);
      },
      'should callback with error': function (err) {
        assert.instanceOf(err, Error);
        assert.isTrue(err.stack.startsWith('Error: post error'));
        assert.equal(err.message, 'post error');
        sinon.restore();
      },
    },
  })
  .addBatch({
    'mergeLocals called with multiple/complex locals maps present': {
      // Sets up several conditions for test:
      // * URLs with and without 'file://' prefix.
      // * Intended locals map key isn't the first or only entry.
      // * Other scopes besides type: 'local' are present.
      // * Transpiled code (Typescript) present in stack
      topic: function () {
        var getPropertiesResponses = {
          objectId1: [
            localsFixtures.locals.object1,
            localsFixtures.locals.object2,
          ],
          objectId2: [
            localsFixtures.locals.boolean1,
            localsFixtures.locals.boolean2,
          ],
          objectId3: [
            localsFixtures.locals.string1,
            localsFixtures.locals.array1,
          ],
        };

        var locals = new Locals({ depth: 0 }, logger);
        sinon
          .stub(Locals.session, 'post')
          .callsFake(fakeSessionPostHandler(getPropertiesResponses));

        var key1 = 'key1';
        var key2 = 'key2';
        var localsMap = new Map();

        // Test with multiple maps present.
        localsMap.set(key1, localsFixtures.maps.simple);
        localsMap.set(key2, localsFixtures.maps.complex); // Stack will match the 2nd locals map added.

        var stack = cloneStack(localsFixtures.stacks.complex);

        var self = this;
        locals.mergeLocals(localsMap, stack, key2, function (err) {
          self.callback(err, stack);
        });
      },
      'should callback with merged locals': function (err, stack) {
        if (err) {
          // Ensure unexpected error can be seen.
          console.log(err);
        }
        assert.isNull(err);

        assert.equal(stack[0].locals.response, 'success');
        assert.equal(stack[0].locals.args, '<Array object>');
        assert.equal(stack[1].locals.old, false);
        assert.equal(stack[1].locals.new, true);
        assert.equal(stack[2].locals.foo, '<FooClass object>');
        assert.equal(stack[2].locals.bar, '<BarClass object>');

        sinon.restore();
      },
    },
  })
  .addBatch({
    'mergeLocals called with simple locals maps present': {
      topic: function () {
        var getPropertiesResponses = {
          objectId1: [
            localsFixtures.locals.object1,
            localsFixtures.locals.object2,
          ],
        };

        var locals = new Locals({ depth: 0 }, logger);
        sinon
          .stub(Locals.session, 'post')
          .callsFake(fakeSessionPostHandler(getPropertiesResponses));

        var key = 'key';
        var localsMap = new Map();

        localsMap.set(key, localsFixtures.maps.simple);

        var stack = cloneStack(localsFixtures.stacks.simple);

        var self = this;
        locals.mergeLocals(localsMap, stack, key, function (err) {
          self.callback(err, stack);
        });
      },
      'should callback with merged locals': function (err, stack) {
        if (err) {
          // Ensure unexpected error can be seen.
          console.log(err);
        }
        assert.isNull(err);

        assert.equal(stack[0].locals.foo, '<FooClass object>');
        assert.equal(stack[0].locals.bar, '<BarClass object>');

        sinon.restore();
      },
    },
  })
  .addBatch({
    'mergeLocals called with depth = 1': {
      topic: function () {
        var getPropertiesResponses = {
          objectId1: [
            localsFixtures.locals.object1,
            localsFixtures.locals.object2,
          ],
          nestedProps1: [
            localsFixtures.locals.string1,
            localsFixtures.locals.boolean1,
            localsFixtures.locals.function1,
          ],
          nestedProps2: [
            localsFixtures.locals.array1,
            localsFixtures.locals.null1,
            localsFixtures.locals.function2,
          ],
        };

        var locals = new Locals({ depth: 1 }, logger);
        sinon
          .stub(Locals.session, 'post')
          .callsFake(fakeSessionPostHandler(getPropertiesResponses));

        var key = 'key';
        var localsMap = new Map();

        localsMap.set(key, localsFixtures.maps.simple);

        var stack = cloneStack(localsFixtures.stacks.simple);

        var self = this;
        locals.mergeLocals(localsMap, stack, key, function (err) {
          self.callback(err, stack);
        });
      },
      'should callback with merged locals': function (err, stack) {
        if (err) {
          // Ensure unexpected error can be seen.
          console.log(err);
        }
        assert.isNull(err);

        assert.deepEqual(stack[0].locals.foo, {
          response: 'success',
          old: false,
          func: '<Function object>',
        });
        assert.deepEqual(stack[0].locals.bar, {
          args: '<Array object>',
          parent: null,
          asyncFunc: '<AsyncFunction object>',
        });

        sinon.restore();
      },
    },
  })
  .addBatch({
    'mergeLocals called with no locals maps present': {
      topic: function () {
        var getPropertiesResponses = {
          objectId1: [
            localsFixtures.locals.object1,
            localsFixtures.locals.object2,
          ],
          objectId2: [
            localsFixtures.locals.boolean1,
            localsFixtures.locals.boolean2,
          ],
          objectId3: [
            localsFixtures.locals.string1,
            localsFixtures.locals.array1,
          ],
        };

        var locals = new Locals({}, logger);
        sinon
          .stub(Locals.session, 'post')
          .callsFake(fakeSessionPostHandler(getPropertiesResponses));

        // Test with no maps present. 'key' won't match anything.
        var key = 'key';
        var localsMap = new Map();

        var stack = cloneStack(localsFixtures.stacks.complex);

        var self = this;
        locals.mergeLocals(localsMap, stack, key, function (err) {
          self.callback(err, stack);
        });
      },
      'should succeed without merged locals': function (err, stack) {
        if (err) {
          // Ensure unexpected error can be seen.
          console.log(err);
        }
        assert.isNull(err);

        assert.equal(stack[0].locals, undefined);
        assert.equal(stack[1].locals, undefined);
        assert.equal(stack[2].locals, undefined);

        sinon.restore();
      },
    },
  })
  .addBatch({
    'mergeLocals called with no local scopes in map': {
      topic: function () {
        var getPropertiesResponses = {
          objectId1: [
            localsFixtures.locals.object1,
            localsFixtures.locals.object2,
          ],
          objectId2: [
            localsFixtures.locals.boolean1,
            localsFixtures.locals.boolean2,
          ],
          objectId3: [
            localsFixtures.locals.string1,
            localsFixtures.locals.array1,
          ],
        };

        var locals = new Locals({}, logger);
        sinon
          .stub(Locals.session, 'post')
          .callsFake(fakeSessionPostHandler(getPropertiesResponses));

        var key = 'key';
        var localsMap = new Map();

        localsMap.set(key, localsFixtures.maps.noLocalScope);

        var stack = cloneStack(localsFixtures.stacks.complex);

        var self = this;
        locals.mergeLocals(localsMap, stack, key, function (err) {
          self.callback(err, stack);
        });
      },
      'should succeed without merged locals': function (err, stack) {
        if (err) {
          // Ensure unexpected error can be seen.
          console.log(err);
        }
        assert.isNull(err);

        assert.equal(stack[0].locals, undefined);
        assert.equal(stack[1].locals, undefined);
        assert.equal(stack[2].locals, undefined);

        sinon.restore();
      },
    },
  })
  .addBatch({
    'currentLocalsMap called with no local scopes in map': {
      topic: function () {
        var locals = new Locals({}, logger);

        // Ensure empty map, as vows uses the same class object between tests.
        Locals.currentErrors = new Map();

        return locals;
      },
      'should return empty map': function (locals) {
        var localsMap = locals.currentLocalsMap();

        assert.instanceOf(localsMap, Map);
        assert.equal(localsMap.size, 0);
      },
    },
  })
  .export(module, { error: false });
