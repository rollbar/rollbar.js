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
});
