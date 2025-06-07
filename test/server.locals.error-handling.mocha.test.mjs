/* globals describe */
/* globals it */
/* globals beforeEach */
/* globals afterEach */

import { expect } from 'chai';
import sinon from 'sinon';
import Rollbar from '../src/server/rollbar.js';
import Locals from '../src/server/locals.js';
import {
  nodeMajorVersion,
  nodeThrow,
  nodeThrowNested,
  nodeThrowAndCatch,
  promiseReject,
  nodeThrowWithNestedLocals,
  nodeThrowRecursionError,
  verifyRejectedPromise,
} from './server.locals.test-utils.mjs';

describe('server.locals error handling', function () {
  let mochaExceptionHandlers;
  let mochaRejectionHandlers;

  beforeEach(function () {
    // Remove Mocha's error handlers
    mochaExceptionHandlers = process.listeners('uncaughtException');
    mochaExceptionHandlers.forEach((handler) => {
      process.removeListener('uncaughtException', handler);
    });

    mochaRejectionHandlers = process.listeners('unhandledRejection');
    mochaRejectionHandlers.forEach((handler) => {
      process.removeListener('unhandledRejection', handler);
    });
  });

  afterEach(function () {
    // Restore Mocha's error handlers
    mochaExceptionHandlers.forEach((h) => process.on('uncaughtException', h));
    mochaRejectionHandlers.forEach((h) => process.on('unhandledRejection', h));
  });

  describe('with locals enabled', function () {
    let rollbar;
    let addItemStub;

    beforeEach(function () {
      rollbar = new Rollbar({
        accessToken: 'abc123',
        captureUncaught: true,
        captureUnhandledRejections: true,
        locals: { module: Locals, uncaughtOnly: true, depth: 0 },
      });

      addItemStub = sinon.stub(rollbar.client.notifier.queue, 'addItem');
    });

    afterEach(function () {
      addItemStub.restore();
    });

    it('should include locals on uncaught error', async function () {
      await nodeThrow();
      expect(addItemStub.called).to.be.true;

      const traceChain = addItemStub.getCall(0).args[3].data.body.trace_chain;
      expect(traceChain[0].exception.message).to.equal('node error');

      let frames = traceChain[0].frames;
      expect(frames).to.have.length.above(1);

      if (nodeMajorVersion >= 18) {
        // Node >=18; locals only in top frame
        expect(frames.at(-1).locals.error).to.equal('<Error object>');
        expect(frames.at(-2).locals).to.not.exist;
      } else if (nodeMajorVersion >= 10) {
        // Node >=10; locals enabled
        expect(frames.at(-1).locals.error).to.equal('<Error object>');
        expect(frames.at(-2).locals.timer).to.equal('<Timeout object>');
      } else {
        // Node <=8; locals disabled
        expect(frames.at(-1).locals).to.not.exist;
        expect(frames.at(-2).locals).to.not.exist;
      }
    });

    describe('then disabled', function () {
      beforeEach(function () {
        addItemStub?.restore();
        rollbar.configure({ locals: { enabled: false } });
        addItemStub = sinon.stub(rollbar.client.notifier.queue, 'addItem');
      });

      it('should not include locals', async function () {
        await nodeThrowNested();
        expect(addItemStub.called).to.be.true;

        const traceChain = addItemStub.getCall(0).args[3].data.body.trace_chain;
        expect(traceChain[0].exception.message).to.equal('test err');
        expect(traceChain[1].exception.message).to.equal('nested test err');

        expect(traceChain[0].frames).to.have.length.above(1);
        expect(traceChain[0].frames.at(-1).locals).to.not.exist;
        expect(traceChain[0].frames.at(-2).locals).to.not.exist;
      });

      describe('then re-enabled', function () {
        beforeEach(function () {
          addItemStub?.restore();
          rollbar.configure({ locals: { enabled: true, uncaughtOnly: false } });
          addItemStub = sinon.stub(rollbar.client.notifier.queue, 'addItem');
        });

        it('should include locals', async function () {
          await promiseReject();

          const result = verifyRejectedPromise(addItemStub);
          expect(result.message).to.equal('promise reject');
          expect(result.hasLocals).to.be.true;
          expect(result.locals.topFrame).to.exist;
        });
      });
    });
  });

  describe('on caught error', function () {
    describe('with uncaughtOnly: true', function () {
      let rollbar;
      let addItemStub;

      beforeEach(function () {
        rollbar = new Rollbar({
          accessToken: 'abc123',
          captureUncaught: true,
          captureUnhandledRejections: true,
          locals: { module: Locals, uncaughtOnly: true, depth: 0 },
        });

        addItemStub = sinon.stub(rollbar.client.notifier.queue, 'addItem');
      });

      afterEach(function () {
        addItemStub.restore();
      });

      it('should not include locals', async function () {
        await nodeThrowAndCatch(rollbar);
        expect(addItemStub.called).to.be.true;

        const traceChain = addItemStub.getCall(0).args[3].data.body.trace_chain;
        expect(traceChain[0].exception.message).to.equal('caught error');
        expect(traceChain[0].frames).to.have.length.above(1);
        expect(traceChain[0].frames.at(-1).locals).to.not.exist;
        expect(traceChain[0].frames.at(-2).locals).to.not.exist;
      });

      describe('then uncaughtOnly: false', function () {
        beforeEach(function () {
          addItemStub?.restore();
          rollbar.configure({ locals: { uncaughtOnly: false } });
          addItemStub = sinon.stub(rollbar.client.notifier.queue, 'addItem');
        });

        it('should include locals', async function () {
          await nodeThrowAndCatch(rollbar);
          expect(addItemStub.called).to.be.true;

          const traceChain =
            addItemStub.getCall(0).args[3].data.body.trace_chain;
          expect(traceChain[0].exception.message).to.equal('caught error');

          let frames = traceChain[0].frames;
          expect(frames).to.have.length.above(1);

          if (nodeMajorVersion >= 18) {
            // Node >=18; locals only in top frame
            expect(frames.at(-1).locals.error).to.equal('<Error object>');
            expect(frames.at(-2).locals).to.not.exist;
          } else if (nodeMajorVersion >= 10) {
            // Node 10..<18; locals enabled
            expect(frames.at(-1).locals.error).to.equal('<Error object>');
            expect(frames.at(-2).locals.timer).to.equal('<Timeout object>');
          } else {
            expect(frames.at(-1).locals).to.not.exist;
            expect(frames.at(-2).locals).to.not.exist;
          }
        });
      });
    });
  });

  describe('on nested exception', function () {
    let rollbar;
    let addItemStub;

    beforeEach(function () {
      rollbar = new Rollbar({
        accessToken: 'abc123',
        captureUncaught: true,
        locals: { module: Locals, uncaughtOnly: false, depth: 0 },
      });

      addItemStub = sinon.stub(rollbar.client.notifier.queue, 'addItem');
    });

    afterEach(function () {
      addItemStub.restore();
    });

    it('should include locals', async function () {
      await nodeThrowNested();
      expect(addItemStub.called).to.be.true;

      const traceChain = addItemStub.getCall(0).args[3].data.body.trace_chain;
      expect(traceChain[0].exception.message).to.equal('test err');
      expect(traceChain[1].exception.message).to.equal('nested test err');

      let frames;

      if (nodeMajorVersion >= 18) {
        // Node >=18; locals only in top frame
        frames = traceChain[0].frames;
        expect(frames).to.have.length.above(1);
        expect(frames.at(-1).locals.message).to.equal('test err');
        expect(frames.at(-1).locals.password).to.equal('********');
        expect(frames.at(-1).locals.err).to.equal('<Error object>');
        expect(frames.at(-1).locals.newMessage).to.equal('nested test err');
        expect(frames.at(-2).locals).to.not.exist;

        frames = traceChain[1].frames;
        expect(frames).to.have.length.above(1);
        expect(frames.at(-1).locals.nestedMessage).to.equal('nested test err');
        expect(frames.at(-1).locals._password).to.equal('123456');
        expect(frames.at(-1).locals.nestedError).to.equal('<Error object>');
        expect(frames.at(-2).locals).to.not.exist;
      } else if (nodeMajorVersion >= 10) {
        // Node >=10; locals enabled
        frames = traceChain[0].frames;
        expect(frames).to.have.length.above(1);
        expect(frames.at(-1).locals.err).to.equal('<Error object>');
        expect(frames.at(-2).locals.timer).to.equal('<Timeout object>');

        frames = traceChain[1].frames;
        expect(frames).to.have.length.above(1);
        expect(frames.at(-1).locals.nestedMessage).to.equal('nested test err');
        expect(frames.at(-1).locals.nestedError).to.equal('<Error object>');
        expect(frames.at(-2).locals.message).to.equal('test err');
        expect(frames.at(-2).locals.password).to.equal('********');
        expect(frames.at(-2).locals.err).to.equal('<Error object>');
        expect(frames.at(-2).locals.newMessage).to.equal('nested test err');
      } else {
        // Node <=8; locals disabled
        frames = traceChain[0].frames;
        expect(frames).to.have.length.above(1);
        expect(frames.at(-1).locals).to.not.exist;
        expect(frames.at(-2).locals).to.not.exist;
      }
    });
  });

  describe('on promise rejection', function () {
    let rollbar;
    let addItemStub;

    beforeEach(function () {
      rollbar = new Rollbar({
        accessToken: 'abc123',
        captureUnhandledRejections: true,
        locals: { module: Locals, uncaughtOnly: false, depth: 0 },
      });

      addItemStub = sinon.stub(rollbar.client.notifier.queue, 'addItem');
    });

    afterEach(function () {
      addItemStub.restore();
    });

    it('should include locals', async function () {
      await promiseReject();
      const result = verifyRejectedPromise(addItemStub);
      expect(result.message).to.equal('promise reject');
    });
  });

  describe('with custom options', function () {
    let rollbar;
    let addItemStub;

    beforeEach(function () {
      rollbar = new Rollbar({
        accessToken: 'abc123',
        captureUncaught: true,
        locals: { module: Locals, depth: 2, maxProperties: 5, maxArray: 2 },
      });

      addItemStub = sinon.stub(rollbar.client.notifier.queue, 'addItem');
    });

    afterEach(function () {
      addItemStub.restore();
      Locals.session = undefined;
    });

    it('should include locals', async function () {
      await nodeThrowWithNestedLocals();
      expect(addItemStub.called).to.be.true;

      const traceChain = addItemStub.getCall(0).args[3].data.body.trace_chain;
      expect(traceChain[0].exception.message).to.equal('node error');

      if (nodeMajorVersion < 10) {
        // Node 8; locals disabled
        expect(traceChain[0].frames).to.have.length.above(1);
        expect(traceChain[0].frames.at(-1).locals).to.not.exist;
      } else {
        expect(traceChain[0].frames).to.have.length.above(1);

        const locals = traceChain[0].frames.at(-1).locals;
        expect(Object.keys(locals.obj)).to.have.lengthOf(5);
        expect(locals.obj).to.deep.equal({
          a: 'a',
          b: 'b',
          c: 'c',
          d: 'd',
          e: 'e',
        });

        expect(locals.arr).to.have.lengthOf(2);
        expect(locals.arr[0]).to.deep.equal({ zero: '<Array object>' });
        expect(locals.arr[1]).to.deep.equal({ one: 1 });

        expect(locals.password).to.equal('********');
        expect(locals.sym).to.equal('Symbol(foo)');
      }
    });
  });

  describe('with recursive stack', function () {
    let rollbar;
    let addItemStub;

    beforeEach(function () {
      rollbar = new Rollbar({
        accessToken: 'abc123',
        captureUncaught: true,
        locals: Locals,
      });
      const notifier = rollbar.client.notifier;
      addItemStub = sinon.stub(notifier.queue, 'addItem');
    });

    afterEach(function () {
      addItemStub.restore();
      Locals.session = undefined;
    });

    it('should include locals in recursive frames', async function () {
      await nodeThrowRecursionError();
      expect(addItemStub.called).to.be.true;

      const traceChain = addItemStub.getCall(0).args[3].data.body.trace_chain;
      expect(traceChain[0].exception.message).to.equal(
        'deep stack error, limit=3',
      );

      let frames = traceChain[0].frames;
      expect(frames).to.have.length.above(1);

      if (nodeMajorVersion >= 18) {
        // Node >=18; locals only in top frame
        expect(frames.at(-1).locals).to.deep.equal({ curr: 3, limit: 3 });
        expect(frames.at(-2).locals).to.not.exist;
        expect(frames.at(-3).locals).to.not.exist;
      } else if (nodeMajorVersion >= 10) {
        // Node >=10; locals enabled
        expect(frames.at(-1).locals).to.deep.equal({ curr: 3, limit: 3 });
        expect(frames.at(-2).locals).to.deep.equal({ curr: 2, limit: 3 });
        expect(frames.at(-3).locals).to.deep.equal({ curr: 1, limit: 3 });
      } else {
        // Node <=8; locals disabled
        expect(frames.at(-1).locals).to.not.exist;
      }
    });
  });
});
