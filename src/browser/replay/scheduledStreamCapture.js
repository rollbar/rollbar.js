import logger from '../../logger.js';

/** @typedef {import('./recorder.js').BufferCursor} BufferCursor */

/**
 * A utility for coordinating streaming, cursor-based captures over extended durations.
 *
 * Unlike ScheduledCapture (single delayed export), this class exports multiple chunks
 * at intervals to prevent event loss during long postDuration windows. Chunks are
 * queued during capture and sent sequentially after coordination requirements are met.
 *
 * Key features:
 * - Periodic chunk exports at safe intervals (≤ checkoutEveryNms)
 * - Sequential chunk sending (maintains rrweb playback continuity)
 * - Fail-fast abort (any chunk failure discards remaining chunks)
 * - Duration-limited (stops when postDuration exceeded)
 */
export default class ScheduledStreamCapture {
  _recorder;
  _tracing;
  _telemeter;
  _pending = new Map();
  _shouldSend;
  _onComplete;

  /**
   * Creates a new ScheduledStreamCapture instance
   *
   * @param {Object} props - Configuration object
   * @param {Object} props.recorder - Recorder instance for capturing events
   * @param {Object} props.tracing - Tracing instance for span management
   * @param {Object} props.telemeter - Optional telemeter for telemetry spans
   * @param {Function} props.shouldSend - Function to check if replay can be sent
   * @param {Function} props.onComplete - Function to call when capture completes
   */
  constructor({ recorder, tracing, telemeter, shouldSend, onComplete }) {
    this._recorder = recorder;
    this._tracing = tracing;
    this._telemeter = telemeter;
    this._shouldSend = shouldSend;
    this._onComplete = onComplete;
  }

  /**
   * Schedules streaming chunk captures over the specified duration.
   *
   * Starts a periodic interval that exports chunks at safe intervals to prevent
   * event loss during buffer checkouts. Chunks are queued for later sequential sending.
   *
   * @param {string} replayId - The replay ID
   * @param {string} occurrenceUuid - The occurrence UUID
   * @param {number} postDuration - Duration in seconds to capture
   */
  schedule(replayId, occurrenceUuid, postDuration) {
    const startCursor = this._recorder.bufferCursor();
    const startTime = Date.now();
    const chunkMs = this._recorder.checkoutEveryNms();

    const intervalId = setInterval(() => {
      this._exportChunk(replayId);
    }, chunkMs);

    this._pending.set(replayId, {
      intervalId,
      startTime,
      postDuration,
      occurrenceUuid,
      cursor: startCursor,
      chunkQueue: [],
      chunkIndex: 0,
      sending: false,
      aborted: false,
    });
  }

  /**
   * Exports a chunk and adds it to the send queue.
   *
   * Called periodically by the interval timer. Captures events from the last
   * cursor position to current, exports as a span, and queues the payload.
   * Stops the interval when postDuration is exceeded.
   *
   * @param {string} replayId - The replay ID
   * @private
   */
  _exportChunk(replayId) {
    const context = this._pending.get(replayId);

    if (!context || context.aborted) {
      return;
    }

    const elapsed = (Date.now() - context.startTime) / 1000;

    if (elapsed >= context.postDuration) {
      clearInterval(context.intervalId);
      return;
    }

    const currentCursor = this._recorder.bufferCursor();

    try {
      this._recorder.exportRecordingSpan(
        this._tracing,
        {
          'rollbar.replay.id': replayId,
          'rollbar.occurrence.uuid': context.occurrenceUuid,
          'rollbar.replay.chunk': context.chunkIndex,
        },
        context.lastCursor,
      );
    } catch (error) {
      logger.error('Error exporting leading chunk:', error);
      this.discard(replayId);
      return;
    }

    this._telemeter?.exportTelemetrySpan({
      'rollbar.replay.id': replayId,
    });

    const payload = this._tracing.exporter.toPayload();

    context.chunkQueue.push({
      cursor: context.lastCursor,
      payload,
      chunkIndex: context.chunkIndex,
    });

    context.lastCursor = currentCursor;
    context.chunkIndex++;
  }

  /**
   * Sends queued chunks if ready and coordination allows it.
   *
   * Called by ReplayManager after trailing replay succeeds. Sends chunks
   * sequentially, waiting for each to complete before sending the next. If any
   * chunk fails to send, aborts the entire stream.
   *
   * @param {string} replayId - The replay ID
   * @returns {Promise<void>}
   */
  async sendIfReady(replayId) {
    const context = this._pending.get(replayId);

    if (!context || context.aborted) {
      return;
    }

    if (context.sending) {
      logger.warn('ScheduledStreamCapture: Already sending for', replayId);
      return;
    }

    context.sending = true;

    for (const chunk of context.chunkQueue) {
      if (context.aborted) {
        break;
      }

      if (!this._shouldSend(replayId)) {
        logger.error('Coordination check failed during chunk send');
        this.discard(replayId);
        throw new Error('Coordination check failed during chunk send');
      }

      try {
        await this._tracing.exporter.post(chunk.payload, {
          'X-Rollbar-Replay-Id': replayId,
        });
      } catch (error) {
        logger.error(`Failed to send chunk ${chunk.chunkIndex}:`, error);
        this.discard(replayId);
        throw error;
      }
    }

    this._pending.delete(replayId);
    this._onComplete?.(replayId);
  }

  /**
   * Aborts the streaming capture and cleans up all state.
   *
   * Stops the interval timer, discards all queued chunks, and marks the
   * capture as aborted. This is called on send failures or explicit discard.
   *
   * @param {string} replayId - The replay ID to abort
   */
  discard(replayId) {
    const context = this._pending.get(replayId);

    if (!context) {
      return;
    }

    context.aborted = true;

    if (context.intervalId) {
      clearInterval(context.intervalId);
    }

    context.chunkQueue = [];

    this._pending.delete(replayId);
    this._onComplete?.(replayId);
  }
}
