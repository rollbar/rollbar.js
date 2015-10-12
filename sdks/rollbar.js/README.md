# Rollbar notifier for JavaScript [![Build Status](https://api.travis-ci.org/rollbar/rollbar.js.png?branch=v1.7.0)](https://travis-ci.org/rollbar/rollbar.js)

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
// Rollbar Snippet
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/* globals __DEFAULT_ROLLBARJS_URL__ */
	/* globals _rollbarConfig */

	var RollbarShim = __webpack_require__(1).Rollbar;
	var snippetCallback = __webpack_require__(2);

	_rollbarConfig.rollbarJsUrl = _rollbarConfig.rollbarJsUrl || ("https://d37gvrvc0wt4s1.cloudfront.net/js/vundefined/rollbar.min.js");

	var shim = RollbarShim.init(window, _rollbarConfig);
	var callback = snippetCallback(shim, _rollbarConfig);

	shim.loadFull(window, document, !_rollbarConfig.async, _rollbarConfig, callback);


/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	var _shimCounter = 0;

	function _logger() {
	  var console = window.console;
	  if (console && typeof console.log === 'function') {
	    console.log.apply(console, arguments);
	  }
	}


	function _wrapInternalErr(f, logger) {
	  logger = logger || _logger;
	  return function() {
	    try {
	      return f.apply(this, arguments);
	    } catch (e) {
	      logger('Rollbar internal error:', e);
	    }
	  };
	}


	function _rollbarWindowOnError(client, old, args) {
	  if (window._rollbarWrappedError) {
	    if (!args[4]) {
	      args[4] = window._rollbarWrappedError;
	    }
	    if (!args[5]) {
	      args[5] = window._rollbarWrappedError._rollbarContext;
	    }
	    window._rollbarWrappedError = null;
	  }

	  client.uncaughtError.apply(client, args);
	  if (old) {
	    old.apply(window, args);
	  }
	}


	function Rollbar(parentShim) {
	  this.shimId = ++_shimCounter;
	  this.notifier = null;
	  this.parentShim = parentShim;
	  this.logger = _logger;
	  this._rollbarOldOnError = null;
	}


	Rollbar.init = function(window, config) {
	  var alias = config.globalAlias || 'Rollbar';
	  if (typeof window[alias] === 'object') {
	    return window[alias];
	  }

	  // Expose the global shim queue
	  window._rollbarShimQueue = [];
	  window._rollbarWrappedError = null;

	  config = config || {};

	  var client = new Rollbar();

	  return _wrapInternalErr(function() {
	    client.configure(config);

	    if (config.captureUncaught) {
	      // Create the client and set the onerror handler
	      client._rollbarOldOnError = window.onerror;

	      window.onerror = function() {
	        var args = Array.prototype.slice.call(arguments, 0);
	        _rollbarWindowOnError(client, client._rollbarOldOnError, args);
	      };

	      // Adapted from https://github.com/bugsnag/bugsnag-js
	      var globals = 'EventTarget,Window,Node,ApplicationCache,AudioTrackList,ChannelMergerNode,CryptoOperation,EventSource,FileReader,HTMLUnknownElement,IDBDatabase,IDBRequest,IDBTransaction,KeyOperation,MediaController,MessagePort,ModalWindow,Notification,SVGElementInstance,Screen,TextTrack,TextTrackCue,TextTrackList,WebSocket,WebSocketWorker,Worker,XMLHttpRequest,XMLHttpRequestEventTarget,XMLHttpRequestUpload'.split(',');

	      var i;
	      var global;
	      for (i = 0; i < globals.length; ++i) {
	        global = globals[i];

	        if (window[global] && window[global].prototype) {
	          _extendListenerPrototype(client, window[global].prototype);
	        }
	      }
	    }

	    // Expose Rollbar globally
	    window[alias] = client;
	    return client;
	  }, client.logger)();
	};


	Rollbar.prototype.loadFull = function(window, document, immediate, config, callback) {
	  var onload = function () {
	    var err;
	    if (window._rollbarPayloadQueue === undefined) {
	      // rollbar.js did not load correctly, call any queued callbacks
	      // with an error.
	      var obj;
	      var cb;
	      var args;
	      var i;

	      err = new Error('rollbar.js did not load');

	      // Go through each of the shim objects. If one of their args
	      // was a function, treat it as the callback and call it with
	      // err as the first arg.
	      while ((obj = window._rollbarShimQueue.shift())) {
	        args = obj.args;
	        for (i = 0; i < args.length; ++i) {
	          cb = args[i];
	          if (typeof cb === 'function') {
	            cb(err);
	            break;
	          }
	        }
	      }
	    }
	    if (typeof callback === 'function') {
	      callback(err);
	    }
	  };

	  // Load the full rollbar.js source
	  var done = false;
	  var s = document.createElement('script');
	  var f = document.getElementsByTagName('script')[0];
	  var parentNode = f.parentNode;

	  s.src = config.rollbarJsUrl;
	  s.async = !immediate;

	  // From http://stackoverflow.com/questions/4845762/onload-handler-for-script-tag-in-internet-explorer
	  s.onload = s.onreadystatechange = _wrapInternalErr(function() {
	    if (!done && (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete')) {
	      s.onload = s.onreadystatechange = null;
	      try {
	        parentNode.removeChild(s);
	      } catch (e) {
	        // pass
	      }
	      done = true;

	      onload();
	    }
	  }, this.logger);

	  parentNode.insertBefore(s, f);
	};


	Rollbar.prototype.wrap = function(f, context) {
	  try {
	    var ctxFn;
	    if (typeof context === 'function') {
	      ctxFn = context;
	    } else {
	      ctxFn = function() { return context || {}; };
	    }

	    if (typeof f !== 'function') {
	      return f;
	    }

	    if (f._isWrap) {
	      return f;
	    }

	    if (!f._wrapped) {
	      f._wrapped = function () {
	        try {
	          return f.apply(this, arguments);
	        } catch(e) {
	          e._rollbarContext = ctxFn() || {};
	          e._rollbarContext._wrappedSource = f.toString();

	          window._rollbarWrappedError = e;
	          throw e;
	        }
	      };

	      f._wrapped._isWrap = true;

	      for (var prop in f) {
	        if (f.hasOwnProperty(prop)) {
	          f._wrapped[prop] = f[prop];
	        }
	      }
	    }

	    return f._wrapped;
	  } catch (e) {
	    // Try-catch here is to work around issue where wrap() fails when used inside Selenium.
	    // Return the original function if the wrap fails.
	    return f;
	  }
	};

	// Stub out rollbar.js methods
	function stub(method) {
	  var R = Rollbar;
	  return _wrapInternalErr(function() {
	    if (this.notifier) {
	      return this.notifier[method].apply(this.notifier, arguments);
	    } else {
	      var shim = this;
	      var isScope = method === 'scope';
	      if (isScope) {
	        shim = new R(this);
	      }
	      var args = Array.prototype.slice.call(arguments, 0);
	      var data = {shim: shim, method: method, args: args, ts: new Date()};
	      window._rollbarShimQueue.push(data);

	      if (isScope) {
	        return shim;
	      }
	    }
	  });
	}


	function _extendListenerPrototype(client, prototype) {
	  if (prototype.hasOwnProperty && prototype.hasOwnProperty('addEventListener')) {
	    var oldAddEventListener = prototype.addEventListener;
	    prototype.addEventListener = function(event, callback, bubble) {
	      oldAddEventListener.call(this, event, client.wrap(callback), bubble);
	    };

	    var oldRemoveEventListener = prototype.removeEventListener;
	    prototype.removeEventListener = function(event, callback, bubble) {
	      oldRemoveEventListener.call(this, event, (callback && callback._wrapped) ? callback._wrapped : callback, bubble);
	    };
	  }
	}


	var _methods = 'log,debug,info,warn,warning,error,critical,global,configure,scope,uncaughtError'.split(',');
	for (var i = 0; i < _methods.length; ++i) {
	  Rollbar.prototype[_methods[i]] = stub(_methods[i]);
	}


	module.exports = {
	  Rollbar: Rollbar,
	  _rollbarWindowOnError: _rollbarWindowOnError
	};


/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function(shim, _config) {
	  return function(err) {
	    if (err) {
	      // do something?
	      return;
	    }

	    if (!window._rollbarInitialized) {
	      var Notifier = window.RollbarNotifier; // This is exposed by UMD bundle.
	      var config = _config || {};
	      var alias = config.globalAlias || 'Rollbar';

	      // At this time window.Rollbar is globalnotifier.wrapper
	      var fullRollbar = window.Rollbar.init(config, shim);

	      fullRollbar._processShimQueue(window._rollbarShimQueue || []);

	      window[alias] = fullRollbar;

	      window._rollbarInitialized = true;

	      Notifier.processPayloads();
	    }
	  };
	};


/***/ }
/******/ ]);
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

