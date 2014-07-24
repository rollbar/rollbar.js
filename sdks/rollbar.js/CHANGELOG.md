# Change Log

**1.1.1**
- Fix bug with default rate limits. The defaults were not applied unless Rollbar.global() was called.

**1.1.0**
- Add support for AMD JS loaders and refactor rollbar.require.js into rollbar.amd.js and rollbar.commonjs.js.

**1.0.0-rc.11**
- Add support for whitelisting host names/domains, (pr#31).

**1.0.0-rc.10**
- Add support for using rollbar with Webpack/Browserify via `require("rollbar.require.min.js")` with examples.

**1.0.0-rc.9**
- Fix bug that caused a wrapped async handler to break if there was no callback provided.

**1.0.0-rc.8**
- Fix bug that created/used a global variable.

**1.0.0-rc.7**
- Change default reportLevel to `debug`. Previously, calls to `Rollbar.info` and `Rollbar.debug` were filtered out under the default configuration; now they are let through.

**1.0.0-rc.6**
- Fix bug where items were sent in reverse order when queued
- Add `maxItems` global option. If defined, at most this many items per pageview will be sent. Default `0`, meaning "no limit".

**1.0.0-rc.5**
- Fix invalid payload generated when a non-Error object is passed as the error (#20)
- Pass correct window.onerror args to original onerror (#23)
- jQuery plugin: ignore status 0 events (#22)
- Fix issue where callbacks to `.debug()`, etc. were not called if reportLevel filters the item (#24)

**1.0.0-rc.4**
- Fix snippet in IE8 (change `map` to a for loop)

**1.0.0-rc.3**
- Remove source maps from build process (no user-facing changes)

**1.0.0-rc.2**
- Send access token as a request header in browsers that support XMLHttpRequest

**1.0.0-rc.1**
- Fix bug where we were attempting to wrap an object instead of a function.
  - https://github.com/rollbar/rollbar.js/pull/17
- Fix bug in jQuery plugin that wasn't passing along the jQuery object.
  - https://github.com/rollbar/rollbar.js/pull/16
- Added a migration guide for the v0 to v1 notifier
  - https://github.com/rollbar/rollbar.js/blob/master/docs/migration_v0_to_v1.md

**1.0.0-beta9**
- Fix api response JSON parsing on older browsers

**1.0.0-beta8**
- Fix uncaught errors being ignored in some browsers
- Default uncaught error level now `warning` instead of `error`, also configurable
- Wrap `addEventListener` to get more rich stack trace info for uncaught exceptions

**1.0.0-beta7**
- Use a custom JSON.stringify method if the existing one does not work properly.

**1.0.0-beta4**
- Fix some documentation bugs
- Changes made to the snippet to put `environment` in the `payload` key.
- Remove the default `context` value and associated logic around it being either a string or a function.
