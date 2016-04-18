# API Reference

<!-- Sub:[TOC] -->

## Rollbar.global()

(See the section on [configuration](https://rollbar.com/docs/notifier/rollbar.js/configuration).)

_Note_: This method will overwrite any existing global configuration.

__Returns__: `undefined`

__Params__

1. options: `Object` - A javascript object that contains global configuration.


## Rollbar.configure()

(See the section on [configuration](https://rollbar.com/docs/notifier/rollbar.js/configuration).)

_Note_: This method will overwrite any existing configuration for the `Rollbar` instance used.

__Returns__: `undefined`

__Params__

1. options: `Object` - A javascript object that contains the notifier configuration.


## Rollbar.scope()

(See the section on [configuration](https://rollbar.com/docs/notifier/rollbar.js/configuration).)

This method acts the same as `configure()` except it will not overwrite any config options. Rather, it will return a new `Rollbar` instance with the inherited config options set along with those passed into `scope()`.

__Returns__: a new `Rollbar` instance

__Params__

1. options: `Object` - A javascript object that contains the notifier configuration.


## Rollbar.uncaughtError()

This method is used to record uncaught exceptions from `window.onerror`. The Rollbar snippet will set `window.onerror = Rollbar.uncaughtError` if it was configured to do so via the `captureUncaught` config parameter given to `Rollbar.init()`.

__Returns__: `undefined`

__Params__

1. message: `String`: The error message.
1. url: `String`: url that the error occurred on.
1. lineNo: `Integer`: The line number, (if known) that the error occurred on.
1. colNo: `Integer`: The column number that the error occurred on.
    1. _Note_: Only newer browsers provide this variable.
1. err: `Exception`: The exception that caused the `window.onerror` event to occur.
    1. _Note_: Only newer browsers provide this variable.


## Rollbar.unhandledRejection()

This method is used to record unhandled Promise rejections via the window event `unhandledrejection`.  Many promise 
libraries, including Bluebird, lie, and native Promise support (Chrome only currently, but it is a [standard to be
built upon](https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onunhandledrejection)). 

To enable this handling, you should provide `captureUnhandledRejections` to the config given to `Rollbar.init()`.

__Returns__: `undefined`

__Params__

1. message: `Exception`: The exception, or rejection being rejected.
1. promise: `Promise`: The originating promise object.

## Rollbar.log()

Log a message and potentially send it to Rollbar. The level that the message or error is logged at is determined by the `logLevel` config option.

In order for the message to be sent to Rollbar, the log level must be greater than or equal to the `reportLevel` config option. 

See [configuration](https://rollbar.com/docs/notifier/rollbar.js/configuration) for more information on configuring log levels.

__Returns__: `undefined`

__Params__

_Note_: order does not matter

- message: `String` - The message to send to Rollbar.
- err: `Exception` - The exception object to send.
- custom: `Object` - The custom payload data to send to Rollbar.
- callback: `Function` - The function to call once the message has been sent to Rollbar.

### Examples

#### Log a debug message

```js
// By default, the .log() method uses the 
// "debug" log level and "warning" report level 
// so this message will not be sent to Rollbar.
Rollbar.log("hello world!");
```

#### Log a warning along with custom data

```js
Rollbar.configure({logLevel: "warning"});
Rollbar.log("Uh oh! The user pressed the wrong button.", {buttonId: "redButton"});
```

#### Log a debug message along with an error

```js
try {
  foo();
} catch (e) {
  Rollbar.log("Caught an exception", e);
}
```

#### Log an error and call a function when the error is reported to Rollbar

```js
Rollbar.configure({logLevel: "error"});

function continueFormSubmission() {
  // ...
}

try {
  foo();
  continueFormSubmission();
} catch (e) {
  Rollbar.log(e, continueFormSubmission);
}
```


## Rollbar.debug/info/warn/warning/error/critical()

These methods are all shorthand for `Rollbar.log()` with the appropriate log level set.
