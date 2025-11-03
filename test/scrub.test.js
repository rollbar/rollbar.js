import { expect } from 'chai';

import scrub from '../src/scrub.js';
import { redact } from '../src/utility.js';

describe('scrub', function () {
  it('should not redact fields that are okay', function () {
    var data = { a: 'somestring', password: 'abc123', tempWorker: 'cool' };
    var scrubFields = ['password', 'b', 'pw'];

    var result = scrub(data, scrubFields);

    expect(result.a).to.eql('somestring');
    expect(result.tempWorker).to.eql('cool');
  });
  it('should redact fields that are in the field list', function () {
    var data = { a: 'somestring', password: 'abc123' };
    var scrubFields = ['password', 'b'];

    var result = scrub(data, scrubFields);

    expect(result.password).to.eql(redact());
  });
  it('should handle nested objects', function () {
    var data = {
      a: {
        b: { badthing: 'secret', other: 'stuff' },
        c: 'bork',
        password: 'abc123',
      },
      secret: 'blahblah',
    };
    var scrubFields = ['badthing', 'password', 'secret'];

    var result = scrub(data, scrubFields);

    expect(result.a.b.other).to.eql('stuff');
    expect(result.a.b.badthing).to.eql(redact());
    expect(result.a.c).to.eql('bork');
    expect(result.a.password).to.eql(redact());
    expect(result.secret).to.eql(redact());
    expect(data.secret).to.eql('blahblah');
  });
  it('should do something sane for recursive objects', function () {
    var inner = { a: 'what', b: 'yes' };
    var data = { thing: 'stuff', password: 'abc123' };
    data.inner = inner;
    inner.outer = data;
    var scrubFields = ['password', 'a'];

    var result = scrub(data, scrubFields);

    expect(result.thing).to.eql('stuff');
    expect(result.password).to.eql(redact());
    expect(result.inner.a).to.eql(redact());
    expect(result.inner.a).to.be.ok;
    expect(result.inner.b).to.eql('yes');
  });
  it('should scrub objects seen twice', function () {
    var request = { password: 'foo' };

    var data = { request, response: { request } };

    var scrubFields = ['password'];

    var result = scrub(data, scrubFields);

    expect(result.request.password).to.eql(redact());
    expect(result.response.request.password).to.eql(redact());
  });
  it('should handle scrubPaths', function () {
    var data = {
      a: { b: { foo: 'secret', bar: 'stuff' }, c: 'bork', password: 'abc123' },
      secret: 'blahblah',
    };
    var scrubPaths = [
      'nowhere', // path not found
      'a.b.foo', // nested path
      'a.password', // nested path
      'secret', // root path
    ];

    var result = scrub(data, [], scrubPaths);

    expect(result.a.b.bar).to.eql('stuff');
    expect(result.a.b.foo).to.eql(redact());
    expect(result.a.c).to.eql('bork');
    expect(result.a.password).to.eql(redact());
    expect(result.secret).to.eql(redact());
  });
});
