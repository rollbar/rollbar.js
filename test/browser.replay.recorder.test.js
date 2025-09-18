import { expect } from 'chai';
import sinon from 'sinon';
import { EventType } from '@rrweb/types';

import Recorder from '../src/browser/replay/recorder.js';

describe('Recorder', function () {
  let mockTracing;
  let mockSpan;
  let stopFnSpy;
  let recordFnStub;
  let emitCallback;
  let testReplayId;

  beforeEach(function () {
    mockSpan = {
      addEvent: sinon.spy(),
      setAttributes: sinon.spy(),
      span: { startTime: null },
      end: sinon.spy(),
    };

    mockTracing = {
      startSpan: sinon.stub().returns(mockSpan),
      exporter: {
        toPayload: sinon.stub().returns([{ id: 'span1' }]),
      },
    };

    testReplayId = 'test-replay-id-123';
    stopFnSpy = sinon.spy();
    recordFnStub = sinon.stub().callsFake(function (options) {
      emitCallback = options.emit;
      return stopFnSpy;
    });
  });

  describe('constructor', function () {
    it('should initialize with default properties', function () {
      const recorder = new Recorder({}, recordFnStub);

      expect(recorder.isRecording).to.be.false;
      expect(recorder.options).to.deep.equal({
        enabled: undefined,
        autoStart: undefined,
        maxSeconds: undefined,
        triggers: undefined,
        debug: undefined,
      });
    });

    it('should initialize removing disallowed options', function () {
      const options = { enabled: true, checkoutEveryNms: 1000 };
      const recorder = new Recorder(options, recordFnStub);

      expect(recorder.options).to.deep.equal({
        enabled: true,
        autoStart: undefined,
        maxSeconds: undefined,
        triggers: undefined,
        debug: undefined,
      });
    });

    it('should throw error if no record function is passed', function () {
      expect(() => new Recorder({}, null)).to.throw(
        TypeError,
        "Expected 'recordFn' to be provided",
      );
    });
  });

  describe('recording management', function () {
    it('should start recording correctly', function () {
      const recorder = new Recorder(
        { enabled: true },
        recordFnStub,
      );
      recorder.start();

      expect(recorder.isRecording).to.be.true;
      expect(recordFnStub.calledOnce).to.be.true;
      expect(stopFnSpy.called).to.be.false;

      const recordOptions = recordFnStub.firstCall.args[0];
      expect(recordOptions.checkoutEveryNms).to.equal(5000);
      expect(typeof recordOptions.emit).to.equal('function');
    });

    it('should not start if already recording', function () {
      const recorder = new Recorder(
        { enabled: true },
        recordFnStub,
      );
      recorder.start();
      recorder.start();

      expect(recordFnStub.calledOnce).to.be.true;
    });

    it('should not start if disabled', function () {
      const recorder = new Recorder(
        { enabled: false },
        recordFnStub,
      );
      recorder.start();

      expect(recorder.isRecording).to.be.false;
      expect(recordFnStub.called).to.be.false;
    });

    it('should stop recording correctly', function () {
      const recorder = new Recorder(
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
      const recorder = new Recorder({}, recordFnStub);
      recorder.stop();

      expect(recorder.isRecording).to.be.false;
      expect(stopFnSpy.called).to.be.false;
    });
  });

  describe('event handling', function () {
    it('should handle events correctly', function () {
      const recorder = new Recorder({}, recordFnStub);
      recorder.start();

      const event1 = { timestamp: 1000, type: 'event1', data: { a: 1 } };
      const event2 = { timestamp: 2000, type: 'event2', data: { b: 2 } };

      emitCallback(event1, false);
      emitCallback(event2, false);

      const result = recorder.dump(mockTracing, testReplayId);

      expect(mockTracing.startSpan.calledOnce).to.be.true;

      // Event count includes the custom end event
      expect(mockSpan.addEvent.calledThrice).to.be.true;
      expect(mockSpan.setAttributes.calledOnce).to.be.true;
      expect(mockSpan.setAttributes.calledWith({'rollbar.replay.id': testReplayId})).to.be.true;

      const firstCallData = mockSpan.addEvent.firstCall.args[1];
      expect(firstCallData.eventType).to.equal('event1');
      expect(JSON.parse(firstCallData.json)).to.deep.equal({ a: 1 });

      const secondCallData = mockSpan.addEvent.secondCall.args[1];
      expect(secondCallData.eventType).to.equal('event2');
      expect(JSON.parse(secondCallData.json)).to.deep.equal({ b: 2 });

      const thirdCallData = mockSpan.addEvent.thirdCall.args[1];
      expect(thirdCallData.eventType).to.equal(5);
      expect(JSON.parse(thirdCallData.json)).to.deep.equal({tag: "replay.end", payload: {}});
    });

    it('should handle checkout events correctly', function () {
      const recorder = new Recorder({}, recordFnStub);
      recorder.start();

      // First checkout
      emitCallback({ timestamp: 0, type: EventType.Meta, data: {} }, true);
      emitCallback(
        { timestamp: 10, type: EventType.FullSnapshot, data: {} },
        true,
      );
      emitCallback(
        {
          timestamp: 1000,
          type: EventType.IncrementalSnapshot,
          data: { a: 1 },
        },
        false,
      );
      emitCallback(
        {
          timestamp: 2000,
          type: EventType.IncrementalSnapshot,
          data: { b: 2 },
        },
        false,
      );

      // Second checkout
      emitCallback({ timestamp: 3050, type: EventType.Meta, data: {} }, true);
      emitCallback(
        { timestamp: 3100, type: EventType.FullSnapshot, data: {} },
        true,
      );
      emitCallback(
        {
          timestamp: 4000,
          type: EventType.IncrementalSnapshot,
          data: { c: 3 },
        },
        false,
      );

      // Third checkout
      emitCallback({ timestamp: 4500, type: EventType.Meta, data: {} }, true);
      emitCallback(
        { timestamp: 5000, type: EventType.FullSnapshot, data: {} },
        true,
      );
      emitCallback(
        {
          timestamp: 6000,
          type: EventType.IncrementalSnapshot,
          data: { d: 4 },
        },
        false,
      );

      recorder.dump(mockTracing, testReplayId);

      // 2nd checkout (meta + fs) + event3 + 3rd checkout (meta + fs) + event4
      expect(mockSpan.span.startTime).to.be.deep.equal([3, 50000000]); // otel time
      expect(mockSpan.span.endTime).not.to.be.null;

      // Event count includes the custom end event
      expect(mockSpan.addEvent.callCount).to.equal(7);

      [
        {
          name: 'rrweb-replay-events',
          attributes: {
            eventType: EventType.Meta,
            json: JSON.stringify({}),
          },
          timestamp: [3, 50000000],
        },
        {
          name: 'rrweb-replay-events',
          attributes: {
            eventType: EventType.FullSnapshot,
            json: JSON.stringify({}),
          },
          timestamp: [3, 100000000],
        },
        {
          name: 'rrweb-replay-events',
          attributes: {
            eventType: EventType.IncrementalSnapshot,
            json: JSON.stringify({ c: 3 }),
          },
          timestamp: [4, 0],
        },
        {
          name: 'rrweb-replay-events',
          attributes: {
            eventType: EventType.Meta,
            json: JSON.stringify({}),
          },
          timestamp: [4, 500000000],
        },
        {
          name: 'rrweb-replay-events',
          attributes: {
            eventType: EventType.FullSnapshot,
            json: JSON.stringify({}),
          },
          timestamp: [5, 0],
        },
        {
          name: 'rrweb-replay-events',
          attributes: {
            eventType: EventType.IncrementalSnapshot,
            json: JSON.stringify({ d: 4 }),
          },
          timestamp: [6, 0],
        },
      ].forEach((expected, index) => {
        const call = mockSpan.addEvent.getCall(index);
        expect(call.args[0]).to.equal(expected.name);
        expect(call.args[1]).to.deep.equal(expected.attributes);
        expect(call.args[2]).to.deep.equal(expected.timestamp);
      });
    });
  });

  describe('dump functionality', function () {
    it('should create a span with events and return formatted payload', function () {
      const recorder = new Recorder({}, recordFnStub);
      recorder.start();

      emitCallback({ timestamp: 1000, type: 'event1', data: { a: 1 } }, false);
      emitCallback({ timestamp: 2000, type: 'event2', data: { b: 2 } }, false);

      const result = recorder.dump(mockTracing, testReplayId);

      expect(result).to.deep.equal([{ id: 'span1' }]);
      expect(mockTracing.startSpan.calledOnce).to.be.true;

      // Event count includes the custom end event
      expect(mockSpan.addEvent.calledThrice).to.be.true;
      expect(mockSpan.end.calledOnce).to.be.true;
      expect(mockTracing.exporter.toPayload.calledOnce).to.be.true;
    });

    it('should create a span with the correct span name', function () {
      const recorder = new Recorder({}, recordFnStub);
      recorder.start();

      emitCallback({ timestamp: 1000, type: 'event1', data: { a: 1 } }, false);
      emitCallback({ timestamp: 2000, type: 'event2', data: { b: 2 } }, false);

      recorder.dump(mockTracing, testReplayId);

      expect(mockTracing.startSpan.calledOnce).to.be.true;
      const spanName = mockTracing.startSpan.firstCall.args[0];
      expect(spanName).to.equal('rrweb-replay-recording');
    });

    it('should add events with the correct event name and replayId', function () {
      const recorder = new Recorder({}, recordFnStub);
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

      recorder.dump(mockTracing, testReplayId);

      // Event count includes the custom end event
      expect(mockSpan.addEvent.callCount).to.equal(4);

      for (let i = 0; i < mockSpan.addEvent.callCount; i++) {
        const eventName = mockSpan.addEvent.getCall(i).args[0];
        const eventAttrs = mockSpan.addEvent.getCall(i).args[1];
        expect(eventName).to.equal(
          'rrweb-replay-events',
          `Event at index ${i} should have name "rrweb-replay-events"`
        );
      }
    });

    it('should handle no events', function () {
      const recorder = new Recorder({}, recordFnStub);

      const result = recorder.dump(mockTracing, testReplayId);

      expect(result).to.be.null;
      expect(mockTracing.startSpan.called).to.be.false;
      expect(mockTracing.exporter.toPayload.called).to.be.false;
    });

    it('should handle less than 2 events (invalid recording)', function () {
      const recorder = new Recorder({}, recordFnStub);
      recorder.start();

      emitCallback({ timestamp: 1000, type: 'event1', data: { a: 1 } }, false);

      const result = recorder.dump(mockTracing, testReplayId);

      expect(result).to.be.null;
      expect(mockTracing.startSpan.called).to.be.false;
      expect(mockTracing.exporter.toPayload.called).to.be.false;
    });
  });

  describe('configure', function () {
    it('should update options', function () {
      const recorder = new Recorder(
        { enabled: true },
        recordFnStub,
      );

      recorder.configure({ enabled: false, maxSeconds: 20 });

      expect(recorder.options).to.deep.equal({
        enabled: false,
        autoStart: undefined,
        maxSeconds: 20,
        triggers: undefined,
        debug: undefined,
      });
    });

    it('should set correct checkoutEveryNms', function () {
      const recorder = new Recorder({ enabled: false });

      recorder.configure({ enabled: true, maxSeconds: 15 });

      expect(recorder.options).to.deep.equal({
        enabled: true,
        autoStart: undefined,
        maxSeconds: 15,
        triggers: undefined,
        debug: undefined,
      });

      expect(recorder.checkoutEveryNms()).to.equal(7500);
    });

    it('should stop recording if enabled set to false', function () {
      const recorder = new Recorder(
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
