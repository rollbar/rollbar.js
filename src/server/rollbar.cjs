// CommonJS wrapper for ES module
// This file provides CommonJS compatibility for Node.js users
// who require() the rollbar package

module.exports = require('./rollbar.js').default;