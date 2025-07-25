# Using Rollbar with [Browserify](http://browserify.org/)

1. Require and initialize the Rollbar javascript module:

```js
// npm install --save rollbar
var rollbar = require('rollbar');

var rollbarConfig = {
  accessToken: 'POST_CLIENT_ITEM_ACCESS_TOKEN',
  captureUncaught: true,
  payload: {
    environment: 'development',
  },
};
var Rollbar = rollbar.init(rollbarConfig);
window.Rollbar = Rollbar;
```

2. Report exceptions and messages in your code:

```js
try {
  foo();
  Rollbar.debug('foo() called');
} catch (e) {
  Rollbar.error('Problem calling foo()', e);
}
```

## To build and test the example

1. Edit index.js and add your Rollbar `POST_CLIENT_ITEM_ACCESS_TOKEN`
   - Sign up for a free account [here](https://rollbar.com/signup/)
2. `npm install` (if you haven't already)
3. `npm run build`
4. Open test.html in your browser and click the button
5. Go to your project dashboard and see the error

![Screenshot](https://raw.githubusercontent.com/rollbar/rollbar.js/master/examples/browserify/img/screenshot.png)
