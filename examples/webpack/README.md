# Using Rollbar with [Webpack](http://webpack.github.io/)

1. Require and initialize the Rollbar javascript module:

```js

// Download //d37gvrvc0wt4s1.cloudfront.net/js/v1.1/rollbar.commonjs.min.js and place in current directory
// and rename to rollbar.commonjs-v1.1.min.js
var rollbarConfig = {
  accessToken: '...',
  captureUncaught: true,
  payload: {
    environment: 'development',
  }
};
var rollbar = require("expose?rollbar!./rollbar.commonjs-v1.1.min.js"); // Use the expose-loader to expose the global
rollbar.init(rollbarConfig);
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
1. Edit index.js and add your Rollbar `post_client_access_token`
   - Sign up for a free account [here](https://rollbar.com/signup/)
2. ```webpack index.js all.js```
3. Open test.html in your browser and click the button
4. Go to your project dashboard and see the error

![Screenshot](https://github.com/rollbar/rollbar.js/raw/browserify/examples/browserify/img/screenshot.png)
