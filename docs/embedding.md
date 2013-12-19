# Using in Embedded Browsers or Extensions

To use Rollbar with PhoneGap, browser extensions, or any other environment where your code is loaded from a protocol besides ```http``` or ```https```, use the following snippet instead. The only change is to use ```https``` instead of a schemaless URL.

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
