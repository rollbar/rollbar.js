'use strict';

var logger = require('./logger');
var async = require('async');

var linesOfContext = 3;
var tracePattern =
  /^\s*at (?:([^(]+(?: \[\w\s+\])?) )?\(?(.+?)(?::(\d+):(\d+)(?:, <js>:(\d+):(\d+))?)?\)?$/;

var jadeTracePattern = /^\s*at .+ \(.+ (at[^)]+\))\)$/;
var jadeFramePattern = /^\s*(>?) [0-9]+\|(\s*.+)$/m;

/*
 * Internal
 */


function getMultipleErrors(errors) {
  var errArray, key;

  if (errors === null || errors === undefined) {
    return null;
  }

  if (typeof errors !== 'object') {
    return null;
  }

  if (Array.isArray(errors)) {
    return errors;
  }

  errArray = [];

  for (key in errors) {
    if (Object.prototype.hasOwnProperty.call(errors, key)) {
      errArray.push(errors[key]);
    }
  }
  return errArray;
}


function parseJadeDebugFrame(body) {
  var lines, lineNumSep, filename, lineno, numLines, msg, i,
    contextLine, preContext, postContext, line, jadeMatch;

  // Given a Jade exception body, return a frame object
  lines = body.split('\n');
  lineNumSep = lines[0].indexOf(':');
  filename = lines[0].slice(0, lineNumSep);
  lineno = parseInt(lines[0].slice(lineNumSep + 1), 10);
  numLines = lines.length;
  msg = lines[numLines - 1];

  lines = lines.slice(1, numLines - 1);

  preContext = [];
  postContext = [];
  for (i = 0; i < numLines - 2; ++i) {
    line = lines[i];
    jadeMatch = line.match(jadeFramePattern);
    if (jadeMatch) {
      if (jadeMatch[1] === '>') {
        contextLine = jadeMatch[2];
      } else {
        if (!contextLine) {
          if (jadeMatch[2]) {
            preContext.push(jadeMatch[2]);
          }
        } else {
          if (jadeMatch[2]) {
            postContext.push(jadeMatch[2]);
          }
        }
      }
    }
  }

  preContext = preContext.slice(0, Math.min(preContext.length, linesOfContext));
  postContext = postContext.slice(0, Math.min(postContext.length, linesOfContext));

  return {
    frame: {
      method: '<jade>',
      filename: filename,
      lineno: lineno,
      code: contextLine,
      context: {
        pre: preContext,
        post: postContext
      }
    },
    message: msg
  };
}

function parseFrameLine(line, callback) {
  var matched, curLine, data, frame;

  curLine = line;
  matched = curLine.match(jadeTracePattern);
  if (matched) {
    curLine = matched[1];
  }
  matched = curLine.match(tracePattern);
  if (!matched) {
    return callback(null, null);
  }

  data = matched.slice(1);
  frame = {
    method: data[0] || '<unknown>',
    filename: data[1],
    lineno: Math.floor(data[2]),
    colno: Math.floor(data[3])
  };

  // For coffeescript, lineno and colno refer to the .coffee positions
  // The .js lineno and colno will be stored in compiled_*
  if (data[4]) {
    frame.compiled_lineno = Math.floor(data[4]);
  }

  if (data[5]) {
    frame.compiled_colno = Math.floor(data[5]);
  }

  callback(null, frame);
}

/*
 * Public API
 */

exports.parseException = function (exc, callback) {
  var multipleErrs = getMultipleErrors(exc.errors);

  return exports.parseStack(exc.stack, function (err, stack) {
    var message, clss, ret, firstErr, jadeMatch, jadeData;

    if (err) {
      logger.error('could not parse exception, err: ' + err);
      return callback(err);
    }
    message = String(exc.message || '<no message>') ;
    clss = String(exc.name || '<unknown>');

    ret = {
      class: clss,
      message: message,
      frames: stack
    };

    if (multipleErrs && multipleErrs.length) {
      firstErr = multipleErrs[0];
      ret = {
        class: clss,
        message: String(firstErr.message || '<no message>'),
        frames: stack
      };
    }

    jadeMatch = message.match(jadeFramePattern);
    if (jadeMatch) {
      jadeData = parseJadeDebugFrame(message);
      ret.message = jadeData.message;
      ret.frames.push(jadeData.frame);
    }
    return callback(null, ret);
  });
};


exports.parseStack = function (stack, callback) {
  var lines, _stack = stack;

  // Some JS frameworks (e.g. Meteor) might bury the stack property
  while (typeof _stack === 'object') {
    _stack = _stack && _stack.stack;
  }

  // grab all lines except the first
  lines = (_stack || '').split('\n').slice(1);

  // Parse out all of the frame and filename info
  async.map(lines, parseFrameLine, function (err, frames) {
    if (err) {
      return callback(err);
    }
    frames.reverse();
    async.filter(frames, function (frame, callback) { callback(!!frame); }, function (results) {
      callback(null, results);
    });
  });
};
