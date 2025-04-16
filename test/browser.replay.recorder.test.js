/* globals expect */
/* globals describe */
/* globals it */
/* globals beforeEach */
/* globals sinon */

import { expect } from 'chai';

import Recorder from '../src/browser/replay/recorder.js';

describe('Recorder', function () {
  let mockTracing;
  let mockSpan;
  let stopFnSpy;
  let recordFnStub;
  let emitCallback;

  beforeEach(function () {
    mockSpan = {
      addEvent: sinon.spy(),
      toHrTime: (timestamp) => [
        Math.floor(timestamp / 1000),
        (timestamp % 1000) * 1000000,
      ],
      span: { startTime: null },
      end: sinon.spy(),
    };

    mockTracing = {
      startSpan: sinon.stub().returns(mockSpan),
    };

    stopFnSpy = sinon.spy();
    recordFnStub = sinon.stub().callsFake(function (options) {
      emitCallback = options.emit;
      return stopFnSpy;
    });
  });

  describe('constructor', function () {
    it('should initialize with default properties', function () {
      const recorder = new Recorder(mockTracing, {}, recordFnStub);

      expect(recorder.isRecording).to.equal(false);
      expect(recorder.options).to.deep.equal({});
    });

    it('should initialize with provided options', function () {
      const options = { enabled: true, checkoutEveryNms: 1000 };
      const recorder = new Recorder(mockTracing, options, recordFnStub);

      expect(recorder.options).to.deep.equal(options);
    });

    it('should throw error if no tracing is passed', function () {
      expect(() => new Recorder(null)).to.throw(
        TypeError,
        "Expected 'tracing' to be provided",
      );
    });

    it('should throw error if no record function is passed', function () {
      expect(() => new Recorder(mockTracing, {}, null)).to.throw(
        TypeError,
        "Expected 'recordFn' to be provided",
      );
    });
  });

  describe('recording management', function () {
    it('should start recording correctly', function () {
      const recorder = new Recorder(
        mockTracing,
        { enabled: true },
        recordFnStub,
      );
      recorder.start();

      expect(recorder.isRecording).to.be.true;
      expect(recordFnStub.calledOnce).to.be.true;
      expect(stopFnSpy.called).to.be.false;

      const recordOptions = recordFnStub.firstCall.args[0];
      expect(recordOptions.checkoutEveryNms).to.equal(300000);
      expect(typeof recordOptions.emit).to.equal('function');
    });

    it('should not start if already recording', function () {
      const recorder = new Recorder(
        mockTracing,
        { enabled: true },
        recordFnStub,
      );
      recorder.start();
      recorder.start();

      expect(recordFnStub.calledOnce).to.be.true;
    });

    it('should not start if disabled', function () {
      const recorder = new Recorder(
        mockTracing,
        { enabled: false },
        recordFnStub,
      );
      recorder.start();

      expect(recorder.isRecording).to.be.false;
      expect(recordFnStub.called).to.be.false;
    });

    it('should stop recording correctly', function () {
      const recorder = new Recorder(
        mockTracing,
        { enabled: true },
        recordFnStub,
      );
      recorder.start();
      recorder.stop();

      expect(recorder.isRecording).to.be.false;
      expect(recordFnStub.calledOnce).to.be.true;
      expect(stopFnSpy.calledOnce).to.be.true;
    });

    it('should handle stop when not recording', function () {
      const recorder = new Recorder(mockTracing, {}, recordFnStub);
      recorder.stop();

      expect(recorder.isRecording).to.be.false;
      expect(stopFnSpy.called).to.be.false;
    });
  });

  describe('event handling', function () {
    it('should handle events correctly', function () {
      const recorder = new Recorder(mockTracing, {}, recordFnStub);
      recorder.start();

      const event1 = { timestamp: 1000, type: 'event1', data: { a: 1 } };
      const event2 = { timestamp: 2000, type: 'event2', data: { b: 2 } };

      emitCallback(event1, false);
      emitCallback(event2, false);

      const context = { spanId: '123' };
      recorder.dump(context);

      expect(mockTracing.startSpan.calledOnce).to.be.true;
      expect(mockSpan.addEvent.calledTwice).to.be.true;

      const firstCallData = mockSpan.addEvent.firstCall.args[1];
      expect(firstCallData.eventType).to.equal('event1');
      expect(JSON.parse(firstCallData.json)).to.deep.equal({ a: 1 });

      const secondCallData = mockSpan.addEvent.secondCall.args[1];
      expect(secondCallData.eventType).to.equal('event2');
      expect(JSON.parse(secondCallData.json)).to.deep.equal({ b: 2 });
    });

    it('should handle checkout events correctly', function () {
      const recorder = new Recorder(mockTracing, {}, recordFnStub);
      recorder.start();

      // First checkout
      emitCallback({ timestamp: 0, type: 'fullSnapshot' }, true);
      const event1 = { timestamp: 1000, type: 'event1', data: { a: 1 } };
      const event2 = { timestamp: 2000, type: 'event2', data: { b: 2 } };
      emitCallback(event1, false);
      emitCallback(event2, false);

      // Second checkout
      emitCallback({ timestamp: 3100, type: 'fullSnapshot' }, true);
      const event3 = { timestamp: 4000, type: 'event3', data: { c: 3 } };
      emitCallback(event3, false);

      // Third checkout
      emitCallback({ timestamp: 5000, type: 'fullSnapshot' }, true);
      const event4 = { timestamp: 6000, type: 'event4', data: { d: 4 } };
      emitCallback(event4, false);

      const context = { spanId: '123' };
      recorder.dump(context);

      // 2nd checkout + event3 + 3rd checkout + event4
      expect(mockSpan.addEvent.callCount).to.equal(4);
      expect(mockSpan.span.startTime).to.be.deep.equal([3, 100000000]); // otel time
      expect(mockSpan.span.endTime).not.to.be.null;
    });
  });

  describe('dump functionality', function () {
    it('should create a span with events', function () {
      const recorder = new Recorder(mockTracing, {}, recordFnStub);
      recorder.start();

      emitCallback({ timestamp: 1000, type: 'event1', data: { a: 1 } }, false);
      emitCallback({ timestamp: 2000, type: 'event2', data: { b: 2 } }, false);

      const context = { spanId: '123' };
      const result = recorder.dump(context);

      expect(result).to.equal(mockSpan);
      expect(mockTracing.startSpan.calledOnce).to.be.true;
      expect(mockSpan.addEvent.calledTwice).to.be.true;
      expect(mockSpan.end.calledOnce).to.be.true;
    });

    it('should create a span with the correct span name', function () {
      const recorder = new Recorder(mockTracing, {}, recordFnStub);
      recorder.start();

      emitCallback({ timestamp: 1000, type: 'event1', data: { a: 1 } }, false);

      const context = { spanId: '123' };
      recorder.dump(context);

      expect(mockTracing.startSpan.calledOnce).to.be.true;
      const spanName = mockTracing.startSpan.firstCall.args[0];
      expect(spanName).to.equal('rrweb-replay-recording');
    });

    it('should add events with the correct event name', function () {
      const recorder = new Recorder(mockTracing, {}, recordFnStub);
      recorder.start();

      emitCallback(
        { timestamp: 1000, type: 'fullSnapshot', data: { a: 1 } },
        false,
      );
      emitCallback(
        { timestamp: 2000, type: 'mouseMove', data: { b: 2 } },
        false,
      );
      emitCallback({ timestamp: 3000, type: 'input', data: { c: 3 } }, false);

      const context = { spanId: '123' };
      recorder.dump(context);

      expect(mockSpan.addEvent.callCount).to.equal(3);

      for (let i = 0; i < mockSpan.addEvent.callCount; i++) {
        const eventName = mockSpan.addEvent.getCall(i).args[0];
        expect(eventName).to.equal(
          'rrweb-replay-events',
          `Event at index ${i} should have name "rrweb-replay-events"`,
        );
      }
    });

    it('should handle no events', function () {
      const recorder = new Recorder(mockTracing, {}, recordFnStub);

      const context = { spanId: '123' };
      const result = recorder.dump(context);

      expect(result).to.be.null;
      expect(mockTracing.startSpan.called).to.be.false;
    });

    it('should clear events if clear option is true', function () {
      const recorder = new Recorder(mockTracing, {}, recordFnStub);
      recorder.start();

      emitCallback({ timestamp: 1000, type: 'event1', data: { a: 1 } }, false);

      const context = { spanId: '123' };
      recorder.dump(context, { clear: true });

      emitCallback({ timestamp: 2000, type: 'event2', data: { b: 2 } }, false);
      recorder.dump(context);

      expect(mockSpan.addEvent.callCount).to.equal(2);
    });
  });

  describe('configure', function () {
    it('should update options', function () {
      const recorder = new Recorder(
        mockTracing,
        { enabled: true },
        recordFnStub,
      );

      recorder.configure({ enabled: false, checkoutEveryNms: 2000 });

      expect(recorder.options).to.deep.equal({
        enabled: false,
        checkoutEveryNms: 2000,
      });
    });

    it('should stop recording if enabled set to false', function () {
      const recorder = new Recorder(
        mockTracing,
        { enabled: true },
        recordFnStub,
      );
      recorder.start();

      expect(recorder.isRecording).to.be.true;

      recorder.configure({ enabled: false });

      expect(recorder.isRecording).to.be.false;
      expect(stopFnSpy.calledOnce).to.be.true;
    });
  });
});
