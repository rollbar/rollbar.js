# Change Log

**v1.4.3**
- Fixed a bug that would cause the notifier to crash when run in a Selenium test. (pr#117)
- Force the notifier to always use HTTPS when communicating with api.rollbar.com. (pr#116)

**v1.4.2**
- Fixed a bug that occurred in FF when Rollbar logged an internal error or if verbose mode was turned on. (pr#105)

**v1.4.1**
- Fixed a bug that would load the wrong AMD module if a custom "rollbar" module was already defined.
  - Customers should copy and paste the new snippet into their code.

**v1.4.0**
- Fix a bug, (introduced in v1.3) that caused Rollbar to generate an error when used with RequireJS.
  - Customers should copy and paste the new snippet into their code.

**v1.3.0**
- Add more strict JSHint options and fix errors/warnings.

**v1.3.0-rc.4**
- Fixes IE8 bug where JSON was not defined.

**v1.3.0-rc.3**
- Remove polyfill.

**v1.3.0-rc.2**
- Fix main values in bower.json.

**v1.3.0-rc.1**
- Fixes for IE8+

**v1.3.0-alpha.5**
- Fix rollbar.umd.min.js URL in the snippet
- Remove sourceMappingURL comment due to browser bug concerns

**v1.3.0-alpha.4**
- Update CHANGELOG.md.

**v1.3.0-alpha.3**
- Remove repeated timer to send enqueued payloads.
- Change argument name in Stack() to fix uglify bug.
- Change __DEFAULT_ROLLBARJS_URL__ to use https.
- Set window._globalRollbarOptions when calling .configure().

**v1.3.0-alpha.2**
- Update missing dist/ files.

**v1.3.0-alpha.1**
- Build the library using webpack.
- Replace tracekit and use error-stack-parser.

**1.2.2**
- Added `nojson` distribution, for use on sites with a Content Security Policy that disallows `unsafe-eval`. (The standard distributions ship with a built-in JSON implementation, since external libraries, such as MooTools, sometimes break the brower's built-in JSON.) If you know that the built-in JSON is not being modified in your application, or you are disallowing `unsafe-eval`, use this distribution.

**1.2.1**
- Fixed bug where the global notifier not being used to atch event listener exceptions. (pr#70)

**1.2.0**
- Fixed AMD build to now return the notifier instance from the `init()` method.

**1.1.16 - EDIT: This version has been removed due to finding a bug that broke backward compatibility.**
- Optimized the AMD build to not create a Notifier instance until the `init()` method is called.

**1.1.15**
- Fix a bug where custom context functions that returned `undefined` were causing `Rollbar.wrap()` to throw an error.

**1.1.14**
- Fix a bug in IE8 where DOMException was being used even though it's not defined, (#62).

**1.1.13**
- Add `responseText` and `statusText` to the data reported by the jQuery ajax plugin, (pr#61).

**1.1.12**
- Fixes a bug where `DOMException` objects were not recognized as error objects. (#55).

**1.1.11**
- Fixes a bug where wrapped functions were crashing when a `null` callback was given to `removeEventListener()`, (pr#50).

**1.1.10**
- Pulls in the latest JSON-js changes that do not call `.toJSON()` if the method exists already. This was breaking because MooTools v1.2.4 sets `.toJSON()` to use a broken JSON stringify implementation.

**1.1.9**
- Always use the custom JSON implementation since some users are initializing a library that will overwrite a working `JSON.stringify()` with a broken one after Rollbar has checked for `JSON.stringify()` correctness.

**1.1.8**
- Added a callback function to `loadFull()` to support Segment.io's plugin model.

**1.1.7**
- Added `verbose` and `logFunction` options, (pr#42).

**1.1.6**
- Added a `_wrappedSource` key to exceptions caught by the `wrap()` method to record the source of the wrapped function.

**1.1.5**
- Added a `context` parameter to `Rollbar.wrap()`, (#26).
- Added a `transform` option to allow the user to read/modify the payload before we send it to Rollbar, (#41 #43).

**1.1.4**
- Added the `enabled` flag to determine when we should enqueue payloads to be sent, (#28).

**1.1.3**
- Fixed a bug that was causing a stack overflow error in IE8, (#38).
- Shaved off a few bytes from the snippet's size.

**1.1.2**
- Fixed a bug that was causing `Rollbar.configure()` to incorrectly handle overwriting array configuration.
- Added in support for a `ignoredMessages` configuration option, (pr#35).
- Fixed a bug that was causing some `EventListener` objects to not be unbound, (pr#33).
- Updated the snippet with fixes.

**1.1.1**
- Fixed a bug with default rate limits. The defaults were not applied unless Rollbar.global() was called.

**1.1.0**
- Add support for AMD JS loaders and refactor rollbar.require.js into rollbar.amd.js and rollbar.commonjs.js.

**1.0.0-rc.11**
- Add support for whitelisting host names/domains, (pr#31).

**1.0.0-rc.10**
- Add support for using rollbar with Webpack/Browserify via `require("rollbar.require.min.js")` with examples.

**1.0.0-rc.9**
- Fixed a bug that caused a wrapped async handler to break if there was no callback provided.

**1.0.0-rc.8**
- Fixed a bug that created/used a global variable.

**1.0.0-rc.7**
- Change default reportLevel to `debug`. Previously, calls to `Rollbar.info` and `Rollbar.debug` were filtered out under the default configuration; now they are let through.

**1.0.0-rc.6**
- Fixed a bug where items were sent in reverse order when queued
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

## Upgrade Instructions

### v1.0.x to v1.1.x
1. Replace your rollbar snippet with the latest from the [rollbar.js quickstart docs](https://rollbar.com/docs/notifier/rollbar.js/) or from [the Github repo](https://github.com/rollbar/rollbar.js/blob/master/dist/rollbar.snippet.js).

