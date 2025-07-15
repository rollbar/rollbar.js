/* globals describe */
/* globals it */

import { expect } from 'chai';
import * as t from '../src/server/transforms.js';
import { createTestItem } from './server.transforms.test-utils.mjs';

describe('transforms.addRequestData', function () {
  describe('without custom addRequestData method', function () {
    describe('without scrub fields', function () {
      const options = {
        nothing: 'here',
        captureEmail: true,
        captureUsername: true,
        captureIp: true,
      };

      it('should not change the item without a request', function (done) {
        const item = {
          data: { body: { message: 'hey' } },
        };

        t.addRequestData(item, options, (err, item) => {
          expect(err).to.not.exist;
          expect(item.request).to.be.undefined;
          expect(item.data.request).to.be.undefined;
          done();
        });
      });

      it('should not change the request with an empty request object', function (done) {
        const item = {
          request: {},
          data: { body: { message: 'hey' } },
        };

        t.addRequestData(item, options, (err, item) => {
          expect(err).to.not.exist;
          expect(item.request.headers).to.be.undefined;
          done();
        });
      });

      it('should have a person, request and context with a request object', function (done) {
        const item = createTestItem({
          request: {
            route: { path: '/api/:bork' },
          },
        });

        t.addRequestData(item, options, (err, item) => {
          expect(err).to.not.exist;

          const data = item.data;
          expect(data.person.id).to.equal(42);
          expect(data.person.email).to.equal('fake@example.com');
          expect(data.request.url).to.equal(
            'https://example.com/some/endpoint',
          );
          expect(data.request.user_ip).to.equal('192.192.192.1');
          expect(data.request.GET).to.exist;
          expect(data.context).to.equal('/api/:bork');

          done();
        });
      });

      it('should set some fields based on request data with a request for a nested router with a baseURL', function (done) {
        const item = createTestItem({
          request: {
            baseUrl: '/nested',
            route: { path: '/api/:bork' },
          },
        });

        t.addRequestData(item, options, (err, item) => {
          expect(err).to.not.exist;
          expect(item.data.request.url).to.equal(
            'https://example.com/nested/some/endpoint',
          );
          expect(item.data.context).to.equal('/nested/api/:bork');
          done();
        });
      });

      it('should set a person and some fields based on request data with a request like from hapi', function (done) {
        const item = createTestItem({
          request: {
            url: {
              protocol: null,
              slashes: null,
              auth: null,
              host: null,
              port: null,
              hostname: null,
              hash: null,
              search: '',
              query: {},
              pathname: '/some/endpoint',
              path: '/some/endpoint',
              href: '/some/endpoint',
            },
            method: 'POST',
            payload: {
              token: 'abc123',
              something: 'else',
            },
            route: { path: '/api/:bork' },
          },
        });

        t.addRequestData(item, options, (err, item) => {
          expect(err).to.not.exist;

          const data = item.data;
          expect(data.person.id).to.equal(42);
          expect(data.person.email).to.equal('fake@example.com');
          expect(data.request.url).to.equal(
            'https://example.com/some/endpoint',
          );
          expect(data.request.user_ip).to.equal('192.192.192.1');
          expect(data.request.GET).to.not.exist;
          expect(data.request.POST).to.exist;
          expect(item.data.context).to.equal('/api/:bork');

          done();
        });
      });

      it('should set a person and some fields based on request data with a request with an array body', function (done) {
        const item = createTestItem({
          request: {
            method: 'POST',
            body: [
              {
                token: 'abc123',
                something: 'else',
              },
              'otherStuff',
            ],
          },
        });

        t.addRequestData(item, options, (err, item) => {
          expect(err).to.not.exist;

          const data = item.data;
          expect(data.person.id).to.equal(42);
          expect(data.person.email).to.equal('fake@example.com');
          expect(data.request.url).to.equal(
            'https://example.com/some/endpoint',
          );
          expect(data.request.user_ip).to.equal('192.192.192.1');
          expect(data.request.POST).to.exist;
          expect(data.request.POST['0'].something).to.equal('else');
          expect(data.request.POST['1']).to.equal('otherStuff');

          done();
        });
      });
    });

    describe('with scrub fields', function () {
      const options = {
        scrubHeaders: ['x-auth-token'],
        scrubFields: ['passwd', 'access_token', 'request.cookie'],
      };

      it('should create request data without scrubbing even with scrub options', function (done) {
        const item = createTestItem();

        t.addRequestData(item, options, (err, item) => {
          expect(err).to.not.exist;
          // Verify that addRequestData doesn't scrub -
          // headers should still contain sensitive data
          expect(item.data.request.headers['x-auth-token']).to.equal('12345');
          expect(item.data.request.GET.token).to.equal('abc123');
          done();
        });
      });
    });
  });

  describe('with custom addRequestData', function () {
    it('should do what the function does with a request with scrub fields', function (done) {
      const customFn = function (item, request) {
        expect(item.stuff).to.be.undefined;
        expect(item.other).to.equal('thing');
        item.myRequest = { body: request.body.token };
      };

      const options = {
        captureIp: true,
        addRequestData: customFn,
        scrubFields: ['passwd', 'access_token', 'token', 'request.cookie'],
      };

      const item = createTestItem();

      t.addRequestData(item, options, (err, item) => {
        expect(err).to.not.exist;
        expect(item.data.request).to.not.exist;
        expect(item.data.myRequest.body).to.equal('abc123');
        done();
      });
    });
  });
});
