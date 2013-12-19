# Instrumenting jQuery

If you use jQuery 1.7 and up, you can include a plugin script that will instrument jQuery to wrap any functions passed into jQuery's ready(), on() and off() to catch errors and report them to Rollbar. To install this plugin, copy the following snippet into your pages, making sure it is BELOW the `<script>` tag where jQuery is loaded:

<!-- EditableTextAreaStart -->
<!-- RemoveNext -->
```html
<script>
(function(r,e,a){if(!e._rollbar){return}var n={"notifier.plugins.jquery.version":"0.0.6"};e._rollbar.push({_rollbarParams:n});var u=function(r){if(e.console){e.console.log(r.message+" [reported to Rollbar]")}};r(a).ajaxError(function(r,a,n,u){var t=a.status;var l=n.url;var o=n.type;e._rollbar.push({level:"warning",msg:"jQuery ajax error for "+o+" "+l,jquery_status:t,jquery_url:l,jquery_type:o,jquery_thrown_error:u,jquery_ajax_error:true})});var t=r.fn.ready;r.fn.ready=function(r){return t.call(this,function(){try{r()}catch(a){e._rollbar.push(a);u(a)}})};var l=r.event.add;r.event.add=function(a,n,t,o,i){var s;var d=function(r){return function(){try{return r.apply(this,arguments)}catch(a){e._rollbar.push(a);u(a)}}};if(t.handler){s=t.handler;t.handler=d(t.handler)}else{s=t;t=d(t)}if(s.guid){t.guid=s.guid}else{t.guid=s.guid=r.guid++}return l.call(this,a,n,t,o,i)}})(jQuery,window,document);
</script>
```
<!-- RemovePrev -->
<!-- EditableTextAreaEnd -->

The plugin will also automatically report any AJAX errors using jQuery's `ajaxError()` handler. You can disable this functionality by providing the following configuration option in the `_rollbarParams` of your base snippet:
```javascript
"notifier.plugins.jquery.ignoreAjaxErrors": true
```
