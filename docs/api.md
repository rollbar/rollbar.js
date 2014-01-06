# API Reference

<!-- Sub:[TOC] -->

## Rollbar.global()

(See the section on [configuration](./configuration).)

Note: This method will overwrite any existing global configuration.

### Params

1. options: `Object` - A javascript object that contains global configuration.

__Returns__: undefined


## Rollbar.configure()

(See the section on [configuration](./configuration).)

Note: This method will overwrite any existing configuration for the Rollbar instance used.

__Returns__: undefined

### Params

1. options: `Object` - A javascript object that contains the notifier configuration.


## Rollbar.uncaughtError()

This method is used to record uncaught exceptions from `window.onerror`. The Rollbar snippet will set `window.onerror = Rollbar.uncaughtError` if it was configured to do so via the `captureUncaught` config parameter given to `Rollbar.init()`.

__Returns__: undefined

### Params

1. message: `String`: The error message.
1. url: `String`: url that the error occurred on.
1. lineNo: `Integer`: The line number, (if known) that the error occurred on.
1. colNo: `Integer`: The column number that the error occurred on. Note: Only newer browsers provide this variable.
1. err: `Exception`: The exception that caused the `window.onerror` event to occur. Note: Only newer browsers provide this variable.


## Rollbar.log()

Log a message and potentially send it to Rollbar. The level that the message or error is logged at is determined by the `logLevel` config option.

In order for the message to be sent to Rollbar, the log level must be greater than or equal to the `reportLevel` config option. 

See [configuration](./configuration) for more information on configuring log levels.

### Params

Note: order does not matter

- message: `String` - The message to send to Rollbar.
- err: `Exception` - The exception object to send.
- custom: `Object` - The custom payload data to send to Rollbar.
- callback: `Function` - The function to call once the message has been sent to Rollbar.
