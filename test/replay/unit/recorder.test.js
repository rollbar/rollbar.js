import { expect } from 'chai';
import sinon from 'sinon';

import Recorder from '../../../src/browser/replay/recorder.js';

describe('Recorder', function () {
  const mockRecordFn = () => () => {};

  describe('constructor', function () {
    it('initializes with provided options', function () {
      const options = {
        enabled: true,
        autoStart: false,
        maxSeconds: 10,
        postDuration: 5,
      };

      const recorder = new Recorder(options, mockRecordFn);

      expect(recorder.options).to.deep.equal({
        enabled: true,
        autoStart: false,
        maxSeconds: 10,
        postDuration: 5,
        triggers: undefined,
        debug: undefined,
      });
      expect(recorder.isReady).to.be.false;
      expect(recorder.isRecording).to.be.false;
    });

    it('throws when recordFn is not provided', function () {
      expect(() => new Recorder({}, null)).to.throw(
        TypeError,
        "Expected 'recordFn' to be provided",
      );
    });

    it('initializes buffers and slots correctly', function () {
      const recorder = new Recorder({}, mockRecordFn);

      expect(recorder._buffers).to.deep.equal([[], []]);
      expect(recorder._currentSlot).to.equal(0);
      expect(recorder._previousSlot).to.equal(1);
    });
  });

  describe('options getter/setter', function () {
    it('returns configured options', function () {
      const recorder = new Recorder(
        { enabled: true, maxSeconds: 10 },
        mockRecordFn,
      );

      expect(recorder.options).to.have.property('enabled', true);
      expect(recorder.options).to.have.property('maxSeconds', 10);
    });

    it('calls configure when setting options', function () {
      const recorder = new Recorder({}, mockRecordFn);
      sinon.spy(recorder, 'configure');

      recorder.options = { enabled: false };

      sinon.assert.calledOnce(recorder.configure);
      sinon.assert.calledWith(recorder.configure, { enabled: false });
    });
  });

  describe('configure', function () {
    it('updates Rollbar options', function () {
      const recorder = new Recorder({ enabled: true }, mockRecordFn);

      recorder.configure({
        enabled: false,
        maxSeconds: 20,
        postDuration: 10,
        triggers: ['error'],
        debug: { logEmits: true },
      });

      expect(recorder.options).to.deep.equal({
        enabled: false,
        autoStart: undefined,
        maxSeconds: 20,
        postDuration: 10,
        triggers: ['error'],
        debug: { logEmits: true },
      });
    });

    it('separates rrweb options from Rollbar options', function () {
      const recorder = new Recorder({}, mockRecordFn);

      recorder.configure({
        enabled: true,
        maxSeconds: 10,
        sampling: { mousemove: true },
        blockClass: 'rr-block',
      });

      expect(recorder.options).to.not.have.property('sampling');
      expect(recorder.options).to.not.have.property('blockClass');
      expect(recorder._rrwebOptions).to.have.property('sampling');
      expect(recorder._rrwebOptions).to.have.property('blockClass');
    });

    it('filters out disallowed rrweb options', function () {
      const recorder = new Recorder({}, mockRecordFn);

      recorder.configure({
        enabled: true,
        emit: () => {},
        checkoutEveryNms: 5000,
      });

      expect(recorder._rrwebOptions).to.not.have.property('emit');
      expect(recorder._rrwebOptions).to.not.have.property('checkoutEveryNms');
    });

    it('stops recording when enabled is set to false', function () {
      const recorder = new Recorder({ enabled: true }, mockRecordFn);
      recorder._stopFn = () => {};
      sinon.spy(recorder, 'stop');

      recorder.configure({ enabled: false });

      sinon.assert.calledOnce(recorder.stop);
    });
  });

  describe('isRecording', function () {
    it('returns false when not recording', function () {
      const recorder = new Recorder({}, mockRecordFn);

      expect(recorder.isRecording).to.be.false;
    });

    it('returns true when recording', function () {
      const recorder = new Recorder({}, mockRecordFn);
      recorder._stopFn = () => {};

      expect(recorder.isRecording).to.be.true;
    });
  });

  describe('isReady', function () {
    it('returns false initially', function () {
      const recorder = new Recorder({}, mockRecordFn);

      expect(recorder.isReady).to.be.false;
    });
  });

  describe('checkoutEveryNms', function () {
    it('returns half of maxSeconds in milliseconds', function () {
      const recorder = new Recorder({ maxSeconds: 10 }, mockRecordFn);

      expect(recorder.checkoutEveryNms()).to.equal(5000);
    });

    it('uses default of 10 seconds when maxSeconds not provided', function () {
      const recorder = new Recorder({}, mockRecordFn);

      expect(recorder.checkoutEveryNms()).to.equal(5000);
    });

    it('calculates correctly for different maxSeconds values', function () {
      const recorder = new Recorder({ maxSeconds: 20 }, mockRecordFn);

      expect(recorder.checkoutEveryNms()).to.equal(10000);
    });
  });

  describe('_previousSlot', function () {
    it('returns 1 when currentSlot is 0', function () {
      const recorder = new Recorder({}, mockRecordFn);
      recorder._currentSlot = 0;

      expect(recorder._previousSlot).to.equal(1);
    });

    it('returns 0 when currentSlot is 1', function () {
      const recorder = new Recorder({}, mockRecordFn);
      recorder._currentSlot = 1;

      expect(recorder._previousSlot).to.equal(0);
    });
  });

  describe('clear', function () {
    it('resets buffers and state', function () {
      const recorder = new Recorder({}, mockRecordFn);
      recorder._buffers = [[{ data: 1 }], [{ data: 2 }]];
      recorder._currentSlot = 1;
      recorder._isReady = true;

      recorder.clear();

      expect(recorder._buffers).to.deep.equal([[], []]);
      expect(recorder._currentSlot).to.equal(0);
      expect(recorder.isReady).to.be.false;
    });
  });
});
