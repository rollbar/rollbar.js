import * as _ from '../../utility.js';
import id from '../../tracing/id.js';
import logger from '../../logger.js';
import Recorder from './recorder.js';
import ReplayPredicates from './replayPredicates.js';

/** @typedef {import('./recorder.js').BufferCursor} BufferCursor */
/** @typedef {import('./recorder.js').Recorder} Recorder */

/**
 * Enum for tracking the status of trailing replay sends.
 * Used to coordinate between trailing and leading replay captures.
 */
const TrailingStatus = Object.freeze({
  PENDING: 'pending', // Trailing not yet sent
  SENT: 'sent', // Trailing successfully sent
  FAILED: 'failed', // Trailing failed to send
});

/**
 * ReplayManager - Manages the mapping between error occurrences and their associated
 * session recordings. This class handles the coordination between when recordings
 * are dumped and when they are eventually sent to the backend.
 */
export default class ReplayManager {
  _map;
  /** @type {Recorder} */
  _recorder;
  _tracing;
  _telemeter;
  _pendingLeading;
  _trailingStatus;

  /**
   * Creates a new ReplayManager instance
   *
   * @param {Object} [props.tracing] - The tracing instance used to create spans and manage context
   * @param {Object} [props.telemeter] - Optional telemeter instance for capturing telemetry events
   * @param {Object} [props.options] - Configuration options
   */
  constructor({ tracing, telemeter, options }) {
    if (!tracing) {
      throw new TypeError("Expected 'tracing' to be provided");
    }

    this._map = new Map();
    this._recorder = new Recorder(options);
    this._tracing = tracing;
    this._telemeter = telemeter;
    this._pendingLeading = new Map();
    this._trailingStatus = new Map();
    this._predicates = new ReplayPredicates(options);
  }

  /**
   * Exports recording and telemetry spans, then stores the tracing payload in the map.
   *
   * Exports both telemetry and recording spans, then generates the complete payload
   * using the tracing exporter and stores it in the map using replayId as the key.
   * This is an async operation that runs in the background.
   *
   * @param {string} replayId - The unique ID for this replay
   * @param {string} occurrenceUuid - The UUID of the associated error occurrence
   * @private
   */
  async _exportSpansAndAddTracingPayload(
    replayId,
    occurrenceUuid,
    trigger,
    triggerContext,
  ) {
    try {
      this._recorder.exportRecordingSpan(this._tracing, {
        'rollbar.replay.id': replayId,
        'rollbar.occurrence.uuid': occurrenceUuid,
        'rollbar.replay.trigger.type': trigger.type,
        'rollbar.replay.trigger.context': JSON.stringify(triggerContext),
        'rollbar.replay.trigger': JSON.stringify(trigger),
        'rollbar.replay.url.full': _.sanitizeHref(window.location.href),
      });
    } catch (error) {
      logger.error('Error exporting recording span:', error);
      return;
    }

    this._telemeter?.exportTelemetrySpan({
      'rollbar.replay.id': replayId,
    });

    const payload = this._tracing.exporter.toPayload();
    this._map.set(replayId, payload);

    const leadingSeconds = this._recorder.options?.postDuration || 0;
    if (leadingSeconds > 0) {
      this._scheduleLeadingCapture(replayId, occurrenceUuid, leadingSeconds);
    }
  }

  /**
   * Schedules the capture of leading replay events after a delay.
   *
   * @param {string} replayId - The replay ID
   * @param {string} occurrenceUuid - The occurrence UUID
   * @param {number} seconds - Number of seconds to wait before capturing
   * @private
   */
  _scheduleLeadingCapture(replayId, occurrenceUuid, seconds) {
    const bufferCursor = this._recorder.bufferCursor();

    this._trailingStatus.set(replayId, TrailingStatus.PENDING);

    const timerId = setTimeout(async () => {
      try {
        await this._exportLeadingSpansAndAddPayload(
          replayId,
          occurrenceUuid,
          bufferCursor,
        );
        this._sendOrDiscardLeadingReplay(replayId);
      } catch (error) {
        logger.error('Error during leading replay processing:', error);
      }
    }, seconds * 1000);

    this._pendingLeading.set(replayId, {
      timerId,
      occurrenceUuid,
      bufferCursor,
      leadingReady: false,
    });
  }

