# Rollbar notifier for JavaScript [![Build Status](https://api.travis-ci.org/rollbar/rollbar.js.png?branch=v1.9.3)](https://travis-ci.org/rollbar/rollbar.js)

<!-- Sub:[TOC] -->

## Quick start

Copy-paste the following code into the ```<head>``` of every page you want to monitor. It should be as high as possible, before any other ```<script>``` tags.

<!-- RemoveNextIfProject -->
Be sure to replace ```POST_CLIENT_ITEM_ACCESS_TOKEN``` with your project's ```post_client_item``` access token, which you can find in the Rollbar.com interface. You can find this in your project settings ("Settings" link at the top of the Rollbar website) in the "Project Access Tokens" settings area.

<!-- EditableTextAreaStart -->
<!-- RemoveNext -->
```html
<script>
var _rollbarConfig = {
    accessToken: "POST_CLIENT_ITEM_ACCESS_TOKEN",
    captureUncaught: true,
    captureUnhandledRejections: true,
    payload: {
        environment: "production"
    }
};
// Rollbar Snippet
!function(r){function e(n){if(o[n])return o[n].exports;var t=o[n]={exports:{},id:n,loaded:!1};return r[n].call(t.exports,t,t.exports,e),t.loaded=!0,t.exports}var o={};return e.m=r,e.c=o,e.p="",e(0)}([function(r,e,o){"use strict";var n=o(1).Rollbar,t=o(2);_rollbarConfig.rollbarJsUrl=_rollbarConfig.rollbarJsUrl||"https://cdnjs.cloudflare.com/ajax/libs/rollbar.js/1.9.3/rollbar.min.js";var a=n.init(window,_rollbarConfig),i=t(a,_rollbarConfig);a.loadFull(window,document,!_rollbarConfig.async,_rollbarConfig,i)},function(r,e){"use strict";function o(r){return function(){try{return r.apply(this,arguments)}catch(r){try{console.error("[Rollbar]: Internal error",r)}catch(r){}}}}function n(r,e,o){window._rollbarWrappedError&&(o[4]||(o[4]=window._rollbarWrappedError),o[5]||(o[5]=window._rollbarWrappedError._rollbarContext),window._rollbarWrappedError=null),r.uncaughtError.apply(r,o),e&&e.apply(window,o)}function t(r){var e=function(){var e=Array.prototype.slice.call(arguments,0);n(r,r._rollbarOldOnError,e)};return e.belongsToShim=!0,e}function a(r){this.shimId=++c,this.notifier=null,this.parentShim=r,this._rollbarOldOnError=null}function i(r){var e=a;return o(function(){if(this.notifier)return this.notifier[r].apply(this.notifier,arguments);var o=this,n="scope"===r;n&&(o=new e(this));var t=Array.prototype.slice.call(arguments,0),a={shim:o,method:r,args:t,ts:new Date};return window._rollbarShimQueue.push(a),n?o:void 0})}function l(r,e){if(e.hasOwnProperty&&e.hasOwnProperty("addEventListener")){var o=e.addEventListener;e.addEventListener=function(e,n,t){o.call(this,e,r.wrap(n),t)};var n=e.removeEventListener;e.removeEventListener=function(r,e,o){n.call(this,r,e&&e._wrapped?e._wrapped:e,o)}}}var c=0;a.init=function(r,e){var n=e.globalAlias||"Rollbar";if("object"==typeof r[n])return r[n];r._rollbarShimQueue=[],r._rollbarWrappedError=null,e=e||{};var i=new a;return o(function(){if(i.configure(e),e.captureUncaught){i._rollbarOldOnError=r.onerror,r.onerror=t(i);var o,a,c="EventTarget,Window,Node,ApplicationCache,AudioTrackList,ChannelMergerNode,CryptoOperation,EventSource,FileReader,HTMLUnknownElement,IDBDatabase,IDBRequest,IDBTransaction,KeyOperation,MediaController,MessagePort,ModalWindow,Notification,SVGElementInstance,Screen,TextTrack,TextTrackCue,TextTrackList,WebSocket,WebSocketWorker,Worker,XMLHttpRequest,XMLHttpRequestEventTarget,XMLHttpRequestUpload".split(",");for(o=0;o<c.length;++o)a=c[o],r[a]&&r[a].prototype&&l(i,r[a].prototype)}return e.captureUnhandledRejections&&(i._unhandledRejectionHandler=function(r){var e=r.reason,o=r.promise,n=r.detail;!e&&n&&(e=n.reason,o=n.promise),i.unhandledRejection(e,o)},r.addEventListener("unhandledrejection",i._unhandledRejectionHandler)),r[n]=i,i})()},a.prototype.loadFull=function(r,e,n,t,a){var i=function(){var e;if(void 0===r._rollbarPayloadQueue){var o,n,t,i;for(e=new Error("rollbar.js did not load");o=r._rollbarShimQueue.shift();)for(t=o.args,i=0;i<t.length;++i)if(n=t[i],"function"==typeof n){n(e);break}}"function"==typeof a&&a(e)},l=!1,c=e.createElement("script"),p=e.getElementsByTagName("script")[0],s=p.parentNode;c.crossOrigin="",c.src=t.rollbarJsUrl,c.async=!n,c.onload=c.onreadystatechange=o(function(){if(!(l||this.readyState&&"loaded"!==this.readyState&&"complete"!==this.readyState)){c.onload=c.onreadystatechange=null;try{s.removeChild(c)}catch(r){}l=!0,i()}}),s.insertBefore(c,p)},a.prototype.wrap=function(r,e){try{var o;if(o="function"==typeof e?e:function(){return e||{}},"function"!=typeof r)return r;if(r._isWrap)return r;if(!r._wrapped){r._wrapped=function(){try{return r.apply(this,arguments)}catch(e){throw"string"==typeof e&&(e=new String(e)),e._rollbarContext=o()||{},e._rollbarContext._wrappedSource=r.toString(),window._rollbarWrappedError=e,e}},r._wrapped._isWrap=!0;for(var n in r)r.hasOwnProperty(n)&&(r._wrapped[n]=r[n])}return r._wrapped}catch(e){return r}};for(var p="log,debug,info,warn,warning,error,critical,global,configure,scope,uncaughtError,unhandledRejection".split(","),s=0;s<p.length;++s)a.prototype[p[s]]=i(p[s]);r.exports={Rollbar:a,_rollbarWindowOnError:n}},function(r,e){"use strict";r.exports=function(r,e){return function(o){if(!o&&!window._rollbarInitialized){var n=window.RollbarNotifier,t=e||{},a=t.globalAlias||"Rollbar",i=window.Rollbar.init(t,r);i._processShimQueue(window._rollbarShimQueue||[]),window[a]=i,window._rollbarInitialized=!0,n.processPayloads()}}}}]);
// End Rollbar Snippet
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

(Advanced) For fine-grained control of the payload sent to the [Rollbar API](https://rollbar.com/docs/api/items_post/), use `Rollbar.scope`:

```js
Rollbar.scope({fingerprint: "custom fingerprint to override grouping algorithm"}).error(err);
```

## UMD / Browserify / Requirejs / Webpack

rollbar.js is also distributed using UMD, so you can use it with browserify, requirejs, webpack, or anything else that uses AMD or CommonJS modules. See the [examples](https://github.com/rollbar/rollbar.js/tree/master/examples) for details.

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
  captureUnhandledRejections: false,
  payload: {
    environment: "production"
  }
};
// init your rollbar like normal, or insert rollbar.js source snippet here
```

