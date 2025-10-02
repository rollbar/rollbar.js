import { expect } from 'chai';
import { EventType } from '@rrweb/types';

import Recorder from '../../../src/browser/replay/recorder.js';
import { setCurrentBuffer, setPreviousBuffer } from '../util/recorder.js';

describe('Recorder buffer-index event collection', function () {
  let recorder;
  const mockRecordFn = () => () => {};

  beforeEach(function () {
    recorder = new Recorder(
      {
        enabled: true,
        autoStart: false,
        maxSeconds: 10,
      },
      mockRecordFn,
    );
  });

  describe('_collectAll', function () {
    it('returns all events from both buffers', function () {
      setPreviousBuffer(recorder, [
        { timestamp: 1000, type: EventType.Meta, data: {} },
        { timestamp: 2000, type: EventType.Meta, data: {} },
      ]);
      setCurrentBuffer(recorder, [
        { timestamp: 3000, type: EventType.Meta, data: {} },
        { timestamp: 4000, type: EventType.Meta, data: {} },
      ]);

      const events = recorder._collectAll();

      expect(events).to.have.lengthOf(5);
      expect(events[0].timestamp).to.equal(1000);
      expect(events[1].timestamp).to.equal(2000);
      expect(events[2].timestamp).to.equal(3000);
      expect(events[3].timestamp).to.equal(4000);
      expect(events[4].data.tag).to.equal('replay.end');
    });

    it('returns empty array when no events exist', function () {
      setPreviousBuffer(recorder, []);
      setCurrentBuffer(recorder, []);

      const events = recorder._collectAll();

      expect(events).to.have.lengthOf(0);
    });
  });

  describe('_collectEventsFromCursor', function () {
    it('returns events after cursor in same buffer', function () {
      recorder._buffers[0] = [
        { timestamp: 1000, type: EventType.Meta, data: {} },
        { timestamp: 2000, type: EventType.Meta, data: {} },
        { timestamp: 3000, type: EventType.Meta, data: {} },
        { timestamp: 4000, type: EventType.Meta, data: {} },
      ];
      recorder._currentSlot = 0;

      const cursor = { slot: 0, offset: 1 };
      const events = recorder._collectEventsFromCursor(cursor);

      expect(events).to.have.lengthOf(3);
      expect(events[0].timestamp).to.equal(3000);
      expect(events[1].timestamp).to.equal(4000);
      expect(events[2].data.tag).to.equal('replay.end');
    });

    it('returns events after cursor spanning checkout', function () {
      recorder._buffers[0] = [
        { timestamp: 1000, type: EventType.Meta, data: {} },
        { timestamp: 2000, type: EventType.Meta, data: {} },
        { timestamp: 3000, type: EventType.Meta, data: {} },
      ];
      recorder._buffers[1] = [
        { timestamp: 4000, type: EventType.Meta, data: {} },
        { timestamp: 5000, type: EventType.Meta, data: {} },
      ];
      recorder._currentSlot = 1;

      const cursor = { slot: 0, offset: 1 };
      const events = recorder._collectEventsFromCursor(cursor);

      expect(events).to.have.lengthOf(4);
      expect(events[0].timestamp).to.equal(3000);
      expect(events[1].timestamp).to.equal(4000);
      expect(events[2].timestamp).to.equal(5000);
      expect(events[3].data.tag).to.equal('replay.end');
    });

    it('handles empty captured buffer after multiple checkouts', function () {
      recorder._buffers[0] = [];
      recorder._buffers[1] = [
        { timestamp: 5000, type: EventType.Meta, data: {} },
        { timestamp: 6000, type: EventType.Meta, data: {} },
      ];
      recorder._currentSlot = 1;

      const cursor = { slot: 0, offset: 2 };
      const events = recorder._collectEventsFromCursor(cursor);

      expect(events).to.have.lengthOf(3);
      expect(events[0].timestamp).to.equal(5000);
      expect(events[1].timestamp).to.equal(6000);
      expect(events[2].data.tag).to.equal('replay.end');
    });

    it('returns empty array when cursor is at end of current buffer', function () {
      recorder._buffers[0] = [
        { timestamp: 1000, type: EventType.Meta, data: {} },
        { timestamp: 2000, type: EventType.Meta, data: {} },
      ];
      recorder._currentSlot = 0;

      const cursor = { slot: 0, offset: 1 };
      const events = recorder._collectEventsFromCursor(cursor);

      expect(events).to.have.lengthOf(0);
    });

    it('handles offset beyond buffer length', () => {
      recorder._buffers[0] = [
        { timestamp: 1000, type: EventType.Meta, data: {} },
        { timestamp: 2000, type: EventType.Meta, data: {} },
      ];
      recorder._buffers[1] = [
        { timestamp: 3000, type: EventType.Meta, data: {} },
      ];
      recorder._currentSlot = 1;

      const cursor = { slot: 0, offset: 10 };
      const events = recorder._collectEventsFromCursor(cursor);

      expect(events).to.have.lengthOf(2);
      expect(events[0].timestamp).to.equal(3000);
      expect(events[1].data.tag).to.equal('replay.end');
    });
  });

  describe('bufferCursor', () => {
    it('returns current buffer index and offset', () => {
      recorder._buffers[0] = [
        { timestamp: 1000, type: EventType.Meta, data: {} },
        { timestamp: 2000, type: EventType.Meta, data: {} },
      ];
      recorder._currentSlot = 0;

      const cursor = recorder.bufferCursor();

      expect(cursor).to.deep.equal({ slot: 0, offset: 1 });
    });

    it('updates after checkout', () => {
      recorder._buffers[1] = [
        { timestamp: 3000, type: EventType.Meta, data: {} },
      ];
      recorder._currentSlot = 1;

      const cursor = recorder.bufferCursor();

      expect(cursor).to.deep.equal({ slot: 1, offset: 0 });
    });
  });
});
