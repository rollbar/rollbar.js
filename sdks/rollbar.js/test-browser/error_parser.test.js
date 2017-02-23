/* globals expect */
/* globals describe */
/* globals it */

var errorParser = require('../src/error_parser');
var StackFrame = require('stackframe');

describe('Stack', function() {
  it('returns the stack, error message and error name', function() {
    var error = new Error('the message');
    error.name = 'MyError';

    var stack = new errorParser.Stack(error);
    expect(stack.message).to.equal('the message');
    expect(stack.name).to.equal('MyError');

    var stackArray = stack.stack;
    expect(stackArray).to.be.an('array');
  });
});

describe('Frame', function() {
  it('returns an Object instance with correct data', function() {
    var stackFrame = new StackFrame('function', [1, 2], 'filename.js', 10, 4);

    var frame = new errorParser.Frame(stackFrame);

    expect(frame.url).to.equal('filename.js');
    expect(frame.line).to.equal(10);
    expect(frame.func).to.equal('function');
    expect(frame.column).to.equal(4);
    expect(frame.args).to.eql([1, 2]);
    expect(frame.context).to.equal(null);
  });
});
