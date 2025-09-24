import id from '../../tracing/id.js';
import logger from '../../logger.js';

/**
 * ReplayManager - Manages the mapping between error occurrences and their associated
 * session recordings. This class handles the coordination between when recordings
 * are dumped and when they are eventually sent to the backend.
 */
export default class ReplayManager {
  _map;
  _recorder;
  _api;
  _tracing;
  _telemeter;

  /**
   * Creates a new ReplayManager instance
   *
   * @param {Object} props - Configuration props
   * @param {Object} props.recorder - The recorder instance that dumps replay data into spans
   * @param {Object} props.api - The API instance used to send replay payloads to the backend
   * @param {Object} props.tracing - The tracing instance used to create spans and manage context
   */
  constructor({ recorder, api, tracing, telemeter }) {
    if (!recorder) {
      throw new TypeError("Expected 'recorder' to be provided");
    }

    if (!api) {
      throw new TypeError("Expected 'api' to be provided");
    }

    if (!tracing) {
      throw new TypeError("Expected 'tracing' to be provided");
    }

    this._map = new Map();
    this._recorder = recorder;
    this._api = api;
    this._tracing = tracing;
    this._telemeter = telemeter;
  }

  /**
   * Processes a replay by exporting spans and generating a transport-ready payload.
   *
   * Exports both telemetry and recording spans, then generates the complete payload
   * using the tracing exporter and stores it in the map using replayId as the key.
   *
   * @param {string} replayId - The unique ID for this replay
   * @param {string} occurrenceUuid - The UUID of the associated error occurrence
   * @returns {string|null} The replayId if successful, or null if an error occurred
   * @private
   */
  _processReplay(replayId, occurrenceUuid) {
    try {
      this._recorder.exportRecordingSpan(this._tracing, {
        'rollbar.replay.id': replayId,
        'rollbar.occurrence.uuid': occurrenceUuid,
      });
    } catch (error) {
      logger.error('Error exporting recording span:', error);
      return null;
    }

    this._telemeter?.exportTelemetrySpan({ 'rollbar.replay.id': replayId });

    const payload = this._tracing.exporter.toPayload();
    this._map.set(replayId, payload);

    return replayId;
  }

  /**
   * Adds a replay to the map and returns a uniquely generated replay ID.
   *
   * The processing involves converting recorder events into a payload format
   * and storing it in the map.
   *
   * @returns {string|null} A unique identifier for this replay, or null if an
   *  error occurred
   */
  add(replayId, occurrenceUuid) {
    replayId = replayId || id.gen(8);

    return this._processReplay(replayId, occurrenceUuid);
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

    await this._api.postSpans(payload, { 'X-Rollbar-Replay-Id': replayId });
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
   * Clears all stored replays without sending them
   */
  clear() {
    this._map.clear();
  }
}
