# Dealing with Browser-Extension Exceptions

For most websites, the path for dealing with browser extension originating exceptions is simply to:

1.  Identify the presence of problematic browser extensions
2.  Disable Rollbar.js's reporting

## Dealing with adblockers

The most common type of extension that can be problematic is adblockers.  These extensions can disable loading
certain external scripts or remove elements from a page based on a simple set of heuristics.

You can see a [full example](https://github.com/rollbar/rollbar.js/tree/master/examples/extension-exceptions/)
for details, but the approach can best summarized as below:

Load Rollbar.js as normal.

```html
<script src="/assets/js/rollbar.js"></script>

<script>
  var _rollbarConfig = {
    accessToken: 'POST_CLIENT_ITEM_ACCESS_TOKEN',
    captureUncaught: true,
    payload: {
      environment: 'development',
    }
  };
</script>
```

Add an html element with "bait" class names to be removed by adblockers.

```html
<!-- bait for adblocker like addons.  If they remove this div, we should disable error reporting -->
<div id="blocker-bait" style="height: 1px; width: 1px; position: absolute; left: -999em; top: -999em"
     class="ads ad adsbox doubleclick ad-placement carbon-ads"></div>
```

Add functions to check for the presence and visibility of our bait div.

```js
  function disableRollbar() {
    Rollbar.configure({enabled: false});
  }

  function checkForAds() {
    var bait = document.getElementById("blocker-bait");

    if (bait == null) {
      disableRollbar();
      return;
    }

    var baitStyles = window.getComputedStyle(bait);
    if (baitStyles && (
        baitStyles.getPropertyValue('display') === 'none' ||
        baitStyles.getPropertyValue('visibility') === 'hidden')) {
      disableRollbar();
    }
  }

  function onLoadStartAdCheck() {
    // Ad blockers generally execute just after load, let's delay ourselves to get behind it.
    setTimeout(checkForAds, 1);
  }

  if (window.addEventListener !== undefined) {
    window.addEventListener('load', onLoadStartAdCheck, false);
  } else {
    window.attachEvent('onload', onLoadStartAdCheck);
  }
```

The above approach is likely to work in the majority of cases, *but it is not foolproof*.  Extensions and their
behavior evolve over time and nothing stops a user from opening their console and modifying / executing code as well.
A practical approach involves incrementally adjusting your detection as new exceptions occur in large numbers.
