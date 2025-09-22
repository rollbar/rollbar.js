/**
 * Unit tests for the ReplayManager module
 */

import { expect } from 'chai';
import sinon from 'sinon';
import logger from '../../../src/browser/logger.js';
import ReplayManager from '../../../src/browser/replay/replayManager.js';
import id from '../../../src/tracing/id.js';

class MockRecorder {
  constructor(returnPayload = true) {
    this.payload = returnPayload ? [{ id: 'span1' }, { id: 'span2' }] : null;
    this.dump = sinon.stub().returns(this.payload);
  }
}

class MockApi {
  constructor() {
    this.postSpans = sinon.stub();
    this.postSpans.resolves({ success: true });
  }
}

class MockTracing {
  constructor() {
    this.exporter = {
      toPayload: sinon.stub().returns([{ id: 'span1' }, { id: 'span2' }]),
    };
  }
}

describe('ReplayManager', function () {
  let replayManager;
  let mockRecorder;
  let mockApi;
  let mockTracing;

  beforeEach(function () {
    logger.init({ logLevel: 'error' });
    sinon.stub(id, 'gen').returns('1234567890abcdef');

    mockRecorder = new MockRecorder();
    mockApi = new MockApi();
    mockTracing = new MockTracing();

    replayManager = new ReplayManager({
      recorder: mockRecorder,
      api: mockApi,
      tracing: mockTracing,
    });
  });

  afterEach(function () {
    sinon.restore();
  });

  describe('constructor', function () {
    it('should throw when required dependencies are missing', function () {
      expect(() => new ReplayManager({})).to.throw(TypeError);
      expect(() => new ReplayManager({ recorder: mockRecorder })).to.throw(
        TypeError,
      );
      expect(
        () =>
          new ReplayManager({
            recorder: mockRecorder,
            api: mockApi,
          }),
      ).to.throw(TypeError);

      expect(
        () =>
          new ReplayManager({
            recorder: mockRecorder,
            api: mockApi,
            tracing: mockTracing,
          }),
      ).to.not.throw();
    });
  });

  describe('_processReplay', function () {
    it('should dump recording and add payload to the map', async function () {
      const replayId = '1234567890abcdef';

      const expectedPayload = [{ id: 'span1' }, { id: 'span2' }];

      const result = await replayManager._processReplay(replayId);

      expect(result).to.equal(replayId);
      expect(mockRecorder.dump.called).to.be.true;
      expect(mockRecorder.dump.calledWith(mockTracing, replayId)).to.be.true;

      expect(replayManager.size).to.equal(1);

      const retrievedPayload = replayManager.getSpans(replayId);
      expect(retrievedPayload).to.deep.equal(expectedPayload);
    });

    it('should store null in map when dump returns null', async function () {
      mockRecorder = new MockRecorder(false);
      replayManager = new ReplayManager({
        recorder: mockRecorder,
        api: mockApi,
        tracing: mockTracing,
      });

      const replayId = '1234567890abcdef';
      const result = await replayManager._processReplay(replayId);

      expect(result).to.equal(replayId);
      expect(mockRecorder.dump.called).to.be.true;
      expect(mockRecorder.dump.calledWith(mockTracing, replayId)).to.be.true;

      expect(replayManager.size).to.equal(1);
      expect(replayManager.getSpans(replayId)).to.be.null;
    });

    it('should handle errors gracefully', async function () {
      mockRecorder.dump.throws(new Error('Test error'));

      const consoleSpy = sinon.spy(console, 'error');
      const replayId = '1234567890abcdef';
      const result = await replayManager._processReplay(replayId);

      expect(result).to.equal(replayId);
      expect(mockRecorder.dump.called).to.be.true;
      expect(consoleSpy.called).to.be.true;
      expect(consoleSpy.args[0][1]).to.include('Error transforming spans');

      expect(replayManager.size).to.equal(1);
      expect(replayManager.getSpans(replayId)).to.be.null;
    });
  });

  describe('add', function () {
    it('should use provided replayId and initiate async processing', function () {
      const replayId = '1122334455667788';
      const uuid = '12345678-1234-5678-1234-1234567890ab';
      const processStub = sinon
        .stub(replayManager, '_processReplay')
        .resolves('1234567890abcdef');

      const resp = replayManager.add(replayId, uuid);

      expect(resp).to.equal(replayId);
      expect(id.gen.calledWith(8)).to.be.false;
      expect(processStub.calledWith(replayId, uuid)).to.be.true;
    });

    it('should generate a replayId and initiate async processing', function () {
      const processStub = sinon
        .stub(replayManager, '_processReplay')
        .resolves('1234567890abcdef');

      const replayId = replayManager.add();

      expect(replayId).to.equal('1234567890abcdef');
      expect(id.gen.calledWith(8)).to.be.true;
      expect(processStub.calledWith(replayId)).to.be.true;
    });

    it('should handle errors from _processReplay', function (done) {
      sinon
        .stub(replayManager, '_processReplay')
        .rejects(new Error('Test error'));

      const errorSpy = sinon.spy(console, 'error');

      try {
        replayManager.add();

        setTimeout(() => {
          expect(errorSpy.called).to.be.true;
          expect(errorSpy.args[0][1]).to.include('Failed to process replay');
          done();
        }, 0);
      } catch (error) {
        done(error);
      }
    });
  });

  describe('send', function () {
    it('should send payload and remove it from the map', async function () {
      const mockPayload = [{ id: 'payload1' }, { id: 'payload2' }];
      replayManager.setSpans('testReplayId', mockPayload);
      expect(replayManager.size).to.equal(1);

      const result = await replayManager.send('testReplayId');

      expect(result).to.be.true;
      expect(mockApi.postSpans.called).to.be.true;
      expect(mockApi.postSpans.firstCall.args[0]).to.deep.equal(mockPayload);

      expect(replayManager.size).to.equal(0);
    });

    it('should handle missing replayId parameter', async function () {
      const consoleSpy = sinon.spy(console, 'error');

      const result = await replayManager.send();

      expect(result).to.be.false;
      expect(consoleSpy.called).to.be.true;
      expect(consoleSpy.args[0][1]).to.include(
        'ReplayManager.send: No replayId provided',
      );
      expect(mockApi.postSpans.called).to.be.false;
    });

    it('should handle non-existent replayId', async function () {
      const consoleSpy = sinon.spy(console, 'error');

      const result = await replayManager.send('nonexistent');

      expect(result).to.be.false;
      expect(consoleSpy.called).to.be.true;
      expect(consoleSpy.args[0][1]).to.include('No replay found for replayId');
      expect(mockApi.postSpans.called).to.be.false;
    });

    it('should handle empty array payload', async function () {
      replayManager.setSpans('emptyReplayId', []);

      const consoleSpy = sinon.spy(console, 'error');
      const result = await replayManager.send('emptyReplayId');

      expect(result).to.be.false;
      expect(consoleSpy.called).to.be.true;
      expect(consoleSpy.args[0][1]).to.include('No payload found for replayId');
      expect(mockApi.postSpans.called).to.be.false;
    });

    it('should handle empty OTLP payload', async function () {
      replayManager.setSpans('emptyOTLPReplayId', { resourceSpans: [] });

      const consoleSpy = sinon.spy(console, 'error');
      const result = await replayManager.send('emptyOTLPReplayId');

      expect(result).to.be.false;
      expect(consoleSpy.called).to.be.true;
      expect(consoleSpy.args[0][1]).to.include('No payload found for replayId');
      expect(mockApi.postSpans.called).to.be.false;
    });

    it('should handle API errors during sending', async function () {
      replayManager.setSpans('errorReplayId', [{ id: 'span1' }]);

      mockApi.postSpans.rejects(new Error('API error'));

      const consoleSpy = sinon.spy(console, 'error');
      const result = await replayManager.send('errorReplayId');

      expect(result).to.be.false;
      expect(consoleSpy.called).to.be.true;
      expect(consoleSpy.args[0][1]).to.include('Error sending replay');
      expect(mockApi.postSpans.called).to.be.true;

      expect(replayManager.size).to.equal(0);
    });
  });

  describe('discard', function () {
    it('should remove the replay from the map without sending', function () {
      replayManager.setSpans('discardReplayId', [{ id: 'span1' }]);
      expect(replayManager.size).to.equal(1);

      const result = replayManager.discard('discardReplayId');

      expect(result).to.be.true;
      expect(mockApi.postSpans.called).to.be.false;
      expect(replayManager.size).to.equal(0);
    });

    it('should handle missing replayId parameter', function () {
      const consoleSpy = sinon.spy(console, 'error');

      const result = replayManager.discard();

      expect(result).to.be.false;
      expect(consoleSpy.called).to.be.true;
      expect(consoleSpy.args[0][1]).to.include(
        'ReplayManager.discard: No replayId provided',
      );
    });

    it('should handle non-existent replayId', function () {
      const consoleSpy = sinon.spy(console, 'error');

      const result = replayManager.discard('nonexistent');

      expect(result).to.be.false;
      expect(consoleSpy.called).to.be.true;
      expect(consoleSpy.args[0][1]).to.include('No replay found for replayId');
    });
  });

  describe('getSpans and setSpans', function () {
    it('should get spans correctly when they exist', function () {
      const testPayload = [{ id: 'testSpan1' }, { id: 'testSpan2' }];
      replayManager.setSpans('testReplayId', testPayload);

      const result = replayManager.getSpans('testReplayId');
      expect(result).to.deep.equal(testPayload);
    });

    it('should return null when getting spans for non-existent replayId', function () {
      const result = replayManager.getSpans('nonExistentId');
      expect(result).to.be.null;
    });

    it('should allow overwriting existing spans', function () {
      const initialPayload = [{ id: 'initialSpan' }];
      const updatedPayload = [{ id: 'updatedSpan' }];

      replayManager.setSpans('replayId', initialPayload);
      expect(replayManager.getSpans('replayId')).to.deep.equal(initialPayload);

      replayManager.setSpans('replayId', updatedPayload);
      expect(replayManager.getSpans('replayId')).to.deep.equal(updatedPayload);
    });
  });

  describe('size and clear', function () {
    it('should report correct size of the map', function () {
      expect(replayManager.size).to.equal(0);

      replayManager.setSpans('id1', [{ id: 'span1' }]);
      expect(replayManager.size).to.equal(1);

      replayManager.setSpans('id2', [{ id: 'span2' }]);
      expect(replayManager.size).to.equal(2);
    });

    it('should clear all entries from the map', function () {
      replayManager.setSpans('id1', [{ id: 'span1' }]);
      replayManager.setSpans('id2', [{ id: 'span2' }]);
      expect(replayManager.size).to.equal(2);

      replayManager.clear();
      expect(replayManager.size).to.equal(0);
    });
  });
});
