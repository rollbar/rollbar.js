'use strict';

var assert = require('assert');
var vows = require('vows');
var sinon = require('sinon');

process.env.NODE_ENV = process.env.NODE_ENV || 'test-node-env';
var Rollbar = require('../src/server/rollbar');

function promisePending(promise, callback) {
  var testValue = 'test-pending';

  // Detect if a given promise is pending/unfulfilled using the
  // behavior of Promise.race(), which always returns the first
  // already resolved promise in the array.
  Promise.race([promise, Promise.resolve(testValue)])
    .then(function (value) {
      if (value === testValue) {
        return callback(true);
      } else {
        return callback(false);
      }
    })
    .catch(function (_error) {
      return callback(false);
    });
}

function fakePostItem(_item, callback) {
  // 1000ms simulates low API response, and allows testing the state before completion.
  setTimeout(function () {
    callback();
  }, 1000);
}

var stubContext = {
  getRemainingTimeInMillis: function () {
    return 2000;
  },
};

vows
  .describe('lambda')
  .addBatch({
    'async handler sends message': {
      topic: function () {
        var rollbar = new Rollbar({
          accessToken: 'abc123',
          captureUncaught: true,
          captureLambdaTimeouts: false,
        });
        var api = rollbar.client.notifier.queue.api;
        rollbar.requestStub = sinon
          .stub(api, 'postItem')
          .callsFake(fakePostItem);

        rollbar.testHandlerInstance = rollbar.lambdaHandler(
          async (_event, _context) => {
            // Testing the condition where the client handler sends a message before exit.
            // The Rollbar wrapper should send, and should not resolve until the API request
            // has completed.
            rollbar.info('lambda test message');
            return 'done';
          },
        );

        return rollbar;
      },
      'invokes handler and receives promise': function (r) {
        var handler = r.testHandlerInstance;

        // rollbar.lambdaHandler in the above topic should have returned a
        // handler with the correct signature. (The callback handler is length = 3)
        assert.equal(handler.length, 2);
        assert.equal(handler.name, 'rollbarAsyncLambdaHandler');

        // The rollbar.wait() in the wrapper should prevent this from
        // resolving until the response is received.
        r.testPromise = handler({}, stubContext);
      },
      'after handler invoked': {
        topic: function (r) {
          var callback = this.callback;

          // This timeout allows a few extra ticks so that without the wait in
          // the wrapper this test should fail.
          setTimeout(function () {
            promisePending(r.testPromise, function (pending) {
              r.promiseIsPending = pending;
              callback(r);
            });
          }, 10);
        },
        'promise is pending': function (r) {
          assert.isTrue(r.promiseIsPending);
        },
        'after promise resolved': {
          topic: function (r) {
            var callback = this.callback;

            r.testPromise.then(function (value) {
              assert.equal(value, 'done');
              callback(r);
            });
          },
          'sends message before exit': function (r) {
            var requestStub = r.requestStub;

            // If the handler is allowed to exit prematurely, this will fail.
            assert.isTrue(requestStub.called);
            var data = requestStub.getCall(0).args[0];
            assert.equal(data.body.message.body, 'lambda test message');

            requestStub.reset();
          },
        },
      },
    },
  })
  .addBatch({
    'async handler catches exception': {
      topic: function () {
        var rollbar = new Rollbar({
          accessToken: 'abc123',
          captureUncaught: true,
          captureLambdaTimeouts: false,
        });
        var api = rollbar.client.notifier.queue.api;
        rollbar.requestStub = sinon
          .stub(api, 'postItem')
          .callsFake(fakePostItem);

        rollbar.testHandlerInstance = rollbar.lambdaHandler(
          async (_event, _context) => {
            // Testing the condition where the client handler throws.
            // The Rollbar wrapper should catch and report, and should not reject
            // until the API request has completed.
            throw new Error('lambda test error');
          },
        );

        return rollbar;
      },
      'invokes handler and receives promise': function (r) {
        var handler = r.testHandlerInstance;

        // rollbar.lambdaHandler in the above topic should have returned a
        // handler with the correct signature. (The callback handler is length = 3)
        assert.equal(handler.length, 2);
        assert.equal(handler.name, 'rollbarAsyncLambdaHandler');

        // The rollbar.wait() in the wrapper should prevent this from
        // resolving until the response is received.
        r.testPromise = handler({}, stubContext);
      },
      'after handler invoked': {
        topic: function (r) {
          var callback = this.callback;

          promisePending(r.testPromise, function (pending) {
            r.promiseIsPending = pending;
            callback(r);
          });
        },
        'promise is pending': function (r) {
          assert.isTrue(r.promiseIsPending);
        },
        'after promise rejected': {
          topic: function (r) {
            var callback = this.callback;

            r.testPromise.catch(function (error) {
              assert.equal(error.message, 'lambda test error');
              callback(r);
            });
          },
          'sends message before exit': function (r) {
            var requestStub = r.requestStub;

            // If the handler is allowed to exit prematurely, this will fail.
            assert.isTrue(requestStub.called);
            var data = requestStub.getCall(0).args[0];
            assert.equal(
              data.body.trace_chain[0].exception.message,
              'lambda test error',
            );

            requestStub.reset();
          },
        },
      },
    },
  })
  .export(module, { error: false });
