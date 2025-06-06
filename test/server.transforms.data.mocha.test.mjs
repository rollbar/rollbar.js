/* globals describe */
/* globals it */

import { expect } from 'chai';
import Rollbar from '../src/server/rollbar.js';
import * as t from '../src/server/transforms.js';
import { merge } from '../src/utility.js';

describe('data transforms', function () {
  describe('transforms.baseData', function () {
    const emptyItem = {};
    const testItem = {
      level: 'critical',
      environment: 'production',
      framework: 'star-wars',
      uuid: '12345',
      custom: {
        one: 'a1',
        stuff: 'b2',
        language: 'english',
      },
    };

    describe('with default options', function () {
      it('should have a timestamp, level and defaults with an empty item', function (done) {
        t.baseData(emptyItem, Rollbar.defaultOptions, (err, item) => {
          expect(err).to.not.exist;

          const data = item.data;
          expect(data).to.exist;
          expect(data.timestamp).to.exist;
          expect(data.level).to.equal('error');
          expect(data.environment).to.be.a('string');
          expect(data.environment).to.not.be.empty;
          expect(data.environment).to.equal(Rollbar.defaultOptions.environment);
          expect(data.framework).to.equal('node-js');
          expect(data.language).to.equal('javascript');
          expect(data.server).to.exist;
          expect(data.server.host).to.exist;
          expect(data.server.pid).to.exist;

          done();
        });
      });

      it('should have a critical level, overriden defaults and custom data with values in item', function (done) {
        t.baseData(testItem, Rollbar.defaultOptions, (err, item) => {
          expect(err).to.not.exist;

          const data = item.data;
          expect(data.level).to.equal('critical');
          expect(data.environment).to.equal('production');
          expect(data.framework).to.equal('star-wars');
          expect(data.language).to.equal('javascript');
          expect(data.uuid).to.equal('12345');
          expect(data.one).to.equal('a1');
          expect(data.stuff).to.equal('b2');
          expect(data.language).to.not.equal('english');

          done();
        });
      });
    });

    describe('with custom options', function () {
      const customOptions = merge(Rollbar.defaultOptions, {
        payload: {
          environment: 'payload-prod',
        },
        framework: 'opt-node',
        host: 'opt-host',
        branch: 'opt-master',
      });

      it('should have a timestamp, error level and data from options and defaults with an empty item', function (done) {
        t.baseData(emptyItem, customOptions, (err, item) => {
          expect(err).to.not.exist;

          const data = item.data;
          expect(data).to.exist;
          expect(data.timestamp).to.exist;
          expect(data.level).to.equal('error');
          expect(data.environment).to.equal('payload-prod');
          expect(data.framework).to.equal('opt-node');
          expect(data.language).to.equal('javascript');
          expect(data.server).to.exist;
          expect(data.server.host).to.equal('opt-host');
          expect(data.server.branch).to.equal('opt-master');
          expect(data.server.pid).to.exist;

          done();
        });
      });

      it('should have a critical level, overriden item defaults and custom data with values in item', function (done) {
        t.baseData(testItem, customOptions, (err, item) => {
          expect(err).to.not.exist;

          const data = item.data;
          expect(data.level).to.equal('critical');
          expect(data.environment).to.equal('production');
          expect(data.framework).to.equal('star-wars');
          expect(data.language).to.equal('javascript');
          expect(data.uuid).to.equal('12345');
          expect(data.one).to.equal('a1');
          expect(data.stuff).to.equal('b2');
          expect(data.language).to.not.equal('english');

          done();
        });
      });
    });
  });

  describe('transforms.addBody', function () {
    const options = { whatever: 'stuff' };

    it('should set the trace_chain with no message with stackInfo', function (done) {
      const item = { stackInfo: [{ message: 'hey' }] };
      t.addBody(item, options, (err, item) => {
        expect(err).to.not.exist;
        expect(item.data.body.trace_chain).to.exist;
        expect(item.data.body.message).to.not.exist;
        done();
      });
    });

    it('should set a message with no trace_chain with no stackInfo', function (done) {
      const item = { message: 'hello' };
      t.addBody(item, options, (err, item) => {
        expect(err).to.not.exist;
        expect(item.data.body.trace_chain).to.not.exist;
        expect(item.data.body.message).to.exist;
        done();
      });
    });
  });

  describe('transforms.addMessageData', function () {
    const options = { random: 'stuff' };

    it('should add a body with diagnostic with no message', function (done) {
      const item = { err: 'stuff', not: 'a message' };
      t.addMessageData(item, options, (err, item) => {
        expect(err).to.not.exist;
        expect(item.data.body).to.exist;
        expect(item.data.body.message.body).to.equal(
          'Item sent with null or missing arguments.',
        );
        done();
      });
    });

    it('should add a body with the message with a message', function (done) {
      const item = { message: 'this is awesome' };
      t.addMessageData(item, options, (err, item) => {
        expect(err).to.not.exist;
        expect(item.data.body.message.body).to.equal('this is awesome');
        done();
      });
    });
  });
});
