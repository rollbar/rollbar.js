import logger from '../../logger.js';

/** @typedef {import('./recorder.js').BufferCursor} BufferCursor */
/** @typedef {import('./recorder.js').Recorder} Recorder */

/**
 * A utility for coordinating delayed, cursor-based captures.
 *
 * Manages timer-based capture scheduling, buffer cursor stability across
 * checkouts, and payload preparation. Used primarily for capturing events
 * that occur after a trigger (leading replays), but the implementation is
 * generic and could be used for any delayed capture scenario.
 */
export default class ScheduledCapture {
  /** @type {Recorder} */
  _recorder;
  _tracing;
  _telemeter;
  _pending = new Map();
  _shouldSend;
  _onComplete;

  /**
   * Creates a new ScheduledCapture instance
   *
   * @param {Object} props - Configuration object
   * @param {Object} props.recorder - Recorder instance for capturing events
   * @param {Object} props.tracing - Tracing instance for span management
   * @param {Object} props.telemeter - Optional telemeter for telemetry spans
   * @param {Function} props.shouldSend - Function to check if replay can be sent
   * @param {Function} props.onComplete - Function to call when leading capture completes
   */
  constructor({ recorder, tracing, telemeter, shouldSend, onComplete }) {
    this._recorder = recorder;
    this._tracing = tracing;
    this._telemeter = telemeter;
    this._shouldSend = shouldSend;
    this._onComplete = onComplete;
  }

  /**
   * Schedules the capture of leading replay events after a delay.
   *
   * Captures a buffer cursor at the time of scheduling, which remains stable
   * even as the buffer continues to receive events. When the timer fires,
   * events after this cursor position are exported as the leading replay.
   *
   * @param {string} replayId - The replay ID
   * @param {string} occurrenceUuid - The occurrence UUID
   * @param {number} seconds - Number of seconds to wait before capturing
   */
  schedule(replayId, occurrenceUuid, seconds) {
    const cursor = this._recorder.bufferCursor();

    const timerId = setTimeout(async () => {
      try {
        this._export(replayId, occurrenceUuid, cursor);
        this.sendIfReady(replayId);
      } catch (error) {
        logger.error('Error during leading replay processing:', error);
      }
    }, seconds * 1000);

    this._pending.set(replayId, {
      timerId,
      occurrenceUuid,
      cursor,
      ready: false,
    });
  }

  /**
   * Exports replay spans and adds the payload to pending context.
   *
   * Uses the captured buffer cursor to collect events that occurred after
   * the trigger. Exports both recording and telemetry spans, then generates
   * the payload and stores it for later sending.
   *
   * @param {string} replayId - The replay ID
   * @param {string} occurrenceUuid - The occurrence UUID
   * @param {BufferCursor} cursor - Buffer cursor position
   * @private
   */
  _export(replayId, occurrenceUuid, cursor) {
    const pendingContext = this._pending.get(replayId);

    if (!pendingContext) {
      // Already cleaned up, possibly due to discard
      throw new Error('No pending context for replayId, cleaned up?');
    }

    try {
      this._recorder.exportRecordingSpan(
        this._tracing,
        {
          'rollbar.replay.id': replayId,
          'rollbar.occurrence.uuid': occurrenceUuid,
        },
        cursor,
      );
    } catch (error) {
      logger.error('Error exporting leading recording span:', error);
      this.discard(replayId);
      throw new Error('Leading export failed', { cause: error });
    }

    this._telemeter?.exportTelemetrySpan({
      'rollbar.replay.id': replayId,
    });

    const payload = this._tracing.exporter.toPayload();
    this._pending.set(replayId, { ready: true, payload });
  }

  /**
   * Sends the payload if it's ready and coordination allows it.
   *
   * Checks if the replay can be sent via the delegate function and only
   * sends if coordination requirements are met.
   *
   * @param {string} replayId - The replay ID
   * @returns {Promise<void>}
   */
  async sendIfReady(replayId) {
    const pendingContext = this._pendingContextIfReady(replayId);
    if (!pendingContext) return;

    try {
      await this._post(replayId, pendingContext.payload);
    } catch (error) {
      logger.error('Failed to send leading replay:', error);
    }

    this.discard(replayId);
  }

  /**
   * Cancels a scheduled capture and cleans up all state.
   *
   * Clears the timer if it hasn't fired yet, and removes all pending
   * context for the replay.
   *
   * @param {string} replayId - The replay ID to discard
   */
  discard(replayId) {
    const pendingContext = this._pending.get(replayId);
    if (pendingContext?.timerId) {
      clearTimeout(pendingContext.timerId);
    }
    this._pending.delete(replayId);
    this._onComplete?.(replayId);
  }

  /**
   * Returns the pending context for the given replayId if it's ready to be sent.
   *
   * @param {string} replayId - The replay ID
   * @returns {Object|null} The pending context if ready, otherwise null
   * @private
   */
  _pendingContextIfReady(replayId) {
    const ctx = this._pending.get(replayId);
    return ctx?.ready === true && ctx?.payload && this._shouldSend(replayId)
      ? ctx
      : null;
  }

  /**
   * Sends the given payload for the replay id to the Rollbar API.
   *
   * @param {string} replayId - The replay ID
   * @param {string} payload - Serialized OTLP format payload
   * @private
   */
  async _post(replayId, payload) {
    await this._tracing.exporter.post(payload, {
      'X-Rollbar-Replay-Id': replayId,
    });
  }
}
