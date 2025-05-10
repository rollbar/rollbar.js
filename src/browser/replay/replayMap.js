import { spanExportQueue } from '@tracing/exporter.js';

/**
 * ReplayMap - Manages the mapping between error occurrences and their associated
 * session recordings. This class handles the coordination between when recordings
 * are dumped and when they are eventually sent to the backend.
 */
export default class ReplayMap {
  #map;
  #recorder;
  #exporter;
  #api;
  #tracing;

  /**
   * Creates a new ReplayMap instance
   *
   * @param {Object} props - Configuration props
   * @param {Object} props.recorder - The recorder instance that will dump replay data
   * @param {Object} props.exporter - The exporter that retrieves completed spans
   * @param {Object} props.api - The API instance used to send spans
   * @param {Object} props.tracing - The tracing instance to create contexts
   */
  constructor({ recorder, exporter, api, tracing }) {
    if (!recorder) {
      throw new TypeError("Expected 'recorder' to be provided");
    }

    if (!exporter) {
      throw new TypeError("Expected 'exporter' to be provided");
    }

    if (!api) {
      throw new TypeError("Expected 'api' to be provided");
    }

    if (!tracing) {
      throw new TypeError("Expected 'tracing' to be provided");
    }

    this.#map = new Map();
    this.#recorder = recorder;
    this.#exporter = exporter;
    this.#api = api;
    this.#tracing = tracing;
  }

  /**
   * Processes a replay by dumping it from the recorder, adding the replay ID attribute,
   * and storing it in the map.
   *
   * @param {string} replayId - The ID to use for this replay
   * @returns {Promise<boolean>} A promise that resolves to true if processing was successful
   * @private
   */
  async _processReplay(replayId) {
    try {
      const context = this.#tracing.contextManager.active();
      const recordingSpan = this.#recorder.dump(context, { clear: false });

      if (!recordingSpan) {
        console.warn('ReplayMap._processReplay: No recording span was created');
        return false;
      }

      recordingSpan.setAttribute('rollbar.replay.id', replayId);
      const spans = spanExportQueue.slice();
      this.#map.set(replayId, spans);

      return true;
    } catch (error) {
      console.error('Error processing replay:', error);
      return false;
    }
  }

  /**
   * Adds a replay to the map and returns a uniquely generated replay ID.
   * This method immediately returns the ID while asynchronously performing
   * the operations needed to dump and store the replay for later sending.
   *
   * @returns {string} A unique identifier for this replay
   */
  add() {
    // 8 bytes hexId matches the span ID size in the tracing system
    const replayId = this.#tracing.hexId(8);

    this._processReplay(replayId).catch((error) => {
      console.error('Failed to process replay:', error);
    });

    return replayId;
  }

  /**
   * Sends the replay associated with the given replay ID to the backend
   * and removes it from the map.
   *
   * @param {string} replayId - The ID of the replay to send
   * @returns {Promise<boolean>} A promise that resolves to true if a replay was found and sent, false otherwise
   */
  async send(replayId) {
    if (!replayId) {
      console.warn('ReplayMap.send: No replayId provided');
      return false;
    }

    if (!this.#map.has(replayId)) {
      console.warn(`ReplayMap.send: No replay found for replayId: ${replayId}`);
      return false;
    }

    const spans = this.#map.get(replayId);
    this.#map.delete(replayId);

    if (!spans || !spans.length) {
      console.warn(`ReplayMap.send: No spans found for replayId: ${replayId}`);
      return false;
    }

    try {
      // Send spans via API using async/await with our modern implementation
      await this.#api.postSpans(spans);
      return true;
    } catch (error) {
      console.error('Error sending replay:', error);
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
      console.warn('ReplayMap.discard: No replayId provided');
      return false;
    }

    if (!this.#map.has(replayId)) {
      console.warn(
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
