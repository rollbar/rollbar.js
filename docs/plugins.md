# jQuery

If you use jQuery 1.7 and up, you can include a plugin script that will instrument jQuery to wrap any functions passed into jQuery's ready(), on() and off() to catch errors and report them to Rollbar. To install this plugin, copy the following snippet into your pages, making sure it is BELOW the `<script>` tag where jQuery is loaded:

<!-- EditableTextAreaStart -->
<!-- RemoveNext -->
```html
<script>
// Rollbar jQuery Snippet
!function(r){function t(o){if(e[o])return e[o].exports;var n=e[o]={exports:{},id:o,loaded:!1};return r[o].call(n.exports,n,n.exports,t),n.loaded=!0,n.exports}var e={};return t.m=r,t.c=e,t.p="",t(0)}([function(r,t,e){"use strict";!function(r,t,e){var o=t.Rollbar;if(o){var n="0.0.8";o.configure({notifier:{plugins:{jquery:{version:n}}}});var a=function(r){if(o.error(r),t.console){var e="[reported to Rollbar]";o.options&&!o.options.enabled&&(e="[Rollbar not enabled]"),t.console.log(r.message+" "+e)}};r(e).ajaxError(function(r,t,e,n){var a=t.status,i=e.url,l=e.type;if(a){var u={status:a,url:i,type:l,isAjax:!0,data:e.data,jqXHR_responseText:t.responseText,jqXHR_statusText:t.statusText},s=n?n:"jQuery ajax error for "+l;o.warning(s,u)}});var i=r.fn.ready;r.fn.ready=function(r){return i.call(this,function(t){try{r(t)}catch(e){a(e)}})};var l=r.event.add;r.event.add=function(t,e,o,n,i){var u,s=function(r){return function(){try{return r.apply(this,arguments)}catch(t){a(t)}}};return o.handler?(u=o.handler,o.handler=s(o.handler)):(u=o,o=s(o)),u.guid?o.guid=u.guid:o.guid=u.guid=r.guid++,l.call(this,t,e,o,n,i)}}}(jQuery,window,document)}]);
// End Rollbar jQuery Snippet
</script>
```
<!-- RemovePrev -->
<!-- EditableTextAreaEnd -->

The plugin will also automatically report any AJAX errors using jQuery's `ajaxError()` handler. You can disable this functionality by configuring the Rollbar notifier with the following:
```javascript
window.Rollbar.configure({
  payload: {
    notifier: {
      plugins: {
        jquery: {
          ignoreAjaxErrors: true
        }
      }
    }
  }
});
```
