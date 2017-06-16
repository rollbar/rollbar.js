# Rollbar notifier for JavaScript [![Build Status](https://api.travis-ci.org/rollbar/rollbar.js.png?branch=v2.0.4)](https://travis-ci.org/rollbar/rollbar.js)

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
!function(r){function o(e){if(n[e])return n[e].exports;var t=n[e]={exports:{},id:e,loaded:!1};return r[e].call(t.exports,t,t.exports,o),t.loaded=!0,t.exports}var n={};return o.m=r,o.c=n,o.p="",o(0)}([function(r,o,n){"use strict";var e=n(1),t=n(4);_rollbarConfig=_rollbarConfig||{},_rollbarConfig.rollbarJsUrl=_rollbarConfig.rollbarJsUrl||"https://cdnjs.cloudflare.com/ajax/libs/rollbar.js/2.0.4/rollbar.min.js",_rollbarConfig.async=void 0===_rollbarConfig.async||_rollbarConfig.async;var a=e.setupShim(window,_rollbarConfig),l=t(_rollbarConfig);window.rollbar=e.Rollbar,a.loadFull(window,document,!_rollbarConfig.async,_rollbarConfig,l)},function(r,o,n){"use strict";function e(r){return function(){try{return r.apply(this,arguments)}catch(r){try{console.error("[Rollbar]: Internal error",r)}catch(r){}}}}function t(r,o){this.options=r,this._rollbarOldOnError=null;var n=s++;this.shimId=function(){return n},window&&window._rollbarShims&&(window._rollbarShims[n]={handler:o,messages:[]})}function a(r,o){var n=o.globalAlias||"Rollbar";if("object"==typeof r[n])return r[n];r._rollbarShims={},r._rollbarWrappedError=null;var t=new d(o);return e(function(){return o.captureUncaught&&(t._rollbarOldOnError=r.onerror,i.captureUncaughtExceptions(r,t,!0),i.wrapGlobals(r,t,!0)),o.captureUnhandledRejections&&i.captureUnhandledRejections(r,t,!0),r[n]=t,t})()}function l(r){return e(function(){var o=this,n=Array.prototype.slice.call(arguments,0),e={shim:o,method:r,args:n,ts:new Date};window._rollbarShims[this.shimId()].messages.push(e)})}var i=n(2),s=0,c=n(3),p=function(r,o){return new t(r,o)},d=c.bind(null,p);t.prototype.loadFull=function(r,o,n,t,a){var l=function(){var o;if(void 0===r._rollbarDidLoad){o=new Error("rollbar.js did not load");for(var n,e,t,l,i=0;n=r._rollbarShims[i++];)for(n=n.messages||[];e=n.shift();)for(t=e.args||[],i=0;i<t.length;++i)if(l=t[i],"function"==typeof l){l(o);break}}"function"==typeof a&&a(o)},i=!1,s=o.createElement("script"),c=o.getElementsByTagName("script")[0],p=c.parentNode;s.crossOrigin="",s.src=t.rollbarJsUrl,n||(s.async=!0),s.onload=s.onreadystatechange=e(function(){if(!(i||this.readyState&&"loaded"!==this.readyState&&"complete"!==this.readyState)){s.onload=s.onreadystatechange=null;try{p.removeChild(s)}catch(r){}i=!0,l()}}),p.insertBefore(s,c)},t.prototype.wrap=function(r,o){try{var n;if(n="function"==typeof o?o:function(){return o||{}},"function"!=typeof r)return r;if(r._isWrap)return r;if(!r._wrapped&&(r._wrapped=function(){try{return r.apply(this,arguments)}catch(e){var o=e;throw"string"==typeof o&&(o=new String(o)),o._rollbarContext=n()||{},o._rollbarContext._wrappedSource=r.toString(),window._rollbarWrappedError=o,o}},r._wrapped._isWrap=!0,r.hasOwnProperty))for(var e in r)r.hasOwnProperty(e)&&(r._wrapped[e]=r[e]);return r._wrapped}catch(o){return r}};for(var u="log,debug,info,warn,warning,error,critical,global,configure,handleUncaughtException,handleUnhandledRejection".split(","),f=0;f<u.length;++f)t.prototype[u[f]]=l(u[f]);r.exports={setupShim:a,Rollbar:d}},function(r,o){"use strict";function n(r,o,n){if(r){var t;"function"==typeof o._rollbarOldOnError?t=o._rollbarOldOnError:r.onerror&&!r.onerror.belongsToShim&&(t=r.onerror,o._rollbarOldOnError=t);var a=function(){var n=Array.prototype.slice.call(arguments,0);e(r,o,t,n)};a.belongsToShim=n,r.onerror=a}}function e(r,o,n,e){r._rollbarWrappedError&&(e[4]||(e[4]=r._rollbarWrappedError),e[5]||(e[5]=r._rollbarWrappedError._rollbarContext),r._rollbarWrappedError=null),o.handleUncaughtException.apply(o,e),n&&n.apply(r,e)}function t(r,o,n){if(r){"function"==typeof r._rollbarURH&&r._rollbarURH.belongsToShim&&r.removeEventListener("unhandledrejection",r._rollbarURH);var e=function(r){var n=r.reason,e=r.promise,t=r.detail;!n&&t&&(n=t.reason,e=t.promise),o&&o.handleUnhandledRejection&&o.handleUnhandledRejection(n,e)};e.belongsToShim=n,r._rollbarURH=e,r.addEventListener("unhandledrejection",e)}}function a(r,o,n){if(r){var e,t,a="EventTarget,Window,Node,ApplicationCache,AudioTrackList,ChannelMergerNode,CryptoOperation,EventSource,FileReader,HTMLUnknownElement,IDBDatabase,IDBRequest,IDBTransaction,KeyOperation,MediaController,MessagePort,ModalWindow,Notification,SVGElementInstance,Screen,TextTrack,TextTrackCue,TextTrackList,WebSocket,WebSocketWorker,Worker,XMLHttpRequest,XMLHttpRequestEventTarget,XMLHttpRequestUpload".split(",");for(e=0;e<a.length;++e)t=a[e],r[t]&&r[t].prototype&&l(o,r[t].prototype,n)}}function l(r,o,n){if(o.hasOwnProperty&&o.hasOwnProperty("addEventListener")){for(var e=o.addEventListener;e._rollbarOldAdd&&e.belongsToShim;)e=e._rollbarOldAdd;var t=function(o,n,t){e.call(this,o,r.wrap(n),t)};t._rollbarOldAdd=e,t.belongsToShim=n,o.addEventListener=t;for(var a=o.removeEventListener;a._rollbarOldRemove&&a.belongsToShim;)a=a._rollbarOldRemove;var l=function(r,o,n){a.call(this,r,o&&o._wrapped||o,n)};l._rollbarOldRemove=a,l.belongsToShim=n,o.removeEventListener=l}}r.exports={captureUncaughtExceptions:n,captureUnhandledRejections:t,wrapGlobals:a}},function(r,o){"use strict";function n(r,o){this.impl=r(o,this),this.options=o,e(n.prototype)}function e(r){for(var o=function(r){return function(){var o=Array.prototype.slice.call(arguments,0);if(this.impl[r])return this.impl[r].apply(this.impl,o)}},n="log,debug,info,warn,warning,error,critical,global,configure,handleUncaughtException,handleUnhandledRejection,_createItem,wrap,loadFull,shimId".split(","),e=0;e<n.length;e++)r[n[e]]=o(n[e])}n.prototype._swapAndProcessMessages=function(r,o){this.impl=r(this.options);for(var n,e,t;n=o.shift();)e=n.method,t=n.args,this[e]&&"function"==typeof this[e]&&this[e].apply(this,t);return this},r.exports=n},function(r,o){"use strict";r.exports=function(r){return function(o){if(!o&&!window._rollbarInitialized){r=r||{};for(var n,e,t=r.globalAlias||"Rollbar",a=window.rollbar,l=function(r){return new a(r)},i=0;n=window._rollbarShims[i++];)e||(e=n.handler),n.handler._swapAndProcessMessages(l,n.messages);window[t]=e,window._rollbarInitialized=!0}}}}]);
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

