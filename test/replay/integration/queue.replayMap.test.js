/**
 * Integration tests for Queue and ReplayMap
 */

/* globals describe */
/* globals it */
/* globals beforeEach */
/* globals afterEach */

import { expect } from 'chai';
import sinon from 'sinon';

import Queue from '@rollbar/queue.js';
import Api from '@rollbar/api.js';

describe('Queue ReplayMap Integration', function () {
  let queue;
  let replayMap;
  let api;
  let transport;

  beforeEach(function () {
    transport = {
      post: sinon
        .stub()
        .callsFake((accessToken, transportOptions, payload, callback) => {
          setTimeout(() => {
            callback(null, { err: 0, result: { id: '12345' } });
          }, 10);
        }),
      postJsonPayload: sinon.stub(),
    };

    const urlMock = { parse: sinon.stub().returns({}) };
    const truncationMock = {
      truncate: sinon.stub().returns({ error: null, value: '{}' }),
    };

    api = new Api(
      { accessToken: 'test-token' },
      transport,
      urlMock,
      truncationMock,
    );

    // Mock ReplayMap - use a minimal implementation with spies
    replayMap = {
      add: sinon.stub().returns('test-replay-id'),
      send: sinon.stub().resolves(true),
      discard: sinon.stub().returns(true),
      getSpans: sinon.stub().returns([{ id: 'test-span' }]),
      setSpans: sinon.stub(),
    };

    // Create Queue with mocked rateLimiter
    queue = new Queue(
      { shouldSend: () => ({ shouldSend: true }) },
      api,
      console,
      { transmit: true },
      replayMap,
    );
  });

  afterEach(function () {
    sinon.restore();
  });

  it('should add replayId when processing an item', function (done) {
    const item = {
      body: {
        trace: {
          exception: {
            message: 'Test error',
          },
        },
      },
    };

    queue.addItem(item, function () {
      expect(item).to.have.property('replayId', 'test-replay-id');
      expect(replayMap.add.calledOnce).to.be.true;
      done();
    });
  });

  it('should call replayMap.send when API response is successful', function (done) {
    const item = {
      body: {
        trace: {
          exception: {
            message: 'Test error',
          },
        },
      },
    };

    queue.addItem(item, function () {
      // Wait for handleReplayResponse to complete
      setTimeout(function () {
        expect(replayMap.send.calledWith('test-replay-id')).to.be.true;
        done();
      }, 50);
    });
  });

  it('should call replayMap.discard when API response has error', function (done) {
    // Make API return an error
    transport.post.callsFake(
      (accessToken, transportOptions, payload, callback) => {
        setTimeout(() => {
          callback(null, { err: 1, message: 'API Error' });
        }, 10);
      },
    );

    const item = {
      body: {
        trace: {
          exception: {
            message: 'Test error with API failure',
          },
        },
      },
    };

    queue.addItem(item, function () {
      // Wait for handleReplayResponse to complete
      setTimeout(function () {
        expect(replayMap.discard.calledWith('test-replay-id')).to.be.true;
        expect(replayMap.send.called).to.be.false;
        done();
      }, 50);
    });
  });

  it('should handle retrying items with replayId', function (done) {
    // Make the first API call fail with network error, then succeed
    let apiCallCount = 0;
    transport.post.callsFake(
      (accessToken, transportOptions, payload, callback) => {
        apiCallCount++;
        if (apiCallCount === 1) {
          setTimeout(() => {
            callback({ code: 'ECONNRESET' });
          }, 10);
        } else {
          setTimeout(() => {
            callback(null, { err: 0, result: { id: '12345' } });
          }, 10);
        }
      },
    );

    // Set retry interval to be fast for testing
    queue.configure({ retryInterval: 50, maxRetries: 3 });

    const item = {
      body: {
        trace: {
          exception: {
            message: 'Test error with retry',
          },
        },
      },
    };

    queue.addItem(item, function (err, resp) {
      if (resp) {
        // Item was eventually sent successfully after retry
        expect(item).to.have.property('replayId', 'test-replay-id');

        // Wait for handleReplayResponse to complete
        setTimeout(function () {
          expect(replayMap.send.calledWith('test-replay-id')).to.be.true;
          done();
        }, 50);
      }
    });
  });

  it('should not add replayId to items without a body', function (done) {
    const item = {
      // No body field
      level: 'error',
      message: 'Test error without body',
    };

    queue.addItem(item, function () {
      expect(item).to.not.have.property('replayId');
      expect(replayMap.add.called).to.be.false;
      done();
    });
  });

  it('should handle null response in _handleReplayResponse', function (done) {
    // Make API return null response
    transport.post.callsFake(
      (accessToken, transportOptions, payload, callback) => {
        setTimeout(() => {
          callback(null, null);
        }, 10);
      },
    );

    const consoleWarnSpy = sinon.spy(console, 'warn');

    const item = {
      body: {
        trace: {
          exception: {
            message: 'Test error with null response',
          },
        },
      },
    };

    queue.addItem(item, function () {
      // Wait for handleReplayResponse to complete
      setTimeout(function () {
        expect(replayMap.send.called).to.be.false;
        expect(replayMap.discard.calledWith('test-replay-id')).to.be.true;
        done();
      }, 50);
    });
  });
});
