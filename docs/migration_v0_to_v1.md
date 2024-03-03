# Migrating from the v0.XX notifier to v1.XX

<!-- Sub:[TOC] -->

## Update your snippet

### Change the config object:

```js
var _rollbarParams = { 'server.environment': 'production' };
_rollbarParams['notifier.snippet_version'] = '2';
var _rollbar = ['POST_CLIENT_ITEM_ACCESS_TOKEN', _rollbarParams];
```

to

```js
var _rollbarConfig = {
  accessToken: 'POST_CLIENT_ITEM_ACCESS_TOKEN',
  captureUncaught: true,
  payload: {
    environment: 'production',
  },
};
```

If you have any extra config options in `_rollbarParams` you'll need to add them to `_rollbarConfig`.

e.g.

```js
var _rollbarParams = {
  checkIgnore: function (msg, url, lineNo, colNo, error) {
    // don't ignore anything (default)
    return false;
  },
  context: 'home#index',
  itemsPerMinute: 60,
  level: 'error',
  person: {
    id: 12345,
    username: 'johndoe',
    email: 'johndoe@example.com',
  },
  'server.branch': 'develop',
  'server.environment': 'staging',
  'server.host': 'web1',
};
```

should be changed to

```js
var _rollbarConfig = {
  accessToken: 'POST_CLIENT_ITEM_ACCESS_TOKEN',
  captureUncaught: true,
  checkIgnore: function (msg, url, lineNo, colNo, error) {
    // don't ignore anything (default)
    return false;
  },
  itemsPerMinute: 60,
  logLevel: 'error',
  payload: {
    environment: 'production',
    context: 'home#index',
    person: {
      id: 12345,
      username: 'johndoe',
      email: 'johndoe@example.com',
    },
    server: {
      branch: 'develop',
      environment: 'staging',
      host: 'web1',
    },
  },
};
```

### Change the snippet

For the latest snippet, see the instructions here: [https://rollbar.com/docs/notifier/rollbar.js/](https://rollbar.com/docs/notifier/rollbar.js/).

## Update references to `_rollbar.push()`

The v1 notifier has a more intuitive interface for recording errors and generic logging.

### Recording a caught exception

From

```js
try {
  doSomething();
} catch (e) {
  _rollbar.push(e);
}
```

to

```js
try {
  doSomething();
} catch (e) {
  // Note: You can also use Rollbar.warning(e) to report the exception as a "warning" to Rollbar.
  // Other options:
  //   Rollbar.debug(e) - report as "debug"
  //   Rollbar.info(e)
  //   Rollbar.warning(e)
  //   Rollbar.error(e)
  //   Rollbar.critical(e)
  //   Rollbar.log(e) - reports as whatever "logLevel" confiugration option was used in the snippet.
  Rollbar.log(e);

  // Note: You can also include a custom message and custom data along with the exception
  // Rollbar.log("Caught an error while doing something.", e, {somevar: "someval"});
}
```

### Recording a log message

From

```js
_rollbar.push('Some log message');
```

to

```js
Rollbar.info('Some log message');
```

#### Including custom data

From

```js
_rollbar.push({
  level: 'warning',
  msg: 'Some warning message',
  point: { x: 5, y: 10 },
});
```

to

```js
Rollbar.warning('Some warning message', { point: { x: 5, y: 10 } });
```

#### Using callbacks

From

```js
try {
  doSomething();
} catch (e) {
  _rollbar.push(e, function (err, uuid) {
    if (err !== null) {
      console.error('Could not report an exception to Rollbar, error: ' + err);
    } else {
      console.log('Reported exception to Rollbar, uuid: ' + uuid);
    }
  });
}
```

to

```js
try {
  doSomething();
} catch (e) {
  Rollbar.log(e, function (err, uuid) {
    if (err !== null) {
      console.error('Could not report an exception to Rollbar, error: ' + err);
    } else {
      console.log('Reported exception to Rollbar, uuid: ' + uuid);
    }
  });
}
```

## Update the jQuery plugin

See the [jQuery plugin docs](https://rollbar.com/docs/notifier/rollbar.js/plugins).

## Using in embedded browsers or extensions

Similar to the v0 instructions, be sure to use "https" instead of a protocol-less URL in the snippet.

Reference: [https://github.com/rollbar/rollbar.js/tree/v0#using-in-embedded-browsers-or-extensions](https://github.com/rollbar/rollbar.js/tree/v0#using-in-embedded-browsers-or-extensions)
