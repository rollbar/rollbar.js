# Change Log

**1.0.0-beta7**
- Fix uncaught errors being ignored in some browsers
- Default uncaught error level now `warning` instead of `error`, also configurable
- Wrap `addEventListener` to get more rich stack trace info for uncaught exceptions

**1.0.0-beta4**
- Fix some documentation bugs
- Changes made to the snippet to put `environment` in the `payload` key.
- Remove the default `context` value and associated logic around it being either a string or a function.
