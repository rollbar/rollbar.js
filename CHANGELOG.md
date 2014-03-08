# Change Log

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
