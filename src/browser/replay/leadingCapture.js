import logger from '../../logger.js';

/** @typedef {import('./recorder.js').BufferCursor} BufferCursor */

/**
 * Manages delayed "leading" (post-trigger) replay captures.
 *
 * Coordinates timing, buffer cursor stability, and payload preparation
 * for events that occur AFTER the trigger event.
 */
export default class LeadingCapture {
  _recorder;
  _tracing;
  _telemeter;
  _pending = new Map();
  _shouldSend;
  _onComplete;

  /**
   * Creates a new LeadingCapture instance
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
    const bufferCursor = this._recorder.bufferCursor();

    const timerId = setTimeout(async () => {
      try {
        await this._export(replayId, occurrenceUuid, bufferCursor);
        await this.sendIfReady(replayId);
      } catch (error) {
        logger.error('Error during leading replay processing:', error);
      }
    }, seconds * 1000);

    this._pending.set(replayId, {
      timerId,
      occurrenceUuid,
      bufferCursor,
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
   * @param {BufferCursor} bufferCursor - Buffer cursor position
   * @private
   */
  async _export(replayId, occurrenceUuid, bufferCursor) {
    const pendingContext = this._pending.get(replayId);

    if (!pendingContext) {
      // Already cleaned up, possibly due to discard
      return;
    }

    try {
      this._recorder.exportRecordingSpan(
        this._tracing,
        {
          'rollbar.replay.id': replayId,
          'rollbar.occurrence.uuid': occurrenceUuid,
        },
        bufferCursor,
      );
    } catch (error) {
      logger.error('Error exporting leading recording span:', error);
      this.discard(replayId);
      return;
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
    const pendingContext = this._pending.get(replayId);

    if (
      !pendingContext?.ready ||
      !pendingContext?.payload ||
      !this._shouldSend(replayId)
    ) {
      return;
    }

    try {
      await this._tracing.exporter.post(pendingContext.payload, {
        'X-Rollbar-Replay-Id': replayId,
      });
    } catch (error) {
      logger.error('Failed to send leading replay:', error);
    }

    this.discard(replayId);
    this._onComplete?.(replayId);
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
  }
}
