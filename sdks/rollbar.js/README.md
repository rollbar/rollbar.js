# Rollbar notifier for JavaScript [![Build Status](https://api.travis-ci.org/rollbar/rollbar.js.png?branch=v2.0.0-alpha.1)](https://travis-ci.org/rollbar/rollbar.js)

<!-- Sub:[TOC] -->

## Quick start Browser

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
!function(r){function n(o){if(e[o])return e[o].exports;var t=e[o]={exports:{},id:o,loaded:!1};return r[o].call(t.exports,t,t.exports,n),t.loaded=!0,t.exports}var e={};return n.m=r,n.c=e,n.p="",n(0)}([function(r,n,e){"use strict";var o=e(1),t=e(4);_rollbarConfig=_rollbarConfig||{},_rollbarConfig.rollbarJsUrl=_rollbarConfig.rollbarJsUrl||"https://cdnjs.cloudflare.com/ajax/libs/rollbar.js/2.0.0-alpha.1/rollbar.min.js",_rollbarConfig.async=void 0===_rollbarConfig.async||_rollbarConfig.async;var a=o.Shim.init(window,_rollbarConfig),i=t(_rollbarConfig);window.rollbar=o.Rollbar,a.loadFull(window,document,!_rollbarConfig.async,_rollbarConfig,i)},function(r,n,e){"use strict";function o(r){return function(){try{return r.apply(this,arguments)}catch(r){try{console.error("[Rollbar]: Internal error",r)}catch(r){}}}}function t(r,n){this.options=r,this._rollbarOldOnError=null;var e=l++;this.shimId=function(){return e},window&&window._rollbarShims&&(window._rollbarShims[e]={handler:n,messages:[]})}function a(r){return o(function(){var n=this,e=Array.prototype.slice.call(arguments,0),o={shim:n,method:r,args:e,ts:new Date};window._rollbarShims[this.shimId()].messages.push(o)})}var i=e(2),l=0,s=e(3),c=function(r,n,e){return new t(r,e)},p=s.bind(null,c);t.init=function(r,n){var e=n.globalAlias||"Rollbar";if("object"==typeof r[e])return r[e];r._rollbarShims={},r._rollbarWrappedError=null;var t=new p(n);return o(function(){return n.captureUncaught&&(t._rollbarOldOnError=r.onerror,i.captureUncaughtExceptions(r,t,!0),i.wrapGlobals(r,t)),n.captureUnhandledRejections&&i.captureUnhandledRejections(r,t),r[e]=t,t})()},t.prototype.loadFull=function(r,n,e,t,a){var i=function(){var n;if(void 0===r._rollbarDidLoad){n=new Error("rollbar.js did not load");for(var e,o,t,i,l=0;e=r._rollbarShims[l++];)for(e=e.messages||[];o=e.shift();)for(t=o.args||[],l=0;l<t.length;++l)if(i=t[l],"function"==typeof i){i(n);break}}"function"==typeof a&&a(n)},l=!1,s=n.createElement("script"),c=n.getElementsByTagName("script")[0],p=c.parentNode;s.crossOrigin="",s.src=t.rollbarJsUrl,e||(s.async=!0),s.onload=s.onreadystatechange=o(function(){if(!(l||this.readyState&&"loaded"!==this.readyState&&"complete"!==this.readyState)){s.onload=s.onreadystatechange=null;try{p.removeChild(s)}catch(r){}l=!0,i()}}),p.insertBefore(s,c)},t.prototype.wrap=function(r,n){try{var e;if(e="function"==typeof n?n:function(){return n||{}},"function"!=typeof r)return r;if(r._isWrap)return r;if(!r._wrapped){r._wrapped=function(){try{return r.apply(this,arguments)}catch(n){throw"string"==typeof n&&(n=new String(n)),n._rollbarContext=e()||{},n._rollbarContext._wrappedSource=r.toString(),window._rollbarWrappedError=n,n}},r._wrapped._isWrap=!0;for(var o in r)r.hasOwnProperty(o)&&(r._wrapped[o]=r[o])}return r._wrapped}catch(n){return r}};for(var d="log,debug,info,warn,warning,error,critical,global,configure,handleUncaughtException,handleUnhandledRejection".split(","),u=0;u<d.length;++u)t.prototype[d[u]]=a(d[u]);r.exports={Shim:t,Rollbar:p}},function(r,n){"use strict";function e(r,n,e){if(r){var t;"function"==typeof n._rollbarOldOnError?t=n._rollbarOldOnError:r.onerror&&!r.onerror.belongsToShim&&(t=r.onerror,n._rollbarOldOnError=t);var a=function(){var e=Array.prototype.slice.call(arguments,0);o(r,n,t,e)};a.belongsToShim=!!e,r.onerror=a}}function o(r,n,e,o){r._rollbarWrappedError&&(o[4]||(o[4]=r._rollbarWrappedError),o[5]||(o[5]=r._rollbarWrappedError._rollbarContext),r._rollbarWrappedError=null),n.handleUncaughtException.apply(n,o),e&&e.apply(r,o)}function t(r,n,e){r&&(e&&"function"==typeof e._unhandledRejectionHandler&&r.removeEventListener("unhandledrejection",e._unhandledRejectionHandler),n._unhandledRejectionHandler=function(r){var e=r.reason,o=r.promise,t=r.detail;!e&&t&&(e=t.reason,o=t.promise),n.handleUnhandledRejection(e,o)},r.addEventListener("unhandledrejection",n._unhandledRejectionHandler))}function a(r,n){if(r){var e,o,t="EventTarget,Window,Node,ApplicationCache,AudioTrackList,ChannelMergerNode,CryptoOperation,EventSource,FileReader,HTMLUnknownElement,IDBDatabase,IDBRequest,IDBTransaction,KeyOperation,MediaController,MessagePort,ModalWindow,Notification,SVGElementInstance,Screen,TextTrack,TextTrackCue,TextTrackList,WebSocket,WebSocketWorker,Worker,XMLHttpRequest,XMLHttpRequestEventTarget,XMLHttpRequestUpload".split(",");for(e=0;e<t.length;++e)o=t[e],r[o]&&r[o].prototype&&i(n,r[o].prototype)}}function i(r,n){if(n.hasOwnProperty&&n.hasOwnProperty("addEventListener")){var e=n.addEventListener;n.addEventListener=function(n,o,t){e.call(this,n,r.wrap(o),t)};var o=n.removeEventListener;n.removeEventListener=function(r,n,e){o.call(this,r,n&&n._wrapped||n,e)}}}r.exports={captureUncaughtExceptions:e,captureUnhandledRejections:t,wrapGlobals:a}},function(r,n){"use strict";function e(r,n,t){this.impl=r(n,t,this),this.options=n,this.client=t,o(e.prototype)}function o(r){for(var n=function(r){return function(){var n=Array.prototype.slice.call(arguments,0);if(this.impl[r])return this.impl[r].apply(this.impl,n)}},e="log,debug,info,warn,warning,error,critical,global,configure,handleUncaughtException,handleUnhandledRejection,_createItem,wrap,loadFull,shimId".split(","),o=0;o<e.length;o++)r[e[o]]=n(e[o])}e.prototype._swapAndProcessMessages=function(r,n){this.impl=r(this.options,this.client);for(var e,o,t;e=n.shift();)o=e.method,t=e.args,this[o]&&"function"==typeof this[o]&&this[o].apply(this,t);return this},r.exports=e},function(r,n){"use strict";r.exports=function(r){return function(r){if(!r&&!window._rollbarInitialized){for(var n,e,o=o||{},t=o.globalAlias||"Rollbar",a=window.rollbar,i=function(r){return new a(r)},l=0;n=window._rollbarShims[l++];)e||(e=n.handler),n.handler._swapAndProcessMessages(i,n.messages);window[t]=e,window._rollbarInitialized=!0}}}}]);
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

