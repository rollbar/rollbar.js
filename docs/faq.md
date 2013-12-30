# FAQ

### How do I use Rollbar with PhoneGap or browser extensions?
You must specify the protocol for the CDN url in the snippet used to load rollbar.min.js.

e.g.
Snippet:

```js
!function(a,b){function c(a){this.shimId=++_shimCounter,this.notifier=null,this.parentShim=a}function d(b){var d=c;return function(){if(this.notifier)return this.notifier[b].apply(this.notifier,arguments);var c=this,e="scope"===b;e&&(c=new d(this));var f=Array.prototype.slice.call(arguments,0),g={shim:c,method:b,args:f,ts:new Date};return a.RollbarShimQueue.push(g),e?c:void 0}}_shimCounter=0,c.VERSION="1.0.0-beta1",c.init=function(a,b){if("object"==typeof a.Rollbar)return a.Rollbar;a.RollbarShimQueue=[],b=b||{};var d=new c;if(d.configure(b),b.captureUncaught){var e=a.onerror;a.onerror=function(){d.uncaughtError.apply(d,arguments),e&&e.apply(a,arguments)}}return a.Rollbar=d,d},c.prototype.loadFull=function(a,b,c,d){var e=function(){var a=b.createElement("script"),e=b.getElementsByTagName("script")[0];a.src=d,a.async=!c,a.onload=f,e.parentNode.insertBefore(a,e)},f=function(){if(void 0===a._rollbarPayloadQueue)for(var b,c,d,e,f=new Error("rollbar.js did not load");b=a.RollbarShimQueue.shift();)for(d=b.args,e=0;e<d.length;++e)if(c=d[e],"function"==typeof c){c(f);break}};c?e():a.addEventListener?a.addEventListener("load",e,!1):a.attachEvent("onload",e)};for(var e="log,debug,info,warning,error,critical,global,configure,scope,uncaughtError".split(","),f=0;f<e.length;++f)c.prototype[e[f]]=d(e[f]);var g="//d37gvrvc0wt4s1.cloudfront.net/js/v1.0/rollbar.min.js",h=c.init(a,_rollbarConfig);h.loadFull(a,b,!0,g)}(window,document);
```

Replace ```//d37gvrvc0wt4s1.cloudfront.net/js/v1.0/rollbar.min.js``` with ```https://d37gvrvc0wt4s1.cloudfront.net/js/v1.0/rollbar.min.js```
