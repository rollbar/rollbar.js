/* globals expect */
/* globals describe */
/* globals it */

var t = require('../src/truncation');
var utility = require('../src/utility');
utility.setupJSON();

describe('truncate', function () {
  it('should not truncate something small enough', function () {
    var payload = messagePayload('hello world');
    var result = t.truncate(payload);
    expect(result.value).to.be.ok();

    var resultValue = JSON.parse(result.value);
    expect(resultValue).to.eql(payload);
  });

  it('should try all strategies if payload too big', function () {
    var payload = tracePayload(10, repeat('a', 500));
    var result = t.truncate(payload, undefined, 1);
    expect(result.value).to.be.ok();

    var resultValue = JSON.parse(result.value);

    expect(resultValue.data.body.trace.exception.description).to.not.be.ok();
    expect(resultValue.data.body.trace.exception.message.length).to.be.below(
      256,
    );
    expect(resultValue.data.body.trace.frames.length).to.be.below(3);
  });

  it('should not truncate ascii payload close to max size', function () {
    var payload = tracePayload(10, repeat('i', 500));
    var result = t.truncate(payload, undefined, 1100); // payload will be 500 + 528
    expect(result.value).to.be.ok();

    var resultValue = JSON.parse(result.value);
    expect(resultValue).to.eql(payload);
  });

  it('should truncate non-ascii payload when oversize', function () {
    var payload = tracePayload(10, repeat('あ', 500)); // あ is 3 utf-8 bytes (U+3042)
    var result = t.truncate(payload, undefined, 1100); // payload will be 1500 + 528
    expect(result.value).to.be.ok();

    var resultValue = JSON.parse(result.value);
    expect(resultValue.data.body.trace.frames.length).to.be.below(3);
  });
});

describe('raw', function () {
  it('should do nothing', function () {
    var payload = messagePayload('something');
    var rawResult = t.raw(payload);
    expect(rawResult[0]).to.eql(payload);
  });
});

describe('truncateFrames', function () {
  it('should do nothing with small number of frames', function () {
    var payload = tracePayload(5);
    var result = t.truncateFrames(payload, undefined, 5);
    var resultP = result[0];
    expect(resultP.data.body.trace.frames.length).to.eql(5);
  });

  it('should cut out middle frames if too many', function () {
    var payload = tracePayload(20);
    var result = t.truncateFrames(payload, undefined, 5);
    var resultP = result[0];
    expect(resultP.data.body.trace.frames.length).to.eql(10);
  });

  it('should do nothing with small number of frames trace_chain', function () {
    var payload = traceChainPayload(4, 5);
    var result = t.truncateFrames(payload, undefined, 5);
    var resultP = result[0];
    expect(resultP.data.body.trace_chain[0].frames.length).to.eql(5);
    expect(resultP.data.body.trace_chain[3].frames.length).to.eql(5);
  });

  it('should cut out middle frames if too many trace_chain', function () {
    var payload = traceChainPayload(4, 20);
    var result = t.truncateFrames(payload, undefined, 5);
    var resultP = result[0];
    expect(resultP.data.body.trace_chain[0].frames.length).to.eql(10);
    expect(resultP.data.body.trace_chain[3].frames.length).to.eql(10);
  });
});

describe('truncateStrings', function () {
  it('should work recursively on different string sizes', function () {
    var payload = {
      access_token: 'abc',
      data: {
        body: {
          small: 'i am a small string',
          big: repeat('hello world', 20),
          exact: repeat('a', 50),
          exactPlusOne: repeat('a', 51),
        },
        other: 'this is ok',
        not: repeat('too big', 30),
      },
    };

    var result = t.truncateStrings(50, payload);
    var resultP = result[0];

    expect(resultP.data.body.small.length).to.eql(19);
    expect(resultP.data.body.big.length).to.eql(50);
    expect(resultP.data.body.exact.length).to.eql(50);
    expect(resultP.data.body.exact[49]).to.eql('a');
    expect(resultP.data.body.exactPlusOne.length).to.eql(50);
    expect(resultP.data.body.exactPlusOne[49]).to.eql('.');
    expect(resultP.data.other.length).to.eql(10);
    expect(resultP.data.not.length).to.eql(50);
    expect(resultP.data.not[49]).to.eql('.');
  });
});

describe('maybeTruncateValue', function () {
  it('should handle falsey things', function () {
    expect(t.maybeTruncateValue(42, null)).to.be(null);
    expect(t.maybeTruncateValue(42, false)).to.eql(false);
    expect(t.maybeTruncateValue(42, undefined)).to.be(undefined);
  });

  it('should handle strings shorter than the length', function () {
    var len = 10;
    var val = 'hello';
    var result = t.maybeTruncateValue(len, val);
    expect(result).to.eql(val);
    expect(result.length).to.be.below(len + 1);
  });
  it('should handle strings longer than the length', function () {
    var len = 10;
    var val = repeat('hello', 3);
    var result = t.maybeTruncateValue(len, val);
    expect(result).to.not.eql(val);
    expect(result.length).to.be.below(len + 1);
  });
  it('should handle arrays shorter than the length', function () {
    var len = 10;
    var val = repeat('a,', 8).split(',');
    val.pop();
    var result = t.maybeTruncateValue(len, val);
    expect(result).to.eql(val);
    expect(result.length).to.be.below(len + 1);
  });
  it('should handle arrays longer than the length', function () {
    var len = 10;
    var val = repeat('a,', 12).split(',');
    val.pop();
    var result = t.maybeTruncateValue(len, val);
    expect(result).to.not.eql(val);
    expect(result.length).to.be.below(len + 1);
  });
});

function messagePayload(message) {
  return {
    access_token: 'abc',
    data: {
      body: {
        message: {
          body: message,
        },
      },
    },
  };
}

function tracePayload(frameCount, message) {
  message = typeof message !== 'undefined' ? message : 'EXCEPTION MESSAGE';
  var frames = [];
  for (var i = 0; i < frameCount; i++) {
    frames.push({
      filename: 'some/file/name',
      lineno: i,
    });
  }
  return {
    access_token: 'abc',
    data: {
      body: {
        trace: {
          exception: {
            description: 'ALL YOUR BASE',
            message: message,
          },
          frames: frames,
        },
      },
    },
  };
}

function traceChainPayload(traceCount, frameCount, message) {
  message = typeof message !== 'undefined' ? message : 'EXCEPTION MESSAGE';
  var chain = [];
  for (var c = 0; c < traceCount; c++) {
    var frames = [];
    for (var i = 0; i < frameCount; i++) {
      frames.push({
        filename: 'some/file/name::' + c,
        lineno: i,
      });
    }
    chain.push({
      exception: {
        description: 'ALL YOUR BASE :: ' + c,
        message: message,
      },
      frames: frames,
    });
  }
  return {
    access_token: 'abc',
    data: {
      body: {
        trace_chain: chain,
      },
    },
  };
}

function repeat(s, n) {
  var result = s;
  for (var i = 1; i < n; i++) {
    result += s;
  }
  return result;
}
