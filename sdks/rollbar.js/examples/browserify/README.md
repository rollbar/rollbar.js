# Using Rollbar with [Browserify](http://browserify.org/)

1. Require and initialize the Rollbar javascript module:

```js
// Download https://d37gvrvc0wt4s1.cloudfront.net/js/v1.3/rollbar.umd.nojson.min.js and place in current directory

// The code below is a example of use on your browserify bundles.
var rollbar = require('./rollbar.umd.nojson.min.js');

var rollbarConfig = {
  accessToken: 'POST_CLIENT_ITEM_ACCESS_TOKEN',
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

## To build and test the example
1. Edit index.js and add your Rollbar `POST_CLIENT_ITEM_ACCESS_TOKEN`
   - Sign up for a free account [here](https://rollbar.com/signup/)
2. ```browserify index.js > all.js```
3. Open test.html in your browser and click the button
4. Go to your project dashboard and see the error

![Screenshot](https://raw.githubusercontent.com/rollbar/rollbar.js/master/examples/browserify/img/screenshot.png)
