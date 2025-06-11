/**
 * Unit tests for Queue's integration with ReplayMap
 */

/* globals describe */
/* globals it */
/* globals beforeEach */
/* globals afterEach */
/* globals sinon */

import { expect } from 'chai';
import sinon from 'sinon';

// We need to use require since the Queue module is CommonJS
const Queue = require('../../../src/queue');

class MockReplayMap {
  constructor() {
    this.add = sinon.stub().returnsArg(0);
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

describe('Queue with ReplayMap', function () {
  let queue;
  let replayMap;
  let api;
  let rateLimiter;
  let logger;

  beforeEach(function () {
    replayMap = new MockReplayMap();
    api = new MockApi();
    rateLimiter = new MockRateLimiter();
    logger = { error: sinon.stub(), log: sinon.stub() };

    queue = new Queue(rateLimiter, api, logger, { transmit: true }, replayMap);
  });

  afterEach(function () {
    sinon.restore();
  });

  describe('addItem', function () {
    it('should add replayId to the item when replayMap is available', function () {
      const item = {
        body: { message: 'test error' },
        attributes: [
          { key: 'replay_id', value: '1234567812345678' },
        ],
      };
      const callback = sinon.stub();

      queue.addItem(item, callback);

      expect(replayMap.add.called).to.be.true;
      expect(item.replayId).to.equal('1234567812345678');
    });

    it('should not add replayId when item has no body', function () {
      const item = {
        noBody: true,
        attributes: [
          { key: 'replay_id', value: '1234567812345678' },
        ],
      };
      const callback = sinon.stub();

      queue.addItem(item, callback);

      expect(replayMap.add.called).to.be.false;
      expect(item.replayId).to.be.undefined;
    });

    it('should not add replayId when replayMap is not available', function () {
      queue = new Queue(rateLimiter, api, logger, { transmit: true });

      const item = {
        body: { message: 'test error' },
        attributes: [
          { key: 'replay_id', value: '1234567812345678' },
        ],
      };
      const callback = sinon.stub();

      queue.addItem(item, callback);

      expect(item.replayId).to.be.undefined;
    });
  });

  describe('_handleReplayResponse', function () {
    it('should send the replay when response is successful', async function () {
      const replayId = 'test-replay-id';
      const response = { err: 0 };
      const headers = { 'Rollbar-Replay-Enabled': 'true' };

      await queue._handleReplayResponse(replayId, response, headers);

      expect(replayMap.send.calledWith(replayId)).to.be.true;
      expect(replayMap.discard.called).to.be.false;
    });

    it('should discard the replay when response has an error', async function () {
      const replayId = 'test-replay-id';
      const response = { err: 1 };
      const headers = { 'Rollbar-Replay-Enabled': 'true' };

      await queue._handleReplayResponse(replayId, response, headers);

      expect(replayMap.send.called).to.be.false;
      expect(replayMap.discard.calledWith(replayId)).to.be.true;
    });

    it('should log a warning when replayMap is not available', async function () {
      queue = new Queue(rateLimiter, api, logger, { transmit: true });

      const consoleSpy = sinon.spy(console, 'warn');

      await queue._handleReplayResponse('test-replay-id', { err: 0 });

      expect(consoleSpy.called).to.be.true;
      expect(consoleSpy.args[0][0]).to.include('ReplayMap not available');
    });

    it('should log a warning when replayId is missing', async function () {
      const consoleSpy = sinon.spy(console, 'warn');

      await queue._handleReplayResponse(null, { err: 0 });

      expect(consoleSpy.called).to.be.true;
      expect(consoleSpy.args[0][0]).to.include('No replayId provided');
    });

    it('should handle errors during send/discard', async function () {
      const replayId = 'test-replay-id';
      const response = { err: 0 };
      const headers = { 'Rollbar-Replay-Enabled': 'true' };

      replayMap.send.rejects(new Error('Send error'));

      const consoleSpy = sinon.spy(console, 'error');

      await queue._handleReplayResponse(replayId, response, headers);

      expect(consoleSpy.called).to.be.true;
      expect(consoleSpy.args[0][0]).to.include(
        'Error handling replay response',
      );
    });
  });

  describe('API callback handling', function () {
    it('should call _handleReplayResponse with replayId and response on success', function () {
      const handleStub = sinon.stub(queue, '_handleReplayResponse');

      const item = {
        body: { message: 'test error' },
        attributes: [
          { key: 'replay_id', value: '1234567812345678' },
        ],
      };
      const callback = sinon.stub();

      queue.addItem(item, callback);

      expect(handleStub.called).to.be.true;
      expect(handleStub.firstCall.args[0]).to.equal('1234567812345678');
      expect(handleStub.firstCall.args[1]).to.deep.equal({ err: 0 });
    });

    it('should not call _handleReplayResponse when there is an API error', function () {
      api.postItem.callsFake((item, callback) => {
        callback(new Error('API error'));
      });

      const handleStub = sinon.stub(queue, '_handleReplayResponse');

      const item = {
        body: { message: 'test error' },
        attributes: [
          { key: 'replay_id', value: '1234567812345678' },
        ],
      };
      const callback = sinon.stub();

      queue.addItem(item, callback);

      expect(handleStub.called).to.be.false;
    });

    it('should not call _handleReplayResponse when item has no replayId', function () {
      const handleStub = sinon.stub(queue, '_handleReplayResponse');

      queue = new Queue(rateLimiter, api, logger, { transmit: true });

      const item = {
        body: { message: 'test error' },
        attributes: [
          { key: 'replay_id', value: '1234567812345678' },
        ],
      };
      const callback = sinon.stub();

      queue.addItem(item, callback);

      expect(handleStub.called).to.be.false;
    });
  });
});
