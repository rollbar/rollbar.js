var expect = chai.expect;

describe('Util', function() {
  it("should merge two objects properly", function(done) {
    var object1 = {a: 'b', c: {d: 1}, l: [1, 2, 3]};
    var object2 = {e: 'f', c: {h: 'i'}, g: {h: 1}};

    var result = Util.merge(object1, object2);

    expect(result).to.have.keys(['a', 'c', 'e', 'g', 'l']);
    expect(result.a).to.equal('b');
    expect(result.e).to.equal('f');
    expect(result.c).to.have.keys(['d', 'h']);
    expect(result.c.d).to.equal(1);
    expect(result.c.h).to.equal('i');
    expect(result.g).to.have.keys(['h']);
    expect(result.g.h).to.equal(1);
    expect(result.l).to.deep.equal([1, 2, 3]);

    // We correctly merged *into* object1
    expect(result).to.equal(object1);
    expect(result).to.not.equal(object2);

    // We correctly merged deep references
    expect(result.c).to.equal(object1.c);
    expect(result.g).to.not.equal(object2.g);

    done();
  });

  it("should replace arrays", function(done) {
    var object1 = {a: 'b', c: [1, 2, 3]};
    var object2 = {c: ['a']};

    var result = Util.merge(object1, object2);

    expect(result).to.have.keys(['a', 'c']);
    expect(result.a).to.equal('b');
    expect(result.c).to.deep.equal(['a']);

    done();
  });

  it("should deep copy an object properly", function(done) {
    var object = {a: 'b', c: {d: 1}, l: [1, 2, {f: 'g'}]};
    var copy = Util.copy(object);

    expect(object).to.not.equal(copy);
    expect(object).to.deep.equal(copy);

    object.c = {p: 2};
    // Make sure changes to the source does not affect the copy
    expect(object).to.not.deep.equal(copy);

    // Make sure objects within arrays are deep copied
    expect(object.l[2]).to.not.equal(copy.l[2]);

    object.l[2]['f'] = 'h';
    expect(object.l[2]['f']).to.equal('h');
    expect(copy.l[2]['f']).to.equal('g');

    object.l.push('a');
    // Make sure changes to a nested object/array in the source does not affect the copy
    expect(copy.l).to.have.length(3);

    done();
  });

  it("should deep copy an array properly", function(done) {
    var array = [{a: 'b'}, {c: {d: 'e'}}, 2, [{m: 'n'}, 2]];
    var copy = Util.copy(array);

    expect(array).to.not.equal(copy);
    expect(array).to.deep.equal(copy);

    // Make sure changes to the source does not affect the copy
    array[2] = 3;
    expect(copy[2]).to.equal(2);

    array[0]['a'] = {o: 3};
    expect(array).to.not.deep.equal(copy);

    // Make sure objects within arrays are deep copied
    expect(array[3][0]).to.not.equal(copy[3][0]);

    array[3].push('a');
    // Make sure changes to a nested object/array in the source does not affect the copy
    expect(copy[3]).to.have.length(2);

    done();
  });

  it("should parse a URI properly", function(done) {
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

  it("should handle incorrect input to parseUri", function(done) {
    expect(function() {
      Util.parseUri()
    }).to.throw('Util.parseUri() received invalid input');

    expect(function() {
      Util.parseUri(2)
    }).to.throw('Util.parseUri() received invalid input');

    done();
  });

  it("should sanitize a URL properly", function(done) {
    var url = 'http://usr:pwd@www.test.com:81/dir/dir.2/index.htm?q1=0&&test1&test2=value#top';
    var sanitized = Util.sanitizeUrl(url);
    expect(sanitized).to.equal('http://usr:pwd@www.test.com:81/dir/dir.2/index.htm#top');

    url = 'http://usr:pwd@www.test.com:81/dir/dir.2/index.htm?q1=0&&test1&test2=value#';
    sanitized = Util.sanitizeUrl(url);
    expect(sanitized).to.equal('http://usr:pwd@www.test.com:81/dir/dir.2/index.htm');

    done();
  });

  it("should handle incorrect input to sanitizeUrl", function(done) {
    expect(function() {
      Util.sanitizeUrl()
    }).to.throw('Util.sanitizeUrl() received invalid input');

    expect(function() {
      Util.sanitizeUrl(2)
    }).to.throw('Util.sanitizeUrl() received invalid input');

    done();
  });

  it("should traverse all keys of an object", function(done) {
    var obj = {
      a: 'a',
      b: 'b',
      2: 2,
      null: null
    };

    var visited = {};
    Util.traverse(obj, function(k, v) {
      visited[k] = v;
      return v;
    });
    expect(obj).to.deep.equal(visited);

    done();
  });

  it("should traverse all keys of a nested object", function(done) {
    var obj = {
      a: 'a',
      b: 'b',
      2: 'c',
      null: {
        1: 'd',
        2: 'e',
        asdf: ['f', {cruel: 'g'}, [1, 2, 3], undefined, null]
      },
      c: [],
      d: {}
    };

    var visited = [];
    Util.traverse(obj, function(k, v) {
      visited.push(v);
      return v;
    });
    expect(visited).to.have.length(12);

    // Don't expect [] and {} since those don't have anything to
    // traverse over
    expect(['a', 'b', 'c', 'd', 'e', 'f', 'g', 1, 2, 3, undefined, null]).to.include.members(visited);

    done();
  });

  it("should redact strings", function(done) {
    expect(Util.redact('asdf')).to.equal('****');
    expect(Util.redact('')).to.equal('');
    expect(Util.redact(' ')).to.equal('*');
    expect(Util.redact('  ')).to.equal('**');
    expect(Util.redact('\t')).to.equal('*');
    expect(Util.redact('\n')).to.equal('*');
    expect(Util.redact('asdf\nasdf')).to.equal('*********');
    expect(Util.redact('√')).to.equal('*');
    expect(Util.redact(String('hello'))).to.equal('*****');
    expect(Util.redact(new String('hello'))).to.equal('*****');

    done();
  });

  it("should redact ints", function(done) {
    expect(Util.redact(1)).to.equal('*');
    expect(Util.redact(100)).to.equal('***');
    expect(Util.redact(0)).to.equal('*');
    expect(Util.redact(0xf)).to.equal('**');
    expect(Util.redact(NaN)).to.equal('***');
    expect(Util.redact(parseInt('33'))).to.equal('**');
    expect(Util.redact(Number(33))).to.equal('**');
    expect(Util.redact(new Number(33))).to.equal('**');

    done();
  });

  it("should redact arrays", function(done) {
    expect(Util.redact([1, 2, 3])).to.equal('*****');
    expect(Util.redact([])).to.equal('');
    expect(Util.redact(new Array(5))).to.equal('****');

    done();
  });

  it("should redact objects", function(done) {
    // {} -> "[object Object]" -> "***************"
    var redactedObj = "***************";
    expect(Util.redact({})).to.equal(redactedObj);
    expect(Util.redact({1:2})).to.equal(redactedObj);
    expect(Util.redact({1:[3, 2, 1]})).to.equal(redactedObj);
    expect(Util.redact({hello:[3, 2, 1]})).to.equal(redactedObj);
    expect(Util.redact(new Object())).to.equal(redactedObj);

    // null is an object, (typeof null === 'object')... how silly is that?
    expect(Util.redact(null)).to.equal('****');

    done();
  });
});
