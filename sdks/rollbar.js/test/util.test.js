var expect = chai.expect;

describe('Util', function() {
  it("should merge two objects properly", function() {
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
  });

  it("should deep copy an object properly", function() {
    var object = {a: 'b', c: {d: 1}, l: [1, 2, 3]};
    var copy = Util.copy(object);

    expect(object).to.not.equal(copy);
    expect(object).to.deep.equal(copy);

    object.c = {p: 2};

    expect(object).to.not.deep.equal(copy);
  });

  it("should parse a URI properly", function() {
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
  });

  it("should sanitize a URL properly", function() {
    var url = 'http://usr:pwd@www.test.com:81/dir/dir.2/index.htm?q1=0&&test1&test2=value#top';
    var sanitized = Util.sanitizeUrl(url);
    expect(sanitized).to.equal('http://usr:pwd@www.test.com:81/dir/dir.2/index.htm#top');

    url = 'http://usr:pwd@www.test.com:81/dir/dir.2/index.htm?q1=0&&test1&test2=value#';
    sanitized = Util.sanitizeUrl(url);
    expect(sanitized).to.equal('http://usr:pwd@www.test.com:81/dir/dir.2/index.htm');
  });
});
