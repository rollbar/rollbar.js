// Use noconflict so we can embed rollbar.js in this library
var Rollbar = require('rollbar/dist/rollbar.noconflict.umd');

const rollbar = new Rollbar({
  accessToken: 'POST_CLIENT_ITEM_TOKEN',
  captureUncaught: true,
  captureUnhandledRejections: true
})

module.exports = function tool(x) {
  rollbar.log('foobar got data', {x})
}
