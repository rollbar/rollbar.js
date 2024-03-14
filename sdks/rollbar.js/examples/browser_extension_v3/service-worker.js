console.log('Background extension is running.');

const _rollbarConfig = {
  accessToken: 'ROLLBAR_CLIENT_TOKEN',
  captureUncaught: true,
  captureUnhandledRejections: true,
};

// When using es6 module
// import './rollbar.min.js';
//
// Else
self.importScripts('./rollbar.min.js');

rollbar.init(_rollbarConfig);

// log a generic message and send to rollbar
rollbar.info('Service worker message');

self.addEventListener('install', (event) => {
  console.log('Chrome ext service worker install event', event);
  rollbar.info('Chrome ext service worker install event');
});

self.addEventListener('activate', (event) => {
  console.log('Chrome ext service worker activate event', event);
  rollbar.info('Chrome ext service worker activate event');
});
