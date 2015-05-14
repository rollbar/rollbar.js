var ErrorStackParser = require('error-stack-parser');

var UNKNOWN_FUNCTION = '?';


function guessFunctionName(url, line) {
  return UNKNOWN_FUNCTION;
}

function gatherContext(url, line) {
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

  data.context = gatherContext(data.url, data.line);

  return data;
};

function Stack(e) {
  function getStack() {
    var parserStack = [];

    try {
      parserStack = ErrorStackParser.parse(e);
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
    message: e.message,
    name: e.name
  };
};

function parse(e) {
  return new Stack(e);
}

module.exports = {
  guessFunctionName: guessFunctionName,
  gatherContext: gatherContext,
  parse: parse
};
