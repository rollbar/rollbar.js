# Using Rollbar with [RequireJS](http://requirejs.org/)

1. Require and initialize the Rollbar javascript module:

  ```js

  // Download https://d37gvrvc0wt4s1.cloudfront.net/js/v1.9.1/rollbar.umd.nojson.min.js and place in current directory.
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

3. You can also configure your payload before reporting exceptions:

```js

// configuring your payload
rollbar.configure({
  payload: {
    person: {
      id: 3,
      username: 'John Doe',
      email: 'john.doe@mailinator.com'
    },
    otherData: {
      foo: 1,
      bar: 'valuable info'
    }
  }
});

// reporting the error
rollbar.error('Problem calling foo()', stacktrace);
```

To know more about Person Tracking and other cool stuff, [check out the Rollbar Docs](https://rollbar.com/docs/).

## Test the example

1. Edit test.html and add your Rollbar `POST_CLIENT_ITEM_ACCESS_TOKEN`
   - Sign up for a free account [here](https://rollbar.com/signup/)
2. Open test.html in your browser and click the button
3. Go to your project dashboard and see the error

![Screenshot](https://raw.githubusercontent.com/rollbar/rollbar.js/master/examples/browserify/img/screenshot.png)
