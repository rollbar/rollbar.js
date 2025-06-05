/* globals describe */
/* globals it */
/* globals beforeEach */

import { expect } from 'chai';
import * as t from '../src/server/transforms.js';
import {
  CustomError,
  isMinNodeVersion,
} from './server.transforms.test-utils.mjs';

describe('transforms.handleItemWithError', function () {
  let options;

  beforeEach(function () {
    options = {
      some: 'stuff',
      captureIp: true,
    };
  });

  it('should not change the item with no error', function (done) {
    const item = {
      data: { body: { yo: 'hey' } },
      message: 'hey',
    };

    t.handleItemWithError(item, options, (err, item) => {
      expect(err).to.not.exist;
      expect(item.data.body.yo).to.equal('hey');
      done();
    });
  });

  it('should add some data to the trace_chain with a simple error', function (done) {
    const item = {
      data: { body: {} },
      err: new Error('wookie'),
    };

    t.handleItemWithError(item, options, (err, item) => {
      expect(err).to.not.exist;
      expect(item.stackInfo).to.exist;
      done();
    });
  });

  it('should add some data to the trace_chain with a normal error', function (done) {
    let testError;

    const test = function () {
      const x = thisVariableIsNotDefined;
    };

    try {
      test();
    } catch (e) {
      testError = e;
    }

    const item = {
      data: { body: {} },
      err: testError,
    };

    t.handleItemWithError(item, options, (err, item) => {
      expect(err).to.not.exist;
      expect(item.stackInfo).to.exist;
      done();
    });
  });

  it('should have the right data in the trace_chain with a nested error', function (done) {
    let testError;

    const test = function () {
      const x = thisVariableIsNotDefined;
    };

    try {
      test();
    } catch (e) {
      testError = new CustomError('nested-message', e);
    }

    const item = {
      data: { body: {} },
      err: testError,
    };

    t.handleItemWithError(item, options, (err, item) => {
      expect(err).to.not.exist;

      const trace_chain = item.stackInfo;
      expect(trace_chain).to.have.lengthOf(2);
      expect(trace_chain[0].exception.class).to.equal('CustomError');
      expect(trace_chain[0].exception.message).to.equal('nested-message');
      expect(trace_chain[1].exception.class).to.equal('ReferenceError');

      done();
    });
  });

  it('should have the right data in the trace_chain with a null nested error', function (done) {
    const err = new CustomError('With null nested error');
    err.nested = null;

    const item = {
      data: { body: {} },
      err: err,
    };

    t.handleItemWithError(item, options, (err, item) => {
      expect(err).to.not.exist;

      const trace_chain = item.stackInfo;
      expect(trace_chain).to.have.lengthOf(1);
      expect(trace_chain[0].exception.class).to.equal('CustomError');

      done();
    });
  });

  it('should should add the error context with error context', function (done) {
    let testError;

    const test = function () {
      const x = thisVariableIsNotDefined;
    };

    try {
      test();
    } catch (e) {
      testError = new CustomError('nested-message', e);
      e.rollbarContext = { err1: 'nested context' };
      testError.rollbarContext = { err2: 'error context' };
    }

    options.addErrorContext = true;

    const item = {
      data: { body: {} },
      err: testError,
    };

    t.handleItemWithError(item, options, (err, item) => {
      expect(err).to.not.exist;

      const trace_chain = item.stackInfo;
      expect(trace_chain).to.have.lengthOf(2);
      expect(item.data.custom.err1).to.equal('nested context');
      expect(item.data.custom.err2).to.equal('error context');

      done();
    });
  });

  it('should have the right data in the trace_chain with an error cause', function (done) {
    // Error cause was introduced in Node 16.9.
    if (!isMinNodeVersion(16, 9)) {
      this.skip();
    }

    let testError;

    const test = function () {
      const x = thisVariableIsNotDefined;
    };

    try {
      test();
    } catch (e) {
      testError = new Error('cause message', { cause: e });
      e.rollbarContext = { err1: 'cause context' };
      testError.rollbarContext = { err2: 'error context' };
    }

    options.addErrorContext = true;

    const item = {
      data: { body: {} },
      err: testError,
    };

    t.handleItemWithError(item, options, (err, item) => {
      expect(err).to.not.exist;

      const trace_chain = item.stackInfo;
      expect(trace_chain).to.have.lengthOf(2);
      expect(trace_chain[0].exception.class).to.equal('Error');
      expect(trace_chain[0].exception.message).to.equal('cause message');
      expect(trace_chain[1].exception.class).to.equal('ReferenceError');
      expect(item.data.custom.err1).to.equal('cause context');
      expect(item.data.custom.err2).to.equal('error context');

      done();
    });
  });
});
