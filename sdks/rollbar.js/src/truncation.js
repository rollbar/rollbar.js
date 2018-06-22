var _ = require('./utility');

function raw(payload) {
  return [payload, _.stringify(payload)];
}

function truncateFrames(payload, range = 30) {
  var body = payload.data.body;
  if (body.trace_chain) {
    var chain = body.trace_chain;
    for (var i=0; i < chain.length; i++) {
      var frames = chain[i].frames;
      frames = selectFrames(frames, range);
      chain[i].frames = frames;
    }
  } else if (body.trace) {
    var frames = body.trace.frames;
    frames = selectFrames(frames, range);
    body.trace.frames = frames;
  }
  return [payload, _.stringify(payload)];
}

function selectFrames(frames, range) {
  var len = frames.length;
  if (len <= range * 2) {
    return frames;
  }
  return frames.slice(0, range).concat(frames.slice(len-range));
}

function truncateStrings(len, payload) {
  function truncator(k, v, seen) {
    switch (_.typeName(v)) {
      case 'string':
        return maybeTruncateValue(len, v);
      case 'object':
      case 'array':
        return _.traverse(v, truncator, seen);
      default:
        return v;
    }
  }
  payload = _.traverse(payload, truncator, []);
  return [payload, _.stringify(payload)];
}

function minBody(payload) {
  var body = payload.data.body;
  if (body.trace_chain) {
    var chain = body.trace_chain;
    for (var i=0; i < chain.length; i++) {
      chain[i] = truncateTraceData(chain[i]);
    }
  } else if (body.trace) {
    body.trace = truncateTraceData(body.trace);
  }
  return [payload, _.stringify(payload)];
}

function truncateTraceData(traceData) {
  delete traceData.exception.description;
  traceData.exception.message = traceData.exception.message.substr(0, 255);
  traceData.frames = selectFrames(traceData.frames, 1);
  return traceData;
}

function truncate(payload) {
  var maxSize = 512 * 1024;
  var strategies = [
    raw,
    truncateFrames,
    truncateStrings.bind(null, 1024),
    truncateStrings.bind(null, 512),
    truncateStrings.bind(null, 256),
    minBody,
  ];
  var strategy, results, result;

  while (strategy = strategies.shift()) {
    results = strategy(payload);
    payload = results[0];
    result  = results[1];
    if (result.error || !needsTruncation(result.value, maxSize)) {
      return result;
    }
  }
  return result;
}

function needsTruncation(payload, maxSize) {
  return payload.length > maxSize;
}

function maybeTruncateValue(len, val) {
  if (!val) {
    return val;
  }
  if (val.length > len) {
    return val.slice(0, len - 3).concat('...');
  }
  return val;
}

module.exports = {
  truncate: truncate
};
