/* globals describe */
/* globals it */

import { expect } from 'chai';
import Rollbar from '../src/server/rollbar.js';
import { TestClient } from './server.rollbar.test-utils.mjs';

describe('rollbar miscellaneous methods', function () {
  describe('buildJsonPayload', function () {
    it('should pass the object through to the client', function () {
      const client = new TestClient();
      const rollbar = new Rollbar({ accessToken: 'abc123' }, client);
      const obj = { hello: 'world' };

      rollbar.buildJsonPayload(obj);

      expect(client.logCalls.length).to.equal(1);
      expect(client.logCalls[0].item).to.equal(obj);
    });
  });

  describe('sendJsonPayload', function () {
    it('should pass the json string through to the client', function () {
      const client = new TestClient();
      const rollbar = new Rollbar({ accessToken: 'abc123' }, client);
      const json = JSON.stringify({ hello: 'world' });

      rollbar.sendJsonPayload(json);

      expect(client.logCalls.length).to.equal(1);
      expect(client.logCalls[0].item).to.equal(json);
    });
  });

  describe('singleton', function () {
    it('should work like a constructor but with an init method', function () {
      const r = Rollbar.init({ accessToken: 'abc123' });

      expect(r.log).to.be.a('function');
      expect(r.options.accessToken).to.equal('abc123');
      expect(Rollbar.log).to.be.a('function');
    });
  });
});
