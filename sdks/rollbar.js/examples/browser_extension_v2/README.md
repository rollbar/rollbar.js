# Chrome/Firefox/Edge Chromium Extension Example

This example demonstrates initializing Rollbar both in the background extension
and in the content script of a Chrome/Chromium or Firefox manifest v2 extension.

To load and run this demo:

- Add your Rolllbar client token (config.js for client script, background.js for background script.)
- Enable developer mode for extensions in Chrome
- Click 'Load unpacked extension', and select this folder to load.

The background script outputs to a separate console accessed from the extensions
panel in Chrome.

## Compatibility Notes

Firefox has slightly different manifest.json requirements. This example is written
so that the same manifest.json can be used across all browsers.

### content_security_policy

According to the browser extension spec, it should be OK to only set `default-src`.
This won't work for Firefox, which requires setting both `script-src` and `object-src`.
This example uses the Firefox compatible content security policy, since it also
works fine on Chrome and Edge.

### background.persistent

Firefox emits a warning when the `background.persistent` key is set false.
This example sets the key true, as this setting works across all browsers.

### Rollbar configuration

There are some limitations on Firefox in the content script. The background script
is not affected by these limitations.

Firefox requires setting `captureUncaught` false in the content script, because it doesn't allow
Rollbar.js to wrap `window.onerror`.

Firefox requires setting `autoInstrument.network` false in the content script,
because it doesn't allow Rollbar.js to wrap `window.fetch`.

The content script config is in ./config.js in this example, and is configured
with Firefox compatible settings.
