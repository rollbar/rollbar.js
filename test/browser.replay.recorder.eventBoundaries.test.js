/* globals expect */
/* globals describe */
/* globals it */

import Recorder from '../src/browser/replay/recorder.js';

describe('Recorder#findEventBoundaries', function () {
  // We'll use a minimal mocked tracing object just to instantiate the class
  const mockTracing = {};
  const recorder = new Recorder(mockTracing);

  it('should find earliest and latest events based on timestamp', function () {
    const events = [
      { timestamp: 1000, type: 'event1' },
      { timestamp: 500, type: 'event2' },
      { timestamp: 1500, type: 'event3' },
    ];

    const { earliest, latest } = recorder.findEventBoundaries(events);

    expect(earliest).to.equal(events[1]); // The event with timestamp 500
    expect(latest).to.equal(events[2]); // The event with timestamp 1500
  });

  it('should handle empty events array', function () {
    const { earliest, latest } = recorder.findEventBoundaries([]);

    expect(earliest).to.be.null;
    expect(latest).to.be.null;
  });

  it('should handle null events', function () {
    const { earliest, latest } = recorder.findEventBoundaries(null);

    expect(earliest).to.be.null;
    expect(latest).to.be.null;
  });

  it('should return same event as earliest and latest for single event', function () {
    const events = [{ timestamp: 1000, type: 'event1' }];

    const { earliest, latest } = recorder.findEventBoundaries(events);

    expect(earliest).to.equal(events[0]);
    expect(latest).to.equal(events[0]);
  });
});
