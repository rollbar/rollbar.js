# Change Log

**v1.9.3**
- Serve rollbar.js from CDNJS

**v1.9.2**
- Fix bug which would break `Rollbar.wrap()` if a string was thrown. (pr#222)

**v1.9.1**
- Re-add rollbar.snippet.js to the Bower distribution. (pr#196)
  - This re-adds `dist/rollbar.snippet.js` to be backwards compatible with v1.8.5

**v1.9.0**
- Added support for arrays as custom data. (pr#194)
- Documentation added for disabling Rollbar in the presence of ad blockers. (pr#190)
- Added support for unhandled rejections from Promises. (pr#192)
- Decreased Bower release size. (pr#191)
  - **Breaking Changes**
    - Various files/directories were removed from the Bower release, including:
      - `dist/*.snippet*`
      - `dist/*.nojson*`
      - `dist/*.named-amd*`
      - `vendor`
      - `src`

**v1.8.5**
- Support retrying after being in offline mode. (pr#186)

**v1.8.4**
- Check messages body for ignored messages. (pr#180)

**v1.8.3**
- Fix a bug introduced in 1.8.0 where payload options were being removed by calls to `configure()`. (pr#176)

**v1.8.2**
- Using the latest error-stack-parser from NPM. (pr#171)

**v1.8.1**
- Changed the error-stack-parser dependency to use git+https. (pr#168)

**v1.8.0**
- Fixed a few bugs in IE9, IE8 which were not recognozing `Error` instances properly. (pr#164)
- Changed the behavior of `.global()` to only store options that we know how to process. (pr#164)
- Refactored the code to remove custom polyfills. (pr#164)
- Updated the snippet's script loading code to now include the `crossorigin` tag to allow the browser to send more information about internal rollbar.js errors. (pr#162)
- Fixed a bug in the jQuery plugin which would cause an error to be thrown in the internal `checkIgnore()` function. (pr#161)

**v1.7.5**
- Fix bug when checking window.onerror.belongsToShim.

**v1.7.4**
- Don't save shim's onerror when we are building globalnotifier.
  This fixes tests using window.onerror on a browser console
- Fix Default endpoint on docs/configuration.md

**v1.7.3**
- Added a named AMD module to the list of build targets. (pr#151)

**v1.7.2**
- Bumped version so that NPM lists 1.7.2 as the latest, (was pointing to 1.6.0) (issue#148)

**v1.7.1**
- Integrated karma tests. (pr#130)
- Added warning message for common issue with `loadFull()`

**v1.7.0**
- Fixed a bug that was not recognizing custom Error subclasses as valid errors. (pr#142)
- Added documentation for the `hostWhiteList` option. (pr#138)
- Changed the default uncaught error level to "error" instead of "warning".
  - This will cause all new uncaught errors to send out email notifications with the default Rollbar notification settings.
- Added a new configuration option, "async" which controls whether or not the full rollbar.min.js source is loaded up
  asynchronously. This option is set to `true` by default.

**v1.6.1**
- Updated bower.json to contain only a single .js entry. (issue#126)

**v1.6.0**
- Fixed a bug that caused IE 8 to not properly initialize `window.Rollbar`. (pr#129)
  - Fixed the `XDomainRequest` code to work properly in IE 8.
  - Updated error parsing to provide more useful information for IE 8 errors

**v1.5.0**
- Published rollbar.js to npmjs.com as rollbar-browser. (pr#127)
- Fixes a bug where thrown non-error objects were not properly handled. (pr#125)
- Fixes a bug that was logging an incorrect message when the notifier was disabled. (pr#124)
- Changes were made to the reported message for jQuery AJAX errors. This will cause some existing errors to have a different fingerprint and show up as new errors.
- Lots of code cleanup and smaller minified file size.

**v1.4.4**
- Remove the `window.onload` event handler from the snippet and just create the script tag for the full rollbar.js source directly. (pr#120)

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
