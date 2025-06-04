/* globals describe */
/* globals it */
/* globals beforeEach */

import { expect } from 'chai';
import sinon from 'sinon';
import Rollbar from '../src/server/rollbar.js';

process.env.NODE_ENV = process.env.NODE_ENV || 'test-node-env';

function promisePending(promise, callback) {
  const testValue = 'test-pending';

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

const stubContext = {
  getRemainingTimeInMillis: function () {
    return 2000;
  },
};

describe('lambda', function () {
  describe('async handler sends message', function () {
    let rollbar;
    let handler;
    let requestStub;
    let testPromise;

    beforeEach(function () {
      rollbar = new Rollbar({
        accessToken: 'abc123',
        captureUncaught: true,
        captureLambdaTimeouts: false,
      });
      const api = rollbar.client.notifier.queue.api;
      requestStub = sinon.stub(api, 'postItem').callsFake(fakePostItem);

      handler = rollbar.lambdaHandler(async (_event, _context) => {
        // Testing the condition where the client handler sends a message before exit.
        // The Rollbar wrapper should send, and should not resolve until the API request
        // has completed.
        rollbar.info('lambda test message');
        return 'done';
      });
    });

    it('invokes handler and receives promise', function () {
      // rollbar.lambdaHandler should have returned a
      // handler with the correct signature. (The callback handler is length = 3)
      expect(handler.length).to.equal(2);
      expect(handler.name).to.equal('rollbarAsyncLambdaHandler');

      // The rollbar.wait() in the wrapper should prevent this from
      // resolving until the response is received.
      testPromise = handler({}, stubContext);
    });

    it('promise is pending after handler invoked', function (done) {
      testPromise = handler({}, stubContext);

      // This timeout allows a few extra ticks so that without the wait in
      // the wrapper this test should fail.
      setTimeout(function () {
        promisePending(testPromise, function (pending) {
          expect(pending).to.be.true;
          done();
        });
      }, 10);
    });

    it('sends message before exit after promise resolved', function (done) {
      testPromise = handler({}, stubContext);

      testPromise.then(function (value) {
        expect(value).to.equal('done');

        // If the handler is allowed to exit prematurely, this will fail.
        expect(requestStub.called).to.be.true;
        const data = requestStub.getCall(0).args[0];
        expect(data.body.message.body).to.equal('lambda test message');

        requestStub.reset();
        done();
      });
    });
  });

  describe('async handler catches exception', function () {
    let rollbar;
    let handler;
    let requestStub;
    let testPromise;

    beforeEach(function () {
      rollbar = new Rollbar({
        accessToken: 'abc123',
        captureUncaught: true,
        captureLambdaTimeouts: false,
      });
      const api = rollbar.client.notifier.queue.api;
      requestStub = sinon.stub(api, 'postItem').callsFake(fakePostItem);

      handler = rollbar.lambdaHandler(async (_event, _context) => {
        // Testing the condition where the client handler throws.
        // The Rollbar wrapper should catch and report, and should not reject
        // until the API request has completed.
        throw new Error('lambda test error');
      });
    });

    it('invokes handler and receives promise', function () {
      // rollbar.lambdaHandler should have returned a
      // handler with the correct signature. (The callback handler is length = 3)
      expect(handler.length).to.equal(2);
      expect(handler.name).to.equal('rollbarAsyncLambdaHandler');

      // The rollbar.wait() in the wrapper should prevent this from
      // resolving until the response is received.
      testPromise = handler({}, stubContext);
    });

    it('promise is pending after handler invoked', function (done) {
      testPromise = handler({}, stubContext);

      promisePending(testPromise, function (pending) {
        expect(pending).to.be.true;
        done();
      });
    });

    it('sends message before exit after promise rejected', function (done) {
      testPromise = handler({}, stubContext);

      testPromise.catch(function (error) {
        expect(error.message).to.equal('lambda test error');

        // If the handler is allowed to exit prematurely, this will fail.
        expect(requestStub.called).to.be.true;
        const data = requestStub.getCall(0).args[0];
        expect(data.body.trace_chain[0].exception.message).to.equal(
          'lambda test error',
        );

        requestStub.reset();
        done();
      });
    });
  });
});
