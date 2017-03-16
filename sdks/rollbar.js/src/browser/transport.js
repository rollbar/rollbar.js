/*
 * accessToken may be embedded in payload but that should not
 *   be assumed
 *
 * options: {
 *   hostname
 *   protocol
 *   path
 *   port
 *   method
 * }
 *
 * payload is an unserialized object
 */
module.exports = {
  get: function (accessToken, options, payload, callback) {
  },

  post: function (accessToken, options, payload, callback) {
  }
};
