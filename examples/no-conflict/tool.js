import Rollbar from 'rollbar';

const rollbar = new Rollbar({
  accessToken: '59c9582c45d945f0ad2b7c3dc1aa9813',
  captureUncaught: false,
  captureUnhandledRejections: false
})

module.exports = function tool(x) {
  rollbar.log('foobar got data', {x})
}
