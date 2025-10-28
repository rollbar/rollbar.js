import { expect } from 'chai';

import { merge } from '../../src/utility.js';

describe('merge', function () {
  it('should work for simple objects', function (done) {
    var o1 = { a: 1, b: 2 };
    var o2 = { a: 42, c: 101 };
    var e = merge(o1, o2);

    expect(e.a).to.eql(42);
    expect(e.b).to.eql(2);
    expect(e.c).to.eql(101);

    e.a = 100;

    expect(o1.a).to.eql(1);
    expect(o2.a).to.eql(42);

    done();
  });
  it('should not concat arrays', function (done) {
    var o1 = { a: 1, b: ['hello', 'world'] };
    var o2 = { a: 42, b: ['goodbye'] };
    var e = merge(o1, o2);

    expect(e.a).to.eql(42);
    expect(e.b).to.contain('goodbye');
    expect(e.b).to.not.contain('world');
    expect(e.b.length).to.eql(1);

    expect(o1.b).to.contain('world');
    expect(o1.b).not.to.contain('goodbye');
    done();
  });
  it('should handle nested objects', function (done) {
    var o1 = {
      a: 1,
      c: 100,
      payload: { person: { id: 'xxx', name: 'hello' }, environment: 'foo' },
    };
    var o2 = {
      a: 42,
      b: 2,
      payload: { person: { id: 'yesyes', email: 'cool' }, other: 'bar' },
    };
    var e = merge(o1, o2);

    expect(e.a).to.eql(42);
    expect(e.c).to.eql(100);
    expect(e.b).to.eql(2);
    expect(e.payload.person.id).to.eql('yesyes');
    expect(e.payload.person.email).to.eql('cool');
    expect(e.payload.person.name).to.eql('hello');
    expect(e.payload.environment).to.eql('foo');
    expect(e.payload.other).to.eql('bar');
    done();
  });
  it('should handle nested arrays and objects, with non-matching structure', function (done) {
    var o1 = {
      a: 1,
      c: {
        arr: [3, 4, 5],
        other: [99, 100, 101],
        payload: { foo: { bar: 'baz' }, hello: 'world', keeper: 'yup' },
      },
    };
    var o2 = {
      a: 32,
      c: {
        arr: [1],
        other: { fuzz: 'buzz' },
        payload: { foo: 'hello', hello: { baz: 'bar' } },
      },
    };
    var e = merge(o1, o2);

    expect(e.a).to.eql(32);
    expect(e.c.arr.length).to.eql(1);
    expect(e.c.arr[0]).to.eql(1);
    expect(e.c.other.fuzz).to.eql('buzz');
    expect(e.c.payload.foo).to.eql('hello');
    expect(e.c.payload.hello.baz).to.eql('bar');
    expect(e.c.payload.keeper).to.eql('yup');

    done();
  });

  it('should handle many nested objects', function (done) {
    var o1 = {
      a: 1,
      c: 100,
      payload: { person: { id: 'xxx', name: 'hello' }, environment: 'foo' },
    };
    var o2 = {
      a: 42,
      b: 2,
      payload: { person: { id: 'yesyes', email: 'cool' }, other: 'bar' },
    };
    var o3 = {
      payload: { fuzz: 'buzz', person: { name: 'nope' } },
      amihere: 'yes',
    };
    var e = merge(o1, o2, o3);

    expect(e.a).to.eql(42);
    expect(e.c).to.eql(100);
    expect(e.b).to.eql(2);
    expect(e.payload.person.id).to.eql('yesyes');
    expect(e.payload.person.email).to.eql('cool');
    expect(e.payload.person.name).to.eql('nope');
    expect(e.payload.environment).to.eql('foo');
    expect(e.payload.fuzz).to.eql('buzz');
    expect(e.payload.other).to.eql('bar');
    expect(e.amihere).to.eql('yes');
    done();
  });
  it('should be secure against prototype pollution', function () {
    const o1 = JSON.parse('{"__proto__": {"polluted": "yes"}}');
    const o2 = JSON.parse('{"__proto__": {"polluted": "yes"}}');
    const result = merge(o1, o2);
    expect({}.polluted).to.not.eql('yes');
    expect(result.polluted).to.not.eql('yes');
  });
});
