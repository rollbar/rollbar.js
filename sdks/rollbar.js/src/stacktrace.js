/*
 * Derived work from raven-js at https://github.com/lincolnloop/raven-js
 *
 * Requires Util.sanitizeUrl
 */

var StackTrace = function(exc) {
  var frames = [];

  if (exc.arguments && exc.stack) {
    frames = _parseChromeExc(exc);
  } else if (exc.stack) {
    if (exc.stack.indexOf('@') === -1) {
      frames = _parseChromeExc(exc);
    } else {
      frames = _parseFirefoxOrSafariExc(exc);
    }
  } else {
    var lineno = parseInt(typeof exc.line !== 'undefined' ? exc.line : exc.lineNumber, 10) || 0;
    var fileUrl = Util.sanitizeUrl((typeof exc.sourceURL !== 'undefined' ? exc.sourceURL : exc.fileName) || null);

    frames = [{filename: fileUrl, lineno: lineno}];
  }
  this.frames = frames.reverse();
};

function _parseChromeExc(e) {
  var chunks, fn, filename, lineno, colno,
      traceback = [],
      lines = e.stack.split('\n'),
      i, line, len = lines.length, frames = [];

  var lineNoRegex = /:([0-9]+(:([0-9]+))?)$/;

  // Skip the first line
  for (i = 1; i < len; ++i) {
    line = lines[i];
    chunks = line.replace(/^\s+|\s+$/g, '').slice(3);
    if (chunks === 'unknown source') {
      continue;
    } else {
      chunks = chunks.split(' ');
    }

    if (chunks.length > 2) {
      fn = chunks.slice(0, -1).join(' ');
      filename = chunks.slice(-1)[0];
      lineno = 0;
    } else if (chunks.length === 2) {
      fn = chunks[0];
      filename = chunks[1];
    } else {
      fn = null;
      filename = chunks[0];
    }

    if (filename && filename !== '(unknown source)') {
      if (filename[0] === '(') {
        filename = filename.slice(1, -1);
      }
      var lineNoMatch = lineNoRegex.exec(filename);
      if (lineNoMatch) {
        lineno = lineNoMatch[1];
        lineno = lineno.split(':');
        if (lineno.length > 1) {
          colno = parseInt(lineno[1], 10);
        } else {
          colno = null;
        }
        lineno = parseInt(lineno[0], 10);
        filename = Util.sanitizeUrl(filename.slice(0, filename.indexOf(lineNoMatch[0])));
      } else {
        lineno = 0;
        colno = null;
      }
    }

    frames.push({filename: filename, lineno: lineno, colno: colno, method: fn});
  } 
  return frames;
}

function _parseFirefoxOrSafariExc(e) {
  var chunks, fn, filename, lineno,
      traceback = [],
      lines = e.stack.split('\n'),
      i, line, len = lines.length, frames = [];

  for (i = 0; i < len; ++i) {
    line = lines[i];

    if (line) {
      chunks = line.split('@');
      if (chunks[0]) {
        fn = chunks[0].split('(');
        fn = (typeof fn[0] !== 'undefined' && String(fn[0]).length) ? fn[0] : null;
      } else {
        fn = null;
      }

      if (chunks.length > 1) {
        filename = chunks[1].split(':');
        lineno = parseInt(filename.slice(-1)[0], 10) || 0;
        filename = Util.sanitizeUrl(filename.slice(0, -1).join(':')) || '<native code>';
      } else if (chunks[0] === '[native code]') {
        fn = null;
        filename = '<native code>';
        lineno = 0;
      }
      
      var frame = {filename: filename, lineno: lineno, method: fn};
      
      // Firefox gives a column number for the first frame
      if (i === 0 && e.columnNumber) {
        // Add 1 to represent a column number starting from 1 since Firefox
        // provides a 0-based column number
        frame.colno = e.columnNumber + 1;
      }
      
      frames.push(frame);
    }
  }
  return frames;
}
