import traverse from './utility/traverse.js';
import * as _ from './utility.js';

function scrub(data, scrubFields, scrubPaths) {
  scrubFields = scrubFields || [];

  if (scrubPaths) {
    for (const path of scrubPaths) {
      scrubPath(data, path);
    }
  }

  var paramRes = _getScrubFieldRegexs(scrubFields);
  var queryRes = _getScrubQueryParamRegexs(scrubFields);

  function redactQueryParam(dummy0, paramPart) {
    return paramPart + _.redact();
  }

  function paramScrubber(v) {
    if (_.isType(v, 'string')) {
      for (const regex of queryRes) {
        v = v.replace(regex, redactQueryParam);
      }
    }
    return v;
  }

  function valScrubber(k, v) {
    for (const regex of paramRes) {
      if (regex.test(k)) {
        v = _.redact();
        break;
      }
    }
    return v;
  }

  function scrubber(k, v, seen) {
    var tmpV = valScrubber(k, v);
    if (tmpV === v) {
      if (_.isType(v, 'object') || _.isType(v, 'array')) {
        return traverse(v, scrubber, seen);
      }
      return paramScrubber(tmpV);
    } else {
      return tmpV;
    }
  }

  return traverse(data, scrubber);
}

function scrubPath(obj, path) {
  var keys = path.split('.');
  var last = keys.length - 1;
  try {
    var index = 0;
    for (const key of keys) {
      if (index < last) {
        obj = obj[key];
      } else {
        obj[key] = _.redact();
      }
      index += 1;
    }
  } catch (_e) {
    // Missing key is OK;
  }
}

function _getScrubFieldRegexs(scrubFields) {
  var ret = [];
  for (const field of scrubFields) {
    var pat = '^\\[?(%5[bB])?' + field + '\\[?(%5[bB])?\\]?(%5[dD])?$';
    ret.push(new RegExp(pat, 'i'));
  }
  return ret;
}

function _getScrubQueryParamRegexs(scrubFields) {
  var ret = [];
  for (const field of scrubFields) {
    var pat = '\\[?(%5[bB])?' + field + '\\[?(%5[bB])?\\]?(%5[dD])?';
    ret.push(new RegExp('(' + pat + '=)([^&\\n]+)', 'igm'));
  }
  return ret;
}

export default scrub;