## Handling uncaught rejections.

Rollbar.js supports the ability to catch and report unhandled Promise rejections, that is, Promise failures
that do not have a corresponding `.then(null, function(e) {})` handler.  This support is best used for handling
rejected `exceptions`, although rejected primitives will report (without a stack trace).

If you decide to use this option, you may also want to combine it the `checkIgnore`
[configuration](https://rollbar.com/docs/notifier/rollbar.js/configuration) option to filter 'noisy' rejections,
depending on the extent to which your application handles Promise failures, or rejects with alot of primitives.

## Verbose option

If you would like to see what is being sent to Rollbar in your console, use the
`verbose` option.

```js
var _rollbarConfig = {
  accessToken: "POST_CLIENT_ITEM_ACCESS_TOKEN",
  verbose: true, // This will now log to console.log, as well as Rollbar  
  captureUncaught: true,
  captureUnhandledRejections: false,
  payload: {
    environment: "production"
  }
};
// init your rollbar like normal, or insert rollbar.js source snippet here
```

## Synchronous option

By default, the snippet loads the full Rollbar source **asynchronously**. You can disable this which will cause the browser to download and evaluate the full rollbar source before evaluating the rest of the page.

More information can be found here: http://www.w3schools.com/tags/att_script_async.asp

```js
var _rollbarConfig = {
  ...
  async: false,
  ...
};
```

## Source Maps

If you minify your JavaScript in production, you'll want to configure source maps so you get meaningful stack traces. See the [source maps guide](https://rollbar.com/docs/source-maps/) for instructions.


## Dealing with adblocker / browser extension exceptions

Unfortunately, some very popular browser extensions may modify a user's copy of your website in such a way as
to break its functionality.  This can result in Rollbar reporting exceptions that are not a direct result
of your own code.  There are multiple approaches to dealing with this issue, the simplest of which is covered
 [in related documentation](https://github.com/rollbar/rollbar.js/tree/master/docs/extension-exceptions.md).

## Next steps

- [Configuration reference](https://rollbar.com/docs/notifier/rollbar.js/configuration)
- [API reference](https://rollbar.com/docs/notifier/rollbar.js/api)
- [Plugins](https://rollbar.com/docs/notifier/rollbar.js/plugins)
- [Examples](https://github.com/rollbar/rollbar.js/tree/master/examples)

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
