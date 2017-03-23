# Rollbar notifier for JavaScript [![Build Status](https://api.travis-ci.org/rollbar/rollbar.js.png?branch=v2.0.0)](https://travis-ci.org/rollbar/rollbar.js)

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
!function(r){function n(t){if(e[t])return e[t].exports;var o=e[t]={exports:{},id:t,loaded:!1};return r[t].call(o.exports,o,o.exports,n),o.loaded=!0,o.exports}var e={};return n.m=r,n.c=e,n.p="",n(0)}([function(r,n,e){"use strict";var t=e(1),o=e(4);_rollbarConfig=_rollbarConfig||{},_rollbarConfig.rollbarJsUrl=_rollbarConfig.rollbarJsUrl||"https://cdnjs.cloudflare.com/ajax/libs/rollbar.js/2.0.0/rollbar.min.js",_rollbarConfig.async=void 0===_rollbarConfig.async||_rollbarConfig.async;var a=t.init(window,_rollbarConfig),i=o(_rollbarConfig);a.loadFull(window,document,!_rollbarConfig.async,_rollbarConfig,i)},function(r,n,e){"use strict";function t(r){return function(){try{return r.apply(this,arguments)}catch(r){try{console.error("[Rollbar]: Internal error",r)}catch(r){}}}}function o(r,n){this.options=r,this._rollbarOldOnError=null;var e=l++;this.shimId=function(){return e},window&&window._rollbarShims&&(window._rollbarShims[e]={handler:n,messages:[]})}function a(r){return t(function(){var n=this,e=Array.prototype.slice.call(arguments,0),t={shim:n,method:r,args:e,ts:new Date};window._rollbarShims[this.shimId()].messages.push(t)})}var i=e(2),l=0,s=e(3),c=function(r,n,e){return new o(r,e)},p=s.bind(null,c);o.init=function(r,n){var e=n.globalAlias||"Rollbar";if("object"==typeof r[e])return r[e];r._rollbarShims={},r._rollbarWrappedError=null;var o=new p(n);return t(function(){return n.captureUncaught&&(o._rollbarOldOnError=r.onerror,i.captureUncaughtExceptions(r,o,!0),i.wrapGlobals(r,o)),n.captureUnhandledRejections&&i.captureUnhandledRejections(r,o),r[e]=o,o})()},o.prototype.loadFull=function(r,n,e,o,a){var i=function(){var n;if(void 0===r._rollbarDidLoad){n=new Error("rollbar.js did not load");for(var e,t,o,i,l=0;e=r._rollbarShims[l++];)for(e=e.messages||[];t=e.shift();)for(o=t.args||[],l=0;l<o.length;++l)if(i=o[l],"function"==typeof i){i(n);break}}"function"==typeof a&&a(n)},l=!1,s=n.createElement("script"),c=n.getElementsByTagName("script")[0],p=c.parentNode;s.crossOrigin="",s.src=o.rollbarJsUrl,e||(s.async=!0),s.onload=s.onreadystatechange=t(function(){if(!(l||this.readyState&&"loaded"!==this.readyState&&"complete"!==this.readyState)){s.onload=s.onreadystatechange=null;try{p.removeChild(s)}catch(r){}l=!0,i()}}),p.insertBefore(s,c)},o.prototype.wrap=function(r,n){try{var e;if(e="function"==typeof n?n:function(){return n||{}},"function"!=typeof r)return r;if(r._isWrap)return r;if(!r._wrapped){r._wrapped=function(){try{return r.apply(this,arguments)}catch(n){throw"string"==typeof n&&(n=new String(n)),n._rollbarContext=e()||{},n._rollbarContext._wrappedSource=r.toString(),window._rollbarWrappedError=n,n}},r._wrapped._isWrap=!0;for(var t in r)r.hasOwnProperty(t)&&(r._wrapped[t]=r[t])}return r._wrapped}catch(n){return r}};for(var d="log,debug,info,warn,warning,error,critical,global,configure,handleUncaughtException,handleUnhandledRejection".split(","),u=0;u<d.length;++u)o.prototype[d[u]]=a(d[u]);r.exports=o},function(r,n){"use strict";function e(r,n,e){if(r){var o;"function"==typeof n._rollbarOldOnError?o=n._rollbarOldOnError:r.onerror&&!r.onerror.belongsToShim&&(o=r.onerror,n._rollbarOldOnError=o);var a=function(){var e=Array.prototype.slice.call(arguments,0);t(r,n,o,e)};a.belongsToShim=!!e,r.onerror=a}}function t(r,n,e,t){r._rollbarWrappedError&&(t[4]||(t[4]=r._rollbarWrappedError),t[5]||(t[5]=r._rollbarWrappedError._rollbarContext),r._rollbarWrappedError=null),n.handleUncaughtException.apply(n,t),e&&e.apply(r,t)}function o(r,n,e){r&&(e&&"function"==typeof e._unhandledRejectionHandler&&r.removeEventListener("unhandledrejection",e._unhandledRejectionHandler),n._unhandledRejectionHandler=function(r){var e=r.reason,t=r.promise,o=r.detail;!e&&o&&(e=o.reason,t=o.promise),n.handleUnhandledRejection(e,t)},r.addEventListener("unhandledrejection",n._unhandledRejectionHandler))}function a(r,n){if(r){var e,t,o="EventTarget,Window,Node,ApplicationCache,AudioTrackList,ChannelMergerNode,CryptoOperation,EventSource,FileReader,HTMLUnknownElement,IDBDatabase,IDBRequest,IDBTransaction,KeyOperation,MediaController,MessagePort,ModalWindow,Notification,SVGElementInstance,Screen,TextTrack,TextTrackCue,TextTrackList,WebSocket,WebSocketWorker,Worker,XMLHttpRequest,XMLHttpRequestEventTarget,XMLHttpRequestUpload".split(",");for(e=0;e<o.length;++e)t=o[e],r[t]&&r[t].prototype&&i(n,r[t].prototype)}}function i(r,n){if(n.hasOwnProperty&&n.hasOwnProperty("addEventListener")){var e=n.addEventListener;n.addEventListener=function(n,t,o){e.call(this,n,r.wrap(t),o)};var t=n.removeEventListener;n.removeEventListener=function(r,n,e){t.call(this,r,n&&n._wrapped||n,e)}}}r.exports={captureUncaughtExceptions:e,captureUnhandledRejections:o,wrapGlobals:a}},function(r,n){"use strict";function e(r,n,o){this.impl=r(n,o,this),this.options=n,this.client=o,t(e.prototype)}function t(r){for(var n=function(r){return function(){var n=Array.prototype.slice.call(arguments,0);if(this.impl[r])return this.impl[r].apply(this.impl,n)}},e="log,debug,info,warn,warning,error,critical,global,configure,handleUncaughtException,handleUnhandledRejection,_createItem,wrap,loadFull,shimId".split(","),t=0;t<e.length;t++)r[e[t]]=n(e[t])}e.prototype._swapAndProcessMessages=function(r,n){this.impl=r(this.options,this.client);for(var e,t,o;e=n.shift();)t=e.method,o=e.args,this[t]&&"function"==typeof this[t]&&this[t].apply(this,o);return this},r.exports=e},function(r,n){"use strict";r.exports=function(r){return function(r){if(!r&&!window._rollbarInitialized){for(var n,e,t=t||{},o=t.globalAlias||"Rollbar",a=window._rollbar,i=function(r){return new a(r)},l=0;n=window._rollbarShims[l++];)e||(e=n.handler),n.handler._swapAndProcessMessages(i,n.messages);window[o]=e,window._rollbarInitialized=!0}}}}]);
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
