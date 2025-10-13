import logger from '../../logger.js';

/** @typedef {import('./recorder.js').BufferCursor} BufferCursor */
/** @typedef {import('./recorder.js').Recorder} Recorder */

/**
 * A utility for coordinating streaming, cursor-based captures over extended
 * durations.
 *
 * Unlike ScheduledCapture (single delayed export), this class exports multiple
 * chunks at intervals to prevent event loss during long postDuration windows.
 * Chunks are queued during capture and sent sequentially after coordination
 * requirements are met.
 */
export default class ScheduledStreamCapture {
  /** @type {Recorder} */
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
   * Starts a periodic interval that exports chunks at safe intervals to
   * prevent event loss during buffer checkouts. Chunks are queued for later
   * sequential sending.
   *
   * @param {string} replayId - The replay ID
   * @param {string} occurrenceUuid - The occurrence UUID
   * @param {number} postDuration - Duration in seconds to capture
   */
  schedule(replayId, occurrenceUuid, postDuration) {
    const startTime = Date.now();
    const endAt = startTime + postDuration * 1000;
    const chunkMs = this._recorder.checkoutEveryNms();
    const cursor = this._recorder.bufferCursor();

    const intervalId = setInterval(() => {
      this._export(replayId);
    }, chunkMs);

    const endTimerId = setTimeout(() => {
      this._finalExport(replayId);
    }, postDuration * 1000);

    this._pending.set(replayId, {
      intervalId,
      endTimerId,
      startTime,
      endAt,
      postDuration,
      occurrenceUuid,
      cursor,
      chunkQueue: [],
      sending: false,
      aborted: false,
      finished: false,
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
  async _export(replayId) {
    const ctx = this._pending.get(replayId);
    if (!ctx || ctx.aborted || ctx.finished || Date.now() >= ctx.endAt) {
      return;
    }

    const before = ctx.cursor;
    const after = this._recorder.bufferCursor();

    try {
      this._recorder.exportRecordingSpan(
        this._tracing,
        {
          'rollbar.replay.id': replayId,
          'rollbar.occurrence.uuid': ctx.occurrenceUuid,
        },
        before,
      );
    } catch (error) {
      logger.debug('Error exporting leading chunk (tick):', error);
      return;
    }

    this._telemeter?.exportTelemetrySpan({ 'rollbar.replay.id': replayId });

    const payload = this._tracing.exporter.toPayload();
    ctx.chunkQueue.push({ payload, cursor: before });
    ctx.cursor = after;

    await this.sendIfReady(replayId);
  }

  async _finalExport(replayId) {
    const ctx = this._pending.get(replayId);
    if (!ctx || ctx.aborted) return;

    if (ctx.intervalId) clearInterval(ctx.intervalId);
    if (ctx.endTimerId) clearTimeout(ctx.endTimerId);

    ctx.finished = true;

    const before = ctx.cursor;
    const after = this._recorder.bufferCursor();
    try {
      this._recorder.exportRecordingSpan(
        this._tracing,
        {
          'rollbar.replay.id': replayId,
          'rollbar.occurrence.uuid': ctx.occurrenceUuid,
        },
        before,
      );
      this._telemeter?.exportTelemetrySpan({ 'rollbar.replay.id': replayId });
      const payload = this._tracing.exporter.toPayload();
      ctx.chunkQueue.push({ payload, cursor: before });
      ctx.cursor = after;
    } catch (error) {
      // TODO(matux): No events probably, this is expected, be more graceful.
      logger.debug('Error exporting leading chunk (final):', error);
    }

    if (!ctx.sending && ctx.chunkQueue.length === 0) {
      this._pending.delete(replayId);
      this._onComplete?.(replayId);
      return;
    }

    await this.sendIfReady(replayId);
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
    const ctx = this._pendingContextIfReady(replayId);
    if (!ctx) return;

    if (ctx.finished && !ctx.sending && ctx.chunkQueue.length === 0) {
      this._pending.delete(replayId);
      this._onComplete?.(replayId);
      return;
    }

    ctx.sending = true;

    for (const chunk of ctx.chunkQueue) {
      if (ctx.aborted) break;

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
        logger.error('Failed to send leading replay:', error);
        this.discard(replayId);
        throw error;
      }
    }

    ctx.sending = false;
    ctx.chunkQueue = [];

    if (ctx.finished) {
      this._pending.delete(replayId);
      this._onComplete?.(replayId);
    }
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
    const ctx = this._pending.get(replayId);
    if (!ctx) return;

    ctx.aborted = true;

    if (ctx.intervalId) clearInterval(ctx.intervalId);
    if (ctx.endTimerId) clearTimeout(ctx.endTimerId);

    ctx.chunkQueue = [];

    this._pending.delete(replayId);
    this._onComplete?.(replayId);
  }

  /**
   * Returns the pending context for the given replayId if it's ready to be sent.
   *
   * @param {string} replayId - The replay ID
   * @returns {Object|null} The pending context if ready, otherwise null
   */
  _pendingContextIfReady(replayId) {
    const ctx = this._pending.get(replayId);
    return ctx &&
      !ctx.aborted &&
      !ctx.sending &&
      ctx.chunkQueue.length > 0 &&
      this._shouldSend(replayId)
      ? ctx
      : null;
  }
}