## Javascript Framework Support

### React

Rollbar.js supports React applications with no additional configuration required.  For apps using React 15.2 and later, production error messages are automatically decoded.

### Angular 1

The [community library](https://github.com/tandibar/ng-rollbar) which provides the machinery for
Angular 1 support has releases for the different versions of this Rollbar.js library. Those releases
lag behind releases to this library, but they are usually in sync.

### Angular 2

Setting the `captureUncaught` option to true will result in reporting all uncaught exceptions to
Rollbar by default. Additionally, one can catch any Angular 2 specific exceptions reported through the
`@angular/core/ErrorHandler` component by setting a custom `ErrorHandler` class:

```js
import * as Rollbar from 'rollbar';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { AppComponent } from './app.component';

const rollbarConfig = {
  accessToken: 'POST_CLIENT_ITEM_ACCESS_TOKEN',
  captureUncaught: true,
  captureUnhandledRejections: true,
};

@Injectable()
export class RollbarErrorHandler implements ErrorHandler {
  constructor(private injector: Injector) { }
  handleError(err:any) : void {
    var rollbar = this.injector.get(Rollbar);
    rollbar.error(err.originalError || err);
  }
}

@NgModule({
  imports: [ BrowserModule ],
  declarations: [ AppComponent ],
  bootstrap: [ AppComponent ],
  providers: [
    { provide: ErrorHandler, useClass: RollbarErrorHandler },
    { provide: Rollbar,
      useFactory: () => {
        return new Rollbar(rollbarConfig)
      }
    }
  ]
})
export class AppModule { }
```

### Ember

[ember-cli-rollbar](https://github.com/davewasmer/ember-cli-rollbar) is a community-maintained library that enables `Ember.Logger.error()` to be reported to Rollbar.

### Backbone.js

Rollbar.js supports Backbone.js with no additional configuration required.

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

## Handling uncaught rejections

Rollbar.js supports the ability to catch and report unhandled Promise rejections, that is, Promise failures
that do not have a corresponding `.then(null, function(e) {})` handler.  This support is best used for handling
rejected `exceptions`, although rejected primitives will report (without a stack trace).

If you decide to use this option, you may also want to combine it with the `checkIgnore`
[configuration](https://rollbar.com/docs/notifier/rollbar.js/#configuration-reference) option to filter 'noisy' rejections,
depending on the extent to which your application handles Promise failures, or rejects with a lot of primitives.

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

More information can be found here: http://www.w3schools.com/tags/att_script_async.asp and https://www.w3schools.com/tags/att_script_defer.asp

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

## Configuration Reference

### Configuration types

There are 2 types of configuration data -- context and payload. Context provides information about the environment of the error while payload describes information about the error itself.

#### Context

  - Information about the environment of the error being sent to Rollbar
  - e.g. server hostname, user's IP, custom fingerprint

#### Payload

  - Information about the error -- usually custom
  - e.g. The name of the javascript component that triggered the error

### Configuration levels

Rollbar can be configured at 3 different levels -- global, notifier and scope. All configuration is inherited at each level, so global configuration affects all notifiers while notifier configuration only affects the notifier being configured and any child notifiers created after the call to `configure()`.

#### Global configuration

  - Affects all notifiers
  - Set by calling `global()` on any notifier
  - Merges/updates previous configuration
  - Currently, the only supported options are `maxItems` and `itemsPerMinute`

#### Notifier configuration - context and/or payload

  - Affects only the notifier you call `configure()` on
  - Merges/updates previous configuration for the notifier you call `configure()` on

### Examples

#### Global

```js
// Only send a max of 5 items to Rollbar per minute
Rollbar.global({itemsPerMinute: 5});
```

#### Notifier

```js
// Set the top-level notifier's checkIgnore() function
Rollbar.configure({checkIgnore: function(isUncaught, args, payload) {
    // ignore all uncaught errors and all 'debug' items
    return isUncaught === true || payload.data.level === 'debug';
}});

// Set the environment, default log level and the context
Rollbar.configure({logLevel: 'info', payload: {environment: 'staging', context: 'home#index'}});
Rollbar.log('this will be sent with level="info"');

// Only send "error" or higher items to Rollbar
Rollbar.configure({reportLevel: 'error'});
Rollbar.info('this will not get reported to Rollbar since it\'s at the "info" level');

// Set the person information to be sent with all items to Rollbar
Rollbar.configure({payload: {person: {id: 12345, email: 'stewie@familyguy.com'}}});

// Add the following payload data to all items sent to Rollbar from this
// notifier or any created using window.Rollbar.scope()
Rollbar.configure({payload: {sessionId: "asdf12345"}});

// Scrub any payload keys/query parameters named 'creditCardNumber'
Rollbar.configure({scrubFields: ['creditCardNumber']});
```

### Reference

Both global and context configuration have the following reserved key names that Rollbar uses to aggregate, notifiy and display.

#### Global

  <dl>
<dt>itemsPerMinute
</dt>
<dd>Max number of items to report per minute. The limit counts uncaught errors (reported through `window.onerror`) and any direct calls to `Rollbar.log/debug/info/warning/error/critical()`. This is intended as a sanity check against infinite loops, but if you're using Rollbar heavily for logging, you may want to increase this.

If you would like to remove this limit, set it to `undefined`.

Default: `60`
</dd>

<dt>maxItems
</dt>
<dd>Max number of items to report per page load. When this limit is reached, an additional item will be reported stating that the limit was reached. Like `itemsPerMinute`, this limit counts uncaught errors (reported through ```window.onerror```) and any direct calls to ```Rollbar.log/debug/info/warning/error/critical()```.

Default: ```0``` (no limit)
</dd>
</dl>

### Context

  <dl>

<dt>checkIgnore
</dt>
<dd>An optional function that will be used to ignore uncaught exceptions based on its return value. The function signature should be: ```function checkIgnore(isUncaught, args, payload) { ... }``` and should return ```true``` if the error should be ignored.

Default: ```null```

- isUncaught: ```true``` if the error being reported is from the ```window.onerror``` hook.
- args: The arguments to ```Rollbar.log/debug/info/warning/error/critical()```.  In the case of unhandled rejections, the last parameter is originating `Promise`.
- payload: The javascript object that is about to be sent to Rollbar. This will contain all of the context and payload information for this notifier and error. This parameter is useful for advanced ignore functionality.
</dd>

<dt>enabled
</dt>
<dd>If set to ```false```, no data will be sent to Rollbar for this notifier.
  Note: callbacks for errors will not be called if this is set to ```false```.

Default: ```true```
</dd>

<dt>hostWhiteList
</dt>
<dd>Check payload frames for white listed domains. This is an array of strings, each of which get compiled to a `Regexp`. If no file in the trace matches one of these domains the payload is ignored.
</dd>

<dt>logLevel
</dt>
<dd>The severity level used for calls to ```Rollbar.log()```. One of ```"critical"```, ```"error"```, ```"warning"```, ```"info"```, ```"debug"```.

Default: ```"debug"```
</dd>

<dt>reportLevel
</dt>
<dd>Used to filter out which messages will get reported to Rollbar. If set to ```"error"```, only ```"error"``` or higher serverity level items will be sent to Rollbar.

Default: ```"warning"```
</dd>

<dt>scrubFields
</dt>
<dd>A list containing names of keys/fields/query parameters to scrub. Scrubbed fields will be normalized to all `*` before being reported to Rollbar. This is useful for sensitive information that you do not want to send to Rollbar. e.g. User tokens

Default: ```["passwd", "password", "secret", "confirm_password", "password_confirmation"]```
</dd>

<dt>transform
</dt>
<dd>Optional function to modify the payload before sending to Rollbar.

Default: ```null```

```javascript
// For example:
// Set a custom fingerprint
var transformer = function(payload) {
  payload.data.fingerprint = 'my custom fingerprint';
};

Rollbar.configure({transform: transformer});
// OR
var _rollbarConfig = {
  // ...
  transform: transformer
};
```
</dd>

<dt>uncaughtErrorLevel
</dt>
<dd>The severity level used when uncaught errors are reported to Rollbar.

Default: ```"error"```
</dd>

<dt>endpoint
</dt>
<dd>The url to which items get POSTed. This is mostly relevant to our enterprise customers. You will, however, need this if you're proxying the requests through your own server, or you're an enterprise customer.

Default: ```'https://api.rollbar.com/api/1/'```
</dd>
</dl>

### Payload

These keys should all be within the `payload` key.

e.g.

```js
Rollbar.configure({
  payload: {
    person: ...,
    context: ...
  }
});
```

  <dl>

<dt>person
</dt>
<dd>An object identifying the logged-in user, containing an ```id``` (required), and optionally a ```username``` and ```email``` (all strings). Passing this will allow you to see which users were affected by particular errors, as well as all the errors that a particular user experienced.
</dd>

<dt>context
</dt>
<dd>Name of the page context -- i.e. route name, url, etc. Can be used in the Rollbar interface to search for items by context prefix.
</dd>

<dt>client
</dt>
<dd>
  An object describing properties of the client device reporting the error.

  This object should have a key that points to another object, ```javascript``` which describes properties of the javascript code/environment to Rollbar.

  ```client.javascript``` supports the following properties:
</dd>

  <dl>
<dt>code_version
</dt>
<dd>Version control number (i.e. git SHA) of the current revision. Used for linking filenames in stacktraces to GitHub.
</dd>

<dt>source_map_enabled
</dt>
<dd>When `true`, the Rollbar service will attempt to find and apply source maps to all frames in the stack trace.

Default: ```false```

</dd>

<dt>guess_uncaught_frames
</dt>
<dd>When `true`, the Rollbar service will attempt to apply source maps to frames even if they are missing column numbers. Works best when the minified javascript file is generated using newlines instead of semicolons.

Default: ```false```
</dd>

  E.g.

```js
Rollbar.configure({
  scrubFields: ["creditCard"], // "creditCard" will be added to the list of default scrubFields
  payload: {
    client: {
      javascript: {
        code_version: "ce0227180bd7429fde128f6ef8fad77396d8fbd4",  // Git SHA of your deployed code
        source_map_enabled: true,
        guess_uncaught_frames: true
      }
    }
  }
});
```

</dl>

<dt>server
</dt>
<dd>
  An object describing properties of the server that was used to generate the page the notifier is reporting on.

  The following properties are supported:

  <dl>
<dt>branch
</dt>
<dd>The name of the branch of the code that is running. Used for linking filenames in stacktraces to GitHub.

Default: ```"master"```

</dd>

<dt>host
</dt>
<dd>The hostname of the machine that rendered the page

e.g. ```"web1.mysite.com"```

e.g. in Python, use ```socket.gethostname()```

</dd>

</dl>

  E.g.

```js
Rollbar.configure({
  logLevel: "warning", // Rollbar.log() will be sent with a level = "warning"
  payload: {
    server: {
      branch: "master",
      host: "web1.mysite.com"
    }
  }
});

```

</dd>

</dl>


### More info

Check out the API reference below for more information on how to use ```global/configure/scope()```.


## API Reference

### Rollbar.global()

(See the section on configuration above.)

_Note_: This method will update any existing global configuration.

__Returns__: `undefined`

__Params__

1. options: `Object` - A javascript object that contains global configuration.


### Rollbar.configure()

(See the section on [configuration](https://rollbar.com/docs/notifier/rollbar.js/#configuration-reference).)

_Note_: This method will update any existing configuration for the `Rollbar` instance used.

__Returns__: `undefined`

__Params__

1. options: `Object` - A javascript object that contains the notifier configuration.


### Rollbar.handleUncaughtException()

This method is used to record uncaught exceptions from `window.onerror`. The Rollbar snippet will set `window.onerror = Rollbar.uncaughtError` if it was configured to do so via the `captureUncaught` config parameter given to the constructor of this Rollbar instance.

__Returns__: `undefined`

__Params__

1. message: `String`: The error message.
1. url: `String`: url that the error occurred on.
1. lineNo: `Integer`: The line number, (if known) that the error occurred on.
1. colNo: `Integer`: The column number that the error occurred on.
    1. _Note_: Only newer browsers provide this variable.
1. err: `Exception`: The exception that caused the `window.onerror` event to occur.
    1. _Note_: Only newer browsers provide this variable.


### Rollbar.handleUnhandledRejection()

This method is used to record unhandled Promise rejections via the window event `unhandledrejection`.  Many promise
libraries, including Bluebird, lie, and native Promise support (Chrome only currently, but it is a [standard to be
built upon](https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onunhandledrejection)).

To enable this handling, you should provide `captureUnhandledRejections` to the config given to this Rollbar constructor.

__Returns__: `undefined`

__Params__

1. message: `Exception`: The exception, or rejection being rejected.
1. promise: `Promise`: The originating promise object.

### Rollbar.log()

Log a message and potentially send it to Rollbar. The level that the message or error is logged at is determined by the `logLevel` config option.

In order for the message to be sent to Rollbar, the log level must be greater than or equal to the `reportLevel` config option.

See [configuration](https://rollbar.com/docs/notifier/rollbar.js/#configuration-reference) for more information on configuring log levels.

__Returns__: `undefined`

__Params__

_Note_: order does not matter

- message: `String` - The message to send to Rollbar.
- err: `Exception` - The exception object to send.
- custom: `Object` - The custom payload data to send to Rollbar.
- callback: `Function` - The function to call once the message has been sent to Rollbar.

#### Examples

##### Log a debug message

```js
// By default, the .log() method uses the
// "debug" log level and "warning" report level
// so this message will not be sent to Rollbar.
Rollbar.log("hello world!");
```

##### Log a warning along with custom data

```js
Rollbar.configure({logLevel: "warning"});
Rollbar.log("Uh oh! The user pressed the wrong button.", {buttonId: "redButton"});
```

#### Log a debug message along with an error

```js
try {
  foo();
} catch (e) {
  Rollbar.log("Caught an exception", e);
}
```

##### Log an error and call a function when the error is reported to Rollbar

```js
Rollbar.configure({logLevel: "error"});

function continueFormSubmission() {
  // ...
}

try {
  foo();
  continueFormSubmission();
} catch (e) {
  Rollbar.log(e, continueFormSubmission);
}
```


### Rollbar.debug/ info/ warn/ warning/ error/ critical()

These methods are all shorthand for `Rollbar.log()` with the appropriate log level set.


## Plugins

### jQuery

If you use jQuery 1.7 and up, you can include a plugin script that will instrument jQuery to wrap any functions passed into jQuery's ready(), on() and off() to catch errors and report them to Rollbar. To install this plugin, copy the following snippet into your pages, making sure it is BELOW the `<script>` tag where jQuery is loaded:

<!-- EditableTextAreaStart -->
<!-- RemoveNext -->
```html
<script>
// Rollbar jQuery Snippet
!function(r){function t(n){if(e[n])return e[n].exports;var a=e[n]={exports:{},id:n,loaded:!1};return r[n].call(a.exports,a,a.exports,t),a.loaded=!0,a.exports}var e={};return t.m=r,t.c=e,t.p="",t(0)}([function(r,t,e){"use strict";!function(r,t,e){var n=t.Rollbar;if(n){var a="0.0.8";n.configure({payload:{notifier:{plugins:{jquery:{version:a}}}}});var o=function(r){if(n.error(r),t.console){var e="[reported to Rollbar]";n.options&&!n.options.enabled&&(e="[Rollbar not enabled]"),t.console.log(r.message+" "+e)}};r(e).ajaxError(function(r,t,e,a){var o=t.status,u=e.url,i=e.type;if(o){var s={status:o,url:u,type:i,isAjax:!0,data:e.data,jqXHR_responseText:t.responseText,jqXHR_statusText:t.statusText},d=a?a:"jQuery ajax error for "+i;n.warning(d,s)}});var u=r.fn.ready;r.fn.ready=function(r){return u.call(this,function(t){try{r(t)}catch(r){o(r)}})};var i=r.event.add;r.event.add=function(t,e,n,a,u){var s,d=function(r){return function(){try{return r.apply(this,arguments)}catch(r){o(r)}}};return n.handler?(s=n.handler,n.handler=d(n.handler)):(s=n,n=d(n)),s.guid?n.guid=s.guid:n.guid=s.guid=r.guid++,i.call(this,t,e,n,a,u)}}}(jQuery,window,document)}]);
// End Rollbar jQuery Snippet
</script>
```
<!-- RemovePrev -->
<!-- EditableTextAreaEnd -->

The plugin will also automatically report any AJAX errors using jQuery's `ajaxError()` handler. You can disable this functionality by configuring the Rollbar notifier with the following:
```javascript
window.Rollbar.configure({
  plugins: {
    jquery: {
      ignoreAjaxErrors: true
    }
  }
});
```


## Using inside an embedded component

Sometimes you want to include Rollbar inside a component that is intended to be used on someone
else's site. To do this, you do not want to interfer with an existing Rollbar integration on the
containing site. Moreover, you would like unhandled exceptions to be available to both Rollbar
instances with the ability to use the configuration options to filter out exceptions you might not
be interested in.

The way that Rollbar typically operates is to load a shimmed version of the library via the snippet
listed above in the head of your page. This allows us to capture errors as soon as possible rather
than other libraries which only can start catching exceptions once their full library has loaded
asyncronously. This shimmed version of the library assumes the global `_rollbarConfig` variable and
uses this to configure things and handle setup after the full library has downloaded. In order for
multiple independent components to load Rollbar, only one can effectively use this snippet plus
global variable approach. Therefore, we provide the bundles: `/dist/rollbar.noconflict.umd.js` and
`/dis/rollbar.noconflict.umd.min.js`. To use these, you most likely want to use something like
Webpack to bundle your code, and then use:

```js
var rollbar = require('rollbar/dist/rollbar.noconflict.umd');
var Rollbar = new rollbar({
    accessToken: "POST_CLIENT_ITEM_ACCESS_TOKEN",
    captureUncaught: true,
    captureUnhandledRejections: true,
    payload: {
        environment: "some-embedded-component"
    }
});
```

The require will not have side effects on globals (unless it is the first instance of a Rollbar
library being loaded which will then set up an initial timestamp on the window if possible). The
construction of the Rollbar object with the `captureUncaught` and/or `captureUnhandledRejections`
configuration options set to true will cause handlers to be added to the global error handling
mechanisms on the window. Note that this will cause errors to be delivered to your instance of
Rollbar as well as any other instances on the page (so you might get errors for someone else's
code).


## Examples

See [here](https://github.com/rollbar/rollbar.js/tree/master/examples) for some examples of how to use rollbar.js with Bower, Browserify, RequireJS, Webpack, and others.

## Quick Start Server

The recommended way to use the rollbar constructor is to pass an object which
represents the configuration options with at least the one required
key `accessToken` with the value equal to your
`POST_SERVER_ITEM_ACCESS_TOKEN`. If you do not want to pass any configuration options, then for
convenience, you can simply pass just the access token as a string as the only argument to the
constructor.

```js
var Rollbar = require('rollbar');
var rollbar = new Rollbar({
  accessToken: 'POST_SERVER_ITEM_ACCESS_TOKEN',
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
  rollbar.error('Error: '+error, request, cb);
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

Other options can be passed into the constructor as a collection. E.g.:

```js
// Configure the library to send errors to api.rollbar.com
new Rollbar({
  accessToken: "POST_SERVER_ITEM_ACCESS_TOKEN",
  environment: "staging",
  endpoint: "https://api.rollbar.com/api/1/"
});
```

## Server Usage

### Rollbar.log()

Log a message and potentially send it to Rollbar. The level that the message or error is logged at is determined by the `logLevel` config option.

In order for the message to be sent to Rollbar, the log level must be greater than or equal to the `reportLevel` config option.

See [configuration](https://rollbar.com/docs/notifier/rollbar.js/#configuration-reference) for more information on configuring log levels.

__Returns__: `undefined`

__Params__

_Note_: order does not matter, however the first `Object` that contains at least one key from the list under `request` will be considered a request object.

- message: `String` - The message to send to Rollbar.
- err: `Exception` - The exception object to send.
- custom: `Object` - The custom payload data to send to Rollbar.
- callback: `Function` - The function to call once the message has been sent to Rollbar.
- request: `Object` - A request object containing at least one of these optional keys:
  - `headers`: an object containing the request headers
  - `protocol`: the request protocol (e.g. `"https"`)
  - `url`: the URL starting after the domain name (e.g. `"/index.html?foo=bar"`)
  - `method`: the request method (e.g. `"GET"`)
  - `body`: the request body as a string
  - `route`: an object containing a 'path' key, which will be used as the "context" for the event (e.g. `{"path": "home/index"}`)

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

  // if you have a request object (or a function that returns one), pass it in
  rollbar.error(e, request);

  // you can also pass a callback, which will be called upon success/failure
  rollbar.error(e, function(err2) {
    if (err2) {
      // an error occurred
    } else {
      // success
    }
  });

  // pass a request and a callback
  rollbar.error(e, request, callback);

  // to specify payload options - like extra data, or the level - pass a custom object
  rollbar.error(e, request, {level: "info"});

  // you can also pass a callback
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

All of the logging methods accept a `request` parameter.

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

## Upgrading from node_rollbar

The upgrade path from `node_rollbar` version 0.6.4 to version 2.0.0 of this library is not
automatic, but it should be straightforward. The main changes are related to naming, however we also
changed the library from being a singleton to being used via individual instances. As we have said
above, the recommended way to use the constructor is to pass an object which represents
the configuration options with the access token contained within. The old style was to always pass the
access token as the first parameter, we permit this style for convenience when no other options are
necessary to ease the migration path, but for new code one should use an object as the only argument.

Old:

```js
var rollbar = require("rollbar");
rollbar.init("POST_SERVER_ITEM_ACCESS_TOKEN");
rollbar.reportMessage("Hello world!");
```

New:

```js
var Rollbar = require("rollbar");
var rollbar = new Rollbar("POST_SERVER_ITEM_ACCESS_TOKEN");
rollbar.log("Hello world!");
```

- Instead of importing the library as a singleton upon which you act, you are now importing a
  constructor.
- The constructor is a function of the form `function (options)` where options is an
  object with the same configuration options as before, and also requires a key `accessToken` with
  your access token as the value.
- `reportMessage`, `reportMessageWithPayloadData`, `handleError`, and `handleErrorWithPayloadData`
  are all deprecated in favor of: log/debug/info/warning/error/critical
- Each of these new logging functions can be called with any of the following sets of arguments:
  - message/error, callback
  - message/error, request
  - message/error, request, callback
  - message/error, request, custom
  - message/error, request, custom, callback
- In other words, the first arugment can be a string or an exception, the type of which will be used
  to subsequently construct the payload. The last argument can be a callback or the callback can be
  omitted. The second argument must be a request or null (or a callback if only two arguments are
  present). The third argument is treated as extra custom data which will be sent along with the
  payload. Note that to include custom data and no request, you must pass null for the second
  argument.

The other major change is that if you wish to capture uncaught exceptions and unhandled rejections,
you now use a configuration option.

Old:

```js
rollbar.handleUncaughtExceptionsAndRejections("POST_SERVER_ITEM_ACCESS_TOKEN", options);
```

New:

```js
var rollbar = new Rollbar({
  accessToken: "POST_SERVER_ITEM_ACCESS_TOKEN",
  handleUncaughtExceptions: true,
  handleUnhandledRejections: true
});

```

We have also changed the `minimumLevel` configuration option to `reportLevel` in order to match the
configuration option currently in use by the browserjs library.

Now that we have said the above, because of how one might be using the library currently, converting
to not use a singleton may be problematic. Therefore, we provide a convenient interface to what is
essentially a singleton managed by the library. First, you would use this code somewhere before any
other instances of rollbar are required or used:

```js
const Rollbar = require('rollbar');

const rollbar = Rollbar.init({
  accessToken: "POST_SERVER_ITEM_ACCESS_TOKEN",
  handleUncaughtExceptions: true
});
```

Then, in other places, you can use:

```js
const Rollbar = require('rollbar');

Rollbar.log('hello world');
```

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