(Advanced) For fine-grained control of the payload sent to the [Rollbar API](https://rollbar.com/docs/api_items/), use `Rollbar.scope`:

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

If you minify your JavaScript in production, you'll want to configure source maps so you get meaningful stack traces. See the [source maps guide](https://rollbar.com/docs/guides_sourcemaps/) for instructions.

## iOS 9 Webviews

iOS 9 webviews will currently not work properly with the rollbar.js snippet above. 

Starting with iOS 9, webviews will only allow connections to HTTPS hosts whose certificates are are signed using SHA256+ and whose key is either 2048+ bit RSA or 256+ ECC. Many CDNs, including Cloudfront, do not meet these specifications. More info [here](https://developer.apple.com/library/prerelease/ios/technotes/App-Transport-Security-Technote/index.html).

You have a couple of options to fix this behavior:

- Update your app's Info.plist file to not enforce Forward Secrecy for the Rollbar cloudfront domain:
```xml
  <key>NSAppTransportSecurity</key> 
  <dict> 
    <key>NSExceptionDomains</key> 
    <dict> 
      <key>d37gvrvc0wt4s1.cloudfront.net</key> 
      <dict> 
        <key>NSExceptionRequiresForwardSecrecy</key> 
          <false/> 
        <key>NSIncludesSubdomains</key> 
          <true/> 
      </dict> 
    </dict> 
  </dict>
```
- Update your rollbar.js snippet to use cdn.rollbar.com
  - This will fix iOS 9 webviews but will cause rollbar.js to not work properly for IE6 and IE8 users
```js
  var _rollbarConfig = {
    accessToken: "POST_CLIENT_ITEM_ACCESS_TOKEN",
    // ... other configuration
    rollbarJsUrl: "https://cdn.rollbar.com/js/v1.7/rollbar.min.js"
  };
```

## Next steps

- [Configuration reference](https://rollbar.com/docs/notifier/rollbar.js/configuration)
- [API reference](https://rollbar.com/docs/notifier/rollbar.js/api)
- [Plugins](https://rollbar.com/docs/notifier/rollbar.js/plugins)
- [Examples](https://github.com/rollbar/rollbar.js/tree/master/examples)
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
