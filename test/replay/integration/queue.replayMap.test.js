/**
 * Integration tests for Queue and ReplayMap
 */

/* globals describe */
/* globals it */
/* globals beforeEach */
/* globals afterEach */

import { expect } from 'chai';
import sinon from 'sinon';

import Queue from '../../../src/queue.js';
import Api from '../../../src/api.js';

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

    replayMap = {
      add: sinon.stub().returns('test-replay-id'),
      send: sinon.stub().resolves(true),
      discard: sinon.stub().returns(true),
      getSpans: sinon.stub().returns([{ id: 'test-span' }]),
      setSpans: sinon.stub(),
    };

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
      setTimeout(function () {
        expect(replayMap.send.calledWith('test-replay-id')).to.be.true;
        done();
      }, 50);
    });
  });

  it('should call replayMap.discard when API response has error', function (done) {
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
      setTimeout(function () {
        expect(replayMap.discard.calledWith('test-replay-id')).to.be.true;
        expect(replayMap.send.called).to.be.false;
        done();
      }, 50);
    });
  });

  it('should handle retrying items with replayId', function (done) {
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
        expect(item).to.have.property('replayId', 'test-replay-id');

        setTimeout(function () {
          expect(replayMap.send.calledWith('test-replay-id')).to.be.true;
          done();
        }, 50);
      }
    });
  });

  it('should not add replayId to items without a body', function (done) {
    const item = {
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
      setTimeout(function () {
        expect(replayMap.send.called).to.be.false;
        expect(replayMap.discard.calledWith('test-replay-id')).to.be.true;
        done();
      }, 50);
    });
  });
});
