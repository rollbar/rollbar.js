/* globals expect */
/* globals describe */
/* globals it */
/* globals sinon */



var browser = require('../src/browser.js');
var Util = require('../src/util.js');

describe('Util', function() {
  Util.setupJSON(JSON);

  it('should parse a URI properly', function(done) {
    var uri = 'http://usr:pwd@www.test.com:81/dir/dir.2/index.htm?q1=0&&test1&test2=value#top';

    var parsed = Util.parseUri(uri);

    expect(parsed.anchor).to.equal('top');
    expect(parsed.query).to.equal('q1=0&&test1&test2=value');
    expect(parsed.file).to.equal('index.htm');
    expect(parsed.directory).to.equal('/dir/dir.2/');
    expect(parsed.path).to.equal('/dir/dir.2/index.htm');
    expect(parsed.relative).to.equal('/dir/dir.2/index.htm?q1=0&&test1&test2=value#top');
    expect(parsed.port).to.equal('81');
    expect(parsed.host).to.equal('www.test.com');
    expect(parsed.password).to.equal('pwd');
    expect(parsed.user).to.equal('usr');
    expect(parsed.userInfo).to.equal('usr:pwd');
    expect(parsed.authority).to.equal('usr:pwd@www.test.com:81');
    expect(parsed.protocol).to.equal('http');
    expect(parsed.source).to.equal('http://usr:pwd@www.test.com:81/dir/dir.2/index.htm?q1=0&&test1&test2=value#top');
    expect(parsed.query).to.equal('q1=0&&test1&test2=value');

    done();
  });

  it('should handle incorrect input to parseUri', function(done) {
    expect(function() {
      Util.parseUri();
    }).to.throwException(/received invalid input/);

    expect(function() {
      Util.parseUri(2);
    }).to.throwException(/received invalid input/);

    done();
  });

  it('should sanitize a URL properly', function(done) {
    var url = 'http://usr:pwd@www.test.com:81/dir/dir.2/index.htm?q1=0&&test1&test2=value#top';
    var sanitized = Util.sanitizeUrl(url);
    expect(sanitized).to.equal('http://usr:pwd@www.test.com:81/dir/dir.2/index.htm#top');

    url = 'http://usr:pwd@www.test.com:81/dir/dir.2/index.htm?q1=0&&test1&test2=value#';
    sanitized = Util.sanitizeUrl(url);
    expect(sanitized).to.equal('http://usr:pwd@www.test.com:81/dir/dir.2/index.htm');

    done();
  });

  it('should handle incorrect input to sanitizeUrl', function(done) {
    expect(function() {
      Util.sanitizeUrl();
    }).to.throwException(/received invalid input/);

    expect(function() {
      Util.sanitizeUrl(2);
    }).to.throwException(/received invalid input/);

    done();
  });

  it('should traverse all keys of an object', function(done) {

    var obj = {
      a: 'a',
      b: 'b',
      2: 2
    };

    var visited = {};
    Util.traverse(obj, function(k, v) {
      visited[k] = v;
      return v;
    });
    expect(obj).to.eql(visited);

    done();
  });

  it('should traverse all keys of a nested object', function(done) {
    var obj = {
      a: 'a',
      b: 'b',
      2: 'c',
      c: [],
      d: {}
    };
    obj[''] = {
      1: 'd',
      2: 'e',
      asdf: ['f', {cruel: 'g'}, [1, 2, 3]]
    };

    var visited = {};
    var numVisited = 0;
    Util.traverse(obj, function(k, v) {
      visited[v] = true;
      numVisited++;
      return v;
    });
    expect(numVisited).to.equal(10);

    // Don't expect [] and {} since those don't have anything to
    // traverse over
    expect(visited).to.only.have.keys(['a', 'b', 'c', 'd', 'e', 'f', 'g', '1', '2', '3']);

    done();
  });

  it('should redact strings', function(done) {
    expect(Util.redact('asdf')).to.equal('****');
    expect(Util.redact('')).to.equal('');
    expect(Util.redact(' ')).to.equal('*');
    expect(Util.redact('  ')).to.equal('**');
    expect(Util.redact('\t')).to.equal('*');
    expect(Util.redact('\n')).to.equal('*');
    expect(Util.redact('asdf\nasdf')).to.equal('*********');
    expect(Util.redact('√')).to.equal('*');
    expect(Util.redact(String('hello'))).to.equal('*****');

    done();
  });

  it('should redact ints', function(done) {
    expect(Util.redact(1)).to.equal('*');
    expect(Util.redact(100)).to.equal('***');
    expect(Util.redact(0)).to.equal('*');
    expect(Util.redact(0xf)).to.equal('**');
    expect(Util.redact(NaN)).to.equal('***');
    expect(Util.redact(parseInt('33'))).to.equal('**');
    expect(Util.redact(Number(33))).to.equal('**');

    done();
  });

  it('should redact arrays', function(done) {
    expect(Util.redact([1, 2, 3])).to.equal('*****');
    expect(Util.redact([])).to.equal('');
    expect(Util.redact(new Array(5))).to.equal('****');

    done();
  });

  it('should redact objects', function(done) {
    // {} -> '[object Object]' -> '***************'
    var redactedObj = '***************';
    expect(Util.redact({})).to.equal(redactedObj);
    expect(Util.redact({1: 2})).to.equal(redactedObj);
    expect(Util.redact({1: [3, 2, 1]})).to.equal(redactedObj);
    expect(Util.redact({hello: [3, 2, 1]})).to.equal(redactedObj);

    // null is an object, (typeof null === 'object')... how silly is that?
    expect(Util.redact(null)).to.equal('****');

    done();
  });

  it('should wrap console functions in IE8', function(done) {
    var obj = {};
    for (var i=0; i < 100; i+=1) obj['test'+i] = i;
    var ieVersion = null;
    var check = null;

    sinon.stub(browser, 'ieVersion', function(){ return ieVersion; });
    sinon.stub(console, 'error', function() { check.apply(this, arguments); });

    // Check that it behaves like normal on IE9
    ieVersion = 9;
    check = function() {
      expect(arguments[0]).to.equal('before');
      expect(arguments[1]).to.equal(obj);
      expect(arguments[2]).to.equal('after');
      expect(typeof arguments[3]).to.equal('undefined');
    };
    Util.consoleError('before', obj, 'after', undefined);

    // Now check that it returns a singnle formatted string for IE8
    ieVersion = 8;
    check = function() {
      expect(arguments.length).to.equal(1);
      expect(arguments[0]).to.match(/^before {/);
      expect(arguments[0]).to.match(/\.\.\. after undefined$/);
    };
    Util.consoleError('before', obj, 'after', undefined);

    // Now check that it works for non-IE versions as well
    ieVersion = undefined;
    check = function() {
      expect(arguments[0]).to.equal('before');
      expect(arguments[1]).to.equal(obj);
      expect(arguments[2]).to.equal('after');
      expect(typeof arguments[3]).to.equal('undefined');
    };
    Util.consoleError('before', obj, 'after', undefined);

    done();
  });
});
