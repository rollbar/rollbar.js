'use strict';

var assert = require('assert');
var vows = require('vows');
var sinon = require('sinon');

process.env.NODE_ENV = process.env.NODE_ENV || 'test-node-env';
var Rollbar = require('../src/server/rollbar');
var Locals = require('../src/server/locals');
var localsFixtures = require('./fixtures/locals.fixtures');

var nodeMajorVersion = process.versions.node.split('.')[0];

async function wait(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

async function promiseReject(rollbar, callback) {
  var error = new Error('promise reject');

  Promise.reject(error);
  await wait(500);
  callback(rollbar);
}

async function nodeThrow(rollbar, callback) {
  setTimeout(function () {
    var error = new Error('node error');
    throw error;
  }, 1);
  await wait(500);
  callback(rollbar);
}

function nestedError(nestedMessage, _password) {
  var nestedError = new Error(nestedMessage);
  throw(nestedError);
}

async function nodeThrowNested(rollbar, callback) {
  setTimeout(function () {
    var message = 'test error';
    var password = '123456';
    var err = new Error(message);

    try {
      var newMessage = 'nested ' + message;
      nestedError(newMessage, password)
    } catch (e) {
      err.nested = e;
    }

    throw err;
  }, 1);
  await wait(500);
  callback(rollbar);
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
  }
}

function cloneStack(stack) {
  // Deep clone, because stack gets modified by mergeLocals
  // and we don't want to modify the test fixtures.
  return JSON.parse(JSON.stringify(stack));
}

