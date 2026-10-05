import fs from 'fs';
import util from 'util';

import async from 'async';
import lru from 'lru-cache';

import logger from '../logger.js';

import * as stackTrace from './sourceMap/stackTrace.js';

var linesOfContext = 3;

// Stack lines are untrusted input: a Node Error's `.stack` begins with its
// message, so a newline in an attacker-influenced message turns the text after
// it into a "frame" line. Frame lines used to be parsed with two regexes whose
// overlapping quantifiers backtracked catastrophically on crafted lines,
// blocking the event loop for seconds (RB-01). matchTraceLine and
// matchJadeTrace below return exactly what those regexes captured, in linear
// time:
//
//   /^\s*at (?:([^(]+(?: \[\w\s+\])?(?:.*\)*)) )?\(?(.+?)(?::(\d+):(\d+)(?:, <js>:(\d+):(\d+))?)?\)?$/
//   /^\s*at .+ \(.+ (at[^)]+\))\)$/
//
// test/server.parser.test.js checks both against these regexes on random input.
var framePrefixPattern = /^\s*at /;
var framePositionPattern = /:(\d+):(\d+)(?:, <js>:(\d+):(\d+))?\)?$/;
// The characters `.` does not match (`\n` never occurs within a line).
var lineTerminatorPattern = /[\r\u2028\u2029]/;

var jadeFramePattern = /^\s*(>?) [0-9]+\|(\s*.+)$/m;

// Bounds the per-frame work (parsing, source-map lookups, file reads) that a
// newline-laden message can trigger. Applied to frame-shaped lines only (see
// parseStack). Node captures 10 frames by default.
var MAX_STACK_FRAMES = 1000;

var cache = new lru({ max: 100 });
var pendingReads = {};

export { cache, pendingReads };

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

/**
 * Parse a V8 stack frame line in linear time.
 *
 * Equivalent to the original trace regex (see the comment at the top of this
 * file). Its greedy method group always ends at the last space that leaves a
 * non-empty location, its location group is the shortest prefix followed by an
 * optional `:line:col[, <js>:line:col]` suffix, and `.` rejects line
 * terminators, which this reproduces explicitly.
 *
 * @param {string} line - A single stack trace line.
 * @returns {Array|null} `[method, filename, line, column, compiledLine,
 *   compiledColumn]` (unmatched parts undefined), or null if not a frame.
 */
export function matchTraceLine(line) {
  var prefix = framePrefixPattern.exec(line);
  if (!prefix) {
    return null;
  }

  var rest = line.slice(prefix[0].length);
  var method;
  var location = rest;
  var split = rest.lastIndexOf(' ', rest.length - 2);
  if (split > 0 && rest[0] !== '(') {
    method = rest.slice(0, split);
    location = rest.slice(split + 1);
  }

  if (!location || lineTerminatorPattern.test(location)) {
    return null;
  }
  // A terminator can only sit in the method's leading `[^(]+` part.
  if (method !== undefined) {
    var paren = method.indexOf('(');
    if (paren !== -1 && lineTerminatorPattern.test(method.slice(paren))) {
      return null;
    }
  }

  if (location.length > 1 && location[0] === '(') {
    location = location.slice(1);
  }

  // The filename keeps at least one character, so search from index 1.
  var position = framePositionPattern.exec(location.slice(1));
  if (position) {
    return [method, location.slice(0, position.index + 1)].concat(
      position.slice(1),
    );
  }

  if (location.length > 1 && location[location.length - 1] === ')') {
    location = location.slice(0, -1);
  }
  return [method, location, undefined, undefined, undefined, undefined];
}

/**
 * Extract the inner `at …)` of a Jade/eval frame line in linear time.
 *
 * Equivalent to the original jade regex (see the comment at the top of this
 * file): `at <M1> (<M2> at<N>))`, where M1 and M2 are non-empty and free of
 * line terminators, N is non-empty and contains no `)`, and the greedy M1 and
 * then M2 pick the latest possible split.
 *
 * @param {string} line - A single stack trace line.
 * @returns {string|null} The captured `at…)` text, or null if no match.
 */
export function matchJadeTrace(line) {
  var n = line.length;
  var prefix = framePrefixPattern.exec(line);
  if (!prefix || line.slice(-2) !== '))') {
    return null;
  }
  var start = prefix[0].length;

  // N (after the capture's `at`) must be `)`-free up to the closing `))`.
  var lastParen = line.lastIndexOf(')', n - 3);
  // M1 cannot extend past the first line terminator.
  var firstTerminator = n;
  for (var j = start; j < n; j++) {
    if (lineTerminatorPattern.test(line[j])) {
      firstTerminator = j;
      break;
    }
  }

  // Walk the ` (` (M1's end) candidates latest first, tracking the latest
  // ` at` capture whose M2 stays terminator-free from i + 2. A terminator
  // entering M2 invalidates the tracked capture; any valid capture must then
  // start at or before i, so it is picked up as the scan continues.
  var capture = -1;
  for (var i = n - 5; i > start; i--) {
    if (lineTerminatorPattern.test(line[i + 2])) {
      capture = -1;
    }
    if (
      capture < 0 &&
      i >= start + 5 &&
      i + 2 > lastParen &&
      line[i - 1] === ' ' &&
      line[i] === 'a' &&
      line[i + 1] === 't'
    ) {
      capture = i;
    }
    if (
      i <= firstTerminator &&
      line[i] === ' ' &&
      line[i + 1] === '(' &&
      capture >= i + 4
    ) {
      return line.slice(capture, n - 1);
    }
  }
  return null;
}

function parseFrameLine(line, callback) {
  var curLine, data, frame, position;

  curLine = matchJadeTrace(line) || line;

  data = matchTraceLine(curLine);
  if (!data) {
    return callback(null, null);
  }

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
  isCached = Boolean(cache.get(frameFilename));
  isPending = Boolean(pendingReads[frameFilename]);

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

export function parseException(exc, options, item, callback) {
  var multipleErrs = getMultipleErrors(exc.errors);

  return parseStack(exc.stack, options, item, function (err, stack) {
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
}

export function parseStack(stack, options, item, callback) {
  var lines,
    _stack = stack;

  // Some JS frameworks (e.g. Meteor) might bury the stack property
  while (typeof _stack === 'object') {
    _stack = _stack && _stack.stack;
  }

  // grab all lines except the first
  lines = (_stack || '').split('\n').slice(1);

  // The message precedes the frames, so a long multi-line message must not
  // use up the cap. Lines without the frame prefix can never become frames:
  // both matchers require it.
  lines = lines.filter(function (line) {
    return framePrefixPattern.test(line);
  });
  if (lines.length > MAX_STACK_FRAMES) {
    lines = lines.slice(0, MAX_STACK_FRAMES);
  }

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
          callback(null, Boolean(frame));
        },
        function (err, results) {
          if (err) return callback(err);
          gatherContexts(results, callback);
        },
      );
    },
  );
}
