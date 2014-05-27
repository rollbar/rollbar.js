# Using Rollbar with [Browserify](http://browserify.org/)

1. Require and initialize the Rollbar javascript module:
```js
var rollbar = require('../dist/rollbar.require.js');

var rollbarConfig = {
  accessToken: '...',
  captureUncaught: true,
  payload: {
    environment: 'development',
  }
};
rollbar.init(rollbarConfig);
window.rollbar = rollbar;
```
2. Report exceptions and messages in your code:
```js
try {
  foo();
  rollbar.debug('foo() called');
} catch (e) {
  rollbar.error('Problem calling foo()', e);
}
```
