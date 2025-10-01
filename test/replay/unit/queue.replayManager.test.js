/**
 * Unit tests for Queue's integration with ReplayManager
 */

import { expect } from 'chai';
import sinon from 'sinon';
import Queue from '../../../src/queue.js';

class MockReplayManager {
  constructor() {
    this.capture = sinon.stub().returnsArg(0);
    this.send = sinon.stub().resolves(true);
    this.discard = sinon.stub().returns(true);
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

describe('Queue with ReplayManager', function () {
  let queue;
  let replayManager;
  let api;
  let rateLimiter;
  let logger;

  beforeEach(function () {
    replayManager = new MockReplayManager();
    api = new MockApi();
    rateLimiter = new MockRateLimiter();
    logger = { error: sinon.stub(), log: sinon.stub() };

    queue = new Queue(
      rateLimiter,
      api,
      logger,
      { transmit: true },
      replayManager,
    );
  });

  afterEach(function () {
    sinon.restore();
  });

  describe('addItem', function () {
    it('should add replayId to the item when replayManager is available', function () {
      const item = {
        data: {
          body: { message: 'test error' },
          attributes: [{ key: 'replay_id', value: '1234567812345678' }],
        },
      };
      const callback = sinon.stub();

      queue.addItem(item, callback);

      expect(replayManager.capture.called).to.be.true;
      expect(item.replayId).to.equal('1234567812345678');
    });

    it('should not add replayId when item has no body', function () {
      const item = {
        data: {
          noBody: true,
          attributes: [{ key: 'replay_id', value: '1234567812345678' }],
        },
      };
      const callback = sinon.stub();

      queue.addItem(item, callback);

      expect(replayManager.capture.called).to.be.false;
      expect(item.replayId).to.be.undefined;
    });

    it('should not add replayId when replayManager is not available', function () {
      queue = new Queue(rateLimiter, api, logger, { transmit: true });

      const item = {
        data: {
          body: { message: 'test error' },
          attributes: [{ key: 'replay_id', value: '1234567812345678' }],
        },
      };
      const callback = sinon.stub();

      queue.addItem(item, callback);

      expect(item.replayId).to.be.undefined;
    });
  });

  describe('_canSendReplay', function () {
    it('should return true when all conditions are met', function () {
      const err = null;
      const response = { err: 0 };
      const headers = {
        'Rollbar-Replay-Enabled': 'true',
        'Rollbar-Replay-RateLimit-Remaining': '10',
      };

      const result = queue._canSendReplay(err, response, headers);
      expect(result).to.be.true;
    });

    it('should return false when there is an error', function () {
      const err = new Error('API error');
      const response = { err: 0 };
      const headers = { 'Rollbar-Replay-Enabled': 'true' };

      const result = queue._canSendReplay(err, response, headers);
      expect(result).to.be.false;
    });

    it('should return false when response has an error code', function () {
      const err = null;
      const response = { err: 1 };
      const headers = { 'Rollbar-Replay-Enabled': 'true' };

      const result = queue._canSendReplay(err, response, headers);
      expect(result).to.be.false;
    });

    it('should return false when replay is disabled', function () {
      const err = null;
      const response = { err: 0 };
      const headers = { 'Rollbar-Replay-Enabled': 'false' };

      const result = queue._canSendReplay(err, response, headers);
      expect(result).to.be.false;
    });

    it('should return false when rate limit is zero', function () {
      const err = null;
      const response = { err: 0 };
      const headers = {
        'Rollbar-Replay-Enabled': 'true',
        'Rollbar-Replay-RateLimit-Remaining': '0',
      };

      const result = queue._canSendReplay(err, response, headers);
      expect(result).to.be.false;
    });
  });

  describe('_sendOrDiscardReplay', function () {
    it('should send the replay when response is successful', async function () {
      const replayId = 'test-replay-id';
      const err = null;
      const response = { err: 0 };
      const headers = {
        'Rollbar-Replay-Enabled': 'true',
        'Rollbar-Replay-RateLimit-Remaining': '10',
      };

      await queue._sendOrDiscardReplay(replayId, err, response, headers);

      expect(replayManager.send.calledWith(replayId)).to.be.true;
      expect(replayManager.discard.called).to.be.false;
    });

    it('should discard the replay when response has an error', async function () {
      const replayId = 'test-replay-id';
      const err = new Error('API error');
      const response = null;
      const headers = null;

      await queue._sendOrDiscardReplay(replayId, err, response, headers);

      expect(replayManager.send.called).to.be.false;
      expect(replayManager.discard.calledWith(replayId)).to.be.true;
    });

    it('should discard the replay when response error code is non-zero', async function () {
      const replayId = 'test-replay-id';
      const err = null;
      const response = { err: 1 };
      const headers = { 'Rollbar-Replay-Enabled': 'true' };

      await queue._sendOrDiscardReplay(replayId, err, response, headers);

      expect(replayManager.send.called).to.be.false;
      expect(replayManager.discard.calledWith(replayId)).to.be.true;
    });

    it('should discard the replay when replay is disabled', async function () {
      const replayId = 'test-replay-id';
      const err = null;
      const response = { err: 0 };
      const headers = { 'Rollbar-Replay-Enabled': 'false' };

      await queue._sendOrDiscardReplay(replayId, err, response, headers);

      expect(replayManager.send.called).to.be.false;
      expect(replayManager.discard.calledWith(replayId)).to.be.true;
    });

    it('should discard the replay when rate limit is exhausted', async function () {
      const replayId = 'test-replay-id';
      const err = null;
      const response = { err: 0 };
      const headers = {
        'Rollbar-Replay-Enabled': 'true',
        'Rollbar-Replay-RateLimit-Remaining': '0',
      };

      await queue._sendOrDiscardReplay(replayId, err, response, headers);

      expect(replayManager.send.called).to.be.false;
      expect(replayManager.discard.calledWith(replayId)).to.be.true;
    });

    it('should discard the replay when send throws an error', async function () {
      const replayId = 'test-replay-id';
      const err = null;
      const response = { err: 0 };
      const headers = {
        'Rollbar-Replay-Enabled': 'true',
        'Rollbar-Replay-RateLimit-Remaining': '10',
      };

      replayManager.send.rejects(new Error('Send failed'));

      const consoleSpy = sinon.spy(console, 'error');

      await queue._sendOrDiscardReplay(replayId, err, response, headers);

      expect(consoleSpy.calledOnce).to.be.true;
      expect(consoleSpy.args[0][0]).to.equal('Failed to send replay:');
      expect(replayManager.discard.calledWith(replayId)).to.be.true;
    });
  });

  describe('Replay cleanup on failures', function () {
    it('should discard replay when API returns an error', async function () {
      const item = {
        data: {
          body: { message: 'test error' },
          attributes: [{ key: 'replay_id', value: '1234567812345678' }],
          uuid: 'test-uuid',
        },
      };

      api.postItem.callsFake((data, callback) => {
        callback(new Error('Network error'), null, null);
      });

      const callback = sinon.stub();
      queue.addItem(item, callback);

      // Wait for async operations
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(replayManager.discard.calledWith('1234567812345678')).to.be.true;
      expect(replayManager.send.called).to.be.false;
    });

    it('should discard replay when makeApiRequest throws an exception', function () {
      const item = {
        data: {
          body: { message: 'test error' },
          attributes: [{ key: 'replay_id', value: '1234567812345678' }],
          uuid: 'test-uuid',
        },
      };

      // Make _makeApiRequest throw synchronously
      sinon
        .stub(queue, '_makeApiRequest')
        .throws(new Error('Unexpected error'));

      const callback = sinon.stub();
      queue.addItem(item, callback);

      expect(replayManager.discard.calledWith('1234567812345678')).to.be.true;
      expect(replayManager.send.called).to.be.false;
    });

    it('should discard replay when rate limiter returns an error', function () {
      const item = {
        data: {
          body: { message: 'test error' },
          attributes: [{ key: 'replay_id', value: '1234567812345678' }],
          uuid: 'test-uuid',
        },
      };

      rateLimiter.shouldSend.returns({
        shouldSend: false,
        error: new Error('Rate limit exceeded'),
      });

      const callback = sinon.stub();
      queue.addItem(item, callback);

      // Wait a tick for callback
      setTimeout(() => {
        expect(replayManager.discard.calledWith('1234567812345678')).to.be.true;
        expect(replayManager.send.called).to.be.false;
      }, 0);
    });

    it('should discard replay when response indicates server error', async function () {
      const item = {
        data: {
          body: { message: 'test error' },
          attributes: [{ key: 'replay_id', value: '1234567812345678' }],
          uuid: 'test-uuid',
        },
      };

      api.postItem.callsFake((data, callback) => {
        callback(null, { err: 1, message: 'Internal server error' }, {});
      });

      const callback = sinon.stub();
      queue.addItem(item, callback);

      // Wait for async operations
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(replayManager.discard.calledWith('1234567812345678')).to.be.true;
      expect(replayManager.send.called).to.be.false;
    });

    it('should discard replay when replay is disabled in headers', async function () {
      const item = {
        data: {
          body: { message: 'test error' },
          attributes: [{ key: 'replay_id', value: '1234567812345678' }],
          uuid: 'test-uuid',
        },
      };

      api.postItem.callsFake((data, callback) => {
        callback(null, { err: 0 }, { 'Rollbar-Replay-Enabled': 'false' });
      });

      const callback = sinon.stub();
      queue.addItem(item, callback);

      // Wait for async operations
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(replayManager.discard.calledWith('1234567812345678')).to.be.true;
      expect(replayManager.send.called).to.be.false;
    });

    it('should discard replay when rate limit is exhausted', async function () {
      const item = {
        data: {
          body: { message: 'test error' },
          attributes: [{ key: 'replay_id', value: '1234567812345678' }],
          uuid: 'test-uuid',
        },
      };

      api.postItem.callsFake((data, callback) => {
        callback(
          null,
          { err: 0 },
          {
            'Rollbar-Replay-Enabled': 'true',
            'Rollbar-Replay-RateLimit-Remaining': '0',
          },
        );
      });

      const callback = sinon.stub();
      queue.addItem(item, callback);

      // Wait for async operations
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(replayManager.discard.calledWith('1234567812345678')).to.be.true;
      expect(replayManager.send.called).to.be.false;
    });

    it('should discard replay when replayManager.send throws', async function () {
      const item = {
        data: {
          body: { message: 'test error' },
          attributes: [{ key: 'replay_id', value: '1234567812345678' }],
          uuid: 'test-uuid',
        },
      };

      api.postItem.callsFake((data, callback) => {
        callback(
          null,
          { err: 0 },
          {
            'Rollbar-Replay-Enabled': 'true',
            'Rollbar-Replay-RateLimit-Remaining': '10',
          },
        );
      });

      replayManager.send.rejects(new Error('Failed to send spans'));

      const callback = sinon.stub();
      queue.addItem(item, callback);

      // Wait for async operations
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(replayManager.send.calledWith('1234567812345678')).to.be.true;
      expect(replayManager.discard.calledWith('1234567812345678')).to.be.true;
    });

    it('should discard replay when response is null', async function () {
      const item = {
        data: {
          body: { message: 'test error' },
          attributes: [{ key: 'replay_id', value: '1234567812345678' }],
          uuid: 'test-uuid',
        },
      };

      api.postItem.callsFake((data, callback) => {
        callback(null, null, null);
      });

      const callback = sinon.stub();
      queue.addItem(item, callback);

      // Wait for async operations
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(replayManager.discard.calledWith('1234567812345678')).to.be.true;
      expect(replayManager.send.called).to.be.false;
    });

    it('should NOT leak replay when retrying after connection error', async function () {
      queue = new Queue(
        rateLimiter,
        api,
        logger,
        { transmit: true, retryInterval: 10, maxRetries: 1 },
        replayManager,
      );

      let callCount = 0;
      api.postItem.callsFake((data, callback) => {
        callCount++;
        if (callCount === 1) {
          callback({ code: 'ECONNRESET' });
        } else {
          callback(new Error('Permanent failure'));
        }
      });

      const item = {
        data: {
          body: { message: 'test error' },
          attributes: [{ key: 'replay_id', value: '1234567812345678' }],
          uuid: 'test-uuid',
        },
      };

      const callback = sinon.stub();
      queue.addItem(item, callback);

      // Wait for retry to complete
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Replay should be discarded exactly once after final failure
      expect(replayManager.discard.calledWith('1234567812345678')).to.be.true;
      expect(replayManager.discard.callCount).to.equal(1);
      expect(replayManager.send.called).to.be.false;
    });
  });

  describe('API callback handling', function () {
    it('should call _sendOrDiscardReplay with replayId and response on success', async function () {
      const handleStub = sinon.stub(queue, '_sendOrDiscardReplay').resolves();

      const item = {
        data: {
          body: { message: 'test error' },
          attributes: [{ key: 'replay_id', value: '1234567812345678' }],
        },
      };
      const callback = sinon.stub();

      queue.addItem(item, callback);

      // Wait for the API callback to be called
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(handleStub.called).to.be.true;
      expect(handleStub.firstCall.args[0]).to.equal('1234567812345678');
      expect(handleStub.firstCall.args[1]).to.be.null; // err
      expect(handleStub.firstCall.args[2]).to.deep.equal({ err: 0 }); // resp
    });

    it('should call _sendOrDiscardReplay even when there is an API error', async function () {
      api.postItem.callsFake((item, callback) => {
        callback(new Error('API error'));
      });

      const handleStub = sinon.stub(queue, '_sendOrDiscardReplay').resolves();

      const item = {
        data: {
          body: { message: 'test error' },
          attributes: [{ key: 'replay_id', value: '1234567812345678' }],
        },
      };
      const callback = sinon.stub();

      queue.addItem(item, callback);

      // Wait for the API callback to be called
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(handleStub.called).to.be.true;
      expect(handleStub.firstCall.args[0]).to.equal('1234567812345678');
      expect(handleStub.firstCall.args[1]).to.be.instanceof(Error);
      expect(handleStub.firstCall.args[2]).to.be.undefined; // resp
    });

    it('should not call _sendOrDiscardReplay when item has no replayId', async function () {
      const handleStub = sinon.stub(queue, '_sendOrDiscardReplay').resolves();

      queue = new Queue(rateLimiter, api, logger, { transmit: true });

      const item = {
        data: {
          body: { message: 'test error' },
          attributes: [{ key: 'replay_id', value: '1234567812345678' }],
        },
      };
      const callback = sinon.stub();

      queue.addItem(item, callback);

      // Wait for any potential async operations
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(handleStub.called).to.be.false;
    });
  });
});
