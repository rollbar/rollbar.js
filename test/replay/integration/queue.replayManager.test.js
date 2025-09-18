/**
 * Integration tests for Queue and ReplayManager
 */

import { expect } from 'chai';
import sinon from 'sinon';

import Queue from '../../../src/queue.js';
import Api from '../../../src/api.js';

describe('Queue ReplayManager Integration', function () {
  let queue;
  let replayManager;
  let api;
  let transport;

  beforeEach(function () {
    transport = {
      post: sinon
        .stub()
        .callsFake(({accessToken, options, payload, callback}) => {
          setTimeout(() => {
            callback(
              null,
              { err: 0, result: { id: '12345' } },
              { 'Rollbar-Replay-Enabled': 'true' },
            );
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

    replayManager = {
      add: sinon.stub().returnsArg(0),
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
      replayManager,
    );
  });

  afterEach(function () {
    sinon.restore();
  });

  it('should add replayId when processing an item', function (done) {
    const item = {
      data: {
        body: {
          trace: {
            exception: {
              message: 'Test error',
            },
          },
        },
        attributes: [{ key: 'replay_id', value: '1234567812345678' }],
      },
    };

    queue.addItem(item, function () {
      expect(item).to.have.property('replayId', '1234567812345678');
      expect(replayManager.add.calledOnce).to.be.true;
      done();
    });
  });

  it('should call replayManager.send when API response is successful', function (done) {
    const item = {
      data: {
        body: {
          trace: {
            exception: {
              message: 'Test error',
            },
          },
        },
        attributes: [{ key: 'replay_id', value: '1234567812345678' }],
      },
    };

    queue.addItem(item, function () {
      setTimeout(function () {
        expect(replayManager.send.calledWith('1234567812345678')).to.be.true;
        done();
      }, 50);
    });
  });

  it('should call replayManager.discard when API response has error', function (done) {
    transport.post.callsFake(
      ({accessToken, options, payload, callback}) => {
        setTimeout(() => {
          callback(null, { err: 1, message: 'API Error' });
        }, 10);
      },
    );

    const item = {
      data: {
        body: {
          trace: {
            exception: {
              message: 'Test error with API failure',
            },
          },
        },
        attributes: [{ key: 'replay_id', value: '1234567812345678' }],
      },
    };

    queue.addItem(item, function () {
      setTimeout(function () {
        expect(replayManager.discard.calledWith('1234567812345678')).to.be.true;
        expect(replayManager.send.called).to.be.false;
        done();
      }, 50);
    });
  });

  it('should call replayManager.discard when replay is disabled', function (done) {
    transport.post.callsFake(
      ({accessToken, options, payload, callback}) => {
        setTimeout(() => {
          callback(
            null,
            { err: 0, result: { id: '12345' } },
            { 'Rollbar-Replay-Enabled': 'false' },
          );
        }, 10);
      },
    );

    const item = {
      data: {
        body: {
          trace: {
            exception: {
              message: 'Test error with replay disabled',
            },
          },
        },
        attributes: [{ key: 'replay_id', value: '1234567812345678' }],
      },
    };

    queue.addItem(item, function () {
      setTimeout(function () {
        expect(replayManager.discard.calledWith('1234567812345678')).to.be.true;
        expect(replayManager.send.called).to.be.false;
        done();
      }, 50);
    });
  });

  it('should call replayManager.discard when over quota', function (done) {
    transport.post.callsFake(
      ({accessToken, options, payload, callback}) => {
        setTimeout(() => {
          callback(
            null,
            { err: 0, result: { id: '12345' } },
            {
              'Rollbar-Replay-Enabled': 'true',
              'Rollbar-Replay-RateLimit-Remaining': '0',
            },
          );
        }, 10);
      },
    );

    const item = {
      data: {
        body: {
          trace: {
            exception: {
              message: 'Test error with replay over quota',
            },
          },
        },
        attributes: [{ key: 'replay_id', value: '1234567812345678' }],
      },
    };

    queue.addItem(item, function () {
      setTimeout(function () {
        expect(replayManager.discard.calledWith('1234567812345678')).to.be.true;
        expect(replayManager.send.called).to.be.false;
        done();
      }, 50);
    });
  });

  it('should handle retrying items with replayId', function (done) {
    let apiCallCount = 0;
    transport.post.callsFake(
      ({accessToken, options, payload, callback}) => {
        apiCallCount++;
        if (apiCallCount === 1) {
          setTimeout(() => {
            callback({ code: 'ECONNRESET' });
          }, 10);
        } else {
          setTimeout(() => {
            callback(
              null,
              { err: 0, result: { id: '12345' } },
              { 'Rollbar-Replay-Enabled': 'true' },
            );
          }, 10);
        }
      },
    );

    queue.configure({ retryInterval: 50, maxRetries: 3 });

    const item = {
      data: {
        body: {
          trace: {
            exception: {
              message: 'Test error with retry',
            },
          },
        },
        attributes: [{ key: 'replay_id', value: '1234567812345678' }],
      },
    };

    queue.addItem(item, function (err, resp) {
      if (resp) {
        expect(item).to.have.property('replayId', '1234567812345678');

        setTimeout(function () {
          expect(replayManager.send.calledWith('1234567812345678')).to.be.true;
          done();
        }, 50);
      }
    });
  });

  it('should not add replayId to items without a body', function (done) {
    const item = {
      data: {
        level: 'error',
        message: 'Test error without body',
        attributes: [{ key: 'replay_id', value: '1234567812345678' }],
      },
    };

    queue.addItem(item, function () {
      expect(item).to.not.have.property('replayId');
      expect(replayManager.add.called).to.be.false;
      done();
    });
  });

  it('should not add replayId to items without a replay_id attribute', function (done) {
    const item = {
      data: {
        level: 'error',
        message: 'Test error without body',
        body: {
          trace: {
            exception: {
              message: 'Test error with retry',
            },
          },
        },
      },
    };

    queue.addItem(item, function () {
      expect(item).to.not.have.property('replayId');
      expect(replayManager.add.called).to.be.false;
      done();
    });
  });

  it('should handle null response in _handleReplayResponse', function (done) {
    transport.post.callsFake(
      ({accessToken, options, payload, callback}) => {
        setTimeout(() => {
          callback(null, null);
        }, 10);
      },
    );

    const consoleWarnSpy = sinon.spy(console, 'warn');

    const item = {
      data: {
        body: {
          trace: {
            exception: {
              message: 'Test error with null response',
            },
          },
        },
        attributes: [{ key: 'replay_id', value: '1234567812345678' }],
      },
    };

    queue.addItem(item, function () {
      setTimeout(function () {
        expect(replayManager.send.called).to.be.false;
        expect(replayManager.discard.calledWith('1234567812345678')).to.be
          .false;
        done();
      }, 50);
    });
  });
});
