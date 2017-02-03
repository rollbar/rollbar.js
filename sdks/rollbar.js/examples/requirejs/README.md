# Using Rollbar with [RequireJS](http://requirejs.org/)

1. Require and initialize the Rollbar javascript module:

  ```js

  //
  // Download the latest rollbar.umd.nojson.min.js and place in current directory.
  var rollbarConfig = {
    accessToken: '...',
    captureUncaught: true,
    payload: {
      environment: 'development',
    }
  };

  // Require the Rollbar library
  require(["rollbar.umd.nojson.min.js"], function(Rollbar) {
    var rollbar = Rollbar.init(rollbarConfig);
    rollbar.info('Hello world');
  });
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

## Test the example

1. Edit test.html and add your Rollbar `POST_CLIENT_ITEM_ACCESS_TOKEN`
   - Sign up for a free account [here](https://rollbar.com/signup/)
2. Open test.html in your browser and click the button
3. Go to your project dashboard and see the error

![Screenshot](https://raw.githubusercontent.com/rollbar/rollbar.js/master/examples/browserify/img/screenshot.png)
