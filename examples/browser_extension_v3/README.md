# Chrome/Chromium Extension Example

This example demonstrates initializing Rollbar both in the background extension
and in the content script of a Chrome/Chromium manifest v3 extension.

To load and run this demo:

- Add your Rolllbar client token (config.js for client script, service-worker.js for background script.)
- Enable developer mode for extensions in Chrome
- Click 'Load unpacked extension', and select this folder to load.

The background script outputs to a separate console accessed from the extensions
panel in Chrome.
