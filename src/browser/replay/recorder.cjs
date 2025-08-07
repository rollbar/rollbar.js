/**
 * CommonJS wrapper for ES module
 *
 * This file provides CommonJS compatibility for users who use require()
 */

module.exports = require('./recorder.js').default || require('./recorder.js');
