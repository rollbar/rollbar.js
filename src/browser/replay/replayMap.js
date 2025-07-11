import id from '../../tracing/id.js';
import logger from '../logger.js';

/**
 * ReplayMap - Manages the mapping between error occurrences and their associated
 * session recordings. This class handles the coordination between when recordings
 * are dumped and when they are eventually sent to the backend.
 */
export default class ReplayMap {
  #map;
  #recorder;
  #api;
  #tracing;

  /**
   * Creates a new ReplayMap instance
   *
   * @param {Object} props - Configuration props
   * @param {Object} props.recorder - The recorder instance that dumps replay data into spans
   * @param {Object} props.api - The API instance used to send replay payloads to the backend
   * @param {Object} props.tracing - The tracing instance used to create spans and manage context
   */
  constructor({ recorder, api, tracing }) {
    if (!recorder) {
      throw new TypeError("Expected 'recorder' to be provided");
    }

    if (!api) {
      throw new TypeError("Expected 'api' to be provided");
    }

    if (!tracing) {
      throw new TypeError("Expected 'tracing' to be provided");
    }

    this.#map = new Map();
    this.#recorder = recorder;
    this.#api = api;
    this.#tracing = tracing;
  }

  /**
   * Processes a replay by converting recorder events into a transport-ready payload.
   *
   * Calls recorder.dump() to capture events as spans, formats them into a proper payload,
   * and stores the result in the map using replayId as the key.
   *
   * @param {string} replayId - The unique ID for this replay
   * @returns {Promise<string>} A promise resolving to the processed replayId
   * @private
   */
  async _processReplay(replayId, occurrenceUuid) {
    try {
      const payload = this.#recorder.dump(
        this.#tracing,
        replayId,
        occurrenceUuid,
      );

      this.#map.set(replayId, payload);
    } catch (transformError) {
      logger.error('Error transforming spans:', transformError);

      this.#map.set(replayId, null); // TODO(matux): Error span?
    }

    return replayId;
  }

  /**
   * Adds a replay to the map and returns a uniquely generated replay ID.
   *
   * This method immediately returns the replayId and asynchronously processes
   * the replay data in the background. The processing involves converting
   * recorder events into a payload format and storing it in the map.
   *
   * @returns {string} A unique identifier for this replay
   */
  add(replayId, occurrenceUuid) {
    replayId = replayId || id.gen(8);

    this._processReplay(replayId, occurrenceUuid).catch((error) => {
      logger.error('Failed to process replay:', error);
    });

    return replayId;
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
      logger.error('ReplayMap.send: No replayId provided');
      return false;
    }

    if (!this.#map.has(replayId)) {
      logger.error(`ReplayMap.send: No replay found for replayId: ${replayId}`);
      return false;
    }

    const payload = this.#map.get(replayId);
    this.#map.delete(replayId);

    // Check if payload is empty (could be raw spans array or OTLP payload)
    const isEmpty =
      !payload ||
      (Array.isArray(payload) && payload.length === 0) ||
      (payload.resourceSpans && payload.resourceSpans.length === 0);

    if (isEmpty) {
      logger.error(
        `ReplayMap.send: No payload found for replayId: ${replayId}`,
      );
      return false;
    }

    try {
      await this.#api.postSpans(payload);
      return true;
    } catch (error) {
      logger.error('Error sending replay:', error);
      return false;
    }
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
      logger.error('ReplayMap.discard: No replayId provided');
      return false;
    }

    if (!this.#map.has(replayId)) {
      logger.error(
        `ReplayMap.discard: No replay found for replayId: ${replayId}`,
      );
      return false;
    }

    this.#map.delete(replayId);
    return true;
  }

  /**
   * Gets spans for the given replay ID
   *
   * @param {string} replayId - The ID to retrieve spans for
   * @returns {Array|null} The spans array or null if not found
   */
  getSpans(replayId) {
    return this.#map.get(replayId) ?? null;
  }

  /**
   * Sets spans for a given replay ID
   *
   * @param {string} replayId - The ID to set spans for
   * @param {Array} spans - The spans to set
   */
  setSpans(replayId, spans) {
    this.#map.set(replayId, spans);
  }

  /**
   * Returns the size of the map (number of stored replays)
   *
   * @returns {number} The number of replays currently stored
   */
  get size() {
    return this.#map.size;
  }

  /**
   * Clears all stored replays without sending them
   */
  clear() {
    this.#map.clear();
  }
}
