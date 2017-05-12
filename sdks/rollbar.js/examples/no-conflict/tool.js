import Rollbar from 'rollbar';

const rollbar = new Rollbar({
  accessToken: 'POST_CLIENT_ITEM_TOKEN',
  captureUncaught: false,
  captureUnhandledRejections: false
})

module.exports = function tool(x) {
  rollbar.log('foobar got data', {x})
}
