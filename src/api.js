import * as helpers from './apiUtility.js';
import { stringify, merge } from './utility.js';

const defaultOptions = {
  hostname: 'api.rollbar.com',
  path: '/api/1/item/',
  search: null,
  version: '1',
  protocol: 'https:',
  port: 443,
};

const OTLPDefaultOptions = {
  hostname: 'api.rollbar.com',
  path: '/api/1/session/',
  search: null,
  version: '1',
  protocol: 'https:',
  port: 443,
};

/**
 * Api encapsulates methods of communicating with the Rollbar API.  It is a
 * standard interface with some parts implemented differently for server or
 * browser contexts.  It is an object that should be instantiated when used so
 * it can contain non-global options that may be different for another instance
 * of RollbarApi.
 */
class Api {
  /**
   * @param {Object} options - Configuration supplied from the parent Rollbar instance.
   * @param {string} options.accessToken - Token used to authenticate API calls.
   * @param {string} [options.endpoint] - Optional fully qualified URL overriding
   *   the default `https://api.rollbar.com/api/1/item`.
   * @param {Object} [options.proxy] - Optional proxy descriptor containing:
   *   `host`/`hostname` (required), `port`, and `protocol`.
   * @param {Object} transport - Adapter implementing `post` and `postJsonPayload`.
   * @param {Object} urllib - Minimal URL helper used for option normalization.
   * @param {Object} truncation - Optional truncation helper for payload size enforcement.
   */
  constructor(options, transport, urllib, truncation) {
    this.options = options;
    this.transport = transport;
    this.url = urllib;
    this.truncation = truncation;
    this.accessToken = options.accessToken;
    this.transportOptions = _getTransport(options, urllib);
    this.OTLPTransportOptions = _getOTLPTransport(options, urllib);
  }

  /**
   * Wraps transport.post in a Promise to support async/await
   *
   * @param {Object} options - Options for the API request
   * @param {string} options.accessToken - The access token for authentication
   * @param {Object} options.transportOptions - Options for the transport
   * @param {Object} options.payload - The data payload to send
   * @returns {Promise} A promise that resolves with the response or rejects with an error
   * @private
   */
  _postPromise({ accessToken, options, payload, headers }) {
    return new Promise((resolve, reject) => {
      this.transport.post({
        accessToken,
        options,
        payload,
        headers,
        callback: (err, resp) => (err ? reject(err) : resolve(resp)),
      });
    });
  }

  /**
   *
   * @param data
   * @param callback
   */
  postItem(data, callback) {
    const options = helpers.transportOptions(this.transportOptions, 'POST');
    const payload = helpers.buildPayload(data);

    // ensure the network request is scheduled after the current tick.
    setTimeout(() => {
      this.transport.post({
        accessToken: this.accessToken,
        options,
        payload,
        callback,
      });
    }, 0);
  }

  /**
   * Posts spans to the Rollbar API using the session endpoint
   *
   * @param {Array} payload - The spans to send
   * @returns {Promise<Object>} A promise that resolves with the API response
   */
  async postSpans(payload, headers = {}) {
    const options = helpers.transportOptions(this.OTLPTransportOptions, 'POST');

    return this._postPromise({
      accessToken: this.accessToken,
      options,
      payload,
      headers,
    });
  }

  /**
   *
   * @param data
   * @param callback
   */
  buildJsonPayload(data, callback) {
    const payload = helpers.buildPayload(data);

    let stringifyResult;
    if (this.truncation) {
      stringifyResult = this.truncation.truncate(payload);
    } else {
      stringifyResult = stringify(payload);
    }

    if (stringifyResult.error) {
      if (callback) {
        callback(stringifyResult.error);
      }
      return null;
    }

    return stringifyResult.value;
  }

  /**
   *
   * @param jsonPayload
   * @param callback
   */
  postJsonPayload(jsonPayload, callback) {
    const transportOptions = helpers.transportOptions(
      this.transportOptions,
      'POST',
    );
    this.transport.postJsonPayload(
      this.accessToken,
      transportOptions,
      jsonPayload,
      callback,
    );
  }

  configure(options) {
    const oldOptions = this.options;
    this.options = merge(oldOptions, options);
    this.transportOptions = _getTransport(this.options, this.url);
    this.OTLPTransportOptions = _getOTLPTransport(this.options, this.url);
    if (this.options.accessToken !== undefined) {
      this.accessToken = this.options.accessToken;
    }
    return this;
  }
}

function _getTransport(options, url) {
  return helpers.getTransportFromOptions(options, defaultOptions, url);
}

function _getOTLPTransport(options, url) {
  options = { ...options, endpoint: options.tracing?.endpoint };
  return helpers.getTransportFromOptions(options, OTLPDefaultOptions, url);
}

export default Api;
