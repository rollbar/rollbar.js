# Configuration Reference

## Example

Using all config options:

```javascript
Rollbar.configure({
  checkIgnore: function(msg, url, lineNo, colNo, error) {
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
});
```

## Reference

All of these are configurable via the ```_rollbarParams``` object.
    
  <dl>
  <dt>checkIgnore</dt>
  <dd>An optional function that will be used to ignore uncaught exceptions based on its return value. It will receive the same arguments as passed by the browser window.onerror. The function signature should be: ```function checkIgnore(msg, url, lineNo, colNo, error) { ... }``` and should return ```true``` if the error should be ignored.

Default: ```null```

  </dd>
  <dt>client.javascript.code_version</dt>
  <dd>Version control number (i.e. git SHA) of the current revision. Used for linking filenames in stacktraces to Github.
  </dd>
  <dt>client.javascript.source_map_enabled</dt>
  <dd>When `true`, the Rollbar service will attempt to find and apply source maps to all frames in the stack trace.

Default: ```false```
  </dd>
  <dt>client.javascript.guess_uncaught_frames</dt>
  <dd>When `true`, the Rollbar service will attempt to apply source maps to frames even if they are missing column numbers. Works best when the minified javascript file is generated using newlines instead of semicolons.

Default: ```false```
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

