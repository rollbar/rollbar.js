# Rollbar notifier for JavaScript

<!-- Sub:[TOC] -->

## Quick start

Copy-paste the following code into the ```<head>``` of every page you want to track. It should be as high as possible, before any other ```<script>``` tags.

<!-- RemoveNextIfProject -->
Be sure to replace ```POST_CLIENT_ITEM_ACCESS_TOKEN``` with your project's ```post_client_item``` access token, which you can find in the Rollbar.com interface.

<!-- EditableTextAreaStart -->
<!-- RemoveNext -->
```html
<script>
var _rollbarParams = {"server.environment": "production"};
_rollbarParams["notifier.snippet_version"] = "2"; var _rollbar=["POST_CLIENT_ITEM_ACCESS_TOKEN", _rollbarParams]; var _ratchet=_rollbar;
(function(w,d){w.onerror=function(e,u,l,c,err){_rollbar.push({_t:'uncaught',e:e,u:u,l:l,c:c,err:err});};var i=function(){var s=d.createElement("script");var 
f=d.getElementsByTagName("script")[0];s.src="//d37gvrvc0wt4s1.cloudfront.net/js/1/rollbar.min.js";s.async=!0;
f.parentNode.insertBefore(s,f);};if(w.addEventListener){w.addEventListener("load",i,!1);}else{w.attachEvent("onload",i);}})(window,document);
</script>
```
<!-- RemovePrev -->
<!-- EditableTextAreaEnd -->

If you're running Rollbar on an environment besides production, change the ```server.environment``` value to something else (e.g. "staging").
  
See below for additional configuration options.
  
### Test your installation

1. Navigate your browser to a page that has the above code installed
2. Type the following code *into the address bar* (not the console) and press enter: ```javascript:testing_rollbar_123();```

As long as you don't happen to have a function by that name, this will cause an uncaught error that will be reported to Rollbar. It should appear in the dashboard within a few seconds.

## Usage

### Generic logging

In addition to catching top-level errors, you can use ```_rollbar.push``` to send custom log messages. It is fully-asynchronous and safe to call anywhere in your code after the ```<script>``` tag above.
  
```_rollbar.push``` accepts arguments of any of the following forms:

- An ```Error``` instance (i.e. for reporting a caught exception):

```javascript
try {
  doSomething();
} catch (e) {
  _rollbar.push(e);
}
```

- A plain string:

```javascript
_rollbar.push("Some log message");
```

