import { expect } from 'chai';

import replace from '../src/utility/replace.js';

describe('replace', function () {
  function original() {
    return 'original';
  }

  function wrapper(orig) {
    return function () {
      return 'wrapped ' + orig();
    };
  }

  it('should replace a writable property and record the original', function () {
    const obj = { fn: original };
    const replacements = { network: [] };

    expect(replace(obj, 'fn', wrapper, replacements, 'network')).to.equal(true);

    expect(obj.fn()).to.equal('wrapped original');
    expect(replacements.network).to.eql([[obj, 'fn', original]]);
  });

  // https://github.com/rollbar/rollbar.js/issues/1451
  it('should not throw when the property is read-only', function () {
    const obj = {};
    Object.defineProperty(obj, 'fn', { value: original, writable: false });
    const replacements = { network: [] };

    expect(replace(obj, 'fn', wrapper, replacements, 'network')).to.equal(
      false,
    );

    expect(obj.fn).to.equal(original);
    expect(replacements.network).to.eql([]);
  });

  it('should not throw when the property is inherited from a read-only prototype property', function () {
    const proto = {};
    Object.defineProperty(proto, 'fn', { value: original, writable: false });
    const obj = Object.create(proto);
    const replacements = { network: [] };

    expect(replace(obj, 'fn', wrapper, replacements, 'network')).to.equal(
      false,
    );

    expect(obj.fn).to.equal(original);
    expect(replacements.network).to.eql([]);
  });

  it('should not throw when the object is frozen', function () {
    const obj = Object.freeze({ fn: original });
    const replacements = { network: [] };

    expect(replace(obj, 'fn', wrapper, replacements, 'network')).to.equal(
      false,
    );

    expect(obj.fn).to.equal(original);
    expect(replacements.network).to.eql([]);
  });

  it('should not throw when the property is a getter without a setter', function () {
    const obj = {};
    Object.defineProperty(obj, 'fn', { get: () => original });

    expect(replace(obj, 'fn', wrapper)).to.equal(false);
    expect(obj.fn).to.equal(original);
  });
});