  /**
   * Exports leading replay spans and adds the payload to pending context.
   * Similar to _exportSpansAndAddTracingPayload but for leading events.
   *
   * @param {string} replayId - The replay ID
   * @param {string} occurrenceUuid - The occurrence UUID
   * @param {BufferCursor} bufferCursor - Buffer cursor position
   * @private
   */
  async _exportLeadingSpansAndAddPayload(
    replayId,
    occurrenceUuid,
    bufferCursor,
  ) {
    const pendingContext = this._pendingLeading.get(replayId);

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
      this._discardLeadingCapture(replayId);
      return;
    }

    this._telemeter?.exportTelemetrySpan({
      'rollbar.replay.id': replayId,
    });

    const leadingPayload = this._tracing.exporter.toPayload();
    pendingContext.leadingReady = true;
    pendingContext.leadingPayload = leadingPayload;
    this._pendingLeading.set(replayId, pendingContext);
  }

  /**
   * Sends or discards leading replay based on trailing replay status.
   *
   * @param {string} replayId - The replay ID
   * @private
   */
  async _sendOrDiscardLeadingReplay(replayId) {
    const trailingStatus = this._trailingStatus.get(replayId);
    const pendingContext = this._pendingLeading.get(replayId);

    if (!pendingContext?.leadingReady || !pendingContext?.leadingPayload) {
      return;
    }

    switch (trailingStatus) {
      case TrailingStatus.SENT:
        try {
          await this._tracing.exporter.post(pendingContext.leadingPayload, {
            'X-Rollbar-Replay-Id': replayId,
          });
        } catch (error) {
          logger.error('Failed to send leading replay:', error);
        }
        this._discardLeadingCapture(replayId);
        break;

      case TrailingStatus.FAILED:
        this._discardLeadingCapture(replayId);
        break;

      case TrailingStatus.PENDING:
      default:
        break;
    }
  }

  /**
   * Discards all state related to leading capture for a replay.
   *
   * @param {string} replayId - The replay ID to discard
   * @private
   */
  _discardLeadingCapture(replayId) {
    const pendingContext = this._pendingLeading.get(replayId);
    if (pendingContext?.timerId) {
      clearTimeout(pendingContext.timerId);
    }
    this._pendingLeading.delete(replayId);
    this._trailingStatus.delete(replayId);
  }

  /**
   * Captures a replay and returns a uniquely generated replay ID.
   *
   * This method immediately returns the replayId and asynchronously processes
   * the replay data in the background. The processing involves converting
   * recorder events into a payload format and storing it in the map.
   *
   * @returns {string} A unique identifier for this replay
   */
  capture(replayId, occurrenceUuid, triggerContext) {
    if (!this._recorder.isReady) {
      logger.warn(
        'ReplayManager.capture: Recorder is not ready, cannot export replay',
      );
      return null;
    }

    replayId = replayId || id.gen(8);

    const trigger = this._predicates.shouldCaptureForTriggerContext({
      ...triggerContext,
      replayId,
    });
    if (!trigger) {
      return null;
    }

    // Start processing the replay in the background
    this._exportSpansAndAddTracingPayload(
      replayId,
      occurrenceUuid,
      trigger,
      triggerContext,
    );

    return replayId;
  }

  /**
   * Determines if a replay can be sent based on API response and headers.
   *
   * @param {Error|null} err - Any error that occurred during the API request
   * @param {Object|null} resp - The API response object
   * @param {Object|null} hs - The response headers
   * @returns {boolean} true if the replay can be sent, false otherwise.
   * @private
   */
  static _canSendReplay(err, resp, hs) {
    if (!hs) return false;

    const hasNoErrors = !err && resp?.err === 0;

    const headers = Object.fromEntries(
      Object.entries(hs).map(([k, v]) => [k.toLowerCase(), String(v).trim()]),
    );

    const headersAreValid =
      headers['rollbar-replay-enabled'] === 'true' &&
      headers['rollbar-replay-ratelimit-remaining'] !== '0';

    return hasNoErrors && headersAreValid;
  }

  /**
   * Sends or discards a replay based on whether it can be sent.
   *
   * The criteria for sending a replay are:
   * - No error occurred during the API request
   * - The response indicates success (err === 0)
   * - Replay is enabled on the server
   * - Rate limit quota is not exhausted
   *
   * Called by Queue after determining replay eligibility from API response.
   *
   * @param {string} replayId - The ID of the replay to send or discard
   * @param {Error|null} err - Any error that occurred during the API request
   * @param {Object|null} resp - The API response object
   * @param {Object|null} headers - The response headers
   * @returns {Promise<void>} A promise that resolves when the operation is complete
   */
  async sendOrDiscardReplay(replayId, err, resp, headers) {
    const canSendReplay = ReplayManager._canSendReplay(err, resp, headers);

    if (canSendReplay) {
      try {
        await this.send(replayId);
      } catch (error) {
        logger.error('Failed to send replay:', error);
        this.discard(replayId);
      }
    } else {
      this.discard(replayId);
    }
  }

  /**
   * Sends the replay payload associated with the given replayId to the backend
   * and removes it from the map.
   *
   * Retrieves the payload from the map, checks if it's valid, then sends it
   * to the API endpoint for processing. The payload can be either a spans array
   * or a formatted OTLP payload object.
   *
   * @param {string} replayId - The ID of the replay to send
   * @returns {Promise<boolean>} A promise that resolves to true if the payload was found and sent, false otherwise
   */
  async send(replayId) {
    if (!replayId) {
      throw Error('ReplayManager.send: No replayId provided');
    }

    if (!this._map.has(replayId)) {
      throw Error(`ReplayManager.send: No replay found for id: ${replayId}`);
    }

    const payload = this._map.get(replayId);
    this._map.delete(replayId);

    // Check if payload is empty (could be raw spans array or OTLP payload)
    const isEmpty =
      !payload ||
      (Array.isArray(payload) && payload.length === 0) ||
      (payload.resourceSpans && payload.resourceSpans.length === 0);

    if (isEmpty) {
      throw Error(`ReplayManager.send: No payload found for id: ${replayId}`);
    }

    await this._tracing.exporter.post(payload, {
      'X-Rollbar-Replay-Id': replayId,
    });

    this._trailingStatus.set(replayId, TrailingStatus.SENT);
    await this._sendOrDiscardLeadingReplay(replayId);
  }

  /**
   * Discards the replay associated with the given replay ID by removing
   * it from the map without sending it.
   *
   * @param {string} replayId - The ID of the replay to discard
   * @returns {boolean} True if a replay was found and discarded, false otherwise
   */
  discard(replayId) {
    if (!replayId) {
      logger.error('ReplayManager.discard: No replayId provided');
      return false;
    }

    this._trailingStatus.set(replayId, TrailingStatus.FAILED);

    this._discardLeadingCapture(replayId);

    if (!this._map.has(replayId)) {
      logger.error(
        `ReplayManager.discard: No replay found for replayId: ${replayId}`,
      );
      return false;
    }

    this._map.delete(replayId);
    return true;
  }

  /**
   * Gets spans for the given replay ID
   *
   * @param {string} replayId - The ID to retrieve spans for
   * @returns {Array|null} The spans array or null if not found
   */
  getSpans(replayId) {
    return this._map.get(replayId) ?? null;
  }

  /**
   * Sets spans for a given replay ID
   *
   * @param {string} replayId - The ID to set spans for
   * @param {Array} spans - The spans to set
   */
  setSpans(replayId, spans) {
    this._map.set(replayId, spans);
  }

  /**
   * Returns the size of the map (number of stored replays)
   *
   * @returns {number} The number of replays currently stored
   */
  get size() {
    return this._map.size;
  }

  /**
   * Returns the Recorder instance used by this manager
   *
   * @returns {Recorder} The Recorder instance
   */
  get recorder() {
    return this._recorder;
  }

  /**
   * Clears all stored replays without sending them
   */
  clear() {
    this._map.clear();
  }
}