vows.describe('locals')
  .addBatch({
    'on exception': {
      'uncaught': {
        topic: function() {
          var rollbar = new Rollbar({
            accessToken: 'abc123',
            captureUncaught: true,
            locals: true
          });
          var notifier = rollbar.client.notifier;
          rollbar.addItemStub = sinon.stub(notifier.queue, 'addItem');

          nodeThrow(rollbar, this.callback);
        },
        'should include locals': function(r) {
          var addItemStub = r.addItemStub;

          assert.isTrue(addItemStub.called);
          var data = addItemStub.getCall(0).args[3].data;
          assert.equal(data.body.trace_chain[0].exception.message, 'node error');
          if (nodeMajorVersion < 10) {
            // Node 8; locals disabled
            var length = data.body.trace_chain[0].frames.length;
            assert.equal(data.body.trace_chain[0].frames[length-1].locals, undefined);
            assert.equal(data.body.trace_chain[0].frames[length-2].locals, undefined);
          } else {
            var length = data.body.trace_chain[0].frames.length;
            assert.equal(data.body.trace_chain[0].frames[length-1].locals.error, '<Error object>');
            assert.equal(data.body.trace_chain[0].frames[length-2].locals.timer, '<Timeout object>');
          }
          addItemStub.reset();
          Locals.session = undefined;
        },
        'nested': {
          topic: function() {
            var rollbar = new Rollbar({
              accessToken: 'abc123',
              captureUncaught: true,
              locals: true
            });
            var notifier = rollbar.client.notifier;
            rollbar.addItemStub = sinon.stub(notifier.queue, 'addItem');

            nodeThrowNested(rollbar, this.callback);
          },
          'should include locals': function(r) {
            var addItemStub = r.addItemStub;

            assert.isTrue(addItemStub.called);
            var data = addItemStub.getCall(0).args[3].data;
            assert.equal(data.body.trace_chain[0].exception.message, 'test error');
            assert.equal(data.body.trace_chain[1].exception.message, 'nested test error');
            if (nodeMajorVersion < 10) {
              // Node 8; locals disabled
              var length = data.body.trace_chain[0].frames.length;
              assert.equal(data.body.trace_chain[0].frames[length-1].locals, undefined);
              assert.equal(data.body.trace_chain[0].frames[length-2].locals, undefined);
            } else {
              var length = data.body.trace_chain[0].frames.length;
              assert.equal(data.body.trace_chain[0].frames[length-1].locals.err, '<Error object>');
              assert.equal(data.body.trace_chain[0].frames[length-2].locals.timer, '<Timeout object>');

              length = data.body.trace_chain[1].frames.length;
              assert.equal(data.body.trace_chain[1].frames[length-1].locals.nestedMessage, 'nested test error');
              assert.equal(data.body.trace_chain[1].frames[length-1].locals.nestedError, '<Error object>');
              assert.equal(data.body.trace_chain[1].frames[length-2].locals.message, 'test error');
              assert.equal(data.body.trace_chain[1].frames[length-2].locals.password, '********');
              assert.equal(data.body.trace_chain[1].frames[length-2].locals.err, '<Error object>');
              assert.equal(data.body.trace_chain[1].frames[length-2].locals.newMessage, 'nested test error');
            }
            addItemStub.reset();
            Locals.session = undefined;
          },
          'promise rejection': {
            topic: function() {
              var rollbar = new Rollbar({
                accessToken: 'abc123',
                captureUnhandledRejections: true,
                locals: true
              });
              var notifier = rollbar.client.notifier;
              rollbar.addItemStub = sinon.stub(notifier.queue, 'addItem');

              promiseReject(rollbar, this.callback);
            },
            'should include locals': function(r) {
              var addItemStub = r.addItemStub;

              assert.isTrue(addItemStub.called);
              var data = addItemStub.getCall(0).args[3].data;
              assert.equal(data.body.trace_chain[0].exception.message, 'promise reject');
              if (nodeMajorVersion < 10) {
                // Node 8; locals disabled
                var length = data.body.trace_chain[0].frames.length;
                assert.equal(data.body.trace_chain[0].frames[length-1].locals, undefined);
                assert.equal(data.body.trace_chain[0].frames[length-2].locals, undefined);
              } else {
                var length = data.body.trace_chain[0].frames.length;
                assert.equal(data.body.trace_chain[0].frames[length-1].locals.error, '<Error object>');
                assert.equal(data.body.trace_chain[0].frames[length-1].locals.rollbar, '<Rollbar object>');
                assert.equal(data.body.trace_chain[0].frames[length-2].locals.notifier, '<Notifier object>');
                assert.equal(data.body.trace_chain[0].frames[length-2].locals.rollbar, '<Rollbar object>');
              }
              addItemStub.reset();
              Locals.session = undefined;
            },
          }
        }
      },
    }
  })

  // The following tests stub a singleton (Locals.session.post()), and need to run sequentially.
  // One way to do this in vows is to put each in a separate batch.
  .addBatch({
    'mergeLocals returns error from session.post()': {
      topic: function() {
        var locals = new Locals();
        var err = new Error('post error');
        sinon.stub(Locals.session, 'post').yields(err);

        var key = 'key';
        var localsMap = new Map();
        localsMap.set('key', localsFixtures.maps.simple);

        var stack = localsFixtures.stacks.simple;

        locals.mergeLocals(localsMap, stack, key, this.callback);
      },
      'should callback with error': function(err) {
        assert.instanceOf(err, Error);
        assert.isTrue(err.stack.startsWith('Error: post error'));
        assert.equal(err.message, 'post error');
        sinon.restore();
      }
    }
  })
  .addBatch({
    'mergeLocals called with multiple/complex locals maps present': {
      // Sets up several conditions for test:
      // * URLs with and without 'file://' prefix.
      // * Intended locals map key isn't the first or only entry.
      // * Other scopes besides type: 'local' are present.
      // * Transpiled code (Typescript) present in stack
      topic: function() {
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
        }

        var locals = new Locals();
        sinon.stub(Locals.session, 'post').callsFake(fakeSessionPostHandler(getPropertiesResponses));

        var key1 = 'key1';
        var key2 = 'key2';
        var localsMap = new Map();

        // Test with multiple maps present.
        localsMap.set(key1, localsFixtures.maps.simple);
        localsMap.set(key2, localsFixtures.maps.complex); // Stack will match the 2nd locals map added.

        var stack = cloneStack(localsFixtures.stacks.complex);

        var self = this;
        locals.mergeLocals(localsMap, stack, key2, function(err) {
          self.callback(err, stack);
        });
      },
      'should callback with merged locals': function(err, stack) {
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
      }
    }
  })
  .addBatch({
    'mergeLocals called with simple locals maps present': {
      topic: function() {
        var getPropertiesResponses = {
          objectId1: [
            localsFixtures.locals.object1,
            localsFixtures.locals.object2,
          ]
        }

        var locals = new Locals();
        sinon.stub(Locals.session, 'post').callsFake(fakeSessionPostHandler(getPropertiesResponses));

        var key = 'key';
        var localsMap = new Map();

        localsMap.set(key, localsFixtures.maps.simple);

        var stack = cloneStack(localsFixtures.stacks.simple);

        var self = this;
        locals.mergeLocals(localsMap, stack, key, function(err) {
          self.callback(err, stack);
        });
      },
      'should callback with merged locals': function(err, stack) {
        if (err) {
          // Ensure unexpected error can be seen.
          console.log(err);
        }
        assert.isNull(err);

        assert.equal(stack[0].locals.foo, '<FooClass object>');
        assert.equal(stack[0].locals.bar, '<BarClass object>');

        sinon.restore();
      }
    }
  })
  .addBatch({
    'mergeLocals called with no locals maps present': {
      topic: function() {
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
        }

        var locals = new Locals();
        sinon.stub(Locals.session, 'post').callsFake(fakeSessionPostHandler(getPropertiesResponses));

        // Test with no maps present. 'key' won't match anything.
        var key = 'key';
        var localsMap = new Map();

        var stack = cloneStack(localsFixtures.stacks.complex);

        var self = this;
        locals.mergeLocals(localsMap, stack, key, function(err) {
          self.callback(err, stack);
        });
      },
      'should succeed without merged locals': function(err, stack) {
        if (err) {
          // Ensure unexpected error can be seen.
          console.log(err);
        }
        assert.isNull(err);

        assert.equal(stack[0].locals, undefined);
        assert.equal(stack[1].locals, undefined);
        assert.equal(stack[2].locals, undefined);

        sinon.restore();
      }
    }
  })
  .addBatch({
    'mergeLocals called with no local scopes in map': {
      topic: function() {
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
        }

        var locals = new Locals();
        sinon.stub(Locals.session, 'post').callsFake(fakeSessionPostHandler(getPropertiesResponses));

        var key = 'key';
        var localsMap = new Map();

        localsMap.set(key, localsFixtures.maps.noLocalScope);

        var stack = cloneStack(localsFixtures.stacks.complex);

        var self = this;
        locals.mergeLocals(localsMap, stack, key, function(err) {
          self.callback(err, stack);
        });
      },
      'should succeed without merged locals': function(err, stack) {
        if (err) {
          // Ensure unexpected error can be seen.
          console.log(err);
        }
        assert.isNull(err);

        assert.equal(stack[0].locals, undefined);
        assert.equal(stack[1].locals, undefined);
        assert.equal(stack[2].locals, undefined);

        sinon.restore();
      }
    }
  })
  .addBatch({
    'currentLocalsMap called with no local scopes in map': {
      topic: function() {
        var locals = new Locals();

        // Ensure empty map, as vows uses the same class object between tests.
        Locals.currentErrors = new Map();

        return locals;
      },
      'should return empty map': function(locals) {
        var localsMap = locals.currentLocalsMap();

        assert.instanceOf(localsMap, Map);
        assert.equal(localsMap.size, 0);
      }
    }
  })
  .export(module, {error: false});
