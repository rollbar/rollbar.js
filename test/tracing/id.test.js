/* globals describe */
/* globals it */

import { expect } from 'chai';
import id from '../../src/tracing/id.js';

describe('id', function () {
  it('should generate random hex id of specified byte length', function (done) {
    const id8 = id.gen(8);
    const id16 = id.gen(16);
    const id32 = id.gen(32);

    expect(id8).to.match(/^[a-f0-9]{16}$/);
    expect(id16).to.match(/^[a-f0-9]{32}$/);
    expect(id32).to.match(/^[a-f0-9]{64}$/);

    const defaultId = id.gen();
    expect(defaultId).to.match(/^[a-f0-9]{32}$/);

    expect(id.gen()).to.not.equal(id.gen());

    done();
  });
});
