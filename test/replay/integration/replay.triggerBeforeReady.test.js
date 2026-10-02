/**
 * Integration tests for replay triggers that fire before the recorder is ready.
 *
 * Regression coverage for https://github.com/rollbar/rollbar.js/issues/1459:
 * the browser telemetry fires a `navigation` trigger on DOMContentLoaded, but
 * rrweb only emits its first full snapshot on window `load`. With a navigation
 * trigger configured, every page load logged
 * `Rollbar: Replay.discard: No replay found for replayId: ...`.
 */

import { expect } from 'chai';
import sinon from 'sinon';

import Api from '../../../src/api.js';
import replayDefaults from '../../../src/browser/replay/defaults.js';
import Replay from '../../../src/browser/replay/replay.js';
import logger from '../../../src/logger.js';
import Telemeter from '../../../src/telemetry.js';
import Tracing from '../../../src/tracing/tracing.js';
import { allEvents } from '../../fixtures/replay/index.ts';

/**
 * Creates an rrweb-like record function that, like rrweb, defers the initial
 * full snapshot until the page `load` event, which the test fires on demand.
 */
function deferredRecordFn() {
  let emit = null;
  const recordFn = (options) => {
    emit = options.emit;
    return () => {
      emit = null;
    };
  };
  recordFn.takeFullSnapshot = () => {};
  recordFn.fireLoad = () => {
    emit(allEvents.domContentLoaded, false);
    emit(allEvents.load, false);
    emit(allEvents.meta, false);
    emit(allEvents.fullSnapshot, false);
  };
  return recordFn;
}

describe('Replay triggers before the recorder is ready', function () {
  let tracing;
  let replay;
  let recordFn;
  let exporterPost;
  let loggerErrorSpy;

  function createReplay(overrides = {}) {
    // The reporter's configuration from issue #1459.
    replay = new Replay({
      tracing,
      telemeter: new Telemeter({}, tracing),
      options: {
        ...replayDefaults,
        enabled: true,
        autoStart: true,
        triggers: [
          {
            type: 'occurrence',
            level: ['error', 'critical'],
            samplingRatio: 1.0,
          },
          {
            type: 'navigation',
            pathMatch: /.*/,
          },
        ],
        recordFn,
        ...overrides,
      },
    });
  }

  beforeEach(function () {
    logger.init({ logLevel: 'warn' });
    loggerErrorSpy = sinon.spy(logger, 'error');

    const api = new Api(
      { accessToken: 'test-token' },
      { post: sinon.stub(), postJsonPayload: sinon.stub() },
      { parse: sinon.stub().returns({}) },
      { truncate: sinon.stub().returns({ error: null, value: '{}' }) },
    );
    tracing = new Tracing(window, api, { enabled: true });
    tracing.initSession();
    exporterPost = sinon.stub(tracing.exporter, 'post').resolves();

    recordFn = deferredRecordFn();
  });

  afterEach(function () {
    // Abort leading captures a test left scheduled so their timers don't
    // outlive it.
    for (const replayId of [
      ...(replay?._scheduledCapture._pending.keys() ?? []),
    ]) {
      replay._scheduledCapture.discard(replayId);
    }
    replay?.recorder.stop();
    replay = null;
    sinon.restore();
  });

  /**
   * Returns the recording span from a posted OTLP payload, with its
   * attributes flattened into a plain object.
   */
  function recordingSpanAttributes(payload) {
    const span = payload.resourceSpans[0].scopeSpans[0].spans.find(
      (s) => s.name === 'rrweb-replay-recording',
    );
    return Object.fromEntries(
      span.attributes.map(({ key, value }) => [key, value.stringValue]),
    );
  }

  it('does not log "No replay found" for a navigation on DOMContentLoaded', async function () {
    createReplay();
    replay.recorder.start();
    expect(replay.recorder.isRecording).to.be.true;
    expect(replay.recorder.isReady).to.be.false;

    await replay.triggerReplay({ type: 'navigation', path: '/' });

    const messages = loggerErrorSpy.getCalls().map((c) => String(c.args[0]));
    expect(messages.some((m) => m.includes('No replay found'))).to.be.false;
    expect(loggerErrorSpy.called).to.be.false;
  });

  it('sends a leading-only replay once the first snapshot arrives', async function () {
    this.timeout(2000);
    createReplay({ triggerDefaults: { preDuration: 300, postDuration: 0.2 } });
    replay.recorder.start();

    const replayId = await replay.triggerReplay({
      type: 'navigation',
      path: '/',
    });
    expect(replayId).to.be.a('string');

    recordFn.fireLoad();
    await new Promise((resolve) => setTimeout(resolve, 400));

    expect(exporterPost.calledOnce).to.be.true;
    expect(exporterPost.firstCall.args[1]).to.deep.equal({
      'X-Rollbar-Replay-Id': replayId,
    });
    expect(loggerErrorSpy.called).to.be.false;
  });

  it('identifies the leading-only replay by its trigger and starting URL', async function () {
    this.timeout(2000);
    createReplay({ triggerDefaults: { preDuration: 300, postDuration: 0.2 } });
    replay.recorder.start();

    const replayId = await replay.triggerReplay({
      type: 'navigation',
      path: '/',
    });
    recordFn.fireLoad();
    await new Promise((resolve) => setTimeout(resolve, 400));

    expect(exporterPost.calledOnce).to.be.true;
    const attributes = recordingSpanAttributes(exporterPost.firstCall.args[0]);
    expect(attributes['rollbar.replay.id']).to.equal(replayId);
    expect(attributes['rollbar.replay.trigger.type']).to.equal('navigation');
    expect(
      JSON.parse(attributes['rollbar.replay.trigger.context']),
    ).to.deep.equal({ type: 'navigation', path: '/' });
    expect(JSON.parse(attributes['rollbar.replay.trigger'])).to.include({
      type: 'navigation',
      postDuration: 0.2,
    });
    expect(attributes['rollbar.replay.url.full']).to.be.a('string').and.not.be
      .empty;
    expect(attributes['rollbar.replay.options']).to.be.a('string');
  });

  it('does nothing when the recorder was never started (autoStart: false)', async function () {
    createReplay({ autoStart: false });

    const replayId = await replay.triggerReplay({
      type: 'navigation',
      path: '/',
    });

    expect(replayId).to.be.null;
    expect(exporterPost.called).to.be.false;
    expect(loggerErrorSpy.called).to.be.false;
  });
});
