/* globals describe */
/* globals it */

import { expect } from 'chai';
import Rollbar from '../src/server/rollbar.js';
import {
  ValidOpenTracingTracerStub,
  InvalidOpenTracingTracerStub,
} from './server.rollbar.test-utils.mjs';

describe('rollbar constructor and configuration', function () {
  describe('constructor', function () {
    describe('with accessToken', function () {
      it('should have log method', function () {
        const r = new Rollbar('abc123');
        expect(r.log).to.be.a('function');
      });

      it('should have error method', function () {
        const r = new Rollbar('abc123');
        expect(r.error).to.be.a('function');
      });

      it('should have buildJsonPayload method', function () {
        const r = new Rollbar('abc123');
        expect(r.buildJsonPayload).to.be.a('function');
      });

      it('should have sendJsonPayload method', function () {
        const r = new Rollbar('abc123');
        expect(r.sendJsonPayload).to.be.a('function');
      });

      it('should have accessToken in options', function () {
        const r = new Rollbar('abc123');
        expect(r.options.accessToken).to.equal('abc123');
      });
    });

    describe('with options', function () {
      it('should have log method', function () {
        const r = new Rollbar({ accessToken: 'abc123' });
        expect(r.log).to.be.a('function');
      });

      it('should have error method', function () {
        const r = new Rollbar({ accessToken: 'abc123' });
        expect(r.error).to.be.a('function');
      });

      it('should have accessToken in options', function () {
        const r = new Rollbar({ accessToken: 'abc123' });
        expect(r.options.accessToken).to.equal('abc123');
      });

      it('should set environment based on default', function () {
        const r = new Rollbar({ accessToken: 'abc123' });
        expect(r.options.environment).to.be.a('string');
        expect(r.options.environment).to.not.be.empty;
        expect(r.options.environment).to.equal(
          Rollbar.defaultOptions.environment,
        );
      });
    });

    describe('with more options', function () {
      it('should have log method', function () {
        const r = new Rollbar({
          accessToken: 'abc123',
          environment: 'fake-env',
        });
        expect(r.log).to.be.a('function');
      });

      it('should have error method', function () {
        const r = new Rollbar({
          accessToken: 'abc123',
          environment: 'fake-env',
        });
        expect(r.error).to.be.a('function');
      });

      it('should have accessToken in options', function () {
        const r = new Rollbar({
          accessToken: 'abc123',
          environment: 'fake-env',
        });
        expect(r.options.accessToken).to.equal('abc123');
      });

      it('should set environment based on options', function () {
        const r = new Rollbar({
          accessToken: 'abc123',
          environment: 'fake-env',
        });
        expect(r.options.environment).to.equal('fake-env');
      });

      it('should set configured options', function () {
        const r = new Rollbar({
          accessToken: 'abc123',
          environment: 'fake-env',
        });
        expect(r.options._configuredOptions.environment).to.equal('fake-env');
      });
    });

    describe('with deprecated options', function () {
      it('should replace options', function () {
        const r = new Rollbar({
          hostWhiteList: ['foo'],
          hostBlackList: ['bar'],
        });
        expect(r.options.hostWhiteList).to.be.undefined;
        expect(r.options.hostBlackList).to.be.undefined;
        expect(r.options.hostSafeList).to.deep.equal(['foo']);
        expect(r.options.hostBlockList).to.deep.equal(['bar']);
      });
    });

    describe('with valid tracer', function () {
      it('should configure tracer', function () {
        const r = new Rollbar({
          captureUncaught: true,
          environment: 'fake-env',
          tracer: ValidOpenTracingTracerStub,
        });
        expect(r.client.tracer).to.be.an('object');
      });
    });

    describe('with invalid tracer', function () {
      it('should configure tracer', function () {
        const r = new Rollbar({
          captureUncaught: true,
          environment: 'fake-env',
          tracer: InvalidOpenTracingTracerStub,
        });
        expect(r.client.tracer).to.be.null;
      });
    });
  });

  describe('configure', function () {
    describe('with updated options', function () {
      it('should set configured options', function () {
        const rollbar = new Rollbar({
          captureUncaught: true,
          environment: 'fake-env',
        });
        rollbar.configure({ captureUncaught: false, environment: 'new-env' });

        expect(rollbar.options._configuredOptions.environment).to.equal(
          'new-env',
        );
        expect(rollbar.options._configuredOptions.captureUncaught).to.be.false;
      });
    });

    describe('with deprecated options', function () {
      it('should replace options', function () {
        const rollbar = new Rollbar({ captureUncaught: true });
        rollbar.configure({
          hostWhiteList: ['foo'],
          hostBlackList: ['bar'],
        });

        expect(rollbar.options.hostWhiteList).to.be.undefined;
        expect(rollbar.options.hostBlackList).to.be.undefined;
        expect(rollbar.options.hostSafeList).to.deep.equal(['foo']);
        expect(rollbar.options.hostBlockList).to.deep.equal(['bar']);
      });
    });

    describe('with valid tracer', function () {
      it('should configure tracer', function () {
        const rollbar = new Rollbar({
          captureUncaught: true,
          environment: 'fake-env',
        });
        rollbar.configure({ tracer: ValidOpenTracingTracerStub });

        expect(rollbar.client.tracer).to.equal(ValidOpenTracingTracerStub);
      });
    });

    describe('with invalid tracer', function () {
      it('should configure tracer', function () {
        const rollbar = new Rollbar({
          captureUncaught: true,
          environment: 'fake-env',
        });
        rollbar.configure({ tracer: InvalidOpenTracingTracerStub });

        expect(rollbar.client.tracer).to.be.null;
      });
    });
  });
});
