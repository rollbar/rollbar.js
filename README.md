# Rollbar notifier for JavaScript [![Build Status](https://api.travis-ci.org/rollbar/rollbar.js.png?branch=master)](https://travis-ci.org/rollbar/rollbar.js)

<!-- Sub:[TOC] -->

## Quick start

__Note__: This notifier is in beta. For a stable version see the [v0.10.10](https://github.com/rollbar/rollbar.js/blob/v0.10.10/README.md) release.

Copy-paste the following code into the ```<head>``` of every page you want to monitor. It should be as high as possible, before any other ```<script>``` tags.

<!-- RemoveNextIfProject -->
Be sure to replace ```POST_CLIENT_ITEM_ACCESS_TOKEN``` with your project's ```post_client_item``` access token, which you can find in the Rollbar.com interface.

<!-- EditableTextAreaStart -->
<!-- RemoveNext -->
```html
<script>
var _rollbarConfig = {
    accessToken: "POST_CLIENT_ITEM_ACCESS_TOKEN",
    captureUncaught: true,
    payload: {
        environment: "production"
    }
};
!function(a,b){function c(b){this.shimId=++f,this.notifier=null,this.parentShim=b,this.logger=function(){},a.console&&void 0===a.console.shimId&&(this.logger=a.console.log)}function d(b){var d=c;return e(function(){if(this.notifier)return this.notifier[b].apply(this.notifier,arguments);var c=this,e="scope"===b;e&&(c=new d(this));var f=Array.prototype.slice.call(arguments,0),g={shim:c,method:b,args:f,ts:new Date};return a._rollbarShimQueue.push(g),e?c:void 0})}function e(a,b){return b=b||this.logger,function(){try{return a.apply(this,arguments)}catch(c){b("Rollbar internal error:",c)}}}var f=0;c.init=function(a,b){var d=b.globalAlias||"Rollbar";if("object"==typeof a[d])return a[d];a._rollbarShimQueue=[],b=b||{};var f=new c;return e(function(){if(f.configure(b),b.captureUncaught){var c=a.onerror;a.onerror=function(){f.uncaughtError.apply(f,arguments),c&&c.apply(a,arguments)}}return a[d]=f,f},f.logger)()},c.prototype.loadFull=function(a,b,c,d){var f=e(function(){var a=b.createElement("script"),e=b.getElementsByTagName("script")[0];a.src=d.rollbarJsUrl,a.async=!c,a.onload=g,e.parentNode.insertBefore(a,e)},this.logger),g=e(function(){if(void 0===a._rollbarPayloadQueue)for(var b,c,d,e,f=new Error("rollbar.js did not load");b=a._rollbarShimQueue.shift();)for(d=b.args,e=0;e<d.length;++e)if(c=d[e],"function"==typeof c){c(f);break}},this.logger);e(function(){c?f():a.addEventListener?a.addEventListener("load",f,!1):a.attachEvent("onload",f)},this.logger)()};for(var g="log,debug,info,warn,warning,error,critical,global,configure,scope,uncaughtError".split(","),h=0;h<g.length;++h)c.prototype[g[h]]=d(g[h]);var i="//d37gvrvc0wt4s1.cloudfront.net/js/v1.0/rollbar.min.js";_rollbarConfig.rollbarJsUrl=_rollbarConfig.rollbarJsUrl||i;var j=c.init(a,_rollbarConfig);j.loadFull(a,b,!1,_rollbarConfig)}(window,document);
</script>
```
<!-- RemovePrev -->
<!-- EditableTextAreaEnd -->

If you're running Rollbar on an environment besides production, change the ```environment``` value to something else (e.g. "staging"). See below for more configuration options.
  
### Test your installation

1. Navigate your browser to a page that has the above code installed
2. Type the following code *into the address bar* (not the console) and press enter: ```javascript:testing_rollbar_123();```

As long as you don't happen to have a function by that name, this will cause an uncaught error that will be reported to Rollbar. It should appear in the dashboard within a few seconds.

## Usage

In addition to catching top-level errors, you can send caught errors or custom log messages. All of the following methods are fully-asynchronous and safe to call anywhere in your code after the ```<script>``` tag above.

```js
// Caught errors
try {
  doSomething();
} catch (e) {
  Rollbar.error("Something went wrong", e);
}

// Arbitrary log messages. 'critical' is most severe; 'debug' is least.
Rollbar.critical("Connection error from remote Payments API");
Rollbar.error("Some unexpected condition");
Rollbar.warning("Connection error from Twitter API");
Rollbar.info("User opened the purchase dialog");
Rollbar.debug("Purchase dialog finished rendering");

// Can include custom data with any of the above.
// It will appear as `custom.postId` in the Occurrences tab
Rollbar.info("Post published", {postId: 123});

// Callback functions
Rollbar.error(e, function(err, data) {
  if (err) {
    console.log("Error while reporting error to Rollbar: ", e);
  } else {
    console.log("Error successfully reported to Rollbar. UUID:", data.uuid);
  }
});
```

To set configuration options at runtime, use `Rollbar.configure`:

```js
// Set the person data to be sent with all errors for this notifier.
Rollbar.configure({
  payload: {
    person: {
      id: 456,
      username: "foo",
      email: "foo@example.com"
    }
  }
});
```

(Advanced) For fine-grained control of the payload sent to the [Rollbar API](https://rollbar.com/docs/api_items/), use `Rollbar.scope`:

```js
Rollbar.scope({fingerprint: "custom fingerprint to override grouping algorithm"}).error(err);
```

## Source Maps

If you minify your JavaScript in production, you'll want to configure source maps so you get meaningful stack traces. See the [source maps guide](https://rollbar.com/docs/guides_sourcemaps/) for instructions.

## Next steps

- [Configuration reference](https://rollbar.com/docs/notifier/rollbar.js/configuration)
- [API reference](https://rollbar.com/docs/notifier/rollbar.js/api)
- [Plugins](https://rollbar.com/docs/notifier/rollbar.js/plugins)
- [FAQ](https://rollbar.com/docs/notifier/rollbar.js/faq)

## Help / Support

If you run into any issues, please email us at [support@rollbar.com](mailto:support@rollbar.com)

You can also find us in IRC: [#rollbar on chat.freenode.net](irc://chat.freenode.net/rollbar)

For bug reports, please [open an issue on GitHub](https://github.com/rollbar/rollbar.js/issues/new).

## Contributing

1. [Fork it](https://github.com/rollbar/rollbar.js)
2. Create your feature branch (```git checkout -b my-new-feature```).
3. Commit your changes (```git commit -am 'Added some feature'```)
4. Push to the branch (```git push origin my-new-feature```)
5. Create new Pull Request

To set up a development environment, you'll need Node.js and npm. Run `npm install`, then `make test` to run the tests.
