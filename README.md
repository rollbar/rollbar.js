# Rollbar notifier for JavaScript [![Build Status](https://api.travis-ci.org/rollbar/rollbar.js.png?branch=master)](https://travis-ci.org/rollbar/rollbar.js)

<!-- Sub:[TOC] -->

## Quick start

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
!function(r){function t(o){if(e[o])return e[o].exports;var n=e[o]={exports:{},id:o,loaded:!1};return r[o].call(n.exports,n,n.exports,t),n.loaded=!0,n.exports}var e={};return t.m=r,t.c=e,t.p="",t(0)}([function(r,t,e){"use strict";var o=e(1).Rollbar,n=e(2),a="https://d37gvrvc0wt4s1.cloudfront.net/js/v1.4/rollbar.min.js";_rollbarConfig.rollbarJsUrl=_rollbarConfig.rollbarJsUrl||a;var i=o.init(window,_rollbarConfig),l=n(i,_rollbarConfig);i.loadFull(window,document,!1,_rollbarConfig,l)},function(r,t){"use strict";function e(){var r=window.console;r&&"function"==typeof r.log&&r.log.apply(r,arguments)}function o(r){this.shimId=++u,this.notifier=null,this.parentShim=r,this.logger=e,this._rollbarOldOnError=null}function n(r,t,e){window._rollbarWrappedError&&(e[4]||(e[4]=window._rollbarWrappedError),e[5]||(e[5]=window._rollbarWrappedError._rollbarContext),window._rollbarWrappedError=null),r.uncaughtError.apply(r,e),t&&t.apply(window,e)}function a(r){var t=o;return l(function(){if(this.notifier)return this.notifier[r].apply(this.notifier,arguments);var e=this,o="scope"===r;o&&(e=new t(this));var n=Array.prototype.slice.call(arguments,0),a={shim:e,method:r,args:n,ts:new Date};return window._rollbarShimQueue.push(a),o?e:void 0})}function i(r,t){if(t.hasOwnProperty&&t.hasOwnProperty("addEventListener")){var e=t.addEventListener;t.addEventListener=function(t,o,n){e.call(this,t,r.wrap(o),n)};var o=t.removeEventListener;t.removeEventListener=function(r,t,e){o.call(this,r,t&&t._wrapped?t._wrapped:t,e)}}}function l(r,t){return t=t||e,function(){try{return r.apply(this,arguments)}catch(e){t("Rollbar internal error:",e)}}}var u=0;o.init=function(r,t){var e=t.globalAlias||"Rollbar";if("object"==typeof r[e])return r[e];r._rollbarShimQueue=[],r._rollbarWrappedError=null,t=t||{};var a=new o;return l(function(){if(a.configure(t),t.captureUncaught){a._rollbarOldOnError=r.onerror,r.onerror=function(){var r=Array.prototype.slice.call(arguments,0);n(a,a._rollbarOldOnError,r)};var o,l,u="EventTarget,Window,Node,ApplicationCache,AudioTrackList,ChannelMergerNode,CryptoOperation,EventSource,FileReader,HTMLUnknownElement,IDBDatabase,IDBRequest,IDBTransaction,KeyOperation,MediaController,MessagePort,ModalWindow,Notification,SVGElementInstance,Screen,TextTrack,TextTrackCue,TextTrackList,WebSocket,WebSocketWorker,Worker,XMLHttpRequest,XMLHttpRequestEventTarget,XMLHttpRequestUpload".split(",");for(o=0;o<u.length;++o)l=u[o],r[l]&&r[l].prototype&&i(a,r[l].prototype)}return r[e]=a,a},a.logger)()},o.prototype.loadFull=function(r,t,e,o,n){var a=l(function(){var r=t.createElement("script"),n=t.getElementsByTagName("script")[0];r.src=o.rollbarJsUrl,r.async=!e,r.onload=i,n.parentNode.insertBefore(r,n)},this.logger),i=l(function(){var t;if(void 0===r._rollbarPayloadQueue){var e,o,a,i;for(t=new Error("rollbar.js did not load");e=r._rollbarShimQueue.shift();)for(a=e.args,i=0;i<a.length;++i)if(o=a[i],"function"==typeof o){o(t);break}}"function"==typeof n&&n(t)},this.logger);l(function(){e?a():r.addEventListener?r.addEventListener("load",a,!1):r.attachEvent("onload",a)},this.logger)()},o.prototype.wrap=function(r,t){try{var e;if(e="function"==typeof t?t:function(){return t||{}},"function"!=typeof r)return r;if(r._isWrap)return r;if(!r._wrapped){r._wrapped=function(){try{return r.apply(this,arguments)}catch(t){throw t._rollbarContext=e()||{},t._rollbarContext._wrappedSource=r.toString(),window._rollbarWrappedError=t,t}},r._wrapped._isWrap=!0;for(var o in r)r.hasOwnProperty(o)&&(r._wrapped[o]=r[o])}return r._wrapped}catch(n){return r}};for(var s="log,debug,info,warn,warning,error,critical,global,configure,scope,uncaughtError".split(","),p=0;p<s.length;++p)o.prototype[s[p]]=a(s[p]);r.exports={Rollbar:o,_rollbarWindowOnError:n}},function(r,t){"use strict";r.exports=function(r,t){return function(e){if(!e&&!window._rollbarInitialized){var o=window.RollbarNotifier,n=t||{},a=n.globalAlias||"Rollbar",i=window.Rollbar.init(n,r);i._processShimQueue(window._rollbarShimQueue||[]),window[a]=i,window._rollbarInitialized=!0,o.processPayloads()}}}}]);
</script>
```
<!-- RemovePrev -->
<!-- EditableTextAreaEnd -->

If you're running Rollbar on an environment besides production, change the ```environment``` value to something else (e.g. "staging"). See below for more configuration options.

### Test your installation

1. Navigate your browser to a page that has the above code installed
2. Type the following code into the console and press enter: ```window.onerror("TestRollbarError: testing window.onerror", window.location.href)```

This simulates an uncaught error. It should appear in the Rollbar dashboard within a few seconds.

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
    console.log("Error successfully reported to Rollbar. UUID:", data.result.uuid);
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

## UMD

From version 1.3.0, rollbar.js is also distributed using UMD (check `rollbar.umd.*.js` files in ([releases](https://github.com/rollbar/rollbar.js/tree/v1.3.0/release)), so you can load the library using AMD or CommonJS styles. Also you can load the library using a `<script>` tag. You can find examples of use in [examples](https://github.com/rollbar/rollbar.js/tree/v1.3.0/examples).

## Disable reporting to rollbar.com

If you don't want to send data to Rollbar, just set the `enabled` flag to `false` for each notifier instance.

```js
Rollbar.error("This will be reported to Rollbar");
Rollbar.configure({enabled: false});
Rollbar.error("This will *not* be reported to Rollbar");
```

## Ignoring specific exception messages

If you want to ignore a specific exception message, say for a third-party browser plugin
that is throwing errors, you can add the message to the `ignoredMessages` array,
and Rollbar will ignore exceptions matching those messages.


```js
var _rollbarConfig = {
  accessToken: "POST_CLIENT_ITEM_ACCESS_TOKEN",
  ignoredMessages: ["Can't find Clippy.bmp. The end is nigh."],
  captureUncaught: true,
  payload: {
    environment: "production"
  }
};
// init your rollbar like normal, or insert rollbar.js source snippet here
```

## Verbose option

If you would like to see what is being sent to Rollbar in your console, use the
`verbose` option.

```js
var _rollbarConfig = {
  accessToken: "POST_CLIENT_ITEM_ACCESS_TOKEN",
  verbose: true, // This will now log to console.log, as well as Rollbar  
  captureUncaught: true,
  payload: {
    environment: "production"
  }
};
// init your rollbar like normal, or insert rollbar.js source snippet here
```

## Source Maps

If you minify your JavaScript in production, you'll want to configure source maps so you get meaningful stack traces. See the [source maps guide](https://rollbar.com/docs/guides_sourcemaps/) for instructions.

## Next steps

- [Configuration reference](https://rollbar.com/docs/notifier/rollbar.js/configuration)
- [API reference](https://rollbar.com/docs/notifier/rollbar.js/api)
- [Plugins](https://rollbar.com/docs/notifier/rollbar.js/plugins)
- [Examples](https://github.com/rollbar/rollbar.js/examples)
- [FAQ](https://rollbar.com/docs/notifier/rollbar.js/faq)

## Help / Support

If you run into any issues, please email us at [support@rollbar.com](mailto:support@rollbar.com)

You can also find us in IRC: [#rollbar on chat.freenode.net](irc://chat.freenode.net/rollbar)

For bug reports, please [open an issue on GitHub](https://github.com/rollbar/rollbar.js/issues/new).

## Developing

To set up a development environment, you'll need Node.js and npm.

1. `git submodule update --init`
2. `npm install -D`
3. `make`

To run the tests, run `make test`

## Contributing

1. [Fork it](https://github.com/rollbar/rollbar.js)
2. Create your feature branch (```git checkout -b my-new-feature```).
3. Commit your changes (```git commit -am 'Added some feature'```)
4. Push to the branch (```git push origin my-new-feature```)
5. Create new Pull Request
