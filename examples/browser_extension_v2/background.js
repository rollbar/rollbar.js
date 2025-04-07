console.log('Background extension is running.');

// The background script can load Rollbar via the snippet as shown here, which
// makes a network request to fetch rollbar.js. Or it can load rollbar.js from
// the manifest.js file as shown in the content script example.
//
var _rollbarConfig = {
  accessToken: 'ROLLBAR_CLIENT_TOKEN',
  captureUncaught: true,
  captureUnhandledRejections: true,
};

// Rollbar Snippet
(()=>{var r={48:r=>{r.exports={captureUncaughtExceptions:function(r,o,e){if(r){var n;if("function"==typeof o._rollbarOldOnError)n=o._rollbarOldOnError;else if(r.onerror){for(n=r.onerror;n._rollbarOldOnError;)n=n._rollbarOldOnError;o._rollbarOldOnError=n}o.handleAnonymousErrors();var t=function(){var e=Array.prototype.slice.call(arguments,0);!function(r,o,e,n){r._rollbarWrappedError&&(n[4]||(n[4]=r._rollbarWrappedError),n[5]||(n[5]=r._rollbarWrappedError._rollbarContext),r._rollbarWrappedError=null);var t=o.handleUncaughtException.apply(o,n);e&&e.apply(r,n),"anonymous"===t&&(o.anonymousErrorsPending+=1)}(r,o,n,e)};e&&(t._rollbarOldOnError=n),r.onerror=t}},captureUnhandledRejections:function(r,o,e){if(r){"function"==typeof r._rollbarURH&&r._rollbarURH.belongsToShim&&r.removeEventListener("unhandledrejection",r._rollbarURH);var n=function(r){var e,n,t;try{e=r.reason}catch(r){e=void 0}try{n=r.promise}catch(r){n="[unhandledrejection] error getting `promise` from event"}try{t=r.detail,!e&&t&&(e=t.reason,n=t.promise)}catch(r){}e||(e="[unhandledrejection] error getting `reason` from event"),o&&o.handleUnhandledRejection&&o.handleUnhandledRejection(e,n)};n.belongsToShim=e,r._rollbarURH=n,r.addEventListener("unhandledrejection",n)}}}},142:r=>{function o(r,e){this.impl=r(e,this),this.options=e,function(r){for(var o=function(r){return function(){var o=Array.prototype.slice.call(arguments,0);if(this.impl[r])return this.impl[r].apply(this.impl,o)}},e="log,debug,info,warn,warning,error,critical,global,configure,handleUncaughtException,handleAnonymousErrors,handleUnhandledRejection,_createItem,wrap,loadFull,shimId,captureEvent,captureDomContentLoaded,captureLoad".split(","),n=0;n<e.length;n++)r[e[n]]=o(e[n])}(o.prototype)}o.prototype._swapAndProcessMessages=function(r,o){var e,n,t;for(this.impl=r(this.options);e=o.shift();)n=e.method,t=e.args,this[n]&&"function"==typeof this[n]&&("captureDomContentLoaded"===n||"captureLoad"===n?this[n].apply(this,[t[0],e.ts]):this[n].apply(this,t));return this},r.exports=o},750:(r,o,e)=>{function n(r){return n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(r){return typeof r}:function(r){return r&&"function"==typeof Symbol&&r.constructor===Symbol&&r!==Symbol.prototype?"symbol":typeof r},n(r)}var t=e(48),a=e(277);function l(r){return function(){try{return r.apply(this,arguments)}catch(r){try{console.error("[Rollbar]: Internal error",r)}catch(r){}}}}var i=0;function s(r,o){this.options=r,this._rollbarOldOnError=null;var e=i++;this.shimId=function(){return e},"undefined"!=typeof window&&window._rollbarShims&&(window._rollbarShims[e]={handler:o,messages:[]})}var d=e(142),c=function(r,o){return new s(r,o)},p=function(r){return new d(c,r)};function u(r){return l((function(){var o=Array.prototype.slice.call(arguments,0),e={shim:this,method:r,args:o,ts:new Date};window._rollbarShims[this.shimId()].messages.push(e)}))}s.prototype.loadFull=function(r,o,e,n,t){var a=!1,i=o.createElement("script"),s=o.getElementsByTagName("script")[0],d=s.parentNode;i.crossOrigin="",i.src=n.rollbarJsUrl,e||(i.async=!0),i.onload=i.onreadystatechange=l((function(){if(!(a||this.readyState&&"loaded"!==this.readyState&&"complete"!==this.readyState)){i.onload=i.onreadystatechange=null;try{d.removeChild(i)}catch(r){}a=!0,function(){var o;if(void 0===r._rollbarDidLoad){o=new Error("rollbar.js did not load");for(var e,n,a,l,i=0;e=r._rollbarShims[i++];)for(e=e.messages||[];n=e.shift();)for(a=n.args||[],i=0;i<a.length;++i)if("function"==typeof(l=a[i])){l(o);break}}"function"==typeof t&&t(o)}()}})),d.insertBefore(i,s)},s.prototype.wrap=function(r,o,e){try{var n;if(n="function"==typeof o?o:function(){return o||{}},"function"!=typeof r)return r;if(r._isWrap)return r;if(!r._rollbar_wrapped&&(r._rollbar_wrapped=function(){e&&"function"==typeof e&&e.apply(this,arguments);try{return r.apply(this,arguments)}catch(e){var o=e;throw o&&("string"==typeof o&&(o=new String(o)),o._rollbarContext=n()||{},o._rollbarContext._wrappedSource=r.toString(),window._rollbarWrappedError=o),o}},r._rollbar_wrapped._isWrap=!0,r.hasOwnProperty))for(var t in r)r.hasOwnProperty(t)&&(r._rollbar_wrapped[t]=r[t]);return r._rollbar_wrapped}catch(o){return r}};for(var f="log,debug,info,warn,warning,error,critical,global,configure,handleUncaughtException,handleAnonymousErrors,handleUnhandledRejection,captureEvent,captureDomContentLoaded,captureLoad".split(","),h=0;h<f.length;++h)s.prototype[f[h]]=u(f[h]);r.exports={setupShim:function(r,o){if(r){var e=o.globalAlias||"Rollbar";if("object"===n(r[e]))return r[e];r._rollbarShims={},r._rollbarWrappedError=null;var i=new p(o);return l((function(){o.captureUncaught&&(i._rollbarOldOnError=r.onerror,t.captureUncaughtExceptions(r,i,!0),o.wrapGlobalEventHandlers&&a(r,i,!0)),o.captureUnhandledRejections&&t.captureUnhandledRejections(r,i,!0);var l=o.autoInstrument;return!1!==o.enabled&&(void 0===l||!0===l||function(r){return!("object"!==n(r)||void 0!==r.page&&!r.page)}(l))&&r.addEventListener&&(r.addEventListener("load",i.captureLoad.bind(i)),r.addEventListener("DOMContentLoaded",i.captureDomContentLoaded.bind(i))),r[e]=i,i}))()}},Rollbar:p}},131:r=>{r.exports=function(r){return function(o){if(!o&&!window._rollbarInitialized){for(var e,n,t=(r=r||{}).globalAlias||"Rollbar",a=window.rollbar,l=function(r){return new a(r)},i=0;e=window._rollbarShims[i++];)n||(n=e.handler),e.handler._swapAndProcessMessages(l,e.messages);window[t]=n,window._rollbarInitialized=!0}}}},277:r=>{function o(r,o,e){if(o.hasOwnProperty&&o.hasOwnProperty("addEventListener")){for(var n=o.addEventListener;n._rollbarOldAdd&&n.belongsToShim;)n=n._rollbarOldAdd;var t=function(o,e,t){n.call(this,o,r.wrap(e),t)};t._rollbarOldAdd=n,t.belongsToShim=e,o.addEventListener=t;for(var a=o.removeEventListener;a._rollbarOldRemove&&a.belongsToShim;)a=a._rollbarOldRemove;var l=function(r,o,e){a.call(this,r,o&&o._rollbar_wrapped||o,e)};l._rollbarOldRemove=a,l.belongsToShim=e,o.removeEventListener=l}}r.exports=function(r,e,n){if(r){var t,a,l="EventTarget,Window,Node,ApplicationCache,AudioTrackList,ChannelMergerNode,CryptoOperation,EventSource,FileReader,HTMLUnknownElement,IDBDatabase,IDBRequest,IDBTransaction,KeyOperation,MediaController,MessagePort,ModalWindow,Notification,SVGElementInstance,Screen,TextTrack,TextTrackCue,TextTrackList,WebSocket,WebSocketWorker,Worker,XMLHttpRequest,XMLHttpRequestEventTarget,XMLHttpRequestUpload".split(",");for(t=0;t<l.length;++t)r[a=l[t]]&&r[a].prototype&&o(e,r[a].prototype,n)}}}},o={};function e(n){var t=o[n];if(void 0!==t)return t.exports;var a=o[n]={exports:{}};return r[n](a,a.exports,e),a.exports}(()=>{var r=e(750),o=e(131);_rollbarConfig=_rollbarConfig||{},_rollbarConfig.rollbarJsUrl=_rollbarConfig.rollbarJsUrl||"https://cdn.rollbar.com/rollbarjs/refs/tags/v2.26.4/rollbar.min.js",_rollbarConfig.async=void 0===_rollbarConfig.async||_rollbarConfig.async;var n=r.setupShim(window,_rollbarConfig),t=o(_rollbarConfig);window.rollbar=r.Rollbar,n.loadFull(window,document,!_rollbarConfig.async,_rollbarConfig,t)})()})();
// End Rollbar Snippet

console.log(Rollbar);

// log a generic message and send to rollbar
Rollbar.info('Background script mesage');
