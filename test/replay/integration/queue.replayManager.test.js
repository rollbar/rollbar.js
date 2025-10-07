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
  let replayId;

  beforeEach(function () {
    transport = {
      post: sinon
        .stub()
        .callsFake(({ accessToken, options, payload, callback }) => {
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

    replayId = '1234567812345678';
    replayManager = {
      capture: sinon.stub().callsFake(() => replayId),
      send: sinon.stub().resolves(true),
      discard: sinon.stub().returns(true),
      sendOrDiscardReplay: sinon.stub().resolves(),
      getSpans: sinon.stub().returns([{ id: 'test-span' }]),
      setSpans: sinon.stub(),
      size: 0,
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
      },
      level: 'error',
    };

    queue.addItem(item, () => {
      expect(item).to.have.property('replayId', item.replayId);
      expect(replayManager.capture.calledOnce).to.be.true;
      done();
    });
  });

  it('should call sendOrDiscardReplay after successful API response', function (done) {
    const item = {
      data: {
        body: {
          trace: {
            exception: {
              message: 'Test error',
            },
          },
        },
      },
      level: 'error',
    };

    queue.addItem(item, () => {
      setTimeout(() => {
        expect(replayManager.sendOrDiscardReplay.calledOnce).to.be.true;
        expect(replayManager.sendOrDiscardReplay.firstCall.args[0]).to.equal(
          item.replayId,
        );
        expect(replayManager.sendOrDiscardReplay.firstCall.args[1]).to.be.null; // no error
        expect(
          replayManager.sendOrDiscardReplay.firstCall.args[2],
        ).to.deep.equal({ err: 0, result: { id: '12345' } });
        expect(
          replayManager.sendOrDiscardReplay.firstCall.args[3],
        ).to.deep.equal({ 'Rollbar-Replay-Enabled': 'true' });
        done();
      }, 50);
    });
  });

  it('should call sendOrDiscardReplay when API response has error', function (done) {
    transport.post.callsFake(({ accessToken, options, payload, callback }) => {
      setTimeout(() => {
        callback(null, { err: 1, message: 'API Error' });
      }, 10);
    });

    const item = {
      data: {
        body: {
          trace: {
            exception: {
              message: 'Test error with API failure',
            },
          },
        },
      },
      level: 'error',
    };

    queue.addItem(item, () => {
      setTimeout(() => {
        expect(replayManager.sendOrDiscardReplay.calledOnce).to.be.true;
        expect(replayManager.sendOrDiscardReplay.firstCall.args[0]).to.equal(
          item.replayId,
        );
        expect(replayManager.sendOrDiscardReplay.firstCall.args[1]).to.be.null;
        expect(
          replayManager.sendOrDiscardReplay.firstCall.args[2],
        ).to.deep.equal({ err: 1, message: 'API Error' });
        done();
      }, 50);
    });
  });

  it('should call sendOrDiscardReplay when replay is disabled in headers', function (done) {
    transport.post.callsFake(({ accessToken, options, payload, callback }) => {
      setTimeout(() => {
        callback(
          null,
          { err: 0, result: { id: '12345' } },
          { 'Rollbar-Replay-Enabled': 'false' },
        );
      }, 10);
    });

    const item = {
      data: {
        body: {
          trace: {
            exception: {
              message: 'Test error with replay disabled',
            },
          },
        },
      },
      level: 'error',
    };

    queue.addItem(item, () => {
      setTimeout(() => {
        expect(replayManager.sendOrDiscardReplay.calledOnce).to.be.true;
        expect(replayManager.sendOrDiscardReplay.firstCall.args[0]).to.equal(
          item.replayId,
        );
        expect(replayManager.sendOrDiscardReplay.firstCall.args[1]).to.be.null;
        expect(
          replayManager.sendOrDiscardReplay.firstCall.args[2],
        ).to.have.property('err', 0);
        expect(
          replayManager.sendOrDiscardReplay.firstCall.args[3],
        ).to.deep.equal({ 'Rollbar-Replay-Enabled': 'false' });
        done();
      }, 50);
    });
  });

  it('should call sendOrDiscardReplay when rate limit is exhausted', function (done) {
    transport.post.callsFake(({ accessToken, options, payload, callback }) => {
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
    });

    const item = {
      data: {
        body: {
          trace: {
            exception: {
              message: 'Test error with replay over quota',
            },
          },
        },
      },
      level: 'error',
    };

    queue.addItem(item, () => {
      setTimeout(() => {
        expect(replayManager.sendOrDiscardReplay.calledOnce).to.be.true;
        expect(replayManager.sendOrDiscardReplay.firstCall.args[0]).to.equal(
          item.replayId,
        );
        expect(replayManager.sendOrDiscardReplay.firstCall.args[1]).to.be.null;
        expect(
          replayManager.sendOrDiscardReplay.firstCall.args[2],
        ).to.have.property('err', 0);
        expect(
          replayManager.sendOrDiscardReplay.firstCall.args[3],
        ).to.deep.equal({
          'Rollbar-Replay-Enabled': 'true',
          'Rollbar-Replay-RateLimit-Remaining': '0',
        });
        done();
      }, 50);
    });
  });

  it('should handle retrying items with replayId', function (done) {
    let apiCallCount = 0;
    transport.post.callsFake(({ accessToken, options, payload, callback }) => {
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
    });

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
      },
      level: 'error',
    };

    queue.addItem(item, (err, resp) => {
      if (resp) {
        expect(item).to.have.property('replayId', '1234567812345678');

        setTimeout(() => {
          // After retry succeeds, sendOrDiscardReplay should be called
          expect(replayManager.sendOrDiscardReplay.called).to.be.true;
          expect(replayManager.sendOrDiscardReplay.firstCall.args[0]).to.equal(
            '1234567812345678',
          );
          expect(replayManager.sendOrDiscardReplay.firstCall.args[1]).to.be
            .null; // no error
          expect(
            replayManager.sendOrDiscardReplay.firstCall.args[2],
          ).to.deep.equal({ err: 0, result: { id: '12345' } });
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

    queue.addItem(item, () => {
      expect(item).to.not.have.property('replayId');
      expect(replayManager.capture.called).to.be.false;
      done();
    });
  });

  it('should not add replayId to items if not returned from capture', function (done) {
    const item = {
      data: {
        level: 'error',
        body: {
          trace: {
            exception: {
              message: 'Test error',
            },
          },
        },
      },
      level: 'error',
    };
    replayId = null;

    queue.addItem(item, () => {
      expect(item.replayId).to.be.null;
      expect(replayManager.capture.called).to.be.true;
      done();
    });
  });

  describe('Memory leak prevention - replay cleanup', function () {
    it('should call sendOrDiscardReplay on transport error', function (done) {
      const transportError = new Error('Transport failed');
      transport.post.callsFake(
        ({ accessToken, options, payload, callback }) => {
          setTimeout(() => {
            callback(transportError);
          }, 10);
        },
      );

      const item = {
        data: {
          body: {
            trace: {
              exception: {
                message: 'Test error with transport failure',
              },
            },
          },
        },
        level: 'error',
      };

      expect(replayManager.size).to.equal(0);
      queue.addItem(item, (err) => {
        expect(err).to.be.instanceof(Error);
        setTimeout(() => {
          // Verify replay was added and sendOrDiscardReplay was called
          expect(replayManager.capture.calledOnce).to.be.true;
          expect(replayManager.sendOrDiscardReplay.calledOnce).to.be.true;
          expect(replayManager.sendOrDiscardReplay.firstCall.args[0]).to.equal(
            item.replayId,
          );
          expect(replayManager.sendOrDiscardReplay.firstCall.args[1]).to.equal(
            transportError,
          );
          // Ensure no memory leak - replay should be removed from map
          expect(replayManager.size).to.equal(0);
          done();
        }, 50);
      });
    });

    it('should call sendOrDiscardReplay when headers are missing', function (done) {
      transport.post.callsFake(
        ({ accessToken, options, payload, callback }) => {
          setTimeout(() => {
            // Success but no headers
            callback(null, { err: 0, result: { id: '12345' } }, null);
          }, 10);
        },
      );

      const item = {
        data: {
          body: {
            trace: {
              exception: {
                message: 'Test error with missing headers',
              },
            },
          },
        },
        level: 'error',
      };

      queue.addItem(item, () => {
        setTimeout(() => {
          expect(replayManager.sendOrDiscardReplay.calledOnce).to.be.true;
          expect(replayManager.sendOrDiscardReplay.firstCall.args[0]).to.equal(
            item.replayId,
          );
          expect(replayManager.sendOrDiscardReplay.firstCall.args[1]).to.be
            .null;
          expect(
            replayManager.sendOrDiscardReplay.firstCall.args[2],
          ).to.deep.equal({ err: 0, result: { id: '12345' } });
          expect(replayManager.sendOrDiscardReplay.firstCall.args[3]).to.be
            .null;
          done();
        }, 50);
      });
    });

    it('should call sendOrDiscardReplay on rate limit header zero', function (done) {
      transport.post.callsFake(
        ({ accessToken, options, payload, callback }) => {
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
                message: 'Test error at rate limit',
              },
            },
          },
        },
        level: 'error',
      };

      queue.addItem(item, () => {
        setTimeout(() => {
          expect(replayManager.sendOrDiscardReplay.calledOnce).to.be.true;
          expect(replayManager.sendOrDiscardReplay.firstCall.args[0]).to.equal(
            item.replayId,
          );
          expect(
            replayManager.sendOrDiscardReplay.firstCall.args[3],
          ).to.deep.equal({
            'Rollbar-Replay-Enabled': 'true',
            'Rollbar-Replay-RateLimit-Remaining': '0',
          });
          done();
        }, 50);
      });
    });

    it('should handle multiple concurrent failures without leaking', function (done) {
      transport.post.callsFake(
        ({ accessToken, options, payload, callback }) => {
          setTimeout(() => {
            callback(new Error('Network error'));
          }, 10);
        },
      );

      const items = [];
      for (let i = 0; i < 5; i++) {
        items.push({
          data: {
            body: {
              trace: {
                exception: {
                  message: `Test error ${i}`,
                },
              },
            },
          },
          level: 'error',
        });
      }

      let completed = 0;
      items.forEach((item) => {
        queue.addItem(item, () => {
          completed++;
          if (completed === items.length) {
            setTimeout(() => {
              // All replays should have sendOrDiscardReplay called
              expect(replayManager.sendOrDiscardReplay.callCount).to.equal(5);
              // No memory leaks
              expect(replayManager.size).to.equal(0);
              done();
            }, 50);
          }
        });
      });
    });
  });

  it('should call sendOrDiscardReplay on null response', function (done) {
    transport.post.callsFake(({ accessToken, options, payload, callback }) => {
      setTimeout(() => {
        callback(null, null);
      }, 10);
    });

    const item = {
      data: {
        body: {
          trace: {
            exception: {
              message: 'Test error with null response',
            },
          },
        },
      },
      level: 'error',
    };

    queue.addItem(item, () => {
      setTimeout(() => {
        expect(replayManager.sendOrDiscardReplay.calledOnce).to.be.true;
        expect(replayManager.sendOrDiscardReplay.firstCall.args[0]).to.equal(
          item.replayId,
        );
        expect(replayManager.sendOrDiscardReplay.firstCall.args[1]).to.be.null;
        expect(replayManager.sendOrDiscardReplay.firstCall.args[2]).to.be.null;
        done();
      }, 50);
    });
  });
});
