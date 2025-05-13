/**
 * Unit tests for the ReplayMap module
 */

/* globals describe */
/* globals it */
/* globals beforeEach */
/* globals afterEach */
/* globals sinon */

import { expect } from 'chai';
import sinon from 'sinon';
import ReplayMap from '../../../src/browser/replay/replayMap.js';
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

describe('ReplayMap', function () {
  let replayMap;
  let mockRecorder;
  let mockApi;
  let mockTracing;

  beforeEach(function () {
    sinon.stub(id, 'gen').returns('1234567890abcdef');

    mockRecorder = new MockRecorder();
    mockApi = new MockApi();
    mockTracing = new MockTracing();

    replayMap = new ReplayMap({
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
      expect(() => new ReplayMap({})).to.throw(TypeError);
      expect(() => new ReplayMap({ recorder: mockRecorder })).to.throw(
        TypeError,
      );
      expect(
        () =>
          new ReplayMap({
            recorder: mockRecorder,
            api: mockApi,
          }),
      ).to.throw(TypeError);

      expect(
        () =>
          new ReplayMap({
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

      const result = await replayMap._processReplay(replayId);

      expect(result).to.equal(replayId);
      expect(mockRecorder.dump.called).to.be.true;
      expect(mockRecorder.dump.calledWith(mockTracing, replayId)).to.be.true;

      expect(replayMap.size).to.equal(1);

      const retrievedPayload = replayMap.getSpans(replayId);
      expect(retrievedPayload).to.deep.equal(expectedPayload);
    });

    it('should store null in map when dump returns null', async function () {
      mockRecorder = new MockRecorder(false);
      replayMap = new ReplayMap({
        recorder: mockRecorder,
        api: mockApi,
        tracing: mockTracing,
      });

      const replayId = '1234567890abcdef';
      const result = await replayMap._processReplay(replayId);

      expect(result).to.equal(replayId);
      expect(mockRecorder.dump.called).to.be.true;
      expect(mockRecorder.dump.calledWith(mockTracing, replayId)).to.be.true;

      expect(replayMap.size).to.equal(1);
      expect(replayMap.getSpans(replayId)).to.be.null;
    });

    it('should handle errors gracefully', async function () {
      mockRecorder.dump.throws(new Error('Test error'));

      const consoleSpy = sinon.spy(console, 'error');
      const replayId = '1234567890abcdef';
      const result = await replayMap._processReplay(replayId);

      expect(result).to.equal(replayId);
      expect(mockRecorder.dump.called).to.be.true;
      expect(consoleSpy.called).to.be.true;
      expect(consoleSpy.args[0][0]).to.include('Error transforming spans');

      expect(replayMap.size).to.equal(1);
      expect(replayMap.getSpans(replayId)).to.be.null;
    });
  });

  describe('add', function () {
    it('should generate a replayId and initiate async processing', function () {
      const processStub = sinon
        .stub(replayMap, '_processReplay')
        .resolves('1234567890abcdef');

      const replayId = replayMap.add();

      expect(replayId).to.equal('1234567890abcdef');
      expect(id.gen.calledWith(8)).to.be.true;
      expect(processStub.calledWith(replayId)).to.be.true;
    });

    it('should handle errors from _processReplay', function (done) {
      sinon.stub(replayMap, '_processReplay').rejects(new Error('Test error'));

      const errorSpy = sinon.spy(console, 'error');

      try {
        replayMap.add();

        setTimeout(() => {
          expect(errorSpy.called).to.be.true;
          expect(errorSpy.args[0][0]).to.include('Failed to process replay');
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
      replayMap.setSpans('testReplayId', mockPayload);
      expect(replayMap.size).to.equal(1);

      const result = await replayMap.send('testReplayId');

      expect(result).to.be.true;
      expect(mockApi.postSpans.called).to.be.true;
      expect(mockApi.postSpans.firstCall.args[0]).to.deep.equal(mockPayload);

      expect(replayMap.size).to.equal(0);
    });

    it('should handle missing replayId parameter', async function () {
      const consoleSpy = sinon.spy(console, 'warn');

      const result = await replayMap.send();

      expect(result).to.be.false;
      expect(consoleSpy.calledWith('ReplayMap.send: No replayId provided')).to
        .be.true;
      expect(mockApi.postSpans.called).to.be.false;
    });

    it('should handle non-existent replayId', async function () {
      const consoleSpy = sinon.spy(console, 'warn');

      const result = await replayMap.send('nonexistent');

      expect(result).to.be.false;
      expect(consoleSpy.called).to.be.true;
      expect(consoleSpy.args[0][0]).to.include('No replay found for replayId');
      expect(mockApi.postSpans.called).to.be.false;
    });

    it('should handle empty array payload', async function () {
      replayMap.setSpans('emptyReplayId', []);

      const consoleSpy = sinon.spy(console, 'warn');
      const result = await replayMap.send('emptyReplayId');

      expect(result).to.be.false;
      expect(consoleSpy.called).to.be.true;
      expect(consoleSpy.args[0][0]).to.include('No payload found for replayId');
      expect(mockApi.postSpans.called).to.be.false;
    });

    it('should handle empty OTLP payload', async function () {
      replayMap.setSpans('emptyOTLPReplayId', { resourceSpans: [] });

      const consoleSpy = sinon.spy(console, 'warn');
      const result = await replayMap.send('emptyOTLPReplayId');

      expect(result).to.be.false;
      expect(consoleSpy.called).to.be.true;
      expect(consoleSpy.args[0][0]).to.include('No payload found for replayId');
      expect(mockApi.postSpans.called).to.be.false;
    });

    it('should handle API errors during sending', async function () {
      replayMap.setSpans('errorReplayId', [{ id: 'span1' }]);

      mockApi.postSpans.rejects(new Error('API error'));

      const consoleSpy = sinon.spy(console, 'error');
      const result = await replayMap.send('errorReplayId');

      expect(result).to.be.false;
      expect(consoleSpy.called).to.be.true;
      expect(consoleSpy.args[0][0]).to.include('Error sending replay');
      expect(mockApi.postSpans.called).to.be.true;

      expect(replayMap.size).to.equal(0);
    });
  });

  describe('discard', function () {
    it('should remove the replay from the map without sending', function () {
      replayMap.setSpans('discardReplayId', [{ id: 'span1' }]);
      expect(replayMap.size).to.equal(1);

      const result = replayMap.discard('discardReplayId');

      expect(result).to.be.true;
      expect(mockApi.postSpans.called).to.be.false;
      expect(replayMap.size).to.equal(0);
    });

    it('should handle missing replayId parameter', function () {
      const consoleSpy = sinon.spy(console, 'warn');

      const result = replayMap.discard();

      expect(result).to.be.false;
      expect(consoleSpy.calledWith('ReplayMap.discard: No replayId provided'))
        .to.be.true;
    });

    it('should handle non-existent replayId', function () {
      const consoleSpy = sinon.spy(console, 'warn');

      const result = replayMap.discard('nonexistent');

      expect(result).to.be.false;
      expect(consoleSpy.called).to.be.true;
      expect(consoleSpy.args[0][0]).to.include('No replay found for replayId');
    });
  });

  describe('getSpans and setSpans', function () {
    it('should get spans correctly when they exist', function () {
      const testPayload = [{ id: 'testSpan1' }, { id: 'testSpan2' }];
      replayMap.setSpans('testReplayId', testPayload);

      const result = replayMap.getSpans('testReplayId');
      expect(result).to.deep.equal(testPayload);
    });

    it('should return null when getting spans for non-existent replayId', function () {
      const result = replayMap.getSpans('nonExistentId');
      expect(result).to.be.null;
    });

    it('should allow overwriting existing spans', function () {
      const initialPayload = [{ id: 'initialSpan' }];
      const updatedPayload = [{ id: 'updatedSpan' }];

      replayMap.setSpans('replayId', initialPayload);
      expect(replayMap.getSpans('replayId')).to.deep.equal(initialPayload);

      replayMap.setSpans('replayId', updatedPayload);
      expect(replayMap.getSpans('replayId')).to.deep.equal(updatedPayload);
    });
  });

  describe('size and clear', function () {
    it('should report correct size of the map', function () {
      expect(replayMap.size).to.equal(0);

      replayMap.setSpans('id1', [{ id: 'span1' }]);
      expect(replayMap.size).to.equal(1);

      replayMap.setSpans('id2', [{ id: 'span2' }]);
      expect(replayMap.size).to.equal(2);
    });

    it('should clear all entries from the map', function () {
      replayMap.setSpans('id1', [{ id: 'span1' }]);
      replayMap.setSpans('id2', [{ id: 'span2' }]);
      expect(replayMap.size).to.equal(2);

      replayMap.clear();
      expect(replayMap.size).to.equal(0);
    });
  });
});
