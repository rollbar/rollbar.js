var ErrorStackParser = require('error-stack-parser');

var UNKNOWN_FUNCTION = '?';
var ERR_CLASS_REGEXP = new RegExp('^(([a-zA-Z0-9-_$ ]*): *)?(Uncaught )?([a-zA-Z0-9-_$ ]*): ');

function guessFunctionName() {
  return UNKNOWN_FUNCTION;
}


function gatherContext(url, line, col) {
  if (line && url == window.location.href) {
    col = col || 0;
    try {
      var serializer = new XMLSerializer();
      var source = serializer.serializeToString(window.document);
      var sourceLines = source.split('\n');
      var sourceLine = sourceLines[line];
      var sourceSnippet = sourceLine.substring(col, Math.min(sourceLine.length, col + 50));
      return [sourceSnippet];
    } catch (e) {
      //pass
      console.error(e);
    }
  }
}


function Frame(stackFrame) {
  var data = {};

  data._stackFrame = stackFrame;

  data.url = stackFrame.fileName;
  data.line = stackFrame.lineNumber;
  data.func = stackFrame.functionName;
  data.column = stackFrame.columnNumber;
  data.args = stackFrame.args;

  data.context = gatherContext(data.url, data.line, data.column);

  return data;
}


function Stack(exception) {
  function getStack() {
    var parserStack = [];

    try {
      parserStack = ErrorStackParser.parse(exception);
    } catch(e) {
      parserStack = [];
    }

    var stack = [];

    for (var i = 0; i < parserStack.length; i++) {
      stack.push(new Frame(parserStack[i]));
    }

    return stack;
  }

  return {
    stack: getStack(),
    message: exception.message,
    name: exception.name
  };
}


function parse(e) {
  return new Stack(e);
}


function guessErrorClass(errMsg) {
  if (!errMsg) {
    return ['Unknown error. There was no error message to display.', ''];
  }
  var errClassMatch = errMsg.match(ERR_CLASS_REGEXP);
  var errClass = '(unknown)';

  if (errClassMatch) {
    errClass = errClassMatch[errClassMatch.length - 1];
    errMsg = errMsg.replace((errClassMatch[errClassMatch.length - 2] || '') + errClass + ':', '');
    errMsg = errMsg.replace(/(^[\s]+|[\s]+$)/g, '');
  }
  return [errClass, errMsg];
}


module.exports = {
  guessFunctionName: guessFunctionName,
  guessErrorClass: guessErrorClass,
  gatherContext: gatherContext,
  parse: parse,
  Stack: Stack,
  Frame: Frame
};