- An object containing a 'msg' property, an optional 'level' property, an optional '_fingerprint' property, and any arbitrary data you want to send (as long as it can be encoded by ```JSON.stringify())```:

```javascript
_rollbar.push({level: 'warning', msg: "Some warning message", point: {x: 5, y: 10}});
```

  - **Note:** jQuery objects can _not_ be encoded by ```JSON.stringify()```, so don't pass them as-is.
    - ```level``` is optional and can take any of the following values: 'critical', 'error', 'warning', 'info', 'debug'
    - ```_fingerprint``` is optional; if provided, it will be override the fingerprint used for grouping. Should be a string no longer than 40 characters.


If you want to wrap ```console.log```, try the following:

```javascript
if (typeof console === 'undefined') {
  console = {log: function() {}};
}
var old_console_log = console.log;
function rollbar_console_log() {
  old_console_log.apply(this, arguments);
  var message = {level: 'info', msg: arguments[0]};
  for (var i = 1; i < arguments.length; i++) {
    message[i] = arguments[i];
  }
  _rollbar.push(message);
}
console.log = rollbar_console_log;
```
    
### Configuration

#### Example

Using all config options:

```javascript
var _rollbarParams = {
  checkIgnore: function(errMsg, url, lineNo) {
    // don't ignore anything (default)
    return false;
  },
  context: "home#index",
  itemsPerMinute: 60,
  level: "error",
  person: {
    id: 12345,
    username: "johndoe",
    email: "johndoe@example.com"
  },
  "server.branch": "develop",
  "server.environment": "staging",
  "server.host": "web1"
};
```

#### Defaults

  All of these are configurable via the ```_rollbarParams``` object.
    
  <dl>
  <dt>checkIgnore</dt>
  <dd>An optional function that will be used to ignore uncaught exceptions based on its return value. The function signature should be: ```function checkIgnore(errMsg, url, lineNo) { ... }``` and should return ```true``` if the error should be ignored.

Default: ```null```

  </dd>
  <dt>client.javascript.code_version</dt>
  <dd>Version control number (i.e. git SHA) of the current revision. Used for linking filenames in stacktraces to Github.
  </dd>
  <dt>context</dt>
  <dd>Name of the page context -- i.e. route name, url, etc. Can be used in the Rollbar interface to search for items by context prefix.
  </dd>
  <dt>custom</dt>
  <dd>An object containing any custom data you'd like to include with all reports. Must be JSON serializable -- note that jQuery objects are _not_ JSON serializable.
  </dd>
  <dt>itemsPerMinute</dt>
  <dd>Max number of items to report per minute. The limit counts uncaught errors (reported through ```window.onerror```) and any direct calls to ```_rollbar.push()```. This is intended as a sanity check against infinite loops, but if you're using Rollbar heavily for logging, you may want to increase this.
  
Default: ```5```

  </dd>
  <dt>level</dt>
  <dd>The severity level to report javascript errors at. One of ```"critical"```, ```"error"```, ```"warning"```, ```"info"```, ```"debug"```.

Default: ```"warning"```

  </dd>
  <dt>person</dt>
  <dd>An object identifying the logged-in user, containing an ```id``` (required), and optionally a ```username``` and ```email``` (all strings). Passing this will allow you to see which users were affected by particular errors, as well as all the errors that a particular user experienced.
  </dd>
  <dt>server.branch</dt>
  <dd>The name of the branch of the code that is running. Used for linking filenames in stacktraces to GitHub.
  
Default: ```"master"```

  </dd>
  <dt>server.environment</dt>
  <dd>Environment name

e.g. ```"production"``` or ```"development"```

Can be an arbitrary string, though to take advantage of the default notifications settings, we recommend using ```"production"``` for your production environment.

Default: ```"production"```

  </dd>
  <dt>server.host</dt>
  <dd>The hostname of the machine that rendered the page

e.g. ```"web1.mysite.com"```

e.g. in Python, use ```socket.gethostname()```

  </dd>
  </dl>

#### Callbacks

You can pass in an optional callback to ```_rollbar.push(obj, callback)``` which will be called when the item is reported to the Rollbar servers. If an error occurs, the callback will be evaluated with 1 argument defining the error that occurred, otherwise the callback will be evaluated a null error and the reported item's uuid as the second argument.

```javascript
for (var i = 0; i < someVar; ++i) {
  var elem = i;
  var callback = function(err, uuid) {
    if (err !== null) {
      console.log('An error occurred while reporting elem ' + elem + ' to Rollbar, ' + err);
    }
  }
  try {
    doSomething();
  } catch (e) {
    _rollbar.push(e, callback);
  }
}
```
  
### Instrumenting jQuery

If you use jQuery 1.7 and up, you can include a plugin script that will instrument jQuery to wrap any functions passed into jQuery's ready(), on() and off() to catch errors and report them to Rollbar. To install this plugin, copy the following snippet into your pages, making sure it is BELOW the `<script>` tag where jQuery is loaded:

<!-- EditableTextAreaStart -->
<!-- RemoveNext -->
```html
<script>
(function(r,e,a){if(!e._rollbar){return}var n={"notifier.plugins.jquery.version":"0.0.5"};e._rollbar.push({_rollbarParams:n});var u=function(r){if(e.console){e.console.log(r.message+" [reported to Rollbar]")}};r(a).ajaxError(function(r,a,n,u){var l=a.status;var t=n.url;e._rollbar.push({level:"warning",msg:"jQuery ajax error for url "+t,jquery_status:l,jquery_url:t,jquery_thrown_error:u,jquery_ajax_error:true})});var l=r.fn.ready;r.fn.ready=function(r){return l.call(this,function(){try{r()}catch(a){e._rollbar.push(a);u(a)}})};var t=r.event.add;r.event.add=function(a,n,l,o,i){var s;var d=function(r){return function(){try{return r.apply(this,arguments)}catch(a){e._rollbar.push(a);u(a)}}};if(l.handler){s=l.handler;l.handler=d(l.handler)}else{s=l;l=d(l)}if(s.guid){l.guid=s.guid}else{l.guid=s.guid=r.guid++}return t.call(this,a,n,l,o,i)}})(jQuery,window,document);
</script>
```
<!-- RemovePrev -->
<!-- EditableTextAreaEnd -->

The plugin will also automatically report any AJAX errors using jQuery's `ajaxError()` handler. You can disable this functionality by providing the following configuration option in the `_rollbarParams` of your base snippet:
```javascript
"notifier.plugins.jquery.ignoreAjaxErrors": true
```

### Using in embedded browsers or extensions

To use Rollbar with PhoneGap, browser extensions, or any other environment where your code is loaded from a protocol besides ```http``` or ```https```, use the following snippet instead. The only change is to use ```https``` instead of a protocol-less URL.

<!-- EditableTextAreaStart -->
<!-- RemoveNext -->
```html
<script>
var _rollbarParams = {"server.environment": "production"};
_rollbarParams["notifier.snippet_version"] = "2"; var _rollbar=["POST_CLIENT_ITEM_ACCESS_TOKEN", _rollbarParams]; var _ratchet=_rollbar;
(function(w,d){w.onerror=function(e,u,l,c,err){_rollbar.push({_t:'uncaught',e:e,u:u,l:l,c:c,err:err});};var i=function(){var s=d.createElement("script");var 
f=d.getElementsByTagName("script")[0];s.src="https://d37gvrvc0wt4s1.cloudfront.net/js/1/rollbar.min.js";s.async=!0;
f.parentNode.insertBefore(s,f);};if(w.addEventListener){w.addEventListener("load",i,!1);}else{w.attachEvent("onload",i);}})(window,document);
</script>
```
<!-- RemovePrev -->
<!-- EditableTextAreaEnd -->

