/* globals describe */
/* globals it */

import { expect } from 'chai';
import Rollbar from '../src/server/rollbar.js';
import * as t from '../src/server/transforms.js';
import { createTestItem } from './server.transforms.test-utils.mjs';

describe('transforms.scrubPayload', function () {
  describe('without scrub fields', function () {
    it('should scrub key/value based on defaults but not okay keys', function (done) {
      const item = {
        data: {
          body: {
            message: 'hey',
            password: '123',
            secret: { stuff: 'here' },
          },
        },
      };

      t.scrubPayload(item, Rollbar.defaultOptions, (err, item) => {
        expect(err).to.not.exist;
        expect(item.data.body.message).to.equal('hey');
        expect(item.data.body.password).to.match(/\*+/);
        expect(item.data.body.secret).to.match(/\*+/);
        done();
      });
    });
  });

  describe('with scrub fields', function () {
    const options = {
      captureIp: true,
      scrubHeaders: ['x-auth-token'],
      scrubFields: ['passwd', 'access_token', 'request.cookie', 'sauce'],
      scrubRequestBody: true,
    };

    it('should scrub based on the options with a request', function (done) {
      const item = createTestItem({
        data: {
          other: 'thing',
          sauce: 'secrets',
          someParams: 'foo=okay&passwd=iamhere',
        },
      });

      t.addRequestData(item, options, (err, item) => {
        expect(err).to.not.exist;

        t.scrubPayload(item, options, (err, scrubbedItem) => {
          expect(err).to.not.exist;

          const data = scrubbedItem.data;
          expect(data.request.GET.token).to.equal('abc123');
          expect(data.request.headers['x-auth-token']).to.match(/\*+/);
          expect(data.request.headers['host']).to.equal('example.com');
          expect(data.sauce).to.match(/\*+/);
          expect(data.other).to.equal('thing');
          expect(data.someParams).to.match(/foo=okay&passwd=\*+/);

          done();
        });
      });
    });

    it('should scrub based on the options with a json request body', function (done) {
      const item = createTestItem({
        request: {
          headers: {
            host: 'example.com',
            'content-type': 'application/json',
            'x-auth-token': '12345',
          },
          body: JSON.stringify({
            token: 'abc123',
            something: 'else',
            passwd: '123456',
          }),
        },
        data: {
          other: 'thing',
          sauce: 'secrets',
          someParams: 'foo=okay&passwd=iamhere',
        },
      });

      t.addRequestData(item, options, (err, item) => {
        expect(err).to.not.exist;

        t.scrubPayload(item, options, (err, scrubbedItem) => {
          expect(err).to.not.exist;

          const data = scrubbedItem.data;
          expect(data.request.headers['x-auth-token']).to.match(/\*+/);
          expect(data.request.headers['host']).to.equal('example.com');
          expect(data.sauce).to.match(/\*+/);
          expect(data.other).to.equal('thing');
          expect(data.someParams).to.match(/foo=okay&passwd=\*+/);

          const requestBody = JSON.parse(scrubbedItem.data.request.body);
          expect(requestBody.passwd).to.match(/\*+/);

          done();
        });
      });
    });

    it('should delete the body and add a diagnostic error with a bad json request body', function (done) {
      const item = {
        request: {
          headers: {
            'content-type': 'application/json',
          },
          protocol: 'https',
          url: '/some/endpoint',
          ip: '192.192.192.1',
          method: 'GET',
          body: 'not valid json',
        },
      };

      t.addRequestData(item, options, (err, item) => {
        expect(err).to.not.exist;

        t.scrubPayload(item, options, (err, scrubbedItem) => {
          expect(err).to.not.exist;

          const data = scrubbedItem.data;
          const requestBody = JSON.parse(data.request.body);
          expect(requestBody).to.be.null;
          expect(data.request.error).to.match(/request.body parse failed/);

          done();
        });
      });
    });
  });
});
