/**
 * Unit tests for Queue's integration with Replay
 */

import { expect } from 'chai';
import sinon from 'sinon';
import Queue from '../../../src/queue.js';
import logger from '../../../src/logger.js';

class MockReplay {
  constructor(replayId) {
    this.capture = sinon.stub().callsFake(() => replayId);
    this.send = sinon.stub().resolves(true);
    this.discard = sinon.stub().returns(true);
    this.sendOrDiscardReplay = sinon.stub().resolves();
  }
}

class MockApi {
  constructor() {
    this.postItem = sinon.stub().callsFake((item, callback) => {
      callback(null, { err: 0 });
    });
  }
}

class MockRateLimiter {
  constructor() {
    this.shouldSend = sinon.stub().returns({ shouldSend: true });
  }
}

describe('Queue with Replay', function () {
  let queue;
  let replay;
  let api;
  let rateLimiter;
  let logger;
  let replayId;

  beforeEach(function () {
    replayId = '1234567812345678';
    replay = new MockReplay(replayId);
    api = new MockApi();
    rateLimiter = new MockRateLimiter();
    logger = { error: sinon.stub(), log: sinon.stub() };

    queue = new Queue(rateLimiter, api, logger, { transmit: true }, replay);
  });

  afterEach(function () {
    sinon.restore();
  });

  describe('addItem', function () {
    it('should add replayId to the item when replay is available', function () {
      const item = {
        data: {
          body: { message: 'test error' },
        },
        level: 'error',
      };
      const callback = sinon.stub();

      queue.addItem(item, callback);

      expect(replay.capture.called).to.be.true;
      expect(item.replayId).to.equal(replayId);
    });

    it('should not add replayId when item has no body', function () {
      const item = {
        data: {
          noBody: true,
        },
        level: 'error',
      };
      const callback = sinon.stub();

      queue.addItem(item, callback);

      expect(replay.capture.called).to.be.false;
      expect(item.replayId).to.be.undefined;
    });

    it('should not add replayId when replay is not available', function () {
      queue = new Queue(rateLimiter, api, logger, { transmit: true });

      const item = {
        data: {
          body: { message: 'test error' },
        },
        level: 'error',
      };
      const callback = sinon.stub();

      queue.addItem(item, callback);

      expect(item.replayId).to.be.undefined;
    });
  });

  describe('API callback handling with sendOrDiscardReplay', function () {
    it('should call sendOrDiscardReplay with error when API returns an error', async function () {
      const item = {
        data: {
          body: { message: 'test error' },
          uuid: 'test-uuid',
        },
        level: 'error',
      };

      const apiError = new Error('Network error');
      api.postItem.callsFake((data, callback) => {
        callback(apiError, null, null);
      });

      const callback = sinon.stub();
      queue.addItem(item, callback);

      // Wait for async operations
      await new Promise((resolve) => setTimeout(resolve, 1));

      expect(replay.sendOrDiscardReplay.called).to.be.true;
      expect(replay.sendOrDiscardReplay.firstCall.args[0]).to.equal(
        '1234567812345678',
      );
      expect(replay.sendOrDiscardReplay.firstCall.args[1]).to.equal(apiError);
      expect(replay.sendOrDiscardReplay.firstCall.args[2]).to.be.undefined;
      expect(replay.sendOrDiscardReplay.firstCall.args[3]).to.be.undefined;
    });

    it('should call discard when makeApiRequest throws an exception', function () {
      const item = {
        data: {
          body: { message: 'test error' },
          uuid: 'test-uuid',
        },
        level: 'error',
      };

      // Make _makeApiRequest throw synchronously
      sinon
        .stub(queue, '_makeApiRequest')
        .throws(new Error('Unexpected error'));

      const callback = sinon.stub();
      queue.addItem(item, callback);

      // When makeApiRequest throws, Queue directly calls discard
      expect(replay.discard.calledWith(replayId)).to.be.true;
      expect(replay.sendOrDiscardReplay.called).to.be.false;
    });

    it('should call sendOrDiscardReplay when rate limiter returns an error', function (done) {
      const item = {
        data: {
          body: { message: 'test error' },
          uuid: 'test-uuid',
        },
        level: 'error',
      };

      const rateLimitError = new Error('Rate limit exceeded');
      rateLimiter.shouldSend.returns({
        shouldSend: false,
        error: rateLimitError,
      });

      const callback = sinon.stub();
      queue.addItem(item, callback);

      // Rate limiter errors now also call sendOrDiscardReplay to clean up replay
      setTimeout(() => {
        expect(callback.calledWith(rateLimitError)).to.be.true;
        expect(replay.sendOrDiscardReplay.called).to.be.true;
        expect(replay.sendOrDiscardReplay.firstCall.args[0]).to.equal(replayId);
        expect(replay.sendOrDiscardReplay.firstCall.args[1]).to.equal(
          rateLimitError,
        );
        expect(replay.sendOrDiscardReplay.firstCall.args[2]).to.be.undefined;
        expect(replay.sendOrDiscardReplay.firstCall.args[3]).to.be.undefined;
        done();
      }, 0);
    });

    it('should call sendOrDiscardReplay with response indicating server error', async function () {
      const item = {
        data: {
          body: { message: 'test error' },
          uuid: 'test-uuid',
        },
        level: 'error',
      };

      const response = { err: 1, message: 'Internal server error' };
      const headers = {};
      api.postItem.callsFake((data, callback) => {
        callback(null, response, headers);
      });

      const callback = sinon.stub();
      queue.addItem(item, callback);

      // Wait for async operations
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(replay.sendOrDiscardReplay.called).to.be.true;
      expect(replay.sendOrDiscardReplay.firstCall.args[0]).to.equal(replayId);
      expect(replay.sendOrDiscardReplay.firstCall.args[1]).to.be.null;
      expect(replay.sendOrDiscardReplay.firstCall.args[2]).to.deep.equal(
        response,
      );
      expect(replay.sendOrDiscardReplay.firstCall.args[3]).to.deep.equal(
        headers,
      );
    });

    it('should call sendOrDiscardReplay when replay is disabled in headers', async function () {
      const item = {
        data: {
          body: { message: 'test error' },
          uuid: 'test-uuid',
        },
        level: 'error',
      };

      const response = { err: 0 };
      const headers = { 'Rollbar-Replay-Enabled': 'false' };
      api.postItem.callsFake((data, callback) => {
        callback(null, response, headers);
      });

      const callback = sinon.stub();
      queue.addItem(item, callback);

      // Wait for async operations
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(replay.sendOrDiscardReplay.called).to.be.true;
      expect(replay.sendOrDiscardReplay.firstCall.args[0]).to.equal(replayId);
      expect(replay.sendOrDiscardReplay.firstCall.args[1]).to.be.null;
      expect(replay.sendOrDiscardReplay.firstCall.args[2]).to.deep.equal(
        response,
      );
      expect(replay.sendOrDiscardReplay.firstCall.args[3]).to.deep.equal(
        headers,
      );
    });

    it('should call sendOrDiscardReplay when rate limit is exhausted', async function () {
      const item = {
        data: {
          body: { message: 'test error' },
          uuid: 'test-uuid',
        },
        level: 'error',
      };

      const response = { err: 0 };
      const headers = {
        'Rollbar-Replay-Enabled': 'true',
        'Rollbar-Replay-RateLimit-Remaining': '0',
      };
      api.postItem.callsFake((data, callback) => {
        callback(null, response, headers);
      });

      const callback = sinon.stub();
      queue.addItem(item, callback);

      // Wait for async operations
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(replay.sendOrDiscardReplay.called).to.be.true;
      expect(replay.sendOrDiscardReplay.firstCall.args[0]).to.equal(replayId);
      expect(replay.sendOrDiscardReplay.firstCall.args[1]).to.be.null;
      expect(replay.sendOrDiscardReplay.firstCall.args[2]).to.deep.equal(
        response,
      );
      expect(replay.sendOrDiscardReplay.firstCall.args[3]).to.deep.equal(
        headers,
      );
    });

    it('should call sendOrDiscardReplay with successful response and headers', async function () {
      const item = {
        data: {
          body: { message: 'test error' },
          uuid: 'test-uuid',
        },
        level: 'error',
      };

      const response = { err: 0 };
      const headers = {
        'Rollbar-Replay-Enabled': 'true',
        'Rollbar-Replay-RateLimit-Remaining': '10',
      };
      api.postItem.callsFake((data, callback) => {
        callback(null, response, headers);
      });

      const callback = sinon.stub();
      queue.addItem(item, callback);

      // Wait for async operations
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(replay.sendOrDiscardReplay.called).to.be.true;
      expect(replay.sendOrDiscardReplay.firstCall.args[0]).to.equal(replayId);
      expect(replay.sendOrDiscardReplay.firstCall.args[1]).to.be.null;
      expect(replay.sendOrDiscardReplay.firstCall.args[2]).to.deep.equal(
        response,
      );
      expect(replay.sendOrDiscardReplay.firstCall.args[3]).to.deep.equal(
        headers,
      );
    });

    it('should call sendOrDiscardReplay when response is null', async function () {
      const item = {
        data: {
          body: { message: 'test error' },
          uuid: 'test-uuid',
        },
        level: 'error',
      };

      api.postItem.callsFake((data, callback) => {
        callback(null, null, null);
      });

      const callback = sinon.stub();
      queue.addItem(item, callback);

      // Wait for async operations
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(replay.sendOrDiscardReplay.called).to.be.true;
      expect(replay.sendOrDiscardReplay.firstCall.args[0]).to.equal(replayId);
      expect(replay.sendOrDiscardReplay.firstCall.args[1]).to.be.null;
      expect(replay.sendOrDiscardReplay.firstCall.args[2]).to.be.null;
      expect(replay.sendOrDiscardReplay.firstCall.args[3]).to.be.null;
    });

    it('should only call sendOrDiscardReplay once when retrying after connection error', async function () {
      queue = new Queue(
        rateLimiter,
        api,
        logger,
        { transmit: true, retryInterval: 10, maxRetries: 1 },
        replay,
      );

      let callCount = 0;
      const finalError = new Error('Permanent failure');
      api.postItem.callsFake((data, callback) => {
        callCount++;
        if (callCount === 1) {
          callback({ code: 'ECONNRESET' });
        } else {
          callback(finalError);
        }
      });

      const item = {
        data: {
          body: { message: 'test error' },
          uuid: 'test-uuid',
        },
        level: 'error',
      };

      const callback = sinon.stub();
      queue.addItem(item, callback);

      // Wait for retry to complete
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Should only be called once with the final error
      expect(replay.sendOrDiscardReplay.callCount).to.equal(1);
      expect(replay.sendOrDiscardReplay.firstCall.args[0]).to.equal(replayId);
      expect(replay.sendOrDiscardReplay.firstCall.args[1]).to.equal(finalError);
    });
  });

  describe('API callback handling', function () {
    it('should call sendOrDiscardReplay with replayId and response on success', async function () {
      const handleStub = replay.sendOrDiscardReplay;

      const item = {
        data: {
          body: { message: 'test error' },
        },
        level: 'error',
      };
      const callback = sinon.stub();

      queue.addItem(item, callback);

      // Wait for the API callback to be called
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(handleStub.called).to.be.true;
      expect(handleStub.firstCall.args[0]).to.equal(replayId);
      expect(handleStub.firstCall.args[1]).to.be.null; // err
      expect(handleStub.firstCall.args[2]).to.deep.equal({ err: 0 }); // resp
    });

    it('should call sendOrDiscardReplay even when there is an API error', async function () {
      api.postItem.callsFake((item, callback) => {
        callback(new Error('API error'));
      });

      const handleStub = replay.sendOrDiscardReplay;

      const item = {
        data: {
          body: { message: 'test error' },
        },
        level: 'error',
      };
      const callback = sinon.stub();

      queue.addItem(item, callback);

      // Wait for the API callback to be called
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(handleStub.called).to.be.true;
      expect(handleStub.firstCall.args[0]).to.equal(replayId);
      expect(handleStub.firstCall.args[1]).to.be.instanceof(Error);
      expect(handleStub.firstCall.args[2]).to.be.undefined; // resp
    });

    it('should not call sendOrDiscardReplay when item has no replayId', async function () {
      const handleStub = replay.sendOrDiscardReplay;

      queue = new Queue(rateLimiter, api, logger, { transmit: true });

      const item = {
        data: {
          body: { message: 'test error' },
        },
        level: 'error',
      };
      const callback = sinon.stub();

      queue.addItem(item, callback);

      // Wait for any potential async operations
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(handleStub.called).to.be.false;
    });
  });
});
