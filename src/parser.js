var ErrorStackParser = require('error-stack-parser');

function Frame(stackFrame) {
  var data = {};

  data._stackFrame = stackFrame;

  data.url = stackFrame.fileName;
  data.line = stackFrame.lineNumber;
  data.func = stackFrame.functionName;
  data.column = stackFrame.columnNumber;
  data.args = stackFrame.args;

  data.context = []; // TODO

  return data;
};

function Stack(e) {
  function getMessage() {

    return 'message';
  }

  function getName() {
    return 'name';
  }

  function getMode() {
    return 'mode'
  }

  function getStack() {
    var parserStack = ErrorStackParser.parse(e);

    var stack = [];

    for (var i = 0; i < parserStack.length - 1; i++) {
      stack.push(new Frame(parserStack[i]));
    }

    return stack;
  }

  return {
    stack: getStack(),
    message: getMessage(),
    name: getName(),
    mode: getMode()
  };
};


function parse(e) {
  return new Stack(e);
}

function guessFunctionName(url, line) {
  return '';
}

function gatherContext(url, line) {
  return [];
}

module.exports = {
  guessFunctionName: guessFunctionName,
  gatherContext: gatherContext,
  parse: parse
};
