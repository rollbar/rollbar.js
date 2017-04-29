# Rollbar notifier for JavaScript [![Build Status](https://api.travis-ci.org/rollbar/rollbar.js.png?branch=v1.9.4)](https://travis-ci.org/rollbar/rollbar.js)

<!-- Sub:[TOC] -->

**Note**: The latest version published on NPM is an alpha version which is still undergoing testing. The docs for the v2 alpha version can be found [here](https://github.com/rollbar/rollbar.js/blob/universal/README.md) and will be merged into master once v2 goes out of alpha. If you wish to use the non-alpha version, you can pin the Rollbar dependency at v1:

```
npm install rollbar-browser@^1.9.4 --save
```

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
!function(r){function e(n){if(o[n])return o[n].exports;var t=o[n]={exports:{},id:n,loaded:!1};return r[n].call(t.exports,t,t.exports,e),t.loaded=!0,t.exports}var o={};return e.m=r,e.c=o,e.p="",e(0)}([function(r,e,o){"use strict";var n=o(1).Rollbar,t=o(2);_rollbarConfig.rollbarJsUrl=_rollbarConfig.rollbarJsUrl||"https://cdnjs.cloudflare.com/ajax/libs/rollbar.js/1.9.4/rollbar.min.js";var a=n.init(window,_rollbarConfig),i=t(a,_rollbarConfig);a.loadFull(window,document,!_rollbarConfig.async,_rollbarConfig,i)},function(r,e){"use strict";function o(r){return function(){try{return r.apply(this,arguments)}catch(r){try{console.error("[Rollbar]: Internal error",r)}catch(r){}}}}function n(r,e,o){window._rollbarWrappedError&&(o[4]||(o[4]=window._rollbarWrappedError),o[5]||(o[5]=window._rollbarWrappedError._rollbarContext),window._rollbarWrappedError=null),r.uncaughtError.apply(r,o),e&&e.apply(window,o)}function t(r){var e=function(){var e=Array.prototype.slice.call(arguments,0);n(r,r._rollbarOldOnError,e)};return e.belongsToShim=!0,e}function a(r){this.shimId=++c,this.notifier=null,this.parentShim=r,this._rollbarOldOnError=null}function i(r){var e=a;return o(function(){if(this.notifier)return this.notifier[r].apply(this.notifier,arguments);var o=this,n="scope"===r;n&&(o=new e(this));var t=Array.prototype.slice.call(arguments,0),a={shim:o,method:r,args:t,ts:new Date};return window._rollbarShimQueue.push(a),n?o:void 0})}function l(r,e){if(e.hasOwnProperty&&e.hasOwnProperty("addEventListener")){var o=e.addEventListener;e.addEventListener=function(e,n,t){o.call(this,e,r.wrap(n),t)};var n=e.removeEventListener;e.removeEventListener=function(r,e,o){n.call(this,r,e&&e._wrapped?e._wrapped:e,o)}}}var c=0;a.init=function(r,e){var n=e.globalAlias||"Rollbar";if("object"==typeof r[n])return r[n];r._rollbarShimQueue=[],r._rollbarWrappedError=null,e=e||{};var i=new a;return o(function(){if(i.configure(e),e.captureUncaught){i._rollbarOldOnError=r.onerror,r.onerror=t(i);var o,a,c="EventTarget,Window,Node,ApplicationCache,AudioTrackList,ChannelMergerNode,CryptoOperation,EventSource,FileReader,HTMLUnknownElement,IDBDatabase,IDBRequest,IDBTransaction,KeyOperation,MediaController,MessagePort,ModalWindow,Notification,SVGElementInstance,Screen,TextTrack,TextTrackCue,TextTrackList,WebSocket,WebSocketWorker,Worker,XMLHttpRequest,XMLHttpRequestEventTarget,XMLHttpRequestUpload".split(",");for(o=0;o<c.length;++o)a=c[o],r[a]&&r[a].prototype&&l(i,r[a].prototype)}return e.captureUnhandledRejections&&(i._unhandledRejectionHandler=function(r){var e=r.reason,o=r.promise,n=r.detail;!e&&n&&(e=n.reason,o=n.promise),i.unhandledRejection(e,o)},r.addEventListener("unhandledrejection",i._unhandledRejectionHandler)),r[n]=i,i})()},a.prototype.loadFull=function(r,e,n,t,a){var i=function(){var e;if(void 0===r._rollbarPayloadQueue){var o,n,t,i;for(e=new Error("rollbar.js did not load");o=r._rollbarShimQueue.shift();)for(t=o.args,i=0;i<t.length;++i)if(n=t[i],"function"==typeof n){n(e);break}}"function"==typeof a&&a(e)},l=!1,c=e.createElement("script"),p=e.getElementsByTagName("script")[0],s=p.parentNode;c.crossOrigin="",c.src=t.rollbarJsUrl,c.async=!n,c.onload=c.onreadystatechange=o(function(){if(!(l||this.readyState&&"loaded"!==this.readyState&&"complete"!==this.readyState)){c.onload=c.onreadystatechange=null;try{s.removeChild(c)}catch(r){}l=!0,i()}}),s.insertBefore(c,p)},a.prototype.wrap=function(r,e){try{var o;if(o="function"==typeof e?e:function(){return e||{}},"function"!=typeof r)return r;if(r._isWrap)return r;if(!r._wrapped){r._wrapped=function(){try{return r.apply(this,arguments)}catch(e){throw"string"==typeof e&&(e=new String(e)),e._rollbarContext=o()||{},e._rollbarContext._wrappedSource=r.toString(),window._rollbarWrappedError=e,e}},r._wrapped._isWrap=!0;for(var n in r)r.hasOwnProperty(n)&&(r._wrapped[n]=r[n])}return r._wrapped}catch(e){return r}};for(var p="log,debug,info,warn,warning,error,critical,global,configure,scope,uncaughtError,unhandledRejection".split(","),s=0;s<p.length;++s)a.prototype[p[s]]=i(p[s]);r.exports={Rollbar:a,_rollbarWindowOnError:n}},function(r,e){"use strict";r.exports=function(r,e){return function(o){if(!o&&!window._rollbarInitialized){var n=window.RollbarNotifier,t=e||{},a=t.globalAlias||"Rollbar",i=window.Rollbar.init(t,r);i._processShimQueue(window._rollbarShimQueue||[]),window[a]=i,window._rollbarInitialized=!0,n.processPayloads()}}}}]);
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
[configuration](https://rollbar.com/docs/notifier/rollbar.js/#configuration-reference) option to filter 'noisy' rejections,
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

#### Scope configuration - only payload

  - Affects only the notifier created by calling `scope()`
  - Only affects the payload of items sent to Rollbar, not the context

All child notifiers, (created with `Rollbar.scope()`) will inherit configuration from their parent notifier.

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

#### Scope

```js
// Create a notifier for two different components, each having a different name
var commentBoxNotifier = Rollbar.scope({component: {name: 'commentBox'}});
var accountSettingsNotifier = Rollbar.scope({component: {name: 'accountSettings'}});

commentBoxNotifier.info('will send a payload containing {component: {name: "commentBox"}}');
accountSettingsNotifier.info('will send a payload containing {component: {name: "accountSettings"}}');

// Override the accountSettingsNotifier's payload settings
var projectSettingsNotifier = accountSettingsNotifier.scope({projectName: 'the-new-hotness'});
projectSettingsNotifier.info('will send a payload containing {component: {name: "accountSettings"}, projectName: "the-new-hotness"}');
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


### Rollbar.scope()

(See the section on [configuration](https://rollbar.com/docs/notifier/rollbar.js/#configuration-reference).)

This method acts the same as `configure()` except it will not update any config options. Rather, it will return a new `Rollbar` instance with the inherited config options set along with those passed into `scope()`.

__Returns__: a new `Rollbar` instance

__Params__

1. options: `Object` - A javascript object that contains the notifier configuration.


### Rollbar.uncaughtError()

This method is used to record uncaught exceptions from `window.onerror`. The Rollbar snippet will set `window.onerror = Rollbar.uncaughtError` if it was configured to do so via the `captureUncaught` config parameter given to `Rollbar.init()`.

__Returns__: `undefined`

__Params__

1. message: `String`: The error message.
1. url: `String`: url that the error occurred on.
1. lineNo: `Integer`: The line number, (if known) that the error occurred on.
1. colNo: `Integer`: The column number that the error occurred on.
    1. _Note_: Only newer browsers provide this variable.
1. err: `Exception`: The exception that caused the `window.onerror` event to occur.
    1. _Note_: Only newer browsers provide this variable.


### Rollbar.unhandledRejection()

This method is used to record unhandled Promise rejections via the window event `unhandledrejection`.  Many promise 
libraries, including Bluebird, lie, and native Promise support (Chrome only currently, but it is a [standard to be
built upon](https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onunhandledrejection)). 

To enable this handling, you should provide `captureUnhandledRejections` to the config given to `Rollbar.init()`.

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
!function(r){function t(n){if(e[n])return e[n].exports;var a=e[n]={exports:{},id:n,loaded:!1};return r[n].call(a.exports,a,a.exports,t),a.loaded=!0,a.exports}var e={};return t.m=r,t.c=e,t.p="",t(0)}([function(r,t,e){"use strict";!function(r,t,e){var n=t.Rollbar;if(n){var a="0.0.8";n.configure({notifier:{plugins:{jquery:{version:a}}}});var o=function(r){if(n.error(r),t.console){var e="[reported to Rollbar]";n.options&&!n.options.enabled&&(e="[Rollbar not enabled]"),t.console.log(r.message+" "+e)}};r(e).ajaxError(function(r,t,e,a){var o=t.status,u=e.url,i=e.type;if(o){var s={status:o,url:u,type:i,isAjax:!0,data:e.data,jqXHR_responseText:t.responseText,jqXHR_statusText:t.statusText},d=a?a:"jQuery ajax error for "+i;n.warning(d,s)}});var u=r.fn.ready;r.fn.ready=function(r){return u.call(this,function(t){try{r(t)}catch(r){o(r)}})};var i=r.event.add;r.event.add=function(t,e,n,a,u){var s,d=function(r){return function(){try{return r.apply(this,arguments)}catch(r){o(r)}}};return n.handler?(s=n.handler,n.handler=d(n.handler)):(s=n,n=d(n)),s.guid?n.guid=s.guid:n.guid=s.guid=r.guid++,i.call(this,t,e,n,a,u)}}}(jQuery,window,document)}]);
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


## Examples

See [here](https://github.com/rollbar/rollbar.js/tree/master/examples) for some examples of how to use rollbar.js with Bower, Browserify, RequireJS, Webpack, and others.

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