(Advanced) For fine-grained control of the payload sent to the [Rollbar API](https://rollbar.com/docs/api/items_post/), you can override any keys by nesting
them in the configuration under the payload key:

```js
Rollbar.configure({payload: {fingerprint: "custom fingerprint to override grouping algorithm"}}).error(err);
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

## Angular 2

Setting the `captureUncaught` option to true will result in reporting all uncaught exceptions to
Rollbar by default. Additionally, one can catch any Angular 2 specific exceptions reported through the
`@angular/core/ErrorHandler` component by setting a custom `ErrorHandler` class:

```js
import Rollbar = require('rollbar');
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { AppComponent } from './app.component';

Rollbar.configure({
  accessToken: 'POST_CLIENT_ITEM_ACCESS_TOKEN',
  captureUncaught: true,
  captureUnhandledRejections: true,
});

export class RollbarErrorHandler implements ErrorHandler {
  handleError(err:any) : void {
    Rollbar.error(err.originalError || err);
  }
}

@NgModule({
  imports: [ BrowserModule ],
  declarations: [ AppComponent ],
  bootstrap: [ AppComponent ],
  providers: [ { provide: ErrorHandler, useClass: RollbarErrorHandler } ]
})
export class AppModule { }
```

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

## Quick Start Server

```js
var Rollbar = require('rollbar');
var rollbar = new Rollbar('POST_SERVER_ITEM_ACCESS_TOKEN', {
  handleUncaughtExceptions: true,
  handleUnhandledRejections: true
});

// log a generic message and send to rollbar
rollbar.log('Hello world!');
```
Setting the ```handleUncaughtExceptions``` option to true will register Rollbar as a handler for
any uncaught exceptions in your Node process.

Similarly, setting the ```handleUnhandledRejections``` option to true will register Rollbar as a
handler for any unhandled Promise rejections in your Node process.

<!-- RemoveNextIfProject -->
Be sure to replace ```POST_SERVER_ITEM_ACCESS_TOKEN``` with your project's ```post_server_item``` access token, which you can find in the Rollbar.com interface.

## Server Installation

Install using the node package manager, npm:

    $ npm install --save rollbar


## Server Configuration

### Using Express

```js
var express = require('express');
var Rollbar = require('rollbar');
var rollbar = new Rollbar('POST_SERVER_ITEM_ACCESS_TOKEN');

var app = express();

app.get('/', function(req, res) {
  // ...
});

// Use the rollbar error handler to send exceptions to your rollbar account
app.use(rollbar.errorHandler());

app.listen(6943);
```

### Using Hapi

```js
#!/usr/bin/env node

var Hapi = require('hapi');
var server = new Hapi.Server();
server.connection({ host:'localhost', port:8000 });

// Begin Rollbar initialization code
var Rollbar = require('rollbar');
var rollbar = new Rollbar('POST_SERVER_ITEM_ACCESS_TOKEN');
server.on('request-error', function(request, error) {
  // Note: before Hapi v8.0.0, this should be 'internalError' instead of 'request-error'
  var cb = function(rollbarErr) {
    if (rollbarErr)
      console.error('Error reporting to rollbar, ignoring: '+rollbarErr);
  };
  if (error instanceof Error)
    return rollbar.error(error, request, cb);
  rollbar.error('Error: '+error, 'error', request, cb);
});
// End Rollbar initialization code

server.route({
  method: 'GET',
  path:'/throw_error',
  handler: function (request, reply) {
    throw new Error('Example error manually thrown from route.');
  }
});
server.start(function(err) {
  if (err)
    throw err;
  console.log('Server running at:', server.info.uri);
}); 
```

### Standalone

In your main application, require and construct a rollbar instance using your access_token::

```js
var Rollbar = require("rollbar");
var rollbar = new Rollbar("POST_SERVER_ITEM_ACCESS_TOKEN");
```

Other options can be passed into the constructor using a second parameter. E.g.:

```js
// Configure the library to send errors to api.rollbar.com
new Rollbar("POST_SERVER_ITEM_ACCESS_TOKEN", {
  environment: "staging",
  endpoint: "https://api.rollbar.com/api/1/"
});
```

## Server Usage

### Caught exceptions

To report an exception that you have caught, use one of the named logging functions
(log/debug/info/warning/error/critical) depending on the level of severity of the exception.

```js
var Rollbar = require('rollbar');
var rollbar = new Rollbar('POST_SERVER_ITEM_ACCESS_TOKEN');

try {
  someCode();
} catch (e) {
  rollbar.error(e);

  // if you have a request object (or a function that returns one), pass it as the second arg
  // see below for details about what the request object is expected to be
  rollbar.error(e, request);

  // you can also pass a callback, which will be called upon success/failure
  rollbar.error(e, function(err2) {
    if (err2) {
      // an error occurred
    } else {
      // success
    }
  });

  // if you have a request and a callback, pass the callback last
  rollbar.error(e, request, callback);

  // to specify payload options - like extra data, or the level - pass a custom object as the third argument. The second argument must be a request or null
  rollbar.error(e, request, {level: "info"});
  rollbar.error(e, null, {level: "warning", custom: {someKey: "arbitrary value"}});

  // you can also pass a callback as the last argument
  rollbar.error(e, null, {level: "info"}, callback);
  rollbar.error(e, request, {level: "info"}, callback);
}
```

### Log messages

To report a string message, possibly along with additional context, use (log/debug/info/warning/error/critical) depending on the level of severity to attach to the message.

```js
var Rollbar = require('rollbar');
var rollbar = new Rollbar('POST_SERVER_ITEM_ACCESS_TOKEN');

// reports a string message at the default severity level ("error")
rollbar.log("Timeout connecting to database");


// reports a string message at the specified level, along with a request and callback
// only the first param is required
rollbar.debug("Response time exceeded threshold of 1s", request, callback);
rollbar.info("Response time exceeded threshold of 1s", request, callback);
rollbar.warning("Response time exceeded threshold of 1s", request, callback);
rollbar.error("Response time exceeded threshold of 1s", request, callback);
rollbar.critical("Response time exceeded threshold of 1s", request, callback);

// reports a string message along with additional data conforming to the Rollbar API Schema
// documented here: https://rollbar.com/docs/api/items_post/
rollbar.warning(
  "Response time exceeded threshold of 1s",
  request,
  {
    threshold: 1,
    timeElapsed: 2.3
  }, callback
);
```

### The Request Object

If your Node.js application is responding to web requests, you can send data about the current request along with each report to Rollbar. This will allow you to replay requests, track events by browser, IP address, and much more.

All of the logging methods accept a `request` parameter as the second argument.

If you're using Express, just pass the express request object. If you're using something custom, pass an object with these keys (all optional):

- `headers`: an object containing the request headers
- `protocol`: the request protocol (e.g. `"https"`)
- `url`: the URL starting after the domain name (e.g. `"/index.html?foo=bar"`)
- `method`: the request method (e.g. `"GET"`)
- `body`: the request body as a string
- `route`: an object containing a 'path' key, which will be used as the "context" for the event (e.g. `{"path": "home/index"}`)

Sensitive param names will be scrubbed from the request body and, if `scrubHeaders` is configured, headers. See the `scrubFields` and `scrubHeaders` configuration options for details.

### Person Tracking

If your application has authenticated users, you can track which user ("person" in Rollbar parlance) was associated with each event.

If you're using the [Passport](http://passportjs.org/) authentication library, this will happen automatically when you pass the request object (which will have "user" attached). Otherwise, attach one of these keys to the `request` object described in the previous section:

- `rollbar_person` or `user`: an object like `{"id": "123", "username": "foo", "email": "foo@example.com"}`. id is required, others are optional.
- `user_id`: the user id as an integer or string, or a function which when called will return the user id

Note: in Rollbar, the `id` is used to uniquely identify a person; `email` and `username` are supplemental and will be overwritten whenever a new value is received for an existing `id`. The `id` is a string up to 40 characters long.

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
