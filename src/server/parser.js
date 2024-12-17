'use strict';

var logger = require('./logger');
var async = require('async');
var fs = require('fs');
var lru = require('lru-cache');
var util = require('util');
var stackTrace = require('./sourceMap/stackTrace');

var linesOfContext = 3;
var tracePattern =
  /^\s*at (?:([^(]+(?: \[\w\s+\])?(?:.*\)*)) )?\(?(.+?)(?::(\d+):(\d+)(?:, <js>:(\d+):(\d+))?)?\)?$/;

var jadeTracePattern = /^\s*at .+ \(.+ (at[^)]+\))\)$/;
var jadeFramePattern = /^\s*(>?) [0-9]+\|(\s*.+)$/m;

var cache = new lru({ max: 100 });
var pendingReads = {};

exports.cache = cache;
exports.pendingReads = pendingReads;

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

  if (util.isArray(errors)) {
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
  var lines,
    lineNumSep,
    filename,
    lineno,
    numLines,
    msg,
    i,
    contextLine,
    preContext,
    postContext,
    line,
    jadeMatch;

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
  postContext = postContext.slice(
    0,
    Math.min(postContext.length, linesOfContext),
  );

  return {
    frame: {
      method: '<jade>',
      filename: filename,
      lineno: lineno,
      code: contextLine,
      context: {
        pre: preContext,
        post: postContext,
      },
    },
    message: msg,
  };
}

function extractContextLines(frame, fileLines) {
  frame.code = fileLines[frame.lineno - 1];
  frame.context = {
    pre: fileLines.slice(
      Math.max(0, frame.lineno - (linesOfContext + 1)),
      frame.lineno - 1,
    ),
    post: fileLines.slice(frame.lineno, frame.lineno + linesOfContext),
  };
}

function mapPosition(position, diagnostic) {
  return stackTrace.mapSourcePosition(
    {
      source: position.source,
      line: position.line,
      column: position.column,
    },
    diagnostic,
  );
}

function parseFrameLine(line, callback) {
  var matched, curLine, data, frame, position;

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
  var runtimePosition = {
    source: data[1],
    line: Math.floor(data[2]),
    column: Math.floor(data[3]) - 1,
  };
  if (this.useSourceMaps) {
    position = mapPosition(runtimePosition, this.diagnostic);
  } else {
    position = runtimePosition;
  }

  frame = {
    method: data[0] || '<unknown>',
    filename: position.source,
    lineno: position.line,
    colno: position.column,
    runtimePosition: runtimePosition, // Used to match frames for locals
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

function shouldReadFrameFile(frameFilename, callback) {
  var isValidFilename, isCached, isPending;

  isValidFilename = frameFilename[0] === '/' || frameFilename[0] === '.';
  isCached = !!cache.get(frameFilename);
  isPending = !!pendingReads[frameFilename];

  callback(null, isValidFilename && !isCached && !isPending);
}

function readFileLines(filename, callback) {
  try {
    fs.readFile(filename, function (err, fileData) {
      var fileLines;
      if (err) {
        return callback(err);
      }

      fileLines = fileData.toString('utf8').split('\n');
      return callback(null, fileLines);
    });
  } catch (e) {
    logger.log(e);
  }
}

function checkFileExists(filename, callback) {
  if (stackTrace.sourceContent(filename)) {
    return callback(null, true);
  }
  fs.stat(filename, function (err) {
    callback(null, !err);
  });
}

function gatherContexts(frames, callback) {
  var frameFilenames = [];

  frames.forEach(function (frame) {
    if (frameFilenames.indexOf(frame.filename) === -1) {
      frameFilenames.push(frame.filename);
    }
  });

  async.filter(frameFilenames, shouldReadFrameFile, function (err, results) {
    if (err) return callback(err);

    var tempFileCache;

    tempFileCache = {};

    function cacheLines(filename, lines) {
      // Cache this in a temp cache as well as the LRU cache so that
      // we know we will have all of the necessary file contents for
      // each filename in tempFileCache.
      tempFileCache[filename] = lines;
      cache.set(filename, lines);
    }

    function gatherFileData(filename, callback) {
      var sourceContent = stackTrace.sourceContent(filename);
      if (sourceContent) {
        try {
          var lines = sourceContent.split('\n');
          cacheLines(filename, lines);
          return callback(null);
        } catch (err) {
          return callback(err);
        }
      }
      readFileLines(filename, function (err, lines) {
        if (err) {
          return callback(err);
        }

        cacheLines(filename, lines);

        return callback(null);
      });
    }

    function gatherContextLines(frame, callback) {
      var lines = tempFileCache[frame.filename] || cache.get(frame.filename);

      if (lines) {
        extractContextLines(frame, lines);
      }
      callback(null);
    }

    async.filter(results, checkFileExists, function (err, filenames) {
      if (err) return callback(err);
      async.each(filenames, gatherFileData, function (err) {
        if (err) {
          return callback(err);
        }
        async.eachSeries(frames, gatherContextLines, function (err) {
          if (err) {
            return callback(err);
          }
          callback(null, frames);
        });
      });
    });
  });
}

/*
 * Public API
 */

exports.parseException = function (exc, options, item, callback) {
  var multipleErrs = getMultipleErrors(exc.errors);

  return exports.parseStack(exc.stack, options, item, function (err, stack) {
    var message, clss, ret, firstErr, jadeMatch, jadeData;

    if (err) {
      logger.error('could not parse exception, err: ' + err);
      return callback(err);
    }
    message = String(exc.message || '<no message>');
    clss = String(exc.name || '<unknown>');

    ret = {
      class: clss,
      message: message,
      frames: stack,
    };

    if (multipleErrs && multipleErrs.length) {
      firstErr = multipleErrs[0];
      ret = {
        class: clss,
        message: String(firstErr.message || '<no message>'),
        frames: stack,
      };
    }

    jadeMatch = message.match(jadeFramePattern);
    if (jadeMatch) {
      jadeData = parseJadeDebugFrame(message);
      ret.message = jadeData.message;
      ret.frames.push(jadeData.frame);
    }

    if (item.localsMap) {
      item.notifier.locals.mergeLocals(
        item.localsMap,
        stack,
        exc.stack,
        function (err) {
          if (err) {
            logger.error('could not parse locals, err: ' + err);

            // Don't reject the occurrence, record the error instead.
            item.diagnostic['error parsing locals'] = err;
          }

          return callback(null, ret);
        },
      );
    } else {
      return callback(null, ret);
    }
  });
};

exports.parseStack = function (stack, options, item, callback) {
  var lines,
    _stack = stack;

  // Some JS frameworks (e.g. Meteor) might bury the stack property
  while (typeof _stack === 'object') {
    _stack = _stack && _stack.stack;
  }

  // grab all lines except the first
  lines = (_stack || '').split('\n').slice(1);

  if (options.nodeSourceMaps) {
    item.diagnostic.node_source_maps = {};
    item.diagnostic.node_source_maps.source_mapping_urls = {};
  }

  // Parse out all of the frame and filename info
  async.map(
    lines,
    parseFrameLine.bind({
      useSourceMaps: options.nodeSourceMaps,
      diagnostic: item.diagnostic,
    }),
    function (err, frames) {
      if (err) {
        return callback(err);
      }
      frames.reverse();
      async.filter(
        frames,
        function (frame, callback) {
          callback(null, !!frame);
        },
        function (err, results) {
          if (err) return callback(err);
          gatherContexts(results, callback);
        },
      );
    },
  );
};
