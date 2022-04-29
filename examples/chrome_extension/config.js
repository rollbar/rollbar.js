
window._rollbarConfig = {
  accessToken: 'ROLLBAR_CLIENT_TOKEN',
  captureUncaught: false, // Only required for Firefox, other browser targets
                          // may set true. See README.
  captureUnhandledRejections: true,
  autoInstrument: {
    network: false // Only required for Firefox, other browser targets
                   // may set true. See README.
  }
};
