# Using Rollbar with [Bower](http://bower.io/)

- Install rollbar.js
```
bower install rollbar --save
```
- Add the `_rollbarConfig` configuration to the `<head>` of your page.
```html
<head>
  <script>
    _rollbarConfig = {
      accessToken: "ACCESS_TOKEN",
      captureUncaught: true,
      payload: {
         environment: "test"
      }
    };
  </script>
</head>
```
- Include the Rollbar snippet just below `_rollbarConfig`.
```html
<head>
  <script>
    _rollbarConfig = {
      accessToken: "ACCESS_TOKEN",
      captureUncaught: true,
      payload: {
        environment: "test"
      }
    };
  </script>
</head>
<script src="bower_components/rollbar/dist/rollbar.snippet.js"></script>
```

Rollbar is now monitoring your page for all unhandled exceptions and is available via the global `window.Rollbar` object.

```js
// Put this anywhere in your app
Rollbar.info('Hello world');
```
