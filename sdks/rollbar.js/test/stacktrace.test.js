var expect = chai.expect;

describe('StackTrace', function() {
  it("should generate a stack trace object correctly with the correct keys and values", function(done) {
    try {
      var a = b;
    } catch (e) {
      var stackTrace = new StackTrace(e);
      var frames = stackTrace.frames;

      var i;
      var frame;
      for (i = 0; i < frames.length; ++i) {
        frame = frames[i];
        expect(frame).to.include.keys('lineno');
        expect(frame).to.include.keys('filename');
        expect(frame).to.include.keys('colno');
      }

      var lastFrame = frames[frames.length - 1];

      expect(lastFrame.filename).to.match(/stacktrace\.test\.js$/);
      expect(lastFrame.lineno).to.equal(6);
    }

    done();
  });

  it("should generate a stack trace object correctly with frame info missing", function(done) {
    var e = {
      fileName: 'test.js',
      lineNumber: 3
    };

    var stackTrace = new StackTrace(e);
    expect(stackTrace.frames).to.have.length(1);

    var onlyFrame = stackTrace.frames[0];
    expect(onlyFrame.filename).to.equal('test.js');
    expect(onlyFrame.lineno).to.equal(3);

    done();
  });
});
