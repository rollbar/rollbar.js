var ErrorStackParser = require('error-stack-parser');

var UNKNOWN_FUNCTION = '?';
var ERR_CLASS_REGEXP = new RegExp('^(([a-zA-Z0-9-_$ ]*): *)?(Uncaught )?([a-zA-Z0-9-_$ ]*): ');

function guessFunctionName() {
  return UNKNOWN_FUNCTION;
}


function gatherContext() {
  return null;
}


function Frame(stackFrame) {
  var data = {};

  data._stackFrame = stackFrame;

  data.url = stackFrame.fileName;
  data.line = stackFrame.lineNumber;
  data.func = stackFrame.functionName;
  data.column = stackFrame.columnNumber;
  data.args = stackFrame.args;

  data.context = gatherContext();

  return data;
}


function Stack(exception) {
  function getStack() {
    var parserStack = [];
    var exc;

    if (!exception.stack) {
      try {
        throw exception;
      } catch (e) {
        exc = e;
      }
    } else {
      exc = exception;
    }

    try {
      parserStack = ErrorStackParser.parse(exc);
    } catch(e) {
      parserStack = [];
    }

    var stack = [];

    for (var i = 0; i < parserStack.length; i++) {
      stack.push(new Frame(parserStack[i]));
    }

    return stack;
  }

  var name = exception.constructor && exception.constructor.name;
  if (!name || !name.length || name.length < 3) {
    name = exception.name;
  }

  return {
    stack: getStack(),
    message: exception.message,
    name: name,
    rawStack: exception.stack,
    rawException: exception
  };
}


function parse(e) {
  return new Stack(e);
}


function guessErrorClass(errMsg) {
  if (!errMsg || !errMsg.match) {
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
