/* globals describe */
/* globals it */
/* globals afterEach */

import { expect } from 'chai';
import sinon from 'sinon';
import Locals from '../src/server/locals.js';
import logger from '../src/logger.js';
import localsFixtures from './fixtures/locals.fixtures.js';

describe('server.locals merge', function () {
  afterEach(function () {
    sinon.restore();
    Locals.session = undefined;
    Locals.currentErrors = new Map();
  });

  describe('mergeLocals', function () {
    // Deep clone, because stack gets modified by mergeLocals
    // and we don't want to modify the test fixtures.
    const cloneStack = (stack) => JSON.parse(JSON.stringify(stack));

    function fakeSessionPostHandler(responses) {
      return (command, options, callback) => {
        let error;
        let response;

        if (command === 'Runtime.getProperties') {
          response = { result: responses[options.objectId] };
        } else {
          error = new Error('Unexpected session.post command');
        }

        setTimeout(() => {
          callback(error, response);
        }, 1);
      };
    }

    it('should callback with error when session.post() returns error', function (done) {
      const locals = new Locals({}, logger);
      const err = new Error('post error');
      sinon.stub(Locals.session, 'post').yields(err);

      const key = 'key';
      const localsMap = new Map();
      localsMap.set('key', localsFixtures.maps.simple);

      const stack = localsFixtures.stacks.simple;

      locals.mergeLocals(localsMap, stack, key, (err) => {
        expect(err).to.be.instanceOf(Error);
        expect(err.message).to.equal('post error');
        expect(err.stack).to.include('Error: post error');
        done();
      });
    });

    it('should callback with merged locals when multiple/complex locals maps present', function (done) {
      const getPropertiesResponses = {
        objectId1: [
          localsFixtures.locals.object1,
          localsFixtures.locals.object2,
        ],
        objectId2: [
          localsFixtures.locals.boolean1,
          localsFixtures.locals.boolean2,
        ],
        objectId3: [
          localsFixtures.locals.string1,
          localsFixtures.locals.array1,
        ],
      };

      const locals = new Locals({ depth: 0 }, logger);
      sinon
        .stub(Locals.session, 'post')
        .callsFake(fakeSessionPostHandler(getPropertiesResponses));

      const key1 = 'key1';
      const key2 = 'key2';
      const localsMap = new Map();

      // Test with multiple maps present.
      localsMap.set(key1, localsFixtures.maps.simple);
      localsMap.set(key2, localsFixtures.maps.complex); // Stack will match the 2nd locals map added.

      const stack = cloneStack(localsFixtures.stacks.complex);

      locals.mergeLocals(localsMap, stack, key2, (err) => {
        expect(err).to.not.exist;

        expect(stack[0].locals.response).to.equal('success');
        expect(stack[0].locals.args).to.equal('<Array object>');
        expect(stack[1].locals.old).to.be.false;
        expect(stack[1].locals.new).to.be.true;
        expect(stack[2].locals.foo).to.equal('<FooClass object>');
        expect(stack[2].locals.bar).to.equal('<BarClass object>');

        done();
      });
    });

    it('should callback with merged locals when simple locals maps present', function (done) {
      const getPropertiesResponses = {
        objectId1: [
          localsFixtures.locals.object1,
          localsFixtures.locals.object2,
        ],
      };

      const locals = new Locals({ depth: 0 }, logger);
      sinon
        .stub(Locals.session, 'post')
        .callsFake(fakeSessionPostHandler(getPropertiesResponses));

      const key = 'key';
      const localsMap = new Map();
      localsMap.set(key, localsFixtures.maps.simple);

      const stack = cloneStack(localsFixtures.stacks.simple);

      locals.mergeLocals(localsMap, stack, key, (err) => {
        expect(err).to.not.exist;
        expect(stack[0].locals.foo).to.equal('<FooClass object>');
        expect(stack[0].locals.bar).to.equal('<BarClass object>');

        done();
      });
    });

    it('should callback with merged locals when depth = 1', function (done) {
      const getPropertiesResponses = {
        objectId1: [
          localsFixtures.locals.object1,
          localsFixtures.locals.object2,
        ],
        nestedProps1: [
          localsFixtures.locals.string1,
          localsFixtures.locals.boolean1,
          localsFixtures.locals.function1,
        ],
        nestedProps2: [
          localsFixtures.locals.array1,
          localsFixtures.locals.null1,
          localsFixtures.locals.function2,
        ],
      };

      const locals = new Locals({ depth: 1 }, logger);
      sinon
        .stub(Locals.session, 'post')
        .callsFake(fakeSessionPostHandler(getPropertiesResponses));

      const key = 'key';
      const localsMap = new Map();
      localsMap.set(key, localsFixtures.maps.simple);

      const stack = cloneStack(localsFixtures.stacks.simple);

      locals.mergeLocals(localsMap, stack, key, (err) => {
        expect(err).to.not.exist;

        expect(stack[0].locals.foo).to.deep.equal({
          response: 'success',
          old: false,
          func: '<Function object>',
        });
        expect(stack[0].locals.bar).to.deep.equal({
          args: '<Array object>',
          parent: null,
          asyncFunc: '<AsyncFunction object>',
        });

        done();
      });
    });

    it('should succeed without merged locals when no locals maps present', function (done) {
      const getPropertiesResponses = {
        objectId1: [
          localsFixtures.locals.object1,
          localsFixtures.locals.object2,
        ],
        objectId2: [
          localsFixtures.locals.boolean1,
          localsFixtures.locals.boolean2,
        ],
        objectId3: [
          localsFixtures.locals.string1,
          localsFixtures.locals.array1,
        ],
      };

      const locals = new Locals({}, logger);
      sinon
        .stub(Locals.session, 'post')
        .callsFake(fakeSessionPostHandler(getPropertiesResponses));

      // Test with no maps present. 'key' won't match anything.
      const key = 'key';
      const localsMap = new Map();

      const stack = cloneStack(localsFixtures.stacks.complex);

      locals.mergeLocals(localsMap, stack, key, (err) => {
        expect(err).to.not.exist;

        expect(stack[0].locals).to.not.exist;
        expect(stack[1].locals).to.not.exist;
        expect(stack[2].locals).to.not.exist;

        done();
      });
    });

    it('should succeed without merged locals when no local scopes in map', function (done) {
      const getPropertiesResponses = {
        objectId1: [
          localsFixtures.locals.object1,
          localsFixtures.locals.object2,
        ],
        objectId2: [
          localsFixtures.locals.boolean1,
          localsFixtures.locals.boolean2,
        ],
        objectId3: [
          localsFixtures.locals.string1,
          localsFixtures.locals.array1,
        ],
      };

      const locals = new Locals({}, logger);
      sinon
        .stub(Locals.session, 'post')
        .callsFake(fakeSessionPostHandler(getPropertiesResponses));

      const localsMap = new Map();
      localsMap.set('key', localsFixtures.maps.noLocalScope);

      const stack = cloneStack(localsFixtures.stacks.complex);

      locals.mergeLocals(localsMap, stack, 'key', (err) => {
        expect(err).to.not.exist;

        expect(stack[0].locals).to.not.exist;
        expect(stack[1].locals).to.not.exist;
        expect(stack[2].locals).to.not.exist;

        done();
      });
    });
  });

  describe('currentLocalsMap', function () {
    it('should return empty map when no local scopes in map', function () {
      const locals = new Locals({}, logger);

      // Ensure empty map, as singleton might have state from other tests
      Locals.currentErrors = new Map();

      const localsMap = locals.currentLocalsMap();
      expect(localsMap).to.be.instanceOf(Map);
      expect(localsMap).to.be.empty;
    });
  });
});
