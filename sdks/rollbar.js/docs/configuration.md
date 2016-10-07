# Configuration Reference

## Configuration types

There are 2 types of configuration data -- context and payload. Context provides information about the environment of the error while payload describes information about the error itself.

### Context

  - Information about the environment of the error being sent to Rollbar
  - e.g. server hostname, user's IP, custom fingerprint

### Payload

  - Information about the error -- usually custom
  - e.g. The name of the javascript component that triggered the error

## Configuration levels

Rollbar can be configured at 3 different levels -- global, notifier and scope. All configuration is inherited at each level, so global configuration affects all notifiers while notifier configuration only affects the notifier being configured and any child notifiers created after the call to `configure()`.

### Global configuration

  - Affects all notifiers
  - Set by calling `global()` on any notifier
  - Merges/overwrites previous configuration
  - Currently, the only supported options are `maxItems` and `itemsPerMinute`

### Notifier configuration - context and/or payload

  - Affects only the notifier you call `configure()` on
  - Merges/overwrites previous configuration for the notifier you call `configure()` on

### Scope configuration - only payload

  - Affects only the notifier created by calling `scope()`
  - Only affects the payload of items sent to Rollbar, not the context

All child notifiers, (created with `Rollbar.scope()`) will inherit configuration from their parent notifier.

## Examples

### Global

```js
// Only send a max of 5 items to Rollbar per minute
Rollbar.global({itemsPerMinute: 5});
```

### Notifier

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

### Scope

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

## Reference

Both global and context configuration have the following reserved key names that Rollbar uses to aggregate, notifiy and display.

### Global

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
<dd>Version control number (i.e. git SHA) of the current revision. Used for linking filenames in stacktraces to Github.
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


## More info

Check out the [API docs](https://rollbar.com/docs/notifier/rollbar.js/api) for more information on how to use ```global/configure/scope()```.
