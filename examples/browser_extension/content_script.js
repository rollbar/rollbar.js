console.log('Content script extension is running.');

// The rollbar snippet can't be used here because it loads via the DOM shared
// with the host web page (e.g. `elem.src = rollbar_js_url` ), and will load
// rollbar.js using the host page's window object instead of the current window context.
//
// So rollbar.js is instead loaded using the manifest.json file. This requires
// bundling rollbar.js in the extension package.
//
console.log(Rollbar);

// log a generic message and send to rollbar
Rollbar.info('Content script message');
