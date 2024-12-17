console.log('Content script extension is running.');

// config.js and rollbar.js are loaded using the manifest.json file.
console.log(Rollbar);

// log a generic message and send to rollbar
Rollbar.info('Content script message');
